import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createAdultSession,
  registerAdult,
  sessionCookieOptions,
} from "../../../../lib/auth";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 60) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!displayName) {
    return NextResponse.json({ error: "Enter the name learners should see." }, { status: 400 });
  }
  if (password.length < 10 || password.length > 200) {
    return NextResponse.json(
      { error: "Choose a password of at least 10 characters." },
      { status: 400 },
    );
  }

  const result = await registerAdult(email, displayName, password);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 409 });

  const { token, expiresAt } = await createAdultSession(result.id);
  const response = NextResponse.json({ adult: result }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
