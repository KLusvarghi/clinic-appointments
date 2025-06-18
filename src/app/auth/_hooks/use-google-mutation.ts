import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

export const useGoogleMutation = () => 
  useMutation({
    mutationFn: async () => {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        scopes: ["email", "profile"],
      });
      if (!res?.data?.redirect) throw new Error("Authentication failed");
      return res;
    },
  });
