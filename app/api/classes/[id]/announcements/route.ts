import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { classAnnouncements, classes } from "../../../../../db/schema";
import { getSessionAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function ownedClass(userId: string, classId: string) {
  const db = await getDb();
  const [row] = await db.select().from(classes).where(and(eq(classes.id, classId), eq(classes.teacherId, userId))).limit(1);
  return row ?? null;
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to post announcements." }, { status: 401 });

  try {
    const { id } = await context.params;
    if (!(await ownedClass(user.id, id))) return Response.json({ error: "Class not found." }, { status: 404 });

    const payload = (await request.json().catch(() => ({}))) as { body?: unknown };
    const body = typeof payload.body === "string" ? payload.body.trim().slice(0, 500) : "";
    if (!body) return Response.json({ error: "Write the announcement first." }, { status: 400 });

    const db = await getDb();
    const [announcement] = await db
      .insert(classAnnouncements)
      .values({ id: crypto.randomUUID(), classId: id, body })
      .returning();
    return Response.json({ announcement }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to manage announcements." }, { status: 401 });

  try {
    const { id } = await context.params;
    if (!(await ownedClass(user.id, id))) return Response.json({ error: "Class not found." }, { status: 404 });

    const payload = (await request.json().catch(() => ({}))) as { announcementId?: unknown };
    const announcementId = typeof payload.announcementId === "string" ? payload.announcementId : "";
    if (!announcementId) return Response.json({ error: "Choose an announcement to remove." }, { status: 400 });

    const db = await getDb();
    const [removed] = await db
      .delete(classAnnouncements)
      .where(and(eq(classAnnouncements.id, announcementId), eq(classAnnouncements.classId, id)))
      .returning();
    if (!removed) return Response.json({ error: "Announcement not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "The classroom service is still being set up." : message }, { status: 500 });
}
