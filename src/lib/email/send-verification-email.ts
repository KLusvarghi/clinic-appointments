// import { Resend } from "resend";

// import { generateVerificationUrl } from "./generate-verification-url";
// import { verificationEmailTemplate } from "./templates/verification-template";

// if (!process.env.RESEND_API_KEY)
//   throw new Error("RESEND_API_KEY not configured");

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail({
//   user,
//   token,
// }: {
//   user: { email: string; name?: string };
//   token: string;
// }) {
//   if (!process.env.RESEND_API_KEY) {
//     throw new Error("RESEND_API_KEY not configured");
//   }
//   if (!process.env.RESEND_FROM_EMAIL) {
//     throw new Error("RESEND_FROM_EMAIL not configured");
//   }

//   const url = generateVerificationUrl(token);

//   console.log("url geradaaaaa", url);

//   await resend.emails.send({
//     from: process.env.RESEND_FROM_EMAIL,
//     to: user.email,
//     subject: "Verifique seu e-mail",
//     react: verificationEmailTemplate({
//       verificationUrl: url,
//       userName: user.name ?? user.email ?? "Cliente",
//     }),
//   });
// }
