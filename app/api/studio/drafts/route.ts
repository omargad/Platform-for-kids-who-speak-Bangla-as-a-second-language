import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { curriculumDrafts } from "../../../../db/schema";
import { lessons, type CurriculumLevel } from "../../../curriculum";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";
const statuses = new Set(["draft", "ready-for-review", "approved-for-release", "archived"]);

export async function GET() {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const db = await getDb();
  const drafts = await db.select().from(curriculumDrafts).where(eq(curriculumDrafts.ownerEmail, user.email)).orderBy(desc(curriculumDrafts.updatedAt));
  return Response.json({ drafts });
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = value(body.id, 80);
  const lessonId = value(body.lessonId, 60);
  const lesson = lessons.find((item) => item.id === lessonId);
  const title = value(body.title, 120);
  const level = value(body.level, 20) as CurriculumLevel;
  const status = value(body.status, 30);
  const dataJson = value(body.dataJson, 100_000);
  if (!lesson || !title || level !== lesson.level || !statuses.has(status)) return Response.json({ error: "Invalid curriculum draft." }, { status: 400 });
  try {
    JSON.parse(dataJson);
  } catch {
    return Response.json({ error: "The structured lesson draft must be valid JSON." }, { status: 400 });
  }
  const db = await getDb();
  const now = new Date().toISOString();
  if (id) {
    const [owned] = await db.select({ id: curriculumDrafts.id }).from(curriculumDrafts).where(and(eq(curriculumDrafts.id, id), eq(curriculumDrafts.ownerEmail, user.email))).limit(1);
    if (!owned) return Response.json({ error: "Draft not found." }, { status: 404 });
    const [draft] = await db.update(curriculumDrafts).set({ lessonId, title, level, status, dataJson, updatedAt: now }).where(eq(curriculumDrafts.id, id)).returning();
    return Response.json({ draft });
  }
  const [draft] = await db.insert(curriculumDrafts).values({ id: crypto.randomUUID(), ownerEmail: user.email, lessonId, title, level, status, dataJson, updatedAt: now }).returning();
  return Response.json({ draft }, { status: 201 });
}

function value(input: unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}
