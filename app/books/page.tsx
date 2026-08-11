import type { Metadata } from "next";
import Link from "next/link";
import { lessons } from "../curriculum";
import {
  nctbAssessmentFramework,
  nctbAuditSummary,
  nctbCommunityDiscovery,
  nctbConditionalTeenResources,
  nctbCoreBooks,
  nctbCoreStats,
  nctbEducatorDocuments,
  nctbPrePrimaryResources,
  nctbTeacherGuideCollections,
  nctbTeenCatalogPages,
} from "../nctb-books";
import {
  class5BanglaContents,
  lessonSourceBridges,
  nctbPdfAuditFindings,
  nctbTeenSubjectOutlines,
} from "../nctb-content";
import styles from "./BookBridge.module.css";

export const metadata: Metadata = {
  title: "NCTB Book Bridge | Bangla Adventures",
  description:
    "Audited official NCTB source books, curriculum evidence and review mappings for Bangla Adventures.",
};

const lessonTitleById = new Map(lessons.map((lesson) => [lesson.id, lesson.title]));
const coreSourceById = new Map(nctbCoreBooks.map((book) => [book.id, book]));
const earlySourceById = new Map(nctbPrePrimaryResources.map((book) => [book.id, book]));

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}<span aria-hidden="true"> ↗</span>
    </a>
  );
}

export default function BooksPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span aria-hidden="true">বা</span>
          <span><strong>Bangla Adventures</strong><small>NCTB Book Bridge</small></span>
        </Link>
        <nav aria-label="Book Bridge navigation">
          <Link href="/">Learner site</Link>
          <Link href="/practice">Practice Lab</Link>
          <Link href="/resources">Research register</Link>
          <Link href="/safety">Safety &amp; access</Link>
        </nav>
      </header>

      <div className={styles.content}>
        <section className={styles.hero} aria-labelledby="book-bridge-title">
          <div>
            <p className={styles.eyebrow}>Official-source audit · {nctbAuditSummary.auditedOn}</p>
            <h1 id="book-bridge-title">A bridge from NCTB books to accessible diaspora lessons.</h1>
            <p className={styles.lead}>
              This catalogue records exactly which official Bangladesh curriculum sources can inform the platform.
              It does not copy textbook pages into lessons or treat a government PDF as automatic approval for a
              child-facing adaptation.
            </p>
            <div className={styles.heroActions}>
              <a href="#current-books">Browse the current pathway</a>
              <a href="#review-queue">See the lesson review queue</a>
            </div>
          </div>
          <aside className={styles.heroBoundary} aria-label="Publication boundary">
            <strong>Source verified ≠ lesson approved</strong>
            <p>Every adaptation still needs Bangla, cultural, age, accessibility and copyright review.</p>
          </aside>
        </section>

        <section className={styles.auditStrip} aria-label="NCTB audit summary">
          <article><strong>{nctbAuditSummary.officialPagesChecked}</strong><span>official pages checked</span></article>
          <article><strong>{nctbAuditSummary.pdfEndpoints}</strong><span>PDF endpoints resolved</span></article>
          <article><strong>{nctbAuditSummary.representativePdfsInspected}</strong><span>PDFs deeply inspected</span></article>
          <article><strong>{nctbAuditSummary.activeContentFindings}</strong><span>active-content findings</span></article>
        </section>

        <section className={styles.findings} aria-labelledby="audit-findings-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Safety and accessibility</p>
            <h2 id="audit-findings-title">What the PDF audit means for implementation</h2>
          </div>
          <ul>
            {nctbPdfAuditFindings.map((finding) => <li key={finding}>{finding}</li>)}
          </ul>
        </section>

        <section id="current-books" className={styles.section} aria-labelledby="current-books-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Current 6–12 source shelf</p>
            <h2 id="current-books-title">{nctbCoreStats.titles} titles · {nctbCoreStats.pdfVariants} verified PDF versions</h2>
            <p>
              The five Bangla readers and three Bangladesh and Global Studies titles cover {nctbCoreStats.uniqueContentPages.toLocaleString()} unique source pages.
              Bangla and English BGS versions are paired under one title so reviewers compare the same level instead of seeing duplicate books.
            </p>
          </div>
          <div className={styles.bookGrid}>
            {nctbCoreBooks.map((book) => (
              <article className={styles.bookCard} key={book.id}>
                <div className={styles.cardTopline}>
                  <span>Class {book.grade}</span>
                  <span>{book.subject === "bangla" ? "Bangla" : "Bangladesh studies"}</span>
                </div>
                <h3 lang="bn">{book.titleBn}</h3>
                <p className={styles.englishTitle}>{book.titleEn}</p>
                <dl className={styles.bookFacts}>
                  <div><dt>Contents</dt><dd>{book.contentsCount} entries</dd></div>
                  <div><dt>Source pages</dt><dd>{book.variants[0].pages}</dd></div>
                  <div><dt>Status</dt><dd>Adaptation review pending</dd></div>
                </dl>
                <p>{book.curriculumUse}</p>
                <div className={styles.versions} role="group" aria-label={`${book.titleEn}, Class ${book.grade} versions`}>
                  <strong>{book.variants.length > 1 ? "Choose a version" : "Official PDF"}</strong>
                  <div>
                    {book.variants.map((variant) => (
                      <ExternalLink href={variant.url} key={variant.id} className={styles.versionLink}>
                        {variant.language === "bn" ? "বাংলা" : "English"} · {variant.pages}p
                      </ExternalLink>
                    ))}
                  </div>
                </div>
                <ExternalLink href={book.officialPage} className={styles.catalogueLink}>Open the NCTB catalogue record</ExternalLink>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="class-five-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Exact source index</p>
            <h2 id="class-five-title">Class 5 <span lang="bn">আমার বাংলা বই</span>: all 23 contents entries</h2>
            <p>
              The titles and starting pages below are transcribed for citation and planning. The adaptation focus is
              original project guidance, not NCTB wording and not a substitute for educator review.
            </p>
          </div>
          <ol className={styles.contentsGrid}>
            {class5BanglaContents.map((entry) => (
              <li key={entry.number}>
                <span className={styles.contentsNumber}>{String(entry.number).padStart(2, "0")}</span>
                <div><h3 lang="bn">{entry.titleBn}</h3><p>{entry.adaptationFocus}</p></div>
                <span className={styles.pageNumber}>p. {entry.page}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="review-queue" className={styles.section} aria-labelledby="review-queue-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Traceable curriculum work</p>
            <h2 id="review-queue-title">NCTB-to-lesson review queue</h2>
            <p>
              These are proposed evidence bridges for the existing lesson set. They deliberately remain unpublished
              review items until a qualified person approves the source interpretation and the new wording.
            </p>
          </div>
          <div className={styles.bridgeGrid}>
            {lessonSourceBridges.map((bridge) => (
              <article key={bridge.lessonId}>
                <div className={styles.statusRow}><span>Pending educator review</span><code>{bridge.lessonId}</code></div>
                <h3>{lessonTitleById.get(bridge.lessonId) ?? bridge.lessonId}</h3>
                <p className={styles.evidenceAnchor}><strong>Evidence anchor:</strong> {bridge.evidenceAnchor}</p>
                <p>{bridge.adaptation}</p>
                <div className={styles.sourceChips} aria-label="Proposed source records">
                  {bridge.sourceIds.map((sourceId) => {
                    const core = coreSourceById.get(sourceId);
                    const early = earlySourceById.get(sourceId);
                    const source = core ?? early;
                    return source ? (
                      <ExternalLink href={source.officialPage} key={sourceId}>
                        {"grade" in source ? `Class ${source.grade} ${source.titleEn}` : source.titleEn}
                      </ExternalLink>
                    ) : <span key={sourceId}>{sourceId}</span>;
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="early-years-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Separate early-years pathway</p>
            <h2 id="early-years-title">Pre-primary sources are not compressed into the 6–12 course</h2>
            <p>
              The archive contributes {nctbPrePrimaryResources.reduce((sum, item) => sum + item.pages, 0)} audited pages,
              including ten illustrated story PDFs. Its play, mark-making and story patterns need their own adult-guided experience.
            </p>
          </div>
          <div className={styles.earlyGrid}>
            {nctbPrePrimaryResources.map((resource) => (
              <article key={resource.id}>
                <div className={styles.cardTopline}><span>Age {resource.ageBand}</span><span>{resource.format.toUpperCase()}</span></div>
                <h3 lang="bn">{resource.titleBn}</h3>
                <p className={styles.englishTitle}>{resource.titleEn} · {resource.pages} pages</p>
                <p>{resource.useBoundary}</p>
                {resource.containedTitles ? (
                  <details>
                    <summary>{resource.containedPdfCount} contained story PDFs</summary>
                    <ul>{resource.containedTitles.map((title) => <li key={title}>{title}</li>)}</ul>
                  </details>
                ) : null}
                <div className={styles.cardLinks}>
                  <ExternalLink href={resource.url}>Open official download</ExternalLink>
                  <ExternalLink href={resource.officialPage}>NCTB page</ExternalLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="educator-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Educator evidence room</p>
            <h2 id="educator-title">Curriculum authority and 2026 teacher guides</h2>
            <p>
              These long-form documents guide outcomes, pedagogy and assessment. They are for reviewers and teachers,
              not a learner reading shelf.
            </p>
          </div>
          <div className={styles.educatorGrid}>
            {nctbEducatorDocuments.map((document) => (
              <article key={document.id}>
                <span className={styles.documentLanguage}>{document.language === "bn" ? "বাংলা" : "English"}</span>
                <h3>{document.title}</h3>
                <p>{document.pages === null ? "Page count pending edition check" : `${document.pages.toLocaleString()} pages`} · {document.purpose}</p>
                <div className={styles.cardLinks}>
                  <ExternalLink href={document.url}>Open document</ExternalLink>
                  <ExternalLink href={document.officialPage}>NCTB source page</ExternalLink>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table>
              <caption>NCTB assessment proportions recorded from the revised primary curriculum</caption>
              <thead><tr><th>Grades</th><th>Subject source</th><th>Continuous</th><th>Summative</th></tr></thead>
              <tbody>
                {nctbAssessmentFramework.map((row) => (
                  <tr key={`${row.grades}-${row.sourceMode}`}>
                    <th scope="row">{row.grades}</th><td>{row.sourceMode}</td><td>{row.continuous}%</td><td>{row.summative}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <caption>2026 NCTB teacher-guide collections held behind the educator-review gate</caption>
              <thead><tr><th>Class</th><th>Bangla guide</th><th>Social studies guide</th><th>Catalogue</th></tr></thead>
              <tbody>
                {nctbTeacherGuideCollections.map((collection) => (
                  <tr key={collection.grade}>
                    <th scope="row">Class {collection.grade}</th>
                    <td><ExternalLink href={collection.banglaGuide}>Open Bangla guide</ExternalLink></td>
                    <td><ExternalLink href={collection.socialStudiesGuide}>Open social studies guide</ExternalLink></td>
                    <td><ExternalLink href={collection.officialPage}>Official page</ExternalLink></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.section} ${styles.conditional}`} aria-labelledby="teen-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Conditional teen extension</p>
            <h2 id="teen-title">Catalogued, but not approved for the current age band</h2>
            <p>
              Class 6–10 sources may deepen B2–C2 work only if the client confirms an upper-age pathway and reviewers
              approve the specific text. They do not silently expand the platform beyond its current 6–12 audience.
            </p>
          </div>
          <div className={styles.teenGrid}>
            {nctbConditionalTeenResources.map((resource) => {
              const outline = nctbTeenSubjectOutlines.find((item) => item.sourceId === resource.id);
              return (
                <article key={resource.id}>
                  <div className={styles.cardTopline}><span>Class {resource.grade}</span><span>Conditional</span></div>
                  <h3 lang="bn">{resource.titleBn}</h3>
                  <p className={styles.englishTitle}>{resource.titleEn} · {resource.pages} pages</p>
                  {outline ? <details><summary>{outline.themes.length} audited themes</summary><ul>{outline.themes.map((theme) => <li key={theme}>{theme}</li>)}</ul></details> : null}
                  <div className={styles.cardLinks}><ExternalLink href={resource.url}>Open PDF</ExternalLink><ExternalLink href={resource.officialPage}>NCTB page</ExternalLink></div>
                </article>
              );
            })}
          </div>
          <div className={styles.catalogueQueue}>
            <strong>Catalogued next:</strong>
            {nctbTeenCatalogPages.map((page) => <ExternalLink href={page.url} key={page.grade}>{page.grade}</ExternalLink>)}
          </div>
        </section>

        <section className={`${styles.section} ${styles.community}`} aria-labelledby="community-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Community-governed discovery</p>
            <h2 id="community-title">Small ethnic-group language resources need named community reviewers</h2>
            <p>
              NCTB publishes pre-primary and primary materials in five community languages. They are discovery sources,
              not content the platform can translate, simplify or republish without the relevant community and language specialists.
            </p>
          </div>
          <div className={styles.communityGrid}>
            {nctbCommunityDiscovery.map((resource) => (
              <article key={resource.language}>
                <span lang="bn">{resource.languageBn}</span><strong>{resource.language}</strong>
                <div><ExternalLink href={resource.prePrimaryPage}>Pre-primary</ExternalLink><ExternalLink href={resource.primaryPage}>Primary</ExternalLink></div>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div>
            <strong>Implementation rule</strong>
            <p>
              Link to the official record, cite title and page, write original accessible HTML, and block publication
              until the required reviewers approve the exact adaptation. NCTB ownership and reuse conditions still apply.
            </p>
          </div>
          <Link href="/resources">Open the full research register →</Link>
        </footer>
      </div>
    </main>
  );
}
