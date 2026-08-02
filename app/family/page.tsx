import { requireAdult, signOutPath } from "@/lib/auth";
import FamilyDashboard from "./FamilyDashboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const user = await requireAdult("/family");
  return (
    <main className="adult-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Grown-up dashboard</small></span></Link>
        <nav aria-label="Adult tools"><a className="active" href="/family">Learners</a><a href="/studio">Content Studio</a><a href="/safety">Safety & access</a></nav>
        <div className="adult-account"><span>{user.displayName}</span><a href={signOutPath("/")}>Sign out</a></div>
      </header>
      <FamilyDashboard adultName={user.displayName} />
    </main>
  );
}
