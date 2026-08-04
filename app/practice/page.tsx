import type { Metadata } from "next";
import PracticeHub from "./PracticeHub";

export const metadata: Metadata = {
  title: "Word practice | Bangla Adventures",
  description:
    "Review the curriculum's vocabulary with gentle spaced repetition: words you know come back later, words you're learning come back sooner. Saved only on this device.",
};

export default function PracticePage() {
  return <PracticeHub />;
}
