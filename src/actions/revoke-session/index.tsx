"use server";

import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { protectedWithRoleActionClient } from "@/lib/next-safe-action";

const schema = z.object({
  sessionToken: z.string(),
});

export const revokeSession = protectedWithRoleActionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    try {
      await authClient.revokeSession({
        token: parsedInput.sessionToken,
      });

      return { success: true };
    } catch (error) {
      console.error("Erro ao revogar sessão:", error);
      throw new Error("Falha ao revogar sessão");
    }
  });
