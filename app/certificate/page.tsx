import type { Metadata } from "next";
import CertificateMaker from "./CertificateMaker";

export const metadata: Metadata = {
  title: "Make a certificate | Bangla Adventures",
  description:
    "Print a bilingual certificate to celebrate a learning milestone. The name is typed for printing only and never stored or sent anywhere.",
};

export default function CertificatePage() {
  return <CertificateMaker />;
}
