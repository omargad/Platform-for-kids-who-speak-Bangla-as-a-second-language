import type { Metadata } from "next";
import ClassroomHub from "./ClassroomHub";

export const metadata: Metadata = {
  title: "My classroom | Bangla Adventures",
  description:
    "Join your Bangla-school class with the code from your teacher — first name only, no email, no password. Read announcements, do activities and send your score to your teacher.",
};

export default function ClassroomPage() {
  return <ClassroomHub />;
}
