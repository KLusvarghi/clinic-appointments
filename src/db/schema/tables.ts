export * from "./accounts";
export * from "./appointments";
export * from "./assets";
export * from "./clinics";
export * from "./diagnoses";
export * from "./doctors";
export * from "./enums";
export * from "./patients";
export * from "./prescriptions";
export * from "./sessions";
export * from "./subscriptions";
export * from "./users";
export * from "./usersToClinics";
export * from "./verifications";

import { accountsTable } from "./accounts";
import { appointmentsTable } from "./appointments";
import { assetsTable } from "./assets";
import { clinicsTable } from "./clinics";
import { diagnosesTable } from "./diagnoses";
import { doctorsTable } from "./doctors";
import { patientsTable } from "./patients";
import { prescriptionsTable } from "./prescriptions";
import { sessionsTable } from "./sessions";
import { subscriptionsTable } from "./subscriptions";
import { usersTable } from "./users";
import { usersToClinicsTable } from "./usersToClinics";
import { verificationsTable } from "./verifications";

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
  assetsTable,
};
export default schema;
