import Link from "next/link";
import { requireAdult, signOutPath } from "@/lib/auth";
import AccountPanel from "./AccountPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your account | Bangla Adventures",
  description: "Change your password, export your family's learning data or delete the account.",
};

export default async function AccountPage() {
  const user = await requireAdult("/account");
  return (
    <main className="adult-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Your account</small></span></Link>
        <nav aria-label="Adult tools"><a href="/family">Learners</a><a href="/studio">Content Studio</a><a href="/safety">Safety &amp; access</a><a className="active" href="/account">Account</a></nav>
        <div className="adult-account"><span>{user.displayName}</span><a href={signOutPath("/")}>Sign out</a></div>
      </header>
      <AccountPanel email={user.email} displayName={user.displayName} />
    </main>
  );
}
