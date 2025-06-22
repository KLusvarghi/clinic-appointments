import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import {
  assetsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
  usersTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { presignGet, s3 } from "@/lib/s3";

import { assetType, OwnerType } from "../../../types/assets-avatar";

const schema = z.object({
  id: z.string().uuid(),
  entity: z.enum(["user", "clinic", "doctor", "patient"]),
});

// export async function GET(req: NextRequest) {
//   const session = await auth.api.getSession({ headers: req.headers });

//   if (!session?.user) {
//     return new NextResponse(null, { status: 401 });
//   }

//   const validated = schema.safeParse(
//     Object.fromEntries(searchParams.entries()),
//   );

//   if (!validated.success)
//     return new Response("Invalid params", { status: 400 });

//   const user = await db.query.usersTable.findFirst({
//     columns: { avatarId: true },
//     where: eq(usersTable.id, session.user.id),
//   });

//   if (!user?.avatarId) {
//     return NextResponse.json({ url: null });
//   }

//   const asset = await db.query.assetsTable.findFirst({
//     where: eq(assetsTable.id, user.avatarId),
//   });

//   if (!asset) {
//     return NextResponse.json({ url: null });
//   }

//   const signedUrl = await presignGet(asset.s3Key);
//   return NextResponse.json({ url: signedUrl });
// }

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return new NextResponse(null, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const ownerType = formData.get("ownerType") as OwnerType;
  const ownerId = formData.get("ownerId");
  const type = formData.get("type") as assetType;

  if (!file || !(file instanceof File))
    return new NextResponse("File missing", { status: 400 });
  if (file.size > 2 * 1024 * 1024)
    return new NextResponse("Max size: 2MB", { status: 400 });
  if (!file.type.startsWith("image/"))
    return new NextResponse("Invalid type", { status: 400 });

  const key = `uploads/${nanoid()}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );

  const existing = await db.query.assetsTable.findFirst({
    where: (a, { eq, and }) =>
      and(eq(a.ownerType, ownerType), eq(a.ownerId, ownerId), eq(a.type, type)),
  });

  const assetId = existing?.id ?? nanoid();

  if (existing) {
    await db
      .update(assetsTable)
      .set({
        s3Key: key,
        mime: file.type,
        size: String(file.size),
        uploadedAt: new Date(),
      })
      .where(eq(assetsTable.id, assetId));
  } else {
    await db.insert(assetsTable).values({
      id: assetId,
      ownerType: ownerType as OwnerType,
      ownerId: ownerId as string,
      type: type as assetType,
      s3Key: key,
      mime: file.type,
      size: String(file.size),
      uploadedAt: new Date(),
    });
  }

  switch (ownerType) {
    case "user":
      await db
        .update(usersTable)
        .set({ avatarId: assetId, updatedAt: new Date() })
        .where(eq(usersTable.id, ownerId as string));
      break;
    case "doctor":
      await db
        .update(doctorsTable)
        .set({ avatarId: assetId, updatedAt: new Date() })
        .where(eq(doctorsTable.id, ownerId as string));
      break;
    case "patient":
      await db
        .update(patientsTable)
        .set({ avatarId: assetId, updatedAt: new Date() })
        .where(eq(patientsTable.id, ownerId as string));
      break;
    case "clinic":
      await db
        .update(clinicsTable)
        .set({ avatarId: assetId, updatedAt: new Date() })
        .where(eq(clinicsTable.id, ownerId as string));
      break;

    default:
      break;
  }

  const signedUrl = await presignGet(key);
  return NextResponse.json({ url: signedUrl });
}
