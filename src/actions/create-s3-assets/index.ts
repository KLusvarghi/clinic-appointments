"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  assetsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
  usersTable,
} from "@/db/schema";
import { protectedWithClinicActionClient } from "@/lib/next-safe-action";
import { presignGet, s3 } from "@/lib/s3";

import { createS3AssetSchema } from "./schema";

export const createS3Assets = protectedWithClinicActionClient
  .schema(createS3AssetSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput.file.type.startsWith("image/")) {
      throw new Error("Invalid image type");
    }
    if (parsedInput.file.size > 2 * 1024 * 1024) {
      throw new Error("Max size is 2MB");
    }

    const key = `uploads/${nanoid()}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: Buffer.from(await parsedInput.file.arrayBuffer()),
        ContentType: parsedInput.file.type,
      }),
    );

    const existing = await db.query.assetsTable.findFirst({
      where: (a, { eq, and }) =>
        and(
          eq(a.ownerType, parsedInput.ownerType),
          eq(a.ownerId, parsedInput.ownerId),
          eq(a.type, parsedInput.type),
        ),
    });

    const assetId = existing?.id ?? nanoid();

    if (existing) {
      await db
        .update(assetsTable)
        .set({
          s3Key: key,
          mime: parsedInput.file.type,
          size: String(parsedInput.file.size),
          uploadedAt: new Date(),
        })
        .where(eq(assetsTable.id, assetId));
    } else {
      await db.insert(assetsTable).values({
        id: assetId,
        ownerType: parsedInput.ownerType,
        ownerId: parsedInput.ownerId,
        type: parsedInput.type,
        s3Key: key,
        mime: parsedInput.file.type,
        size: String(parsedInput.file.size),
        uploadedAt: new Date(),
      });
    }

    // Atualiza referência na entidade correta
    const updateMap = {
      user: () =>
        db
          .update(usersTable)
          .set({ avatarId: assetId })
          .where(eq(usersTable.id, parsedInput.ownerId)),
      doctor: () =>
        db
          .update(doctorsTable)
          .set({ avatarId: assetId })
          .where(eq(doctorsTable.id, parsedInput.ownerId)),
      patient: () =>
        db
          .update(patientsTable)
          .set({ avatarId: assetId })
          .where(eq(patientsTable.id, parsedInput.ownerId)),
      clinic: () =>
        db
          .update(clinicsTable)
          .set({ avatarId: assetId })
          .where(eq(clinicsTable.id, parsedInput.ownerId)),
    };

    await updateMap[parsedInput.ownerType as keyof typeof updateMap]();

    const signedUrl = await presignGet(key);
    revalidatePath("/"); // opcional
    return { url: signedUrl };
  });
