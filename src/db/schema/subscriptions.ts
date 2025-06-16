import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { clinicsTable } from "./clinics";
import { planUserEnum } from "./enums";

export const subscriptionsTable = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  plan: planUserEnum("plan").notNull(),
  status: text("status").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  canceledAt: timestamp("canceled_at"),
  canceledReason: text("canceled_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
