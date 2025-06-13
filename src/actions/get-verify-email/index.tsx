"use server";

import "@/db/schema"; // força a avaliação e registro das relations

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { accountsTable, usersTable } from "@/db/schema";
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
    });

    if (!user) {
      throw new Error("Does not exist any account with this email");
    }

    const account = await db.query.accountsTable.findFirst({
      where: eq(accountsTable.userId, user.id),
    });

    return {
      email: user.email,
      provider: account?.providerId,
    };
  });
