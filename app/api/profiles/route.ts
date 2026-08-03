import { desc, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { assignments, learnerProfiles, skillProgress } from "../../../db/schema";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ageBands = new Set(["6-8", "9-12", "13-15", "16+", "not-specified"]);

export async function GET() {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in as a grown-up to view learner profiles." }, { status: 401 });

  try {
    const db = await getDb();
    const profiles = await db.select().from(learnerProfiles).where(inArray(learnerProfiles.ownerEmail, [user.email])).orderBy(desc(learnerProfiles.updatedAt));
    const profileIds = profiles.map((profile) => profile.id);
    const progress = profileIds.length ? await db.select().from(skillProgress).where(inArray(skillProgress.profileId, profileIds)) : [];
    const profileAssignments = profileIds.length ? await db.select().from(assignments).where(inArray(assignments.profileId, profileIds)).orderBy(desc(assignments.createdAt)) : [];

    return Response.json({
      profiles: profiles.map((profile) => ({
        ...profile,
        homeLanguages: safeJsonArray(profile.homeLanguages),
        progress: progress.filter((item) => item.profileId === profile.id),
        assignments: profileAssignments.filter((item) => item.profileId === profile.id),
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in as a grown-up to create a learner profile." }, { status: 401 });

  try {
    const body = (await request.json()) as { displayName?: unknown; ageBand?: unknown; homeLanguages?: unknown };
    const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 40) : "";
    const ageBand = typeof body.ageBand === "string" && ageBands.has(body.ageBand) ? body.ageBand : "not-specified";
    const homeLanguages = Array.isArray(body.homeLanguages)
      ? body.homeLanguages.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, 30)).filter(Boolean).slice(0, 5)
      : [];
    if (!displayName) return Response.json({ error: "A display name is required." }, { status: 400 });

    const db = await getDb();
    const [profile] = await db.insert(learnerProfiles).values({
      id: crypto.randomUUID(),
      ownerEmail: user.email,
      displayName,
      ageBand,
      homeLanguages: JSON.stringify(homeLanguages),
    }).returning();
    return Response.json({ profile: { ...profile, homeLanguages } }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "Saved progress is being set up. Local learning still works." : message }, { status: 500 });
}
