import { NextResponse } from "next/server";
import { z } from "zod";

import { handleEmailWithTokenWorkflow } from "@/services/email-service";

const schema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response(result.error.message, { status: 400 });
  }

  try {
    await handleEmailWithTokenWorkflow({
      email: result.data.email,
      type: "password-reset",
      subject: "Resetar senha",
    });

    return NextResponse.json({ success: true });
  } catch (error: Error) {
    return new Response(error.message, { status: 400 });
  }
}
