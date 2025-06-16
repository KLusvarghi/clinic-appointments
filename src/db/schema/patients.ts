import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { assetsTable } from "./assets";
import { clinicsTable } from "./clinics";
import { patientSexEnum } from "./enums";

export const patientsTable = pgTable("patients", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(),
  whatsappNumber: text("whatsapp_number"),
  avatarId: text("avatar_id").references(() => assetsTable.id, {
    onDelete: "set null",
  }),
  notificationPreferences: json("notification_preferences").default({
    channels: {
      whatsapp: true,
      email: true,
      sms: false,
    },
    types: {
      reminder: true,
      promotion: false,
      survey: false,
    },
    preferredTime: null,
  }),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
