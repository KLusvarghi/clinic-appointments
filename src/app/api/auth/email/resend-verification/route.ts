import { addMinutes } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { usersTable, verificationsTable } from "@/db/schema";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";

const schema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response(result.error.message, { status: 400 });
  }

  const email = result.data.email;

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) {
    return new Response("This e-mail does not exist on our system", {
      status: 400,
    });
  }

  const token = nanoid(32);
  const expiresAt = addMinutes(new Date(), 15);

  await db.delete(verificationsTable).where(eq(verificationsTable.identifier, email));

  await db.insert(verificationsTable).values({
    identifier: user.email,
    value: token,
    expiresAt,
  });

  await sendVerificationEmail({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });

  return NextResponse.json({ success: true });
}
