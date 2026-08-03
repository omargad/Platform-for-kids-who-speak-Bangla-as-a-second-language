import { requireAdult } from "@/lib/auth";
import FamilyDashboard from "./FamilyDashboard";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const user = await requireAdult("/family");
  return <FamilyDashboard adultName={user.displayName} />;
}
