"use server";

import { hashPassword, verifyPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { accountsTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const updatePassword = protectedActionClient
  .schema(
    z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6, { message: "Password must have at least 6 characters" }),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const account = await db.query.accountsTable.findFirst({
      where: and(
        eq(accountsTable.userId, ctx.user.id),
        eq(accountsTable.providerId, "credential"),
      ),
    });

    if (account?.password) {
      const isValid = await verifyPassword({ hash: account.password, password: parsedInput.currentPassword });
      if (!isValid) throw new Error("Invalid current password");
      const hashed = await hashPassword(parsedInput.newPassword);
      await db
        .update(accountsTable)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(accountsTable.id, account.id));
    } else {
      const hashed = await hashPassword(parsedInput.newPassword);
      if (account) {
        await db
          .update(accountsTable)
          .set({ password: hashed, updatedAt: new Date() })
          .where(eq(accountsTable.id, account.id));
      } else {
        await db.insert(accountsTable).values({
          userId: ctx.user.id,
          providerId: "credential",
          accountId: ctx.user.id,
          password: hashed,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    revalidatePath("/settings/general");
    return { success: true };
  });
