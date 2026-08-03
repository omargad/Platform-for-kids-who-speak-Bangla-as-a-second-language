import { NextResponse } from "next/server";
import { SESSION_COOKIE, destroyAllSessions, getSessionAdult } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

/** Sign out of every device, including this one. */
export async function DELETE() {
  const adult = await getSessionAdult();
  if (!adult) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  await destroyAllSessions(adult.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
