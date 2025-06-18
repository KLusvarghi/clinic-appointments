import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetPassword } from "../_services/reset-password";
import { ResetPasswordFormData } from "../_types/schema";

export function useResetPasswordMutation(
  onSuccess: () => void,
  onError: (message: string) => void,
) {
  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successfully");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      onError(error.message);
    },
  });
} 