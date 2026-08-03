import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { videoReviews } from "../../../../db/schema";
import { lessons } from "../../../curriculum";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const lessonId = value(body.lessonId, 60);
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return Response.json({ error: "Unknown lesson." }, { status: 400 });
  const status = value(body.status, 30);
  const captionsStatus = value(body.captionsStatus, 30);
  const suitabilityStatus = value(body.suitabilityStatus, 30);
  const replacementUrl = value(body.replacementUrl, 400);
  const notes = value(body.notes, 1500);
  if (!["pending", "approved", "replace", "unavailable"].includes(status)) return Response.json({ error: "Invalid video status." }, { status: 400 });
  if (!["unchecked", "available", "partial", "missing"].includes(captionsStatus)) return Response.json({ error: "Invalid captions status." }, { status: 400 });
  if (!["unchecked", "suitable", "supervision-required", "unsuitable"].includes(suitabilityStatus)) return Response.json({ error: "Invalid suitability status." }, { status: 400 });

  const db = await getDb();
  const now = new Date().toISOString();
  const existing = await db.select({ id: videoReviews.id }).from(videoReviews).where(and(eq(videoReviews.ownerEmail, user.email), eq(videoReviews.lessonId, lessonId))).limit(1);
  const values = { videoId: lesson.video.id, status, captionsStatus, suitabilityStatus, replacementUrl, notes, checkedAt: now, updatedAt: now };
  const [review] = existing.length
    ? await db.update(videoReviews).set(values).where(eq(videoReviews.id, existing[0].id)).returning()
    : await db.insert(videoReviews).values({ id: crypto.randomUUID(), ownerEmail: user.email, lessonId, ...values }).returning();
  return Response.json({ review }, { status: existing.length ? 200 : 201 });
}

function value(input: unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}
