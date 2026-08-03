import type { Metadata } from "next";
import CalendarHub from "./CalendarHub";

export const metadata: Metadata = {
  title: "Days, months & the six seasons | Bangla Adventures",
  description:
    "Learn the days of the week, the twelve Bengali months and Bangladesh's six seasons, with transliteration and tap-to-hear pronunciation.",
};

export default function CalendarPage() {
  return <CalendarHub />;
}
