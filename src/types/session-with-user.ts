import { sessionsTable, } from "@/db/schema";
import { UserPreferences } from "@/types/user-preferences";

export type SessionWithUser = typeof sessionsTable.$inferSelect & {
  user: {
    name: string;
    email: string;
    preferences: UserPreferences;
  };
};
