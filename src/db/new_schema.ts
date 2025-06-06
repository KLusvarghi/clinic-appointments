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

// Enums
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "attended",
  "canceled",
]);

export const planUserEnum = pgEnum("plan_user", ["free", "essential", "pro"]);
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN", // acesso total
  "MANAGER", // cria médicos, vê agenda, mas não edita usuários
  "ASSISTANT", // agenda e vê pacientes
]);
// enum para status do médico
export const doctorStatusEnum = pgEnum("doctor_status", [
  "active",
  "inactive",
  "on_leave",
  "suspended",
]);

// Tabela de Contas
export const accountsTable = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (accounts) => ({
    // 👇 Garantia de unicidade do provedor + conta externa
    uniqueAccountProvider: unique().on(accounts.accountId, accounts.providerId),
  }),
);

export const accountsTableRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

// Tabela de Verificações
export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Tabela de Relacionamento Users <-> Clinics
export const usersToClinicsTable = pgTable("users_to_clinics", {
  id: uuid("id").defaultRandom().primaryKey(), // ← Adicione PK
  userId: uuid("user_id") // ← Mantenha text (compatível)
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("MANAGER").notNull(), // ← ADICIONE role
  isActive: boolean("is_active").default(true).notNull(), // ← Status
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

// Tabela Users
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  preferences: json("preferences").default({
    theme: null,
    language: null,
    dashboardLayout: null,
    defaultClinicId: null,
    notifications: {
      email: true,
      push: false,
    },
  }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  lastLoginAt: timestamp("last_login_at"),
  deletedAt: timestamp("deleted_at"),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

// Tabela Clinics
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable), // ✅ Estava appointmentsTable, não patientsTable
  usersToClinics: many(usersToClinicsTable),
  subscriptions: many(subscriptionsTable),
}));

// Tabela de Assinaturas
export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  plan: planUserEnum("plan_user").notNull(),
  status: text("status").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  canceledAt: timestamp("canceled_at"),
  canceledReason: text("canceled_reason"),
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

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  bio: text("bio"),
  crmNumber: text("crm_number").unique(), // ✅ Deve ser único
  status: doctorStatusEnum("status").default("active").notNull(), // ✅ Com enum
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

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

// Tabela Patients
export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(),
  whatsappNumber: text("whatsapp_number"),
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

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable), // ✅ Adicionar este relacionamento
  }),
);

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
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
  summary: text("summary"),
  consultationType: text("consultation_type"),
  attendedAt: timestamp("attended_at"),
  canceledAt: timestamp("canceled_at"),
  canceledBy: text("canceled_by") // ✅ Melhor seria referenciar usersTable.id
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

// tabela de diagnósticos (sugestão)
export const diagnosesTable = pgTable("diagnoses", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id") // ← ADICIONAR ESTA LINHA
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // CID-10 ou similar
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
    diagnoses: many(diagnosesTable), // ✅ Relacionamento simples
  }),
);
// Tabela de Prescrições
export const prescriptionsTable = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  }),
);
