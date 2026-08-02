import { eq, inArray } from "drizzle-orm";
import { getDb } from "../../../../db";
import {
  assignments,
  contentReviews,
  curriculumDrafts,
  learnerProfiles,
  mediaAssets,
  skillProgress,
  videoReviews,
} from "../../../../db/schema";
import { getSessionAdult } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

/** Full machine-readable export of everything stored for the signed-in grown-up. */
export async function GET() {
  const adult = await getSessionAdult();
  if (!adult) return Response.json({ error: "Sign in required." }, { status: 401 });

  const db = await getDb();
  const profiles = await db
    .select()
    .from(learnerProfiles)
    .where(eq(learnerProfiles.ownerEmail, adult.email));
  const profileIds = profiles.map((profile) => profile.id);
  const progress = profileIds.length
    ? await db.select().from(skillProgress).where(inArray(skillProgress.profileId, profileIds))
    : [];

  const [ownedAssignments, drafts, reviews, videos, media] = [
    await db.select().from(assignments).where(eq(assignments.ownerEmail, adult.email)),
    await db.select().from(curriculumDrafts).where(eq(curriculumDrafts.ownerEmail, adult.email)),
    await db.select().from(contentReviews).where(eq(contentReviews.ownerEmail, adult.email)),
    await db.select().from(videoReviews).where(eq(videoReviews.ownerEmail, adult.email)),
    await db.select().from(mediaAssets).where(eq(mediaAssets.ownerEmail, adult.email)),
  ];

  const payload = {
    exportedAt: new Date().toISOString(),
    account: { email: adult.email, displayName: adult.displayName },
    learnerProfiles: profiles.map((profile) => ({
      ...profile,
      progress: progress.filter((item) => item.profileId === profile.id),
    })),
    assignments: ownedAssignments,
    curriculumDrafts: drafts,
    contentReviews: reviews,
    videoReviews: videos,
    // Metadata only; the audio files themselves can be requested separately.
    mediaAssets: media.map(({ objectKey, ...rest }) => rest),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="bangla-adventures-export.json"',
      "Cache-Control": "no-store",
    },
  });
}
