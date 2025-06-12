import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  // console.log("SESSION HEADERS:", await headers());
  console.log("SESSION RES:", session);
  return NextResponse.json(session);
}
