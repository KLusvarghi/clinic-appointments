import { verifyEmail } from "@/actions/get-verify-email";
import { authClient } from "@/lib/auth-client";

import { RegisterSchema } from "../_types/schema";

export class RegisterError extends Error {
  constructor(public code: "email-exists" | "create-failed") {
    super(code);
  }
}

export const registerUser = async (values: RegisterSchema) => {
  const check = await verifyEmail({ email: values.email });
  if (check?.data) throw new RegisterError("email-exists");

  const res = await authClient.signUp.email(values);
  if (!res?.data) throw new RegisterError("create-failed");

  return res.data.user;
};
