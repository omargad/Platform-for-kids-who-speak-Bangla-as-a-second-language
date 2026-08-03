import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { learnerProfiles, skillProgress } from "../../../db/schema";
import { lessons } from "../../curriculum";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

const lessonIds = new Set(lessons.map((lesson) => lesson.id));
const skills = new Set(["listening", "reading", "speaking", "writing", "culture", "mastery"]);

export async function GET(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const profileId = new URL(request.url).searchParams.get("profileId") || "";
  const db = await getDb();
  const [profile] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(and(eq(learnerProfiles.id, profileId), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!profile) return Response.json({ error: "Learner profile not found." }, { status: 404 });
  const progress = await db.select().from(skillProgress).where(eq(skillProgress.profileId, profileId));
  return Response.json({ progress });
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const profileId = textValue(body.profileId, 80);
  const lessonId = textValue(body.lessonId, 60);
  const sessionId = textValue(body.sessionId, 100);
  const skill = textValue(body.skill, 20);
  const score = typeof body.score === "number" && Number.isFinite(body.score) ? Math.max(0, Math.min(100, Math.round(body.score))) : null;
  if (!profileId || !lessonIds.has(lessonId) || !sessionId.startsWith(`session-${lessonId}-`) || !skills.has(skill)) {
    return Response.json({ error: "Invalid progress event." }, { status: 400 });
  }

  const db = await getDb();
  const [profile] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(and(eq(learnerProfiles.id, profileId), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!profile) return Response.json({ error: "Learner profile not found." }, { status: 404 });
  const now = new Date().toISOString();
  const [progress] = await db.insert(skillProgress).values({
    id: crypto.randomUUID(),
    profileId,
    lessonId,
    sessionId,
    skill,
    score,
    status: "complete",
    updatedAt: now,
  }).onConflictDoUpdate({
    target: [skillProgress.profileId, skillProgress.sessionId],
    set: { status: "complete", score, skill, updatedAt: now },
  }).returning();
  return Response.json({ progress }, { status: 201 });
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
