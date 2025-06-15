import { Resend } from "resend";

import { generateVerificationUrl } from "./_helpers/generate-verification-url";
import { PasswordResetTemplate } from "./templates/password-reset-template";
import { VerificationEmailTemplate } from "./templates/verification-template";

type EmailType = "email-verification" | "password-reset";

interface EmailSendOptions {
  user: { email: string; name?: string };
  token: string;
  options: {
    type: EmailType;
    subject: string;
  };
}

export async function sendEmail({ user, token, options }: EmailSendOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured");
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL not configured");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const userName = user.name ?? user.email ?? "Usuário";
  const reactTemplate =
    options.type === "email-verification"
      ? VerificationEmailTemplate({
          verificationUrl: generateVerificationUrl(token, "verify"),
          userName,
        })
      : PasswordResetTemplate({
          resetUrl: generateVerificationUrl(token, "reset-password"),
          userName,
        });

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: user.email,
    subject: options.subject,
    html: "<p>it works!</p>",
    // react: reactTemplate,
  });
}
