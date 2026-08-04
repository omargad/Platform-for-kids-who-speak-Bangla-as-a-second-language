import type { Metadata } from "next";
import GrammarHub from "./GrammarHub";

export const metadata: Metadata = {
  title: "How Bangla works — grammar guide | Bangla Adventures",
  description:
    "A friendly beginner grammar reference: pronouns and politeness, word order, verb tenses, postpositions and question words, with tap-to-hear examples.",
};

export default function GrammarPage() {
  return <GrammarHub />;
}
