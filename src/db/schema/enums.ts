import { pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "attended",
  "canceled",
]);

export const planUserEnum = pgEnum("plan_user", ["free", "essential", "pro"]);

export const planUserEnumSchema = z.enum([...planUserEnum.enumValues] as const);

export type PlanUser = z.infer<typeof planUserEnumSchema>;

export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "MANAGER",
  "ASSISTANT",
]);

export const userRoleSchema = z.enum([...userRoleEnum.enumValues] as const);

export type UserRole = z.infer<typeof userRoleSchema>;

export const doctorStatusEnum = pgEnum("doctor_status", [
  "active",
  "inactive",
  "on_leave",
  "suspended",
]);

export const ownerTypeEnum = pgEnum("owner_type", [
  "user",
  "doctor",
  "patient",
  "clinic",
]);

export const assetTypeEnum = pgEnum("asset_type", [
  "user_avatar",
  "doctor_avatar",
  "patient_avatar",
  "clinic_logo",
  "other",
]);
