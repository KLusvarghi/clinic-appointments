"use client";

import { useEffect, useState } from "react";

import { UserRole } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { CustomSession } from "@/types/auth-session";

export const useSession = (): {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  session: CustomSession["session"] | null;
  user: CustomSession["user"] | null;
  clinic: CustomSession["user"]["clinic"] | null;
  clinics: CustomSession["user"]["clinics"];
  plan: CustomSession["user"]["plan"];
  role: UserRole | null;
  preferences: CustomSession["user"]["preferences"] | null;
  sessions: CustomSession["sessions"];
} => {
  const { data, error } = authClient.useSession();
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!data?.session;

  useEffect(() => {
    setStatus(data ? "authenticated" : "unauthenticated");
  }, [data]);

  if (isLoading) {
    return {
      isLoading: true,
      isAuthenticated: false,
      error: null,
      session: null,
      user: null,
      clinic: null,
      clinics: [],
      plan: null,
      role: null,
      preferences: null,
      sessions: [],
    };
  }

  if (error) {
    return {
      isLoading: false,
      isAuthenticated: false,
      error,
      session: null,
      user: null,
      clinic: null,
      clinics: [],
      plan: null,
      role: null,
      preferences: null,
      sessions: [],
    };
  }

  const session = data?.session ?? null;
  const sessions = data?.sessions ?? [];
  const user = data?.user ?? null;
  const clinic = user?.clinic ?? null;
  const clinics = user?.clinics ?? [];
  const plan = user?.plan ?? null;
  const role = clinic?.role ?? null;
  const preferences = user?.preferences ?? null;

  return {
    isLoading: false,
    error: null,
    isAuthenticated,
    session,
    sessions,
    user,
    clinic,
    clinics,
    plan,
    role,
    preferences,
  };
};
