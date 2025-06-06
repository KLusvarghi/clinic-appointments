"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

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

    // deletando o doctor
    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));
    revalidatePath("/doctors"); // após a deleção ele recarrega a página

    return { success: true };
  });
