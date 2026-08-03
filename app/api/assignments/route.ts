import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { assignments, learnerProfiles } from "../../../db/schema";
import { lessons } from "../../curriculum";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";
const lessonIds = new Set(lessons.map((lesson) => lesson.id));

export async function GET(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const profileId = new URL(request.url).searchParams.get("profileId");
  const db = await getDb();
  const rows = profileId
    ? await db.select().from(assignments).where(and(eq(assignments.ownerEmail, user.email), eq(assignments.profileId, profileId))).orderBy(desc(assignments.createdAt))
    : await db.select().from(assignments).where(eq(assignments.ownerEmail, user.email)).orderBy(desc(assignments.createdAt));
  return Response.json({ assignments: rows });
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const profileId = value(body.profileId, 80);
  const lessonId = value(body.lessonId, 60);
  const sessionId = value(body.sessionId, 100) || null;
  const dueAt = value(body.dueAt, 40) || null;
  if (!profileId || !lessonIds.has(lessonId) || (sessionId && !sessionId.startsWith(`session-${lessonId}-`))) {
    return Response.json({ error: "Choose a valid learner, module and session." }, { status: 400 });
  }
  const lesson = lessons.find((item) => item.id === lessonId)!;
  const db = await getDb();
  const [profile] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(and(eq(learnerProfiles.id, profileId), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!profile) return Response.json({ error: "Learner profile not found." }, { status: 404 });
  const [assignment] = await db.insert(assignments).values({
    id: crypto.randomUUID(),
    ownerEmail: user.email,
    profileId,
    lessonId,
    sessionId,
    dueAt,
    title: sessionId ? `${lesson.title} · ${sessionId.split("-").at(-1)}` : lesson.title,
  }).returning();
  return Response.json({ assignment }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = value(body.id, 80);
  const status = value(body.status, 20);
  if (!id || !["assigned", "in-progress", "complete", "archived"].includes(status)) return Response.json({ error: "Invalid assignment update." }, { status: 400 });
  const db = await getDb();
  const [assignment] = await db.update(assignments).set({ status, updatedAt: new Date().toISOString() }).where(and(eq(assignments.id, id), eq(assignments.ownerEmail, user.email))).returning();
  if (!assignment) return Response.json({ error: "Assignment not found." }, { status: 404 });
  return Response.json({ assignment });
}

function value(input: unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}
