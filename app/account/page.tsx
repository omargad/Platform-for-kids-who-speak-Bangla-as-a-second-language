import { requireAdult } from "@/lib/auth";
import AccountPanel from "./AccountPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your account | Bangla Adventures",
  description: "Change your password, export your family's learning data or delete the account.",
};

export default async function AccountPage() {
  const user = await requireAdult("/account");
  return <AccountPanel email={user.email} displayName={user.displayName} />;
}
