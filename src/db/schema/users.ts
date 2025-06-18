import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { UserPreferences } from "@/types/user-preferences";

import { assetsTable } from "./assets";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  avatarId: text("avatar_id")
    .references(() => assetsTable.id, {
      onDelete: "set null",
    }),
  preferences: jsonb("preferences")
    .$type<UserPreferences>()
    .notNull()
    .default({
      theme: null,
      language: null,
      dashboardLayout: null,
      defaultClinicId: null,
      notifications: {
        email: true,
        push: false,
      },
    } as UserPreferences),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  lastLoginAt: timestamp("last_login_at"),
  deletedAt: timestamp("deleted_at"),
});

// selectedClinicId: null,
