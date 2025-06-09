import { z } from "zod";

export const addAppointmentSchema = z.object({
  patientId: z.string({
    message: "Pacient is required.",
  }),
  doctorId: z.string({
    message: "Doctor is required.",
  }),
  date: z.date({
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
  appointmentPriceInCents: z.number().min(1, {
    message: "Appointment price is required.",
  }),
});
