import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { adults, classStudents, classes } from "../db/schema";
import { hashSessionToken } from "./password";

export const STUDENT_TOKEN_HEADER = "x-student-token";

export type ClassroomStudent = {
  id: string;
  displayName: string;
  classId: string;
  className: string;
  teacherName: string;
};

/** Resolves the student identified by the x-student-token header, if any. */
export async function getStudentFromRequest(request: Request): Promise<ClassroomStudent | null> {
  const token = request.headers.get(STUDENT_TOKEN_HEADER)?.trim();
  if (!token) return null;

  try {
    const db = await getDb();
    const [row] = await db
      .select({
        id: classStudents.id,
        displayName: classStudents.displayName,
        classId: classes.id,
        className: classes.name,
        teacherName: adults.displayName,
      })
      .from(classStudents)
      .innerJoin(classes, eq(classStudents.classId, classes.id))
      .innerJoin(adults, eq(classes.teacherId, adults.id))
      .where(eq(classStudents.tokenHash, hashSessionToken(token)))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}
