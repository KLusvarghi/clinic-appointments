import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { assetsTable } from "./assets";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  avatarId: text("avatar_id").references(() => assetsTable.id, {
    onDelete: "set null",
  }),
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
