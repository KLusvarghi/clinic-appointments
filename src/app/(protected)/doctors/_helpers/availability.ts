// import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/db/schema/schema";

// para usar o dayjs com o utc, precisamos estender o dayjs com o plugin utc
dayjs.extend(utc);

// para usar o locale, precisamos estender o dayjs com o plugin locale
// dayjs.locale("pt-br"); // assim não precisa fazer mais nada e a data vai aparecer em português

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    // praticamente, fazemos o mesmo processo que no action, mas aqui, estamos pegando o dia da semana do médico
    .utc()
    // pegando o dia da semana do médico
    .day(doctor.availableFromWeekDay)
    // pegando as horas, minutos e segundos local
    .set("hour", Number(doctor.availableFromTime.split(":")[0]))
    .set("minute", Number(doctor.availableFromTime.split(":")[1]))
    .set("second", Number(doctor.availableFromTime.split(":")[2] || 0))
    .local();
  const to = dayjs()
    .utc()
    .day(doctor.availableToWeekDay)
    .set("hour", Number(doctor.availableToTime.split(":")[0]))
    .set("minute", Number(doctor.availableToTime.split(":")[1]))
    .set("second", Number(doctor.availableToTime.split(":")[2] || 0))
    .local();
  return { from, to };
};
