import { authClient } from "@/lib/auth-client";

export function useEmailVerified() {
  const session = authClient.useSession();
  return !!session?.data?.user?.emailVerified;
}
