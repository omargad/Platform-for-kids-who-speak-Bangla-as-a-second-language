import type { Metadata } from "next";
import PoemsHub from "./PoemsHub";

export const metadata: Metadata = {
  title: "Poetry corner — as the poets wrote it | Bangla Adventures",
  description:
    "Public-domain Bangla poems and folk rhymes presented exactly as written — Tagore, Kusumkumari Das and the rhymes every Bengali child grows up chanting — with gentle English helpers.",
};

export default function PoemsPage() {
  return <PoemsHub />;
}
