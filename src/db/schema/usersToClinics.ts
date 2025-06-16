import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { clinicsTable } from "./clinics";
import { userRoleEnum } from "./enums";
import { usersTable } from "./users";

export const usersToClinicsTable = pgTable("users_to_clinics", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("MANAGER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
