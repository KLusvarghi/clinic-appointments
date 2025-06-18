import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { sendEmailRequest } from "@/client-actions/send-email";

import { persistPreferences } from "../../_helpers/save-preferences";
import { RegisterError, registerUser } from "../_helpers/register-user";

export const useRegisterMutation = (
  onSuccess: () => void,
  setFieldError: (msg: string) => void,
) =>
  useMutation({
    mutationFn: registerUser,
    onSuccess: async (user, vars) => {
      await sendEmailRequest(vars.email, "verify");
      persistPreferences(user?.preferences ?? null);
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof RegisterError && err.code === "email-exists"
          ? "E-mail already registered"
          : "Failed to create account. Try again.";
      setFieldError(msg);
      toast.error(msg);
    },
  });
