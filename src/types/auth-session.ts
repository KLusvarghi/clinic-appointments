import { PlanUser, UserRole } from "@/db/schema";

import type { SessionWithUser } from "./session-with-user";
import { UserPreferences } from "./user-preferences";

export interface SessionInfo {
  id: string;
  userId: string;
  token: string;
  createdAt: Date; // ou string, veja nota abaixo
  updatedAt: Date;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface UserClinic {
  id: string;
  name: string;
  plan: PlanUser | null;
  role: UserRole;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  avatarId?: string | null;
  lastLoginAt?: Date | null;
  deletedAt?: Date | null;

  preferences: UserPreferences | null;
  clinics: UserClinic[];
  clinic: UserClinic | null;
  plan: "free" | "essential" | "pro" | null;
  image?: string | null;
}

export interface CustomSession {
  user: UserSession;
  session: SessionInfo;
  sessions?: SessionWithUser[];
}
