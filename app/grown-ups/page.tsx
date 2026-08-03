import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionAdult } from "../../lib/auth";
import { safeReturnPath } from "../../lib/safe-redirect";
import AuthCard from "./AuthCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grown-up sign in | Bangla Adventures",
  description:
    "Sign in or create a grown-up account to manage learner profiles, assignments and the content studio.",
};

export default async function GrownUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const destination = safeReturnPath(returnTo, "/family");
  const adult = await getSessionAdult();
  if (adult) redirect(destination);

  return (
    <main className="adult-app auth-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>Grown-up sign in</small>
          </span>
        </Link>
        <nav aria-label="Platform information">
          <Link href="/">Learner site</Link>
          <Link className="active" href="/grown-ups">Grown-up sign in</Link>
          <Link href="/safety">Safety &amp; access</Link>
        </nav>
      </header>
      <div className="auth-layout">
        <section className="auth-intro">
          <p className="adult-eyebrow">For parents, carers and educators</p>
          <h1>One grown-up account for progress, assignments and content review.</h1>
          <p>
            Children never need an account: every lesson, story and game works anonymously on the
            learner site. A grown-up account only adds optional learner profiles, saved progress and
            the content studio, all under your control.
          </p>
          <ul>
            <li>Create learner profiles with just a display name — no child emails or birthdays.</li>
            <li>Assign lessons and see listening, reading, speaking and writing progress.</li>
            <li>Review pronunciation audio and lesson videos before children meet them.</li>
          </ul>
        </section>
        <AuthCard returnTo={destination} />
      </div>
    </main>
  );
}
