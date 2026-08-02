import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing and session-token helpers with no framework dependencies,
 * so they can be unit-tested directly under `node --test`.
 */

const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS).toString("hex");
  return `scrypt:${SCRYPT_OPTIONS.N}:${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;
  const cost = Number(parts[1]);
  if (!Number.isInteger(cost) || cost < 2) return false;
  const [, , salt, expectedHex] = parts;
  const expected = Buffer.from(expectedHex, "hex");
  const derived = scryptSync(password, salt, expected.length, { ...SCRYPT_OPTIONS, N: cost });
  return expected.length > 0 && timingSafeEqual(derived, expected);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

// No I, L, O, 0 or 1 — codes get read out loud and typed by hand.
const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRecoveryCode(): string {
  const bytes = randomBytes(10);
  let code = "";
  for (let i = 0; i < 10; i += 1) {
    if (i === 5) code += "-";
    code += RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length];
  }
  return code;
}

/** Uppercase and strip separators so hand-typed codes match regardless of format. */
export function normalizeRecoveryCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z2-9]/g, "");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
