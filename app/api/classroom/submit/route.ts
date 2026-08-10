import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { activitySubmissions, classActivities } from "../../../../db/schema";
import type { QuizQuestion } from "@/lib/classroom";
import { gradeAnswers } from "@/lib/classroom";
import { getStudentFromRequest } from "@/lib/classroom-server";
import { checkRateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`class-submit:${clientKey(request)}`, 60, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  const student = await getStudentFromRequest(request);
  if (!student) return Response.json({ error: "Join a class first." }, { status: 401 });

  try {
    const body = (await request.json().catch(() => ({}))) as { activityId?: unknown; answers?: unknown };
    const activityId = typeof body.activityId === "string" ? body.activityId : "";
    if (!activityId) return Response.json({ error: "Choose an activity." }, { status: 400 });

    const db = await getDb();
    const [activity] = await db
      .select()
      .from(classActivities)
      .where(and(eq(classActivities.id, activityId), eq(classActivities.classId, student.classId)))
      .limit(1);
    if (!activity) return Response.json({ error: "Activity not found." }, { status: 404 });
    if (activity.status !== "open") return Response.json({ error: "This activity is closed." }, { status: 409 });

    const questions = parseQuestions(activity.questionsJson);
    const { score, total, picked } = gradeAnswers(questions, body.answers);

    // One row per student per activity: resubmitting replaces the previous try.
    await db
      .delete(activitySubmissions)
      .where(and(eq(activitySubmissions.activityId, activityId), eq(activitySubmissions.studentId, student.id)));
    await db.insert(activitySubmissions).values({
      id: crypto.randomUUID(),
      activityId,
      studentId: student.id,
      answersJson: JSON.stringify(picked),
      score,
      total,
      submittedAt: new Date().toISOString(),
    });

    return Response.json({
      score,
      total,
      // Reveal correctness (and the right answers) only after submitting.
      review: questions.map((question, index) => ({
        prompt: question.prompt,
        picked: picked[index],
        answer: question.answer,
        correct: picked[index] === question.answer,
      })),
    });
  } catch (error) {
    return databaseError(error);
  }
}

function parseQuestions(json: string): QuizQuestion[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as QuizQuestion[]) : [];
  } catch {
    return [];
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "The classroom service is still being set up." : message }, { status: 500 });
}
