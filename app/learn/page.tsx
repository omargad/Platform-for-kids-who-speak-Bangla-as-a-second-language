import type { Metadata } from "next";
import LearnHub from "./LearnHub";

export const metadata: Metadata = {
  title: "Learn more — all activities | Bangla Adventures",
  description:
    "Every free learning space in one place: alphabet, phrasebook, numbers, calendar, grammar, stories, word practice, culture explorer, worksheets and certificates.",
};

export default function LearnPage() {
  return <LearnHub />;
}
