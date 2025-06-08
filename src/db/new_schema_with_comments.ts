import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// ================================
// ENUMS - Definições de tipos padronizados
// ================================

// Status do agendamento no fluxo de consulta
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending", // Aguardando confirmação
  "confirmed", // Confirmado pelo paciente/clínica
  "attended", // Consulta realizada
  "canceled", // Cancelado por qualquer motivo
]);

// Planos de assinatura disponíveis
export const planUserEnum = pgEnum("plan_user", ["free", "essential", "pro"]);

// Sexo biológico do paciente (para fins médicos)
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

// Hierarquia de permissões no sistema
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN", // Acesso total ao sistema
  "MANAGER", // Cria médicos, vê agendas, mas não edita usuários
  "ASSISTANT", // Agenda consultas e visualiza pacientes
]);

// Status operacional do médico
export const doctorStatusEnum = pgEnum("doctor_status", [
  "active", // Ativo e disponível para consultas
  "inactive", // Temporariamente indisponível
  "on_leave", // Em licença/férias
  "suspended", // Suspenso administrativamente
]);

// ================================
// TABELAS DE AUTENTICAÇÃO
// ================================

/**
 * ACCOUNTS TABLE
 * Gerencia autenticação externa (OAuth, etc.) e credenciais de login
 * Suporta múltiplos provedores por usuário (Google, GitHub, etc.)
 */
export const accountsTable = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    accountId: text("account_id").notNull(), // ID do usuário no provedor externo
    providerId: text("provider_id").notNull(), // Nome do provedor (google, github, etc.)
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"), // Token de acesso à API do provedor
    refreshToken: text("refresh_token"), // Token para renovar o access_token
    idToken: text("id_token"), // Token de identidade (JWT)
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"), // Permissões concedidas pelo usuário
    password: text("password"), // Hash da senha (para login local)
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (accounts) => ({
    // Impede duplicação: um usuário não pode ter duas contas do mesmo provedor
    uniqueAccountProvider: unique().on(accounts.accountId, accounts.providerId),
  }),
);

export const accountsTableRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

/**
 * VERIFICATIONS TABLE
 * Armazena códigos de verificação temporários (email, SMS, etc.)
 * Usado para confirmação de email, reset de senha, 2FA
 */
export const verificationsTable = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  identifier: text("identifier").notNull(), // Email, telefone ou outro identificador
  value: text("value").notNull(), // Código/token de verificação
  expiresAt: timestamp("expires_at").notNull(), // Data de expiração do código
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ================================
// TABELAS DE RELACIONAMENTO
// ================================

/**
 * USERS TO CLINICS TABLE
 * Relacionamento many-to-many entre usuários e clínicas
 * Um usuário pode trabalhar em múltiplas clínicas com diferentes roles
 * Uma clínica pode ter múltiplos usuários com diferentes permissões
 */
export const usersToClinicsTable = pgTable("users_to_clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("MANAGER").notNull(), // Papel do usuário nesta clínica específica
  isActive: boolean("is_active").default(true).notNull(), // Permite desativar temporariamente sem deletar
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

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

// ================================
// TABELAS PRINCIPAIS
// ================================

/**
 * USERS TABLE
 * Usuários do sistema (funcionários da clínica, administradores)
 * Não confundir com pacientes - estes têm tabela própria
 */
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  // Configurações personalizadas do usuário (JSON flexível)
  preferences: json("preferences").default({
    theme: null, // dark/light theme
    language: null, // pt-BR, en-US, etc.
    dashboardLayout: null, // layout preferido do dashboard
    defaultClinicId: null, // clínica padrão ao fazer login
    notifications: {
      email: true,
      push: false,
    },
  }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  lastLoginAt: timestamp("last_login_at"), // Para auditoria e segurança
  deletedAt: timestamp("deleted_at"), // Soft delete para preservar histórico
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

/**
 * CLINICS TABLE
 * Representa cada clínica/consultório no sistema
 * Entidade central que agrupa médicos, pacientes e agendamentos
 */
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"), // Soft delete para preservar histórico
});

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
  subscriptions: many(subscriptionsTable),
}));

/**
 * SUBSCRIPTIONS TABLE
 * Gerencia planos de assinatura e faturamento das clínicas
 * Integração com Stripe para processamento de pagamentos
 */
export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  plan: planUserEnum("plan_user").notNull(), // Tipo de plano contratado
  status: text("status").notNull(), // active, canceled, past_due, etc.
  stripeCustomerId: text("stripe_customer_id"), // ID do cliente no Stripe
  stripeSubscriptionId: text("stripe_subscription_id"), // ID da assinatura no Stripe
  startDate: timestamp("start_date"), // Início da vigência
  endDate: timestamp("end_date"), // Fim da vigência (se aplicável)
  canceledAt: timestamp("canceled_at"), // Quando foi cancelado
  canceledReason: text("canceled_reason"), // Motivo do cancelamento
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
 * DOCTORS TABLE
 * Médicos/profissionais de saúde vinculados às clínicas
 * Controla disponibilidade, especialidades e valores de consulta
 */
export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  // Disponibilidade semanal (0=domingo, 6=sábado)
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  // Horário de atendimento diário
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(), // Especialidade médica
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(), // Valor em centavos
  bio: text("bio"), // Biografia/descrição do profissional
  crmNumber: text("crm_number").unique(), // Registro profissional único
  status: doctorStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => usersTable.id),
  deletedAt: timestamp("deleted_at"), // Soft delete para preservar histórico
});

export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
    updatedByUser: one(usersTable, {
      fields: [doctorsTable.updatedBy],
      references: [usersTable.id],
    }),
  }),
);

/**
 * PATIENTS TABLE
 * Pacientes que utilizam os serviços das clínicas
 * Possui sistema de login próprio e preferências de notificação
 */
export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(), // Para fins médicos/estatísticos
  whatsappNumber: text("whatsapp_number"), // Separado do telefone principal
  // Configurações de como o paciente quer ser notificado
  notificationPreferences: json("notification_preferences").default({
    channels: {
      whatsapp: true,
      email: true,
      sms: false,
    },
    types: {
      reminder: true, // Lembrete de consulta
      promotion: false, // Ofertas e promoções
      survey: false, // Pesquisas de satisfação
    },
    preferredTime: null, // Horário preferido para notificações
  }),
  password: text("password"), // Hash da senha para login do paciente
  emailVerified: boolean("email_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  // Sistema de reset de senha
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => usersTable.id),
  deletedAt: timestamp("deleted_at"), // Soft delete para LGPD/GDPR
});

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
    updatedByUser: one(usersTable, {
      fields: [patientsTable.updatedBy],
      references: [usersTable.id],
    }),
  }),
);

/**
 * APPOINTMENTS TABLE
 * Agendamentos/consultas - núcleo do sistema
 * Conecta pacientes, médicos e clínicas em um momento específico
 */
export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(), // Data e hora da consulta
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(), // Valor cobrado (pode diferir do padrão do médico)
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id, { onDelete: "cascade" }),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  summary: text("summary"), // Resumo da consulta (após atendimento)
  consultationType: text("consultation_type"), // presencial, telemedicina, etc.
  attendedAt: timestamp("attended_at"), // Quando a consulta foi marcada como atendida
  canceledAt: timestamp("canceled_at"), // Quando foi cancelada
  canceledBy: text("canceled_by") // Quem cancelou (usuário do sistema)
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => usersTable.id),
  deletedAt: timestamp("deleted_at"), // Soft delete para auditoria
});

/**
 * DIAGNOSES TABLE
 * Diagnósticos médicos associados às consultas
 * Suporta múltiplos diagnósticos por consulta
 */
export const diagnosesTable = pgTable("diagnoses", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id") // Para facilitar queries por clínica
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // Código CID-10 ou similar
  description: text("description").notNull(), // Descrição do diagnóstico
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => usersTable.id),
});

export const diagnosesTableRelations = relations(diagnosesTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [diagnosesTable.appointmentId],
    references: [appointmentsTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [diagnosesTable.clinicId],
    references: [clinicsTable.id],
  }),
  updatedByUser: one(usersTable, {
    fields: [diagnosesTable.updatedBy],
    references: [usersTable.id],
  }),
}));

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
    updatedByUser: one(usersTable, {
      fields: [appointmentsTable.updatedBy],
      references: [usersTable.id],
    }),
    canceledByUser: one(usersTable, {
      fields: [appointmentsTable.canceledBy],
      references: [usersTable.id],
    }),
  }),
);

/**
 * PRESCRIPTIONS TABLE
 * Prescrições médicas/receitas associadas às consultas
 * Suporta múltiplas medicações por consulta
 */
export const prescriptionsTable = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id") // Para facilitar relatórios por clínica
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  medicationName: text("medication_name").notNull(), // Nome do medicamento
  dosage: text("dosage").notNull(), // Dosagem (ex: "500mg")
  frequency: text("frequency").notNull(), // Frequência (ex: "2x ao dia")
  notes: text("notes"), // Observações adicionais
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => usersTable.id),
});

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
    updatedByUser: one(usersTable, {
      fields: [prescriptionsTable.updatedBy],
      references: [usersTable.id],
    }),
  }),
);

// ================================
// RESUMO DAS FUNCIONALIDADES
// ================================

/*
FLUXO PRINCIPAL DO SISTEMA:

1. SETUP INICIAL:
   - Clínica se cadastra e escolhe plano (subscriptions)
   - Usuários são adicionados à clínica com roles específicos (users_to_clinics)
   - Médicos são cadastrados com disponibilidade e valores (doctors)

2. GESTÃO DE PACIENTES:
   - Pacientes se cadastram ou são cadastrados pela clínica (patients)
   - Configuram preferências de notificação
   - Podem fazer login para ver seus agendamentos

3. AGENDAMENTO:
   - Consultas são criadas conectando paciente + médico + horário (appointments)
   - Status evolui: pending → confirmed → attended/canceled
   - Sistema de notificações baseado nas preferências do paciente

4. ATENDIMENTO:
   - Médico registra diagnósticos (diagnoses) usando códigos CID
   - Prescreve medicamentos (prescriptions) com dosagem e frequência
   - Adiciona resumo da consulta no appointment

5. SEGURANÇA E AUDITORIA:
   - Soft deletes preservam histórico médico
   - Múltiplos métodos de autenticação (accounts, verifications)
   - Rastreamento de quem cancelou consultas
   - Logs de último login para usuários e pacientes

6. FATURAMENTO:
   - Integração com Stripe para pagamentos recorrentes
   - Controle de planos e status de assinatura
   - Valores de consulta flexíveis por médico
*/

// implementação futura
export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "view",
  "export",
]);

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id),
  entityType: text("entity_type").notNull(), // 'patient', 'appointment', etc.
  entityId: uuid("entity_id").notNull(),
  action: auditActionEnum("action").notNull(), // 'create', 'update', 'delete'
  changes: json("changes"), // { field: { old: valor_antigo, new: valor_novo } }
  ipAddress: text("ip_address"), // Para segurança adicional
  userAgent: text("user_agent"), // Rastreamento de dispositivo
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
