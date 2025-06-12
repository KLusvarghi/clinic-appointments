"use server";

import "@/db/schema/schema"; // força a avaliação e registro das relations

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema/schema";
import { actionClient } from "@/lib/next-safe-action";

export const verifyEmail = actionClient
  .schema(
    z.object({
      email: z.string().trim().email({ message: "Invalid email address" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email),
      with: {
        accounts: true,
      },
    });

    if (!user) {
      throw new Error("Does not exist any account with this email");
    }

    return {
      email: user.email,
      provider: user.accounts.map((account) => account.providerId),
    };
  });
