import { rateLimit } from "better-auth/plugins/rate-limit";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: ({ request }: { request: Request }) =>
    request.headers.get("x-forwarded-for") || "unknown",
  skip: () => process.env.NODE_ENV === "development",
});

export const POST = async (req: Request) => {
  await limiter.check(req);

  const { email, password } = await req.json();
  const result = await auth.api.signInEmail({ body: { email, password } });

  if (result.redirect) {
    return NextResponse.redirect(result.url as string);
  } else {
    return NextResponse.json({ error: result }, { status: 401 });
  }
};
