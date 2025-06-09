"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/new_schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const changeClinic = protectedActionClient
  .schema(z.object({ clinicId: z.string().min(1) }))
  .action(async ({ parsedInput, ctx }) => {
    const clinic = await db.query.usersToClinicsTable.findFirst({
      where: and(
        eq(usersToClinicsTable.userId, ctx.user.id),
        eq(usersToClinicsTable.clinicId, parsedInput.clinicId),
      ),
      with: {
        clinic: { with: { subscriptions: true } },
      },
    });

    if (!clinic) {
      throw new Error("Clinic not found");
    }

    const cookieStore = await cookies();
    cookieStore.set("clinic_id", parsedInput.clinicId, { path: "/" });

    return {
      id: clinic.clinic.id,
      name: clinic.clinic.name,
      role: clinic.role,
      plan: clinic.clinic.subscriptions?.[0]?.plan,
    };
  });
