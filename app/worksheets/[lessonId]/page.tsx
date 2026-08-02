import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons, levelBands } from "../../curriculum";
import { lessonExtensions } from "../../learning-content";
import PrintButton from "../PrintButton";

type PageProps = { params: Promise<{ lessonId: string }> };

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return { title: "Worksheet not found | Bangla Adventures" };
  return {
    title: `Worksheet: ${lesson.title} | Bangla Adventures`,
    description: `Printable Bangla practice sheet for lesson ${lesson.number}: vocabulary, patterns, reading, writing and the family mission.`,
  };
}

const WRITING_LINES = 6;

export default async function WorksheetPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);
  const extension = lessonExtensions[lessonId];
  if (!lesson || !extension) notFound();

  const band = levelBands.find((item) => item.id === lesson.level);
  const answerKey = [
    `Reading check: ${extension.reading.check.answer + 1}`,
    ...lesson.quiz.map((item, index) => `Quiz ${index + 1}: ${item.answer + 1}`),
  ].join(" · ");

  return (
    <main className="adult-app worksheets-app">
      <header className="adult-header worksheet-no-print">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>Printable worksheet</small></span></Link>
        <nav aria-label="Platform information"><Link href="/">Learner site</Link><Link href="/worksheets">All worksheets</Link><a href="/family">Grown-up dashboard</a></nav>
        <div className="adult-account"><PrintButton /></div>
      </header>

      <article className="worksheet-sheet">
        <header className="worksheet-header">
          <div>
            <p className="worksheet-brand">বা · Bangla Adventures</p>
            <h1>
              Lesson {lesson.number}: {lesson.title}
            </h1>
            <p className="worksheet-title-bn" lang="bn">
              {lesson.titleBn}
            </p>
          </div>
          <div className="worksheet-meta">
            <span className="worksheet-band-tag">{band?.code}</span>
            <div className="worksheet-fill-line">Name: ______________________</div>
            <div className="worksheet-fill-line">Date: ______________________</div>
          </div>
        </header>

        <p className="worksheet-cando">
          <strong>Goal:</strong> {lesson.canDo}
        </p>

        <section className="worksheet-section">
          <h2>1 · Words to learn — শব্দ শেখা</h2>
          <table className="worksheet-vocab">
            <thead>
              <tr>
                <th scope="col">Bangla</th>
                <th scope="col">Say it</th>
                <th scope="col">English</th>
                <th scope="col">Write it yourself</th>
              </tr>
            </thead>
            <tbody>
              {lesson.vocabulary.map((item) => (
                <tr key={item.bn}>
                  <td lang="bn">{item.bn}</td>
                  <td>{item.transliteration}</td>
                  <td>{item.en}</td>
                  <td className="worksheet-trace" aria-label="Space to practise writing" />
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="worksheet-section">
          <h2>2 · Sentence patterns — বাক্যের ছাঁচ</h2>
          {lesson.patterns.map((pattern) => (
            <div className="worksheet-pattern" key={pattern.bn}>
              <p>
                <span lang="bn">{pattern.bn}</span> <em>({pattern.transliteration})</em> — {pattern.en}
              </p>
              <div className="worksheet-rule" aria-hidden="true" />
            </div>
          ))}
        </section>

        <section className="worksheet-section">
          <h2>3 · Read and think — পড়ে ভাবি</h2>
          <h3>{extension.reading.title}</h3>
          <p lang="bn">{extension.reading.bn}</p>
          <p className="worksheet-reading-en">{extension.reading.en}</p>
          <p className="worksheet-question">{extension.reading.check.prompt}</p>
          <ol className="worksheet-options">
            {extension.reading.check.options.map((option) => (
              <li key={option}>
                <span className="worksheet-checkbox" aria-hidden="true" /> {option}
              </li>
            ))}
          </ol>
        </section>

        <section className="worksheet-section">
          <h2>4 · Your turn to write — এবার লেখো</h2>
          <p>{extension.writing.mission}</p>
          <p className="worksheet-starters">
            Sentence starters:{" "}
            {extension.writing.starters.map((starter, index) => (
              <span key={starter} lang="bn">
                {starter}
                {index < extension.writing.starters.length - 1 ? "  •  " : ""}
              </span>
            ))}
          </p>
          {Array.from({ length: WRITING_LINES }, (_, index) => (
            <div className="worksheet-rule" key={index} aria-hidden="true" />
          ))}
        </section>

        <section className="worksheet-section">
          <h2>5 · Check yourself — নিজেকে যাচাই</h2>
          {lesson.quiz.map((item, index) => (
            <div key={item.question} className="worksheet-quiz">
              <p className="worksheet-question">
                {index + 1}. {item.question}
              </p>
              <ol className="worksheet-options">
                {item.options.map((option) => (
                  <li key={option}>
                    <span className="worksheet-checkbox" aria-hidden="true" /> {option}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <aside className="worksheet-mission">
          <h2>Family mission — পরিবারের সঙ্গে</h2>
          <p>{lesson.familyMission}</p>
        </aside>

        <footer className="worksheet-footer">
          <span>
            Answer key (1 = first option): {answerKey}
          </span>
          <span>banglaadventures · free to copy for home and classroom use</span>
        </footer>
      </article>
    </main>
  );
}
