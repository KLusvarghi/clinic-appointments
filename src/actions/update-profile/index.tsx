"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const updateProfile = protectedActionClient
  .schema(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(usersTable)
      .set({ name: parsedInput.name, updatedAt: new Date() })
      .where(eq(usersTable.id, ctx.user.id));

    revalidatePath("/settings");

    return { success: true };
  });