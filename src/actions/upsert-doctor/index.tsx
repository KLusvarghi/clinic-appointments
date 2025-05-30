// uma boa prática, é sempre validar os dados recebidos do front, e para isso usaremos o zod
"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertDoctorSchema } from "./schema";

// para usar o dayjs com o utc, precisamos estender o dayjs com o plugin utc
dayjs.extend(utc);

// resumindo, o action irá pegar o schema e já valida os parametros recebidos do front, e depois, irá executar a lógica do nosso servidor action

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema) // aqui, definimos o schema que iremos usar para validar os dados recebidos do front - ela tem uma boa integração com o zod
  // e aqui, definimos a action que iremos usar para executar a lógica do nosso servidor action
  // e dentro do action, temos o parsedInput que é o valor que iremos receber do front (que é o valor do forms)
  .action(async ({ parsedInput }) => {
    // um problemas que temos é questão das horas, e para manter a concistencia, temos que armazenar as horas em UTC (sem fuso horário)
    // pra começar vamos pegar os valores que queremos formatar antes de armazenar
    const availableFromTime = parsedInput.availableFromTime; // 15:30:00
    const availableToTime = parsedInput.availableToTime; // 16:00:00

    // aqui
    const availableFromTimeUTC = dayjs()
      // usando o split vamos divir o valor 15:30:00 em 3: [15, 30, 00]
      .set("hour", parseInt(availableFromTime.split(":")[0])) // [15]
      .set("minute", parseInt(availableFromTime.split(":")[1])) // [30]
      .set("second", parseInt(availableFromTime.split(":")[2])) // [00]
      .utc(); // e aqui convertemos para UTC

    // e aqui, vamos fazer o mesmo para a hora final
    const availableToTimeUTC = dayjs()
      .set("hour", parseInt(availableToTime.split(":")[0]))
      .set("minute", parseInt(availableToTime.split(":")[1]))
      .set("second", parseInt(availableToTime.split(":")[2]))
      .utc();

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
        ...parsedInput,
        id: parsedInput.id,
        clinicId: session?.user.clinic?.id,

        // E para armazenar no banco, ele recebe em string, e ai que usamos a lib dayjs para converter a data para string - https://day.js.org/docs/en/display/format
        availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
        availableToTime: availableToTimeUTC.format("HH:mm:ss"),
      })
      .onConflictDoUpdate({
        // Se já existir um médico com o id que estou recebendo (no schema definimos o id do medico como opcional, então ele pode o não vir), ele irá atualizar o médico com os valores do formData
        target: [doctorsTable.id],
        // e se gerar esse conflito, ele irá atualizar o médico passando todos os valores do forms
        set: {
          ...parsedInput,
          // repetindo a mesma coisa ao editar a data
          availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
          availableToTime: availableToTimeUTC.format("HH:mm:ss"),
        },
      });
    // Após inserir ou atualizar o médico, vamos refazer a pagina de médicos, assim aparece de imediato quando cria ou atualiza a página
    revalidatePath("/doctors");
  });
