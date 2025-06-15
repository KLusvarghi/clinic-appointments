// lib/client-actions/use-change-clinic.ts
"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { changeClinic } from "@/actions/change-clinic";

export function useChangeClinicAction() {
  const router = useRouter();
  return useAction(changeClinic, {
    onSuccess: () => router.refresh(),
  });
}
