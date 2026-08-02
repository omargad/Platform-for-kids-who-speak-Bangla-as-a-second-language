import { and, eq, gt, lt, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../db";
import { adults, adultSessions, recoveryCodes } from "../db/schema";
import {
  createSessionToken,
  generateRecoveryCode,
  hashPassword,
  hashSessionToken,
  normalizeRecoveryCode,
  verifyPassword,
} from "./password";

export type Adult = {
  id: string;
  email: string;
  displayName: string;
};

export const SESSION_COOKIE = "ba_adult_session";
const SESSION_DAYS = 30;
const SIGN_IN_PATH = "/grown-ups";

export async function getSessionAdult(): Promise<Adult | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const db = await getDb();
    const now = new Date().toISOString();
    const [row] = await db
      .select({ id: adults.id, email: adults.email, displayName: adults.displayName })
      .from(adultSessions)
      .innerJoin(adults, eq(adultSessions.adultId, adults.id))
      .where(and(eq(adultSessions.tokenHash, hashSessionToken(token)), gt(adultSessions.expiresAt, now)))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function requireAdult(returnTo: string): Promise<Adult> {
  const adult = await getSessionAdult();
  if (!adult) {
    redirect(`${SIGN_IN_PATH}?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return adult;
}

export function signOutPath(returnTo: string): string {
  return `/api/auth/sign-out?returnTo=${encodeURIComponent(returnTo)}`;
}

export async function registerAdult(
  email: string,
  displayName: string,
  password: string,
): Promise<Adult | { error: string }> {
  const db = await getDb();
  const normalized = email.trim().toLowerCase();
  const [existing] = await db
    .select({ id: adults.id })
    .from(adults)
    .where(eq(adults.email, normalized))
    .limit(1);
  if (existing) return { error: "An account with this email already exists. Sign in instead." };

  const [adult] = await db
    .insert(adults)
    .values({
      id: crypto.randomUUID(),
      email: normalized,
      displayName: displayName.trim().slice(0, 60),
      passwordHash: hashPassword(password),
    })
    .returning({ id: adults.id, email: adults.email, displayName: adults.displayName });
  return adult;
}

export async function verifyAdultCredentials(email: string, password: string): Promise<Adult | null> {
  const db = await getDb();
  const normalized = email.trim().toLowerCase();
  const [row] = await db.select().from(adults).where(eq(adults.email, normalized)).limit(1);
  if (!row || !verifyPassword(password, row.passwordHash)) return null;
  return { id: row.id, email: row.email, displayName: row.displayName };
}

export async function createAdultSession(adultId: string): Promise<{ token: string; expiresAt: Date }> {
  const db = await getDb();
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(adultSessions).values({
    tokenHash: hashSessionToken(token),
    adultId,
    expiresAt: expiresAt.toISOString(),
  });
  // Opportunistic cleanup of expired sessions.
  await db.delete(adultSessions).where(lt(adultSessions.expiresAt, new Date().toISOString()));
  return { token, expiresAt };
}

export async function destroySession(token: string): Promise<void> {
  const db = await getDb();
  await db.delete(adultSessions).where(eq(adultSessions.tokenHash, hashSessionToken(token)));
}

export async function destroyAllSessions(adultId: string): Promise<void> {
  const db = await getDb();
  await db.delete(adultSessions).where(eq(adultSessions.adultId, adultId));
}

/** Delete every session except the one identified by keepToken (used after a password change). */
export async function destroyOtherSessions(adultId: string, keepToken: string): Promise<void> {
  const db = await getDb();
  await db
    .delete(adultSessions)
    .where(
      and(eq(adultSessions.adultId, adultId), ne(adultSessions.tokenHash, hashSessionToken(keepToken))),
    );
}

export async function updateAdultPassword(adultId: string, newPassword: string): Promise<void> {
  const db = await getDb();
  await db.update(adults).set({ passwordHash: hashPassword(newPassword) }).where(eq(adults.id, adultId));
}

const RECOVERY_CODE_COUNT = 8;

/** Replace any existing recovery codes with a fresh set; the plaintext is returned exactly once. */
export async function issueRecoveryCodes(adultId: string): Promise<string[]> {
  const db = await getDb();
  const codes = Array.from({ length: RECOVERY_CODE_COUNT }, () => generateRecoveryCode());
  await db.delete(recoveryCodes).where(eq(recoveryCodes.adultId, adultId));
  await db.insert(recoveryCodes).values(
    codes.map((code) => ({
      id: crypto.randomUUID(),
      adultId,
      codeHash: hashSessionToken(normalizeRecoveryCode(code)),
    })),
  );
  return codes;
}

/** Verify an unused recovery code for this email and consume it. Returns the adult on success. */
export async function consumeRecoveryCode(email: string, code: string): Promise<Adult | null> {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const [adult] = await db.select().from(adults).where(eq(adults.email, normalizedEmail)).limit(1);
  if (!adult) return null;

  const codeHash = hashSessionToken(normalizeRecoveryCode(code));
  const [row] = await db
    .select({ id: recoveryCodes.id, usedAt: recoveryCodes.usedAt })
    .from(recoveryCodes)
    .where(and(eq(recoveryCodes.adultId, adult.id), eq(recoveryCodes.codeHash, codeHash)))
    .limit(1);
  if (!row || row.usedAt) return null;

  await db
    .update(recoveryCodes)
    .set({ usedAt: new Date().toISOString() })
    .where(eq(recoveryCodes.id, row.id));
  return { id: adult.id, email: adult.email, displayName: adult.displayName };
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}
