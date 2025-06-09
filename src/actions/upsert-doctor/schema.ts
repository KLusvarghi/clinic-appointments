import { z } from "zod";

// esse schema ele é bem parecido com o que fizemos no form do doctor, mas é bom não reutilziar o mesmo por que eles tem responsabilidades diferentes.

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(), // caso não exista, ele será undefined
    name: z.string().trim().min(1, { message: "Doctor name is required" }),
    specialty: z.string().min(1, { message: "Specialty is required" }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: "Appointment price is required" }),
    availableFromWeekDay: z
      .number()
      .min(0).max(6),
    availableToWeekDay: z
      .number()
      .min(0).max(6),
    availableFromTime: z.string().min(1, {
      message: "Start time is required",
    }),
    availableToTime: z.string().min(1, {
      message: "End time is required",
    }),
  })
  .refine(
    (data) => {
      // caso essa validação seja true, o campo é validado e ele retortna true
      return data.availableFromTime < data.availableToTime;
    },
    // caso essa validação seja false, o campo é invalidado e ele retorna false e exibe a mensagem
    {
      message: "Start time must be before end time",
      // e para expeficicar abaixo de qual campo será exibido, passamos o nome do campo:
      path: ["availableToTime"],
    },
  );

  // e esse é o type do nosso schema
  export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
