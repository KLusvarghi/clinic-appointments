// uma boa prática, é sempre validar os dados recebidos do front, e para isso usaremos o zod
"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertDoctorSchema } from "./schema";

// resumindo, o action irá pegar o schema e já valida os parametros recebidos do front, e depois, irá executar a lógica do nosso servidor action

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema) // aqui, definimos o schema que iremos usar para validar os dados recebidos do front - ela tem uma boa integração com o zod
  // e aqui, definimos a action que iremos usar para executar a lógica do nosso servidor action
  .action(async ({ parsedInput }) => {
    // e dentro do action, temos o parsedInput que é o valor que iremos receber do front (que é o valor do forms)

    // pegando a sessão do usuário
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // e com a sessão que está ativa, verificamos se existe uma clinica associada a ele
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    // depois de validar, podemos enviar para o banco de dados
    // mas antes, temos que fazer aquela validação de, se não existe o médico, eu irei criar, se não, eu irei atualziar
    await db
      // mas esse trecho, ele irá criar um médico passando todos os valores do forms
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        clinicId: session.user.clinic.id,
        appointmentPriceInCents: Number(parsedInput.appointmentPriceInCents),
        name: parsedInput.name,
        specialty: parsedInput.specialty,
        availableFromWeekDay: parsedInput.availableFromWeekDay,
        availableToWeekDay: parsedInput.availableToWeekDay,
        availableFromTime: parsedInput.availableFromTime,
        availableToTime: parsedInput.availableToTime,
      })
      .onConflictDoUpdate({
        // Se já existir um médico com o id que estou recebendo (no schema definimos o id do medico como opcional, então ele pode o não vir), ele irá atualizar o médico com os valores do formData
        target: [doctorsTable.id],
        // e se gerar esse conflito, ele irá atualizar o médico passando todos os valores do forms
        set: {
          name: parsedInput.name,
          specialty: parsedInput.specialty,
          appointmentPriceInCents: Number(parsedInput.appointmentPriceInCents),
          availableFromWeekDay: parsedInput.availableFromWeekDay,
          availableToWeekDay: parsedInput.availableToWeekDay,
          availableFromTime: parsedInput.availableFromTime,
          availableToTime: parsedInput.availableToTime,
        },
      });
  });
