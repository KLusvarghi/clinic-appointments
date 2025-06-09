import { authClient } from "@/lib/auth-client";

export function signUp(
  values: { name: string; email: string; password: string },
  options?: Parameters<typeof authClient.signUp.email>[1],
) {
  return authClient.signUp.email(
    {
      email: values.email,
      password: values.password,
      name: values.name,
    },
    options,
  );
}

export function signIn(
  values: { email: string; password: string },
  options?: Parameters<typeof authClient.signIn.email>[1],
) {
  return authClient.signIn.email(
    {
      email: values.email,
      password: values.password,
    },
    options,
  );
}