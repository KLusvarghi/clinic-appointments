"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { patientsTable } from "@/db/schema/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

import { upsertPatientSchema } from "./schema";

/**
 * Insere ou atualiza o registro de um paciente para a clínica autenticada.
 *
 * @param parsedInput - Dados validados por upsertPatientSchema.
 * @param ctx - Contexto da ação com os dados da clínica.
 */
export const upsertPatient = protectedWithClinicActionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: ctx.clinic.id,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...parsedInput,
        },
      });

    revalidatePath("/patients");
  });
