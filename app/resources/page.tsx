import type { Metadata } from "next";
import ResourcesHub from "./ResourcesHub";

export const metadata: Metadata = {
  title: "More ways to learn Bangla | Bangla Adventures",
  description:
    "A curated list of external Bangla courses and resources for families: universities, heritage schools, self-study options and free collections.",
};

export default function ResourcesPage() {
  return <ResourcesHub />;
}
