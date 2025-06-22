"use server"

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { assetsTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

const input = z.object({
  userId: z.string().min(1),
});

export const clientGetAvatarUrlAction = protectedActionClient
.schema(input)
.action(async ({ parsedInput }) => {
  const asset = await db.query.assetsTable.findFirst({
    where: eq(assetsTable.ownerId, parsedInput.userId),
    orderBy: (assets, { desc }) => [desc(assets.uploadedAt)],
  });

  if (!asset?.s3Key) return { url: null };

  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${asset.s3Key}`;

  return { url };
});
