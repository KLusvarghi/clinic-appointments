import { authClient } from "@/lib/auth-client";

import { LoginSchema } from "../_types/schema";

export type LoginErrorCode = "invalid-credentials" | "server-error";

export class LoginError extends Error {
  constructor(public code: LoginErrorCode) {
    super(code);
  }
}

export const loginUser = async (values: LoginSchema) => {
  const { data } = await authClient.signIn.email(values);

  if (!data?.user) {
    throw new LoginError("invalid-credentials");
  }

  return data.user;
};
