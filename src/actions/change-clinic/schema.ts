import { z } from "zod";

// Input
export const changeClinicSchema = z.object({
  clinicId: z.string().uuid(),
});
export type ChangeClinicInput = z.infer<typeof changeClinicSchema>;

// (Opcional) Output
export const changeClinicResultSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]),
  plan: z.string().nullable(),
  logo: z.string().url(),
});

export type ChangeClinicOutput = z.infer<typeof changeClinicResultSchema>;
