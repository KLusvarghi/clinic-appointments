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
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

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
// TABELAS PRINCIPAIS
// ================================

/**
 * USERS TABLE
 * Usuários do sistema (funcionários da clínica, administradores)
 * Não confundir com pacientes - estes têm tabela própria
 */
export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
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

/**
 * CLINICS TABLE
 * Representa cada clínica/consultório no sistema
 * Entidade central que agrupa médicos, pacientes e agendamentos
 */
export const clinicsTable = pgTable("clinics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"), // Soft delete para preservar histórico
});

/**
 * DOCTORS TABLE
 * Médicos/profissionais de saúde vinculados às clínicas
 * Controla disponibilidade, especialidades e valores de consulta
 */
export const doctorsTable = pgTable("doctors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  clinicId: text("clinic_id")
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
  deletedAt: timestamp("deleted_at"), // Soft delete para preservar histórico
});

/**
 * PATIENTS TABLE
 * Pacientes que utilizam os serviços das clínicas
 * Possui sistema de login próprio e preferências de notificação
 */
export const patientsTable = pgTable("patients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  clinicId: text("clinic_id")
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
  deletedAt: timestamp("deleted_at"), // Soft delete para LGPD/GDPR
});

/**
 * APPOINTMENTS TABLE
 * Agendamentos/consultas - núcleo do sistema
 * Conecta pacientes, médicos e clínicas em um momento específico
 */
export const appointmentsTable = pgTable("appointments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  date: timestamp("date").notNull(), // Data e hora da consulta
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(), // Valor cobrado (pode diferir do padrão do médico)
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
  summary: text("summary"), // Resumo da consulta (após atendimento)
  consultationType: text("consultation_type"), // presencial, telemedicina, etc.
  attendedAt: timestamp("attended_at"), // Quando a consulta foi marcada como atendida
  canceledAt: timestamp("canceled_at"), // Quando foi cancelada
  canceledBy: text("canceled_by").references(() => usersTable.id), // Quem cancelou (usuário do sistema)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"), // Soft delete para auditoria
});

/**
 * SUBSCRIPTIONS TABLE
 * Gerencia planos de assinatura e faturamento das clínicas
 * Integração com Stripe para processamento de pagamentos
 */
export const subscriptionsTable = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  plan: planUserEnum("plan").notNull(), // Tipo de plano contratado
  status: text("status").notNull(), // active, canceled, past_due, etc.
  stripeCustomerId: text("stripe_customer_id"), // ID do cliente no Stripe
  stripeSubscriptionId: text("stripe_subscription_id"), // ID da assinatura no Stripe
  startDate: timestamp("start_date"), // Início da vigência
  endDate: timestamp("end_date"), // Fim da vigência (se aplicável)
  canceledAt: timestamp("canceled_at"), // Quando foi cancelado
  canceledReason: text("canceled_reason"), // Motivo do cancelamento
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * PRESCRIPTIONS TABLE
 * Prescrições médicas/receitas associadas às consultas
 * Suporta múltiplas medicações por consulta
 */
export const prescriptionsTable = pgTable("prescriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  clinicId: text("clinic_id") // Para facilitar relatórios por clínica
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  medicationName: text("medication_name").notNull(), // Nome do medicamento
  dosage: text("dosage").notNull(), // Dosagem (ex: "500mg")
  frequency: text("frequency").notNull(), // Frequência (ex: "2x ao dia")
  notes: text("notes"), // Observações adicionais
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * DIAGNOSES TABLE
 * Diagnósticos médicos associados às consultas
 * Suporta múltiplos diagnósticos por consulta
 */
export const diagnosesTable = pgTable("diagnoses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  clinicId: text("clinic_id") // Para facilitar queries por clínica
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // Código CID-10 ou similar
  description: text("description").notNull(), // Descrição do diagnóstico
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * USERS TO CLINICS TABLE
 * Relacionamento many-to-many entre usuários e clínicas
 * Um usuário pode trabalhar em múltiplas clínicas com diferentes roles
 * Uma clínica pode ter múltiplos usuários com diferentes permissões
 */
export const usersToClinicsTable = pgTable("users_to_clinics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("MANAGER").notNull(), // Papel do usuário nesta clínica específica
  isActive: boolean("is_active").default(true).notNull(), // Permite desativar temporariamente sem deletar
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * SESSIONS TABLE
 * Gerencia sessões de usuários autenticados
 * Armazena tokens e informações de segurança
 */
export const sessionsTable = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"), // Para segurança adicional
  userAgent: text("user_agent"), // Rastreamento de dispositivo
});

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
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

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

export const schema = {
  usersTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
  appointmentsTable,
  subscriptionsTable,
  prescriptionsTable,
  diagnosesTable,
  usersToClinicsTable,
  sessionsTable,
  verificationsTable,
  accountsTable,
};
export default schema;
