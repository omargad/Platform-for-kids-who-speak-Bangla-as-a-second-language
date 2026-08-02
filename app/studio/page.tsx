import { signOutPath, requireAdult } from "@/lib/auth";
import ContentStudio from "./ContentStudio";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requireAdult("/studio");
  return (
    <main className="adult-app studio-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Content Studio</small></span></Link>
        <nav aria-label="Adult tools"><a href="/family">Learners</a><a className="active" href="/studio">Content Studio</a><a href="/safety">Safety & access</a></nav>
        <div className="adult-account"><span>{user.displayName}</span><a href={signOutPath("/")}>Sign out</a></div>
      </header>
      <ContentStudio />
    </main>
  );
}
