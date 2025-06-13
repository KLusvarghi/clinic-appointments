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

// ================================
// RELACIONAMENTOS ENTRE TABELAS
// ================================

/**
 * Relacionamentos da tabela de usuários
 * Um usuário pode ter múltiplas contas (OAuth, local)
 * e estar associado a várias clínicas com diferentes papéis
 */
export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
  accounts: many(accountsTable),
  sessions: many(sessionsTable),
  // verifications: many(verificationsTable),
  // appointments: many(appointmentsTable),
  // subscriptions: many(subscriptionsTable),
}));

/**
 * Relacionamentos da tabela de clínicas
 * Uma clínica pode ter múltiplos médicos, pacientes,
 * agendamentos e usuários associados
 */
export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
  subscriptions: many(subscriptionsTable),
}));

/**
 * Relacionamentos da tabela de médicos
 * Um médico pertence a uma clínica e pode ter
 * múltiplos agendamentos associados
 */
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

/**
 * Relacionamentos da tabela de pacientes
 * Um paciente pertence a uma clínica e pode ter
 * múltiplos agendamentos associados
 */
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

/**
 * Relacionamentos da tabela de agendamentos
 * Um agendamento conecta uma clínica, um paciente e um médico
 * e pode ter múltiplas prescrições e diagnósticos
 */
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

/**
 * Relacionamentos da tabela de assinaturas
 * Uma assinatura pertence a uma clínica específica
 * e gerencia o plano de faturamento
 */
export const subscriptionsTableRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [subscriptionsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

/**
 * Relacionamentos da tabela de prescrições
 * Uma prescrição pertence a um agendamento específico
 * e está associada a uma clínica para relatórios
 */
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

/**
 * Relacionamentos da tabela de diagnósticos
 * Um diagnóstico pertence a um agendamento específico
 * e está associado a uma clínica para queries
 */
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

/**
 * Relacionamentos da tabela de usuários para clínicas
 * Gerencia o relacionamento many-to-many entre usuários e clínicas
 * com diferentes papéis e permissões
 */
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

/**
 * Relacionamentos da tabela de sessões
 * Uma sessão pertence a um usuário específico
 * e gerencia o estado de autenticação
 */
export const sessionsTableRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

/**
 * Relacionamentos da tabela de contas
 * Uma conta pertence a um usuário específico
 * e gerencia autenticação externa (OAuth)
 */
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
