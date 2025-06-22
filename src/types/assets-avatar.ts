import { z } from "zod";

export const ownerTypeSchema = z.enum(["user", "doctor", "patient", "clinic"]);
export const assetTypeSchema = z.enum([
  "user_avatar",
  "doctor_avatar",
  "patient_avatar",
  "clinic_logo",
]);

export type OwnerType = z.infer<typeof ownerTypeSchema>;
export type assetType = z.infer<typeof assetTypeSchema>;
