"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
/**
 * Exclui um agendamento pertencente à clínica autenticada.
 *
 * @param parsedInput - Objeto contendo o ID do agendamento.
 * @param ctx - Contexto da ação com os dados da clínica.
 */

export const deleteAppointment = protectedWithClinicActionClient
  .schema(
    z.object({
      id: z.string(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    });

    if (!appointment) {
      throw new Error("Appointment doesn't exist");
    }

    if (appointment.clinicId !== ctx.clinic.id) {
      throw new Error("Appointment doesn't belong to the clinic");
    }

    await db
      .update(appointmentsTable)
      .set({ deletedAt: new Date() })
      .where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");

    return { success: true };
  });
