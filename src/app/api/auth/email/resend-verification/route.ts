// app/api/email/resend-verification/route.ts
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { verificationsTable } from "@/db/new_schema";
import { auth } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const FIFITEN_MINUTES = 1000 * 60 * 15;
  const token = randomUUID(); // gera um novo token
  const expiresAt = new Date(Date.now() + FIFITEN_MINUTES); // 15 minutos

  // remove tokens antigos se quiser
  await db
    .delete(verificationsTable)
    .where(eq(verificationsTable.identifier, session.user.email));

  // cria novo token
  await db.insert(verificationsTable).values({
    identifier: session.user.email,
    value: token,
    expiresAt,
  });

  await sendVerificationEmail({
    user: session.user,
    token,
  });

  return NextResponse.json({ success: true });
}
