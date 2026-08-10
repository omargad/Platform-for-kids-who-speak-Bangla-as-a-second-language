import type { Metadata } from "next";
import LibraryHub from "./LibraryHub";

export const metadata: Metadata = {
  title: "NCTB textbook library | Bangla Adventures",
  description:
    "The Bangladesh government (NCTB) textbooks this platform draws its culture, history and literature content from — with official download links and a yearly review promise.",
};

export default function LibraryPage() {
  return <LibraryHub />;
}
