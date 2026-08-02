import { NextResponse } from "next/server";
import { SESSION_COOKIE, destroySession } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/";
  // Only same-origin paths, so the route can't be used as an open redirect.
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";

  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (token) {
    try {
      await destroySession(token);
    } catch {
      // The cookie is cleared regardless; a missing session row is not an error.
    }
  }

  const response = NextResponse.redirect(new URL(safeReturnTo, url.origin), 303);
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
