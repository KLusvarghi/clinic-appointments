"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

import { getAvailableTimes } from "../get-available-times";
import type { TimeSlot } from "../get-available-times/types";
import { addAppointmentSchema } from "./schema";

/**
 * Cria um agendamento caso o horário escolhido esteja disponível. O
 * agendamento é associado à clínica do contexto autenticado e as páginas
 * relevantes são revalidadas.
 *
 * @param parsedInput - Dados validados por {@link addAppointmentSchema}.
 * @param ctx - Contexto contendo a clínica autenticada.
 */
export const addAppointment = protectedWithClinicActionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    // getAvailableTimes retorna um array de objetos com o time e se ele está disponível ou não
    const availableTimesResponse = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    if (!availableTimesResponse?.data) {
      throw new Error("No available times");
    }

    // verificando se o time selecionado está disponível
    const isTimeAvailable = availableTimesResponse.data.some(
      // some é um método que verifica se algum dos elementos do array atende a condição
      (time: TimeSlot) => time.value === parsedInput.time && time.available,
    );

    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    const appointmentDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db.insert(appointmentsTable).values({
      ...parsedInput,
      clinicId: ctx.clinic.id, // houve mudanças
      date: appointmentDateTime,
    });

    revalidatePath("/appointments");
    revalidatePath("/dashboard"); // revalidando o dashboard para que atualize os dados conforme esperado
  });
