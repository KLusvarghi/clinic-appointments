import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { clinicsTable } from "./clinics";
import { doctorsTable } from "./doctors";
import { appointmentStatusEnum } from "./enums";
import { patientsTable } from "./patients";
import { usersTable } from "./users";

export const appointmentsTable = pgTable("appointments", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  date: timestamp("date").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patientsTable.id, { onDelete: "cascade" }),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctorsTable.id, { onDelete: "cascade" }),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  summary: text("summary"),
  consultationType: text("consultation_type"),
  attendedAt: timestamp("attended_at"),
  canceledAt: timestamp("canceled_at"),
  canceledBy: text("canceled_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
