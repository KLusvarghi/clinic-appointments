import { nanoid } from "nanoid";

import { db } from "@/db";
import { assetsTable } from "@/db/schema";
import { assetType, OwnerType } from "@/types/assets-avatar";
// import { putObjectInS3 } from "@/lib/s3"; // sua função de upload

export async function createAssetFromUrl({
  imageUrl,
  ownerId,
  ownerType,
  type,
}: {
  imageUrl: string;
  ownerId: string;
  ownerType: OwnerType;
  type: assetType;
}) {
  const res = await fetch(imageUrl);
  const buffer = await res.arrayBuffer();

  const s3Key = `uploads/${nanoid()}.jpg`;
  // await putObjectInS3(s3Key, Buffer.from(buffer), "image/jpeg");

  const assetId = nanoid();
  await db.insert(assetsTable).values({
    id: assetId,
    ownerType,
    ownerId,
    type,
    s3Key,
    mime: "image/jpeg",
    size: `${buffer.byteLength}`,
    uploadedAt: new Date(),
  });

  return { id: assetId };
}
