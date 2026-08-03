import { NextResponse } from "next/server";
import { getSessionAdult, issueRecoveryCodes, verifyAdultCredentials } from "../../../../lib/auth";
import { checkRateLimit, clientKey, tooManyRequests } from "../../../../lib/rate-limit";

export const dynamic = "force-dynamic";

/** Replace all recovery codes with a fresh set. Requires the current password. */
export async function POST(request: Request) {
  const limit = checkRateLimit(`account:${clientKey(request)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const adult = await getSessionAdult();
  if (!adult) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const password = typeof body.password === "string" ? body.password : "";
  const verified = await verifyAdultCredentials(adult.email, password);
  if (!verified) {
    return NextResponse.json({ error: "Your current password is incorrect." }, { status: 403 });
  }

  const recoveryCodes = await issueRecoveryCodes(adult.id);
  return NextResponse.json({ recoveryCodes });
}
