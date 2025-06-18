"use client";

import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

export const useSession = () => {
  const { data, error } = authClient.useSession();
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!data?.session;

  useEffect(() => {
    if (!data) {
      setStatus("unauthenticated");
    } else {
      setStatus("authenticated");
    }
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
  const plan = user?.plan ?? null;
  const role = user?.clinic?.role ?? null;
  const preferences = user?.preferences ?? null;
  const clinic = user?.clinic ?? null;
  const clinics = user?.clinics ?? [];

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
