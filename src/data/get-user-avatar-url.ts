import { eq } from "drizzle-orm";

import { db } from "@/db";
import { assetsTable, usersTable } from "@/db/schema";
import { publicUrl } from "@/lib/s3";

export async function getUserAvatar(userId: string) {
  const user = await db.query.usersTable.findFirst({
    columns: { avatarId: true },
    where: eq(usersTable.id, userId),
  });

  if (!user?.avatarId) return null;

  const asset = await db.query.assetsTable.findFirst({
    where: eq(assetsTable.id, user.avatarId),
  });

  if (!asset) return null;

  return publicUrl(asset.s3Key);
}
