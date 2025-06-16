import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { appointmentsTable } from "./appointments";
import { clinicsTable } from "./clinics";

export const diagnosesTable = pgTable("diagnoses", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
