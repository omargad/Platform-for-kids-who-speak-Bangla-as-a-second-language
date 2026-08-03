import type { Metadata } from "next";
import NumbersHub from "./NumbersHub";

export const metadata: Metadata = {
  title: "Numbers & counting | Bangla Adventures",
  description:
    "Learn Bangla numbers 1–20 and the tens to one hundred, with Bangla numerals, number words, tap-to-hear pronunciation and a friendly counting game.",
};

export default function NumbersPage() {
  return <NumbersHub />;
}
