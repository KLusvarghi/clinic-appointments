import { useAction } from "next-safe-action";
import { toast } from "sonner";

import { revokeSessionUnsafe } from "@/actions/revoke-session";

export const revokeSessionAction = useAction(revokeSessionUnsafe, {
  onSuccess: () => {
    toast.success("Session revoked successfully");
  },
  onError: () => {
    toast.error("Failed to revoke session");
  },
});
