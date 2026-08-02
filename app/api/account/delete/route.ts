import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import {
  adults,
  assignments,
  contentReviews,
  curriculumDrafts,
  learnerProfiles,
  mediaAssets,
  videoReviews,
} from "../../../../db/schema";
import {
  SESSION_COOKIE,
  destroyAllSessions,
  getSessionAdult,
  verifyAdultCredentials,
} from "../../../../lib/auth";
import { checkRateLimit, clientKey, tooManyRequests } from "../../../../lib/rate-limit";
import { deleteMediaObject } from "../../../../lib/storage";

export const dynamic = "force-dynamic";

/**
 * Permanently delete the grown-up account and every record it owns:
 * learner profiles (progress and assignments cascade), studio drafts,
 * reviews, uploaded audio files and all sessions.
 */
export async function POST(request: Request) {
  const limit = checkRateLimit(`account:${clientKey(request)}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const adult = await getSessionAdult();
  if (!adult) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const password = typeof body.password === "string" ? body.password : "";
  const verified = await verifyAdultCredentials(adult.email, password);
  if (!verified) {
    return NextResponse.json(
      { error: "Enter your current password to confirm deletion." },
      { status: 403 },
    );
  }

  const db = await getDb();

  const ownedMedia = await db
    .select({ objectKey: mediaAssets.objectKey })
    .from(mediaAssets)
    .where(eq(mediaAssets.ownerEmail, adult.email));
  for (const asset of ownedMedia) {
    await deleteMediaObject(asset.objectKey);
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.ownerEmail, adult.email));
  await db.delete(videoReviews).where(eq(videoReviews.ownerEmail, adult.email));
  await db.delete(contentReviews).where(eq(contentReviews.ownerEmail, adult.email));
  await db.delete(curriculumDrafts).where(eq(curriculumDrafts.ownerEmail, adult.email));
  await db.delete(assignments).where(eq(assignments.ownerEmail, adult.email));
  // skill_progress rows cascade with their learner profile.
  await db.delete(learnerProfiles).where(eq(learnerProfiles.ownerEmail, adult.email));
  await destroyAllSessions(adult.id);
  await db.delete(adults).where(eq(adults.id, adult.id));

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
