import type { Metadata } from "next";
import SafetyContent from "./SafetyContent";

export const metadata: Metadata = {
  title: "Safety, privacy and accessibility | Bangla Adventures",
  description:
    "Plain-language data boundaries, accessibility targets, external media safeguards and independent review status for Bangla Adventures.",
};

export default function SafetyPage() {
  return <SafetyContent />;
}
