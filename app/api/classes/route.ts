import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { activitySubmissions, classActivities, classStudents, classes } from "../../../db/schema";
import { getSessionAdult } from "@/lib/auth";
import { generateJoinCode } from "@/lib/classroom";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to manage your classes." }, { status: 401 });

  try {
    const db = await getDb();
    const teacherClasses = await db.select().from(classes).where(eq(classes.teacherId, user.id)).orderBy(desc(classes.createdAt));
    const classIds = teacherClasses.map((item) => item.id);
    const students = classIds.length ? await db.select().from(classStudents).where(inArray(classStudents.classId, classIds)) : [];
    const activities = classIds.length ? await db.select().from(classActivities).where(inArray(classActivities.classId, classIds)) : [];
    const activityIds = activities.map((item) => item.id);
    const submissions = activityIds.length
      ? await db.select().from(activitySubmissions).where(inArray(activitySubmissions.activityId, activityIds))
      : [];

    return Response.json({
      classes: teacherClasses.map((item) => ({
        ...item,
        studentCount: students.filter((student) => student.classId === item.id).length,
        activityCount: activities.filter((activity) => activity.classId === item.id).length,
        submissionCount: submissions.filter((submission) =>
          activities.some((activity) => activity.id === submission.activityId && activity.classId === item.id),
        ).length,
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to create a class." }, { status: 401 });

  try {
    const body = (await request.json().catch(() => ({}))) as { name?: unknown };
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
    if (!name) return Response.json({ error: "Give the class a name." }, { status: 400 });

    const db = await getDb();
    // Regenerate on the (vanishingly rare) join-code collision.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const [created] = await db
          .insert(classes)
          .values({ id: crypto.randomUUID(), teacherId: user.id, name, joinCode: generateJoinCode() })
          .returning();
        return Response.json({ class: { ...created, studentCount: 0, activityCount: 0, submissionCount: 0 } }, { status: 201 });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (!message.includes("classes_join_code_unique")) throw error;
      }
    }
    return Response.json({ error: "Could not allocate a join code. Try again." }, { status: 500 });
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "The classroom service is still being set up." : message }, { status: 500 });
}
