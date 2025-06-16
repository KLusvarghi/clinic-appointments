import { integer, pgTable, text, time, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { assetsTable } from "./assets";
import { clinicsTable } from "./clinics";
import { doctorStatusEnum } from "./enums";

export const doctorsTable = pgTable("doctors", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarId: text("avatar_id").references(() => assetsTable.id, {
    onDelete: "set null",
  }),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  bio: text("bio"),
  crmNumber: text("crm_number").unique(),
  status: doctorStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
