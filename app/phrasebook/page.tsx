import type { Metadata } from "next";
import PhrasebookHub from "./PhrasebookHub";

export const metadata: Metadata = {
  title: "First phrases — the phrasebook | Bangla Adventures",
  description:
    "A child-friendly Bangla phrasebook: greetings, kind words, family phrases, feelings, play and food — with transliteration and tap-to-hear pronunciation.",
};

export default function PhrasebookPage() {
  return <PhrasebookHub />;
}
