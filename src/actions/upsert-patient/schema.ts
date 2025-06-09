import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  sex: z.enum(["male", "female"], {
    required_error: "Sex is required",
  }),
});
