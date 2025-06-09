"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { doctorsTable } from "@/db/new_schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
/**
 * Exclui um médico se ele pertencer à clínica autenticada.
 *
 * @param parsedInput - Objeto contendo o ID do médico.
 * @param ctx - Contexto da ação com os dados da clínica.
 */

export const deleteDoctor = protectedWithClinicActionClient
  .schema(
    z.object({
      // recebendo o id do medico a ser deletado
      id: z.string().uuid(),
    }),
  )
  // o ".action" recebe uma arrow function da acção a ser executada
  .action(async ({ parsedInput, ctx }) => {
    // o "parsedInput" é o que se recebe

    // obtendo o doctor que tenha o mesmo id que tenha no bd
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    });

    // verificando se o doctor existe
    if (!doctor) {
      throw new Error("Doctor doesn't exist");
    }
    // verifica se o clinicId do doctor é o do clinicId do user
    if (doctor.clinicId !== ctx.clinic?.id) {
      throw new Error("Doctor doesn't belong to the clinic");
    }

    // faz o soft delete do doctor marcando a data de exclusão
    await db
      .update(doctorsTable)
      .set({ deletedAt: new Date() })
      .where(eq(doctorsTable.id, parsedInput.id));
    revalidatePath("/doctors"); // após a deleção ele recarrega a página

    return { success: true };
  });
