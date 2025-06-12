"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/new_schema";
import { actionClient } from "@/lib/next-safe-action";

export const verifyEmail = actionClient
  .schema(
    z.object({
      email: z.string().trim().email({ message: "Invalid email address" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const hasEmail = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email),
    });

    if (!hasEmail) {
      throw new Error("Does not exist any account with this email");
    }

    return true;
  });
