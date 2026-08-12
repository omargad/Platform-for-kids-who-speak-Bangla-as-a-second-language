export const retiredLmsPages = [
  "/account/:path*",
  "/alphabet/:path*",
  "/calendar/:path*",
  "/certificate/:path*",
  "/classroom/:path*",
  "/family/:path*",
  "/grammar/:path*",
  "/grown-ups/:path*",
  "/learn/:path*",
  "/numbers/:path*",
  "/phrasebook/:path*",
  "/practice/:path*",
  "/studio/:path*",
  "/teach/:path*",
  "/worksheets/:path*",
] as const;

export const retiredLmsApiPrefixes = [
  "account",
  "assignments",
  "audio",
  "auth",
  "classes",
  "classroom",
  "profiles",
  "progress",
  "studio",
] as const;

export function normalizeMoodleUrl(value: string | undefined): string {
  const normalized = (value ?? "").trim().replace(/\/+$/, "");
  if (!normalized) return "";

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error("The Moodle URL is invalid.");
  }

  const allowsLocalHttp = parsed.protocol === "http:"
    && ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !allowsLocalHttp) {
    throw new Error("The Moodle URL must use HTTPS (HTTP is allowed only for localhost development).");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("The Moodle URL must not contain credentials, a query string or a fragment.");
  }
  return normalized;
}
