import type { Metadata } from "next";
import TopicsHub from "./TopicsHub";

export const metadata: Metadata = {
  title: "Classroom topics — culture, history & literature | Bangla Adventures",
  description:
    "Kid-friendly readings about Bangladesh's history, festivals, literature and arts — each traced to the NCTB government textbook that covers it, with a short quiz to show your teacher.",
};

export default function TopicsPage() {
  return <TopicsHub />;
}
