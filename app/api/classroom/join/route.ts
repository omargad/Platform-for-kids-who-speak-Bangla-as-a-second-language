import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { adults, classStudents, classes } from "../../../../db/schema";
import { isValidJoinCode, normalizeJoinCode } from "@/lib/classroom";
import { createSessionToken, hashSessionToken } from "@/lib/password";
import { checkRateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = checkRateLimit(`class-join:${clientKey(request)}`, 15, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

  try {
    const body = (await request.json().catch(() => ({}))) as { code?: unknown; name?: unknown };
    const code = typeof body.code === "string" ? normalizeJoinCode(body.code) : "";
    // First name (or nickname) only — never a surname, email or birthday.
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 30) : "";
    if (!isValidJoinCode(code)) return Response.json({ error: "That class code does not look right." }, { status: 400 });
    if (!name) return Response.json({ error: "Tell us a first name or nickname." }, { status: 400 });

    const db = await getDb();
    const [foundClass] = await db
      .select({ id: classes.id, name: classes.name, teacherName: adults.displayName })
      .from(classes)
      .innerJoin(adults, eq(classes.teacherId, adults.id))
      .where(eq(classes.joinCode, code))
      .limit(1);
    if (!foundClass) return Response.json({ error: "No class has that code. Check with your teacher." }, { status: 404 });

    const token = createSessionToken();
    const [student] = await db
      .insert(classStudents)
      .values({ id: crypto.randomUUID(), classId: foundClass.id, displayName: name, tokenHash: hashSessionToken(token) })
      .returning();

    return Response.json(
      {
        token,
        student: { id: student.id, displayName: student.displayName },
        class: { id: foundClass.id, name: foundClass.name, teacherName: foundClass.teacherName },
      },
      { status: 201 },
    );
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "The classroom service is still being set up." : message }, { status: 500 });
}
