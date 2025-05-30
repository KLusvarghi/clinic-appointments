// criando os schemas (basicamente o que vai ser salvo no banco de dados, tabelas, tipos de dados, etc)
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// schemas criados pelo better-auth para implementar a autenticação

// "users" é o nome da tabela e dentro são as prorpiedades
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable), // um usuário pode ter várias clinicas
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
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
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // onUpdate usamos para atualizar a data de atualização, então toda vez que houver uma atualização, ele atualiza a data
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Quando se fazemos uma relação n-n (many to many), criamos uma tabela intermediária que lidará com as chaves estrangeiras
export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// definindo as relações da tabela intermediária
export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    // apenas dizendo que "users" referencia a tabela "users" e a coluna "id"
    user: one(usersTable, {
      // um usuário pode ter uma clinica
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    // apenas dizendo que "clinics" referencia a tabela "clinics" e a coluna "id"
    clinic: one(clinicsTable, {
      // uma clinica pode ter um usuário
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// aqui foi explicitados as relações da clinica
export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  // uma clinica pode ter varios medicos
  // definindo a relação de 1-n (one to many)
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(patientsTable),
  usersToClinics: many(usersToClinicsTable), // uma clinica pode ter varios usuarios
}));

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),

  // esse "onDelete: "cascade"" significa se ao deletar a clinica que o doutor é vinculado, ele deleta o doutor também
  // fazendo referencia a "clinicsTable" e a coluna "id"
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),

  // 1 = monday, 2 = tuesday, 3 = wednesday, 4 = thursday, 5 = friday, 6 = saturday, 0 = sunday
  availableFromWeekDay: integer("available_from_week_day").notNull(),// 1 = monday
  availableToWeekDay: integer("available_to_week_day").notNull(),// 5 = friday

  // o tipo "time" é para horas e minutos
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),

  // valores monetarios
  // não utilizamos o tipo "float" -> porque ele tem como objetivo ECONOMIZAR MEMORIA
  // E dentro do postgress, ele nos tras o tipo "numeric"
  // POrém, para casos em que lidamos com muitas casas decimais, temos a lib decimal.js que vem pra ajduar
  // Mas nesse caso, como iremos salvar em centavos, podemos usar o tipo "integer" e apenas multiplicar ou dividir por 100 no front
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// poruqe fazer isso se já dizemos que que tem essa relação em "clinicId)"? porque apenas o campo "clinicId" não nos da acesso aos dados da clinica, e sendo necessario isso para que ele faça os joins
export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      // Um medico pertence a uma clinica
      fields: [doctorsTable.clinicId], // dizendo que o campo "clinicId" dentro de "doctorsTable" referencia o campo 'id' dentro de "clinicsTable"
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable), // Um medico pode ter varios agendamentos
  }),
);

// o tipo "Enum" é um tipo de dado que nos permite definir um conjunto de valores possíveis para uma coluna
// nesse caso, o "patient_sex" é um enum que nos permite definir os valores possíveis para a coluna "sex"
// e o "male" e "female" são os valores possíveis para a coluna "sex"
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  // .unique() -> só use quando realmente necessário, porque ele cria um index e ocupa memoria, e isso pode afetar o desempenho do banco de dados
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    // um paciente tem uma clinica
    fields: [patientsTable.clinicId], // na tabela "patientsTable" a coluna "clinicId" referencia a coluna "id" da tabela "clinicsTable"
    references: [clinicsTable.id],
  }),
}));

export const appointmentsTable = pgTable("appointments", {
  id: text("id").primaryKey(),
  // o tipo timestamp ele apaenas armazena a data com o hora
  // já o "time" ele armazena apenas a hora e os minutos (tempo)
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),

  // dizendo que ele é um uuid. sua coluna se chama "clinic_id". ele faz referencia a "clinicsTable" e a coluna "id"
  // com isso ele já entende que é um FK (foreign key)
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id, { onDelete: "cascade" }),
});

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one }) => ({
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
  }),
);
