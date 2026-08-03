/**
 * Reduce a caller-supplied `returnTo` value to a safe same-origin path.
 *
 * A naive `startsWith("/") && !startsWith("//")` check is not enough: the
 * WHATWG URL parser normalizes backslashes to forward slashes for http(s),
 * so `/\evil.com` passes that check yet resolves to `https://evil.com/`.
 * We reject backslashes and control characters, then resolve against a fixed
 * dummy origin and keep the value only when it stays on that origin,
 * returning just path + query + hash.
 */
const DUMMY_ORIGIN = "https://bangla-adventures.internal";

// Control characters (incl. tab/newline, which the URL parser strips before
// parsing) that could smuggle an off-origin destination past a prefix check.
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;

export function safeReturnPath(value: string | null | undefined, fallback = "/"): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (value.includes("\\")) return fallback;
  if (CONTROL_CHARS.test(value)) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const url = new URL(value, DUMMY_ORIGIN);
    if (url.origin !== DUMMY_ORIGIN) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
