import type { User } from "better-auth";
import { Resend } from "resend";

import { generateVerificationUrl } from "./generate-verification-url";
import { verificationEmailTemplate } from "./templates/verification-template";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function sendVerificationEmail({
  user,
  token,
}: {
  user: User;
  token: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL not configured");
  }

  const url = generateVerificationUrl(token);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: user.email,
    subject: "Verifique seu e-mail",
    react: verificationEmailTemplate({
      verificationUrl: url,
      userName: user.name ?? user.email,
    }),
  });
}
