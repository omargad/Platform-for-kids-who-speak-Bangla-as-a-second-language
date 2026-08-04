import type { Metadata } from "next";
import StoriesHub from "./StoriesHub";

export const metadata: Metadata = {
  title: "Story time — bilingual tales | Bangla Adventures",
  description:
    "Bilingual Bengali stories for children: folk tales retold gently plus original stories about growing up between two homes, with tap-to-hear narration.",
};

export default function StoriesPage() {
  return <StoriesHub />;
}
