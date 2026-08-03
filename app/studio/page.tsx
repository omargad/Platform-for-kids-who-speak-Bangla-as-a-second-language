import { requireAdult } from "@/lib/auth";
import ContentStudio from "./ContentStudio";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requireAdult("/studio");
  return <ContentStudio adultName={user.displayName} />;
}
