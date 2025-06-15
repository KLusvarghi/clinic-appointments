import { addMinutes } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { usersTable, verificationsTable } from "@/db/schema";
import { sendEmail } from "@/lib/email/send";

type WorkflowType = "email-verification" | "password-reset";

interface WorkflowOptions {
  email: string;
  type: WorkflowType;
  subject: string;
}

export async function handleEmailWithTokenWorkflow({
  email,
  type,
  subject,
}: WorkflowOptions) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) {
    throw new Error("E-mail não encontrado no sistema");
  }

  const token = nanoid(32);
  const expiresAt = addMinutes(new Date(), 15);

  await db
    .delete(verificationsTable)
    .where(eq(verificationsTable.identifier, email));

  await db.insert(verificationsTable).values({
    identifier: user.email,
    value: token,
    expiresAt,
  });

  await sendEmail({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
    options: {
      type,
      subject,
    },
  });
}
