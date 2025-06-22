"use server";

import { db } from "@/db";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { presignGet } from "@/lib/s3";

import { getAvatarUrlActionSchema } from "./schema";

export const getAvatarUrlAction = protectedWithClinicActionClient
  .schema(getAvatarUrlActionSchema)
  .action(async ({ parsedInput }) => {
    const asset = await db.query.assetsTable.findFirst({
      where: (a, { eq, and }) =>
        and(
          eq(a.ownerId, parsedInput.ownerId),
          eq(a.ownerType, parsedInput.ownerType),
        ),
    });

    if (!asset) return { url: null };

    const signedUrl = await presignGet(asset.s3Key);
    return { url: signedUrl };
  });
