"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { generateTimeSlots } from "@/helpers/time";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

dayjs.extend(utc); // para usar o plugin utc (data e hora em UTC)
dayjs.extend(timezone); // para usar o plugin timezone (data e hora em timezone)

/**
 * Retorna os horários disponíveis para um médico em determinada data.
 *
 * @param parsedInput - Objeto contendo o ID do médico e a data.
 * @param ctx - Contexto da ação com os dados da clínica.
 */
export const getAvailableTimes = protectedWithClinicActionClient
  .schema(
    z.object({
      // Precisamos receber o id do doctor e a data selecionada para verificar se o médico está disponível nessa data
      doctorId: z.string(),
      date: z.string().date(), // YYYY-MM-DD,
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const doctor = await db.query.doctorsTable.findFirst({
      where: and(
        eq(doctorsTable.id, parsedInput.doctorId),
        isNull(doctorsTable.deletedAt),
      ),
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    if (doctor.clinicId !== ctx.clinic.id) {
      throw new Error("Doctor doesn't belong to the clinic");
    }

    // primeiro temos que verificar se o médico está disponivel naquele dia da semana (segunda, terça, etc)
    // day() retorna o dia da semana, sendo 0 para domingo, 1 para segunda, 2 para terça, etc
    // o "parsedInput" é o "data" que se recebe no action
    const selectedDayOfWeek = dayjs(parsedInput.date).day(); // com isso ele pega o dia da semana

    // assim eu valido se o dia da semana está entre o inicial e o final que o médico está trabalhando
    const doctorIsAvailable =
      selectedDayOfWeek >= doctor.availableFromWeekDay &&
      selectedDayOfWeek <= doctor.availableToWeekDay;

    // caso não seja, ele já retorna um array vazio
    if (!doctorIsAvailable) {
      return [];
    }

    // caso o medico tenha disponibilidade nesse dia, nó pegaremos todos agendamento do médico
    const appointments = await db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.doctorId, parsedInput.doctorId),
        isNull(appointmentsTable.deletedAt),
      ),
    });

    // e aqui pegamos todos os agendamentos do médico nesse dia, apenas do dia selecionado
    const appointmentsOnSelectedDate = appointments
      .filter((appointment) => {
        // para cada agendamento ele irá filtrar apenas os que são do dia selecionado, usando o "isSame"
        return dayjs(appointment.date).isSame(parsedInput.date, "day");
      })
      // e para facilitar a comparação, vamos formatar para o formato "HH:mm:ss" e salvar em uma lista, ficando: [14:00:00, 14:30:00, 15:00:00, 15:30:00, 16:00:00, 16:30:00, 17:00:00]
      .map((appointment) => dayjs(appointment.date).format("HH:mm:ss"));

    // essa função gera os "slots" de horários entre [05:00:00] e [23:00:00] com intervalo de 30 minutos
    const timeSlots = generateTimeSlots();

    // como nós salvamos os dados com UTC no bd, precisamos converter para o horário local do médico
    // basicamnete quando estou criando uma data a partir de uma data em UTC, eu preciso usar o "utc" para converter para o horário local do médico
    const doctorAvailableFrom = dayjs()
      .utc()
      .set("hour", Number(doctor.availableFromTime.split(":")[0])) // pegando a hora
      .set("minute", Number(doctor.availableFromTime.split(":")[1])) // pegrando os minutos
      .set("second", 0) // não pegando os segundos
      .local();
    const doctorAvailableTo = dayjs()
      .utc()
      .set("hour", Number(doctor.availableToTime.split(":")[0]))
      .set("minute", Number(doctor.availableToTime.split(":")[1]))
      .set("second", 0)
      .local();

    const doctorTimeSlots = timeSlots.filter((time) => {
      // time = 14:00:00
      // para cada time, eu vou criar uma dara com esse time que recebemos com props
      const date = dayjs()
        .utc()
        .set("hour", Number(time.split(":")[0]))
        .set("minute", Number(time.split(":")[1]))
        .set("second", 0);

      return (
        // aqui pegamos a data que foi convertida para utc e depois para horario local, e vamos verificar se ela é maior ou igual que o horario de inicio e menor ou igual ao horario de fim do expediente do médico
        date.format("HH:mm:ss") >= doctorAvailableFrom.format("HH:mm:ss") &&
        date.format("HH:mm:ss") <= doctorAvailableTo.format("HH:mm:ss")
      );
    });

    // aqui eu vou mapear cada time retorna o valor, se ele está disponível e o label
    return doctorTimeSlots.map((time) => {
      return {
        value: time,
        available: !appointmentsOnSelectedDate.includes(time),
        label: time.substring(0, 5), // isso fará com que retorn apena "12:00" e não "12:00:00"
      };
    });
  });
