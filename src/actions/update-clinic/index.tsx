"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { clinicsTable } from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";

export const updateClinic = protectedWithClinicActionClient
  .schema(z.object({ name: z.string().min(1, { message: "Clinic name is required" }) }))
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(clinicsTable)
      .set({ name: parsedInput.name, updatedAt: new Date() })
      .where(eq(clinicsTable.id, ctx.clinic.id));

    revalidatePath("/settings/general");
    return { success: true };
  });
