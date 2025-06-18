// hooks/useLoginMutation.ts

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { persistPreferences } from "../../_helpers/save-preferences";
import { LoginError, loginUser } from "../_services/login-user";

export const useLoginMutation = (
  onSuccess: () => void,
  setFieldError: (msg: string) => void,
) =>
  useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      persistPreferences(user?.preferences ?? null);
      onSuccess();
    },
    onError: (err) => {
      const msg =
        err instanceof LoginError && err.code === "invalid-credentials"
          ? "Invalid password"
          : "Unexpected error. Please try again.";

      setFieldError(msg);
      toast.error(msg);
    },
  });
