import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { mediaAssets } from "../../../../../db/schema";
import { lessons } from "../../../../curriculum";
import { getMediaObject } from "@/lib/storage";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ lessonId: string; slot: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { lessonId, slot } = await context.params;
  const validLesson = lessons.some((lesson) => lesson.id === lessonId);
  const validSlot = /^(dialogue|reading|word-[1-6]|pattern-[1-2])$/.test(slot);
  if (!validLesson || !validSlot) return Response.json({ error: "Audio not found." }, { status: 404 });

  try {
    const db = await getDb();
    const [asset] = await db.select().from(mediaAssets).where(and(eq(mediaAssets.lessonId, lessonId), eq(mediaAssets.slot, slot), eq(mediaAssets.reviewStatus, "approved"), eq(mediaAssets.consentConfirmed, true))).orderBy(desc(mediaAssets.updatedAt)).limit(1);
    if (asset) {
      const body = await getMediaObject(asset.objectKey);
      if (body) {
        return new Response(new Uint8Array(body), {
          headers: {
            "Content-Type": asset.contentType,
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }
  } catch {
    // Bundled synthetic audio is the resilient fallback while reviewed media is unavailable.
  }

  return Response.redirect(new URL(`/audio/lesson-${lessonId}-${slot}.ogg`, request.url), 307);
}
