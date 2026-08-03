import Link from "next/link";
import { lessons, levelBands } from "../curriculum";

export const metadata = {
  title: "Printable worksheets | Bangla Adventures",
  description:
    "Print-friendly practice sheets for all 18 lessons: vocabulary tracing, sentence patterns, reading, writing and the family mission.",
};

export default function WorksheetsIndexPage() {
  return (
    <main className="adult-app worksheets-app">
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Printable worksheets</small></span></Link>
        <nav aria-label="Platform information"><Link href="/">Learner site</Link><Link className="active" href="/worksheets">Worksheets</Link><a href="/family">Grown-up dashboard</a><a href="/safety">Safety &amp; access</a></nav>
        <div className="adult-account"><span>Free to print and share</span></div>
      </header>

      <div className="adult-content">
        <section className="adult-hero">
          <div>
            <p className="adult-eyebrow">Off-screen practice</p>
            <h1>One printable worksheet for every lesson.</h1>
            <p>
              Each sheet mirrors its on-screen lesson: the six vocabulary words with space to write,
              both sentence patterns, a short bilingual reading with a comprehension check, a guided
              writing task and the family mission. Made for kitchen tables and community-school
              classrooms — no login, no ink-heavy artwork.
            </p>
          </div>
        </section>

        {levelBands.map((band) => {
          const bandLessons = lessons.filter((lesson) => lesson.level === band.id);
          if (bandLessons.length === 0) return null;
          return (
            <section key={band.id} className="worksheet-band">
              <h2>
                <span className="worksheet-band-code">{band.code}</span> {band.title} · {band.titleBn}
              </h2>
              <p>{band.descriptor}</p>
              <ul className="worksheet-list">
                {bandLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={`/worksheets/${lesson.id}`}>
                      <strong>
                        {lesson.number}. {lesson.title}
                      </strong>
                      <span lang="bn">{lesson.titleBn}</span>
                      <small>{lesson.duration} on screen · 1–2 pages printed</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
