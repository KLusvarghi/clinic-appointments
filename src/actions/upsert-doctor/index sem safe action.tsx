// uma boa prática, é sempre validar os dados recebidos do front, e para isso usaremos o zod
"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/new_schema";
import { auth } from "@/lib/auth";

import { UpsertDoctorSchema, upsertDoctorSchema } from "./schema";

/**
 * Insere ou atualiza um médico sem utilizar next-safe-action.
 *
 * @param formData - Dados validados por upsertDoctorSchema.
 * @returns Uma promessa que é resolvida quando o médico é salvo.
 */
export const upsertDoctor = async (formData: UpsertDoctorSchema) => {
  // para validar o que de "formData", usamos o upsertDoctorSchema
  upsertDoctorSchema.parse(formData);

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
      id: formData.id,
      clinicId: session.user.clinic.id,
      appointmentPriceInCents: Number(formData.appointmentPriceInCents),
      name: formData.name,
      specialty: formData.specialty,
      availableFromWeekDay: formData.availableFromWeekDay,
      availableToWeekDay: formData.availableToWeekDay,
      availableFromTime: formData.availableFromTime,
      availableToTime: formData.availableToTime,
    })
    .onConflictDoUpdate({
      // Se já existir um médico com o id que estou recebendo (no schema definimos o id do medico como opcional, então ele pode o não vir), ele irá atualizar o médico com os valores do formData
      target: [doctorsTable.id],
      // e se gerar esse conflito, ele irá atualizar o médico passando todos os valores do forms
      set: {
        name: formData.name,
        specialty: formData.specialty,
        appointmentPriceInCents: Number(formData.appointmentPriceInCents),
        availableFromWeekDay: formData.availableFromWeekDay,
        availableToWeekDay: formData.availableToWeekDay,
        availableFromTime: formData.availableFromTime,
        availableToTime: formData.availableToTime,
      },
    });
};
