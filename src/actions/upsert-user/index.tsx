"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable, usersToClinicsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

import { upsertUserSchema } from "./schema";

export const upsertUser = protectedWithClinicActionClient
  .schema(upsertUserSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [user] = await db
      .insert(usersTable)
      .values({
        // id: parsedInput.id,
        name: parsedInput.name,
        email: parsedInput.email,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [usersTable.email],
        set: { name: parsedInput.name, updatedAt: new Date() },
      })
      .returning();

    const membership = await db.query.usersToClinicsTable.findFirst({
      where: and(
        eq(usersToClinicsTable.userId, user.id),
        eq(usersToClinicsTable.clinicId, ctx.clinic.id),
      ),
    });

    if (membership) {
      await db
        .update(usersToClinicsTable)
        .set({ role: parsedInput.role, updatedAt: new Date() })
        .where(eq(usersToClinicsTable.id, membership.id));
    } else {
      await db.insert(usersToClinicsTable).values({
        userId: user.id,
        clinicId: ctx.clinic.id,
        role: parsedInput.role,
        isActive: true,
      });
    }

    revalidatePath("/members");

    return { success: true };
  });
