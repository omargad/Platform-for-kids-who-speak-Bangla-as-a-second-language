import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { assignments, learnerProfiles, skillProgress } from "../../../../db/schema";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const db = await getDb();
  const [profile] = await db.select().from(learnerProfiles).where(and(eq(learnerProfiles.id, id), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!profile) return Response.json({ error: "Learner profile not found." }, { status: 404 });
  const progress = await db.select().from(skillProgress).where(eq(skillProgress.profileId, id));
  const profileAssignments = await db.select().from(assignments).where(and(eq(assignments.profileId, id), eq(assignments.ownerEmail, user.email)));
  return Response.json({ profile: { ...profile, homeLanguages: safeJsonArray(profile.homeLanguages) }, progress, assignments: profileAssignments });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json()) as { displayName?: unknown; ageBand?: unknown; homeLanguages?: unknown };
  const db = await getDb();
  const [owned] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(and(eq(learnerProfiles.id, id), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!owned) return Response.json({ error: "Learner profile not found." }, { status: 404 });

  const values: Partial<typeof learnerProfiles.$inferInsert> = { updatedAt: new Date().toISOString() };
  if (typeof body.displayName === "string" && body.displayName.trim()) values.displayName = body.displayName.trim().slice(0, 40);
  if (typeof body.ageBand === "string") values.ageBand = body.ageBand.slice(0, 20);
  if (Array.isArray(body.homeLanguages)) values.homeLanguages = JSON.stringify(body.homeLanguages.filter((item): item is string => typeof item === "string").slice(0, 5));
  const [profile] = await db.update(learnerProfiles).set(values).where(eq(learnerProfiles.id, id)).returning();
  return Response.json({ profile: { ...profile, homeLanguages: safeJsonArray(profile.homeLanguages) } });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const db = await getDb();
  const [owned] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(and(eq(learnerProfiles.id, id), eq(learnerProfiles.ownerEmail, user.email))).limit(1);
  if (!owned) return Response.json({ error: "Learner profile not found." }, { status: 404 });
  // Progress cascades via the profile foreign key; assignments are removed explicitly.
  await db.delete(assignments).where(and(eq(assignments.profileId, id), eq(assignments.ownerEmail, user.email)));
  await db.delete(learnerProfiles).where(eq(learnerProfiles.id, id));
  return Response.json({ ok: true });
}

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
