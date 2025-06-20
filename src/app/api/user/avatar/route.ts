import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { assetsTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicUrl, s3 } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const user = await db.query.usersTable.findFirst({
    columns: { avatarId: true },
    where: eq(usersTable.id, session.user.id),
  });

  if (!user?.avatarId) {
    return NextResponse.json({ url: null });
  }

  const asset = await db.query.assetsTable.findFirst({
    where: eq(assetsTable.id, user.avatarId),
  });

  if (!asset) {
    return NextResponse.json({ url: null });
  }

  return NextResponse.json({ url: publicUrl(asset.s3Key) });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return new NextResponse(null, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return new NextResponse("File not provided", { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return new NextResponse("File too large", { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return new NextResponse("Invalid file type", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const key = `uploads/${nanoid()}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    }),
  );

  const assetId = nanoid();
  await db.insert(assetsTable).values({
    id: assetId,
    ownerType: "user",
    ownerId: session.user.id,
    type: "user_avatar",
    s3Key: key,
    mime: file.type,
    size: String(file.size),
    uploadedAt: new Date(),
  });

  await db
    .update(usersTable)
    .set({ avatarId: assetId, updatedAt: new Date() })
    .where(eq(usersTable.id, session.user.id));

  return NextResponse.json({ id: assetId, url: publicUrl(key) });
}