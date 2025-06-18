"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { protectedWithRoleActionClient } from "@/lib/next-safe-action";


const schema = z.object({
  membershipId: z.string(),
  role: z.enum(["ADMIN", "MANAGER", "ASSISTANT"]),
});

export const updateUserRole = protectedWithRoleActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await db.query.usersToClinicsTable.findFirst({
      where: and(
        eq(usersToClinicsTable.id, parsedInput.membershipId),
        eq(usersToClinicsTable.clinicId, ctx.clinic.id),
      ),
    });

    if (!membership) {
      throw new Error("Member not found");
    }

    await db
      .update(usersToClinicsTable)
      .set({ role: parsedInput.role, updatedAt: new Date() })
      .where(eq(usersToClinicsTable.id, parsedInput.membershipId));

    return { success: true };
  });
