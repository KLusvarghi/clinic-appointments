// lib/client-actions/use-change-clinic.ts
"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { changeClinic } from "@/actions/change-clinic";
import { authClient } from "@/lib/auth-client";

export function useChangeClinicAction() {
  const router = useRouter();
  const session = authClient.useSession();

  return useAction(changeClinic, {
    onSuccess: () => {
      session.refetch();
      router.refresh();
    },
  });
}
