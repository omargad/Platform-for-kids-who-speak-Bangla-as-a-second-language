import type { Metadata } from "next";
import ExploreHub from "./ExploreHub";

export const metadata: Metadata = {
  title: "Explore Bangladesh | Bangla Adventures",
  description:
    "A bilingual, child-friendly tour of Bangladesh: its history timeline, regions and landmarks, festivals, food and culture.",
};

export default function ExplorePage() {
  return <ExploreHub />;
}
