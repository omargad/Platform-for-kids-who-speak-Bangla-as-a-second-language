import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { contentReviews, curriculumDrafts, mediaAssets, videoReviews } from "../../../../db/schema";
import { lessons } from "../../../curriculum";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const reviewTypes = new Set(["language", "culture", "child-development", "accessibility", "video", "legal-privacy"]);
const statuses = new Set(["not-started", "in-review", "changes-requested", "approved"]);

export async function GET() {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  try {
    const db = await getDb();
    const [reviews, media, videos, drafts] = await Promise.all([
      db.select().from(contentReviews).where(eq(contentReviews.ownerEmail, user.email)).orderBy(desc(contentReviews.updatedAt)),
      db.select().from(mediaAssets).where(eq(mediaAssets.ownerEmail, user.email)).orderBy(desc(mediaAssets.createdAt)),
      db.select().from(videoReviews).where(eq(videoReviews.ownerEmail, user.email)).orderBy(desc(videoReviews.updatedAt)),
      db.select().from(curriculumDrafts).where(eq(curriculumDrafts.ownerEmail, user.email)).orderBy(desc(curriculumDrafts.updatedAt)),
    ]);
    return Response.json({ reviews, media, videos, drafts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Content review data is unavailable.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const lessonId = value(body.lessonId, 60);
  const reviewType = value(body.reviewType, 30);
  const status = value(body.status, 30);
  const reviewerName = value(body.reviewerName, 80);
  const reviewerEmail = value(body.reviewerEmail, 120);
  const notes = value(body.notes, 1500);
  if (!lessonIds.has(lessonId) || !reviewTypes.has(reviewType) || !statuses.has(status)) return Response.json({ error: "Invalid review record." }, { status: 400 });
  if (status === "approved" && !reviewerName) return Response.json({ error: "Name the reviewer before approving content." }, { status: 400 });

  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.select({ id: contentReviews.id }).from(contentReviews).where(and(eq(contentReviews.ownerEmail, user.email), eq(contentReviews.lessonId, lessonId), eq(contentReviews.reviewType, reviewType))).limit(1);
  const values = { reviewerName, reviewerEmail, status, notes, reviewedAt: status === "approved" ? now : null, updatedAt: now };
  const [review] = existing.length
    ? await db.update(contentReviews).set(values).where(eq(contentReviews.id, existing[0].id)).returning()
    : await db.insert(contentReviews).values({ id: crypto.randomUUID(), ownerEmail: user.email, lessonId, reviewType, ...values }).returning();
  return Response.json({ review }, { status: existing.length ? 200 : 201 });
}

function value(input: unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}
