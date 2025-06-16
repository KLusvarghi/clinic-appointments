import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { assetsTable } from "./assets";

export const clinicsTable = pgTable("clinics", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  avatarId: text("avatar_id").references(() => assetsTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});
