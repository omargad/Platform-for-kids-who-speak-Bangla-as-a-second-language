import { NextResponse } from "next/server";
import {
  destroyOtherSessions,
  getSessionAdult,
  getSessionToken,
  updateAdultPassword,
  verifyAdultCredentials,
} from "../../../../lib/auth";
import { checkRateLimit, clientKey, tooManyRequests } from "../../../../lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`account:${clientKey(request)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const adult = await getSessionAdult();
  if (!adult) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  if (newPassword.length < 10 || newPassword.length > 200) {
    return NextResponse.json(
      { error: "Choose a new password of at least 10 characters." },
      { status: 400 },
    );
  }
  const verified = await verifyAdultCredentials(adult.email, currentPassword);
  if (!verified) {
    return NextResponse.json({ error: "Your current password is incorrect." }, { status: 403 });
  }

  await updateAdultPassword(adult.id, newPassword);
  // Keep this session signed in; end every other one.
  const token = await getSessionToken();
  if (token) await destroyOtherSessions(adult.id, token);
  return NextResponse.json({ ok: true });
}
