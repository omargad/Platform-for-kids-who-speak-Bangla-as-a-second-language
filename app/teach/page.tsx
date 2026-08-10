import { requireAdult } from "@/lib/auth";
import TeacherDashboard from "./TeacherDashboard";

export const dynamic = "force-dynamic";

export default async function TeachPage() {
  const user = await requireAdult("/teach");
  return <TeacherDashboard teacherName={user.displayName} />;
}
