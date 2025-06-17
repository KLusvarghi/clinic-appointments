"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const updatePreferences = protectedActionClient
  .schema(
    z.object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      language: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, ctx.user.id),
    });

    const prefs = user?.preferences ?? {};
    await db
      .update(usersTable)
      .set({
        preferences: {
          ...prefs,
          theme: parsedInput.theme ?? prefs.theme ?? null,
          language: parsedInput.language ?? prefs.language ?? null,
        },
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, ctx.user.id));

    revalidatePath("/settings/general");
    return { success: true };
  });
