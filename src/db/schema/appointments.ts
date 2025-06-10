import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { doctors } from "./doctors";
import { patients } from "./patients";

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctors.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 
