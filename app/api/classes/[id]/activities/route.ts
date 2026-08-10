import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { classActivities, classes } from "../../../../../db/schema";
import { getSessionAdult } from "@/lib/auth";
import { validateQuizQuestions } from "@/lib/classroom";
import { topics } from "../../../../topics-content";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function ownedClass(userId: string, classId: string) {
  const db = await getDb();
  const [row] = await db.select().from(classes).where(and(eq(classes.id, classId), eq(classes.teacherId, userId))).limit(1);
  return row ?? null;
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to create activities." }, { status: 401 });

  try {
    const { id } = await context.params;
    if (!(await ownedClass(user.id, id))) return Response.json({ error: "Class not found." }, { status: 404 });

    const body = (await request.json().catch(() => ({}))) as {
      title?: unknown;
      instructions?: unknown;
      topicId?: unknown;
      questions?: unknown;
    };
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
    if (!title) return Response.json({ error: "Give the activity a title." }, { status: 400 });
    const instructions = typeof body.instructions === "string" ? body.instructions.trim().slice(0, 1000) : "";
    const topicId =
      typeof body.topicId === "string" && topics.some((topic) => topic.id === body.topicId) ? body.topicId : null;

    const validated = validateQuizQuestions(body.questions);
    if ("error" in validated) return Response.json({ error: validated.error }, { status: 400 });

    const db = await getDb();
    const [activity] = await db
      .insert(classActivities)
      .values({
        id: crypto.randomUUID(),
        classId: id,
        title,
        instructions,
        topicId,
        questionsJson: JSON.stringify(validated.questions),
      })
      .returning();
    return Response.json({ activity: { ...activity, questions: validated.questions } }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to manage activities." }, { status: 401 });

  try {
    const { id } = await context.params;
    if (!(await ownedClass(user.id, id))) return Response.json({ error: "Class not found." }, { status: 404 });

    const body = (await request.json().catch(() => ({}))) as { activityId?: unknown; status?: unknown };
    const activityId = typeof body.activityId === "string" ? body.activityId : "";
    const status = body.status === "closed" ? "closed" : body.status === "open" ? "open" : null;
    if (!activityId || !status) return Response.json({ error: "Choose an activity and a status." }, { status: 400 });

    const db = await getDb();
    const [updated] = await db
      .update(classActivities)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(and(eq(classActivities.id, activityId), eq(classActivities.classId, id)))
      .returning();
    if (!updated) return Response.json({ error: "Activity not found." }, { status: 404 });
    return Response.json({ ok: true, status: updated.status });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to manage activities." }, { status: 401 });

  try {
    const { id } = await context.params;
    if (!(await ownedClass(user.id, id))) return Response.json({ error: "Class not found." }, { status: 404 });

    const body = (await request.json().catch(() => ({}))) as { activityId?: unknown };
    const activityId = typeof body.activityId === "string" ? body.activityId : "";
    if (!activityId) return Response.json({ error: "Choose an activity to remove." }, { status: 400 });

    const db = await getDb();
    const [removed] = await db
      .delete(classActivities)
      .where(and(eq(classActivities.id, activityId), eq(classActivities.classId, id)))
      .returning();
    if (!removed) return Response.json({ error: "Activity not found." }, { status: 404 });
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
