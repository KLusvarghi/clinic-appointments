import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { usersTable,verificationsTable } from "@/db/schema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }
  
  const now = new Date();
  const [record] = await db
    .select()
    .from(verificationsTable)
    .where(and(eq(verificationsTable.value, token), gt(verificationsTable.expiresAt, now)));

  if (!record) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
  }

  await db
    .update(usersTable)
    .set({ emailVerified: true })
    .where(eq(usersTable.email, record.identifier));

  await db.delete(verificationsTable).where(eq(verificationsTable.id, record.id));

  return NextResponse.redirect("/email-verificado");
}
