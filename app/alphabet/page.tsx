import type { Metadata } from "next";
import AlphabetHub from "./AlphabetHub";

export const metadata: Metadata = {
  title: "Bornomala — the Bangla alphabet | Bangla Adventures",
  description:
    "Learn the full Bangla alphabet: 11 vowels, 39 consonants, vowel signs and Bangla numerals, with primer-style example words and tap-to-hear pronunciation.",
};

export default function AlphabetPage() {
  return <AlphabetHub />;
}
