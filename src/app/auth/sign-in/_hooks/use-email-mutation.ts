import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { EmailCheckError } from "@/services/check-email-credential";

import { checkEmailCredential } from "../_helpers/check-email-credential";
import { EmailSchema } from "../_types/schema";

export const useEmailMutation = (
  onSuccess: () => void,
  setFieldError: (msg: string) => void,
) =>
  useMutation<void, EmailCheckError, EmailSchema>({
    mutationFn: ({ email }) => checkEmailCredential(email),
    onSuccess,
    onError: (err) => {
      const msg =
        err.code === "wrong-provider"
          ? `This email was created with ${err.provider}.`
          : "Email not found. Please sign up first.";
      setFieldError(msg);
      toast.error(msg);
    },
  });
