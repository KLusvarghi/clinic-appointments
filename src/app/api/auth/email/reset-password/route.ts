// app/api/email/resend-verification/route.ts
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { usersTable, verificationsTable } from "@/db/new_schema";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";

export async function POST(request: Request) {
  const email = request.headers.get("email");

  // z.object({
  //   email: z.string().trim().email({ message: "Invalid email address" }),
  // });

  const hasEmail = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  const user = db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));


  if (!user) {
    return new Response("This e-mail does not exist on our sistem", {
      status: 400,
    });
  }



  const FIFITEN_MINUTES = 1000 * 60 * 15;
  const token = randomUUID(); // gera um novo token
  const expiresAt = new Date(Date.now() + FIFITEN_MINUTES); // 15 minutos

  // // remove tokens antigos se quiser
  // await db
  //   .delete(verificationsTable)
  //   .where(eq(verificationsTable.identifier, session.user.email));

  // // cria novo token
  // await db.insert(verificationsTable).values({
  //   identifier: session.user.email,
  //   value: token,
  //   expiresAt,
  // });

  await sendVerificationEmail({
    user: user,
    token,
  });

  return NextResponse.json({ success: true });
}
