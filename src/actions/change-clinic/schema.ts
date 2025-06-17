import { z } from "zod";

import { userRoleEnum } from "@/db/schema";

// Input
export const changeClinicSchema = z.object({
  clinicId: z.string(),
});
export type ChangeClinicInput = z.infer<typeof changeClinicSchema>;

// (Opcional) Output
export const changeClinicResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(userRoleEnum.enumValues as [string, ...string[]]),
  plan: z.string().nullable(),
  // logo: z.string(),
});

export type ChangeClinicOutput = z.infer<typeof changeClinicResultSchema>;
