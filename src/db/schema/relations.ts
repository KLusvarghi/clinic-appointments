import { relations } from "drizzle-orm";

import {
  accountsTable,
  appointmentsTable,
  clinicsTable,
  diagnosesTable,
  doctorsTable,
  patientsTable,
  prescriptionsTable,
  sessionsTable,
  subscriptionsTable,
  usersTable,
  usersToClinicsTable,
} from "./tables";

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
  accounts: many(accountsTable),
  sessions: many(sessionsTable),
  // verifications: many(verificationsTable),
  // appointments: many(appointmentsTable),
  // subscriptions: many(subscriptionsTable),
}));

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
  subscriptions: many(subscriptionsTable),
}));

export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    prescriptions: many(prescriptionsTable),
    diagnoses: many(diagnosesTable),
  }),
);

export const subscriptionsTableRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [subscriptionsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const prescriptionsTableRelations = relations(
  prescriptionsTable,
  ({ one }) => ({
    appointment: one(appointmentsTable, {
      fields: [prescriptionsTable.appointmentId],
      references: [appointmentsTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [prescriptionsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const diagnosesTableRelations = relations(diagnosesTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [diagnosesTable.appointmentId],
    references: [appointmentsTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [diagnosesTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const sessionsTableRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const accountsTableRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const relations = {
  usersTableRelations,
  clinicsTableRelations,
  doctorsTableRelations,
  patientsTableRelations,
  appointmentsTableRelations,
  subscriptionsTableRelations,
  prescriptionsTableRelations,
  diagnosesTableRelations,
  usersToClinicsTableRelations,
  sessionsTableRelations,
  accountsTableRelations,
};

export default relations;
