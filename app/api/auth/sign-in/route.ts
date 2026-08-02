import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createAdultSession,
  sessionCookieOptions,
  verifyAdultCredentials,
} from "../../../../lib/auth";
import { checkRateLimit, clientKey, tooManyRequests } from "../../../../lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`sign-in:${clientKey(request)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const adult = await verifyAdultCredentials(email, password);
  if (!adult) {
    return NextResponse.json({ error: "That email and password do not match." }, { status: 401 });
  }

  const { token, expiresAt } = await createAdultSession(adult.id);
  const response = NextResponse.json({ adult });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
