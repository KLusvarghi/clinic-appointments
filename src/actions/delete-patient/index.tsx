"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/new_schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
/**
 * Exclui um paciente pertencente à clínica autenticada.
 *
 * @param parsedInput - Objeto contendo o ID do paciente.
 * @param ctx - Contexto da ação com os dados da clínica.
 */

export const deletePatient = protectedWithClinicActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient) {
      throw new Error("Patient doesn't exist");
    }

    if (patient.clinicId !== ctx.clinic.id) {
      throw new Error("Patient doesn't belong to the clinic");
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));
    revalidatePath("/patients");

    return { success: true };
  });
