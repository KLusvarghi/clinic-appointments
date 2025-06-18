import { z } from "zod";

export const upsertUserSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "ASSISTANT"]),
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is invalid" }),
});

export type UpsertUserSchema = z.infer<typeof upsertUserSchema>;