"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { libraryBooks, NCTB_PORTAL_URL } from "../library-content";

const levels: Array<{ id: "primary" | "secondary"; en: string; bn: string; note: { en: string; bn: string } }> = [
  {
    id: "primary",
    en: "Primary level (Classes 1–5)",
    bn: "প্রাথমিক স্তর (১ম–৫ম শ্রেণি)",
    note: {
      en: "Class 1 focuses mostly on learning to read; the culture and history material grows from Class 3.",
      bn: "১ম শ্রেণি মূলত পড়তে শেখার; সংস্কৃতি ও ইতিহাসের উপকরণ বাড়ে ৩য় শ্রেণি থেকে।",
    },
  },
  {
    id: "secondary",
    en: "Secondary level (Classes 6–10)",
    bn: "মাধ্যমিক স্তর (৬ষ্ঠ–১০ম শ্রেণি)",
    note: {
      en: "Richer history, literature and arts — several of these books also come in official English versions.",
      bn: "গভীর ইতিহাস, সাহিত্য ও শিল্পকলা — এর কয়েকটি বইয়ের সরকারি ইংরেজি সংস্করণও আছে।",
    },
  },
];

export default function LibraryHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  return (
    <main className="adult-app library-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Textbook library", "পাঠ্যবই লাইব্রেরি")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/topics">{s("Classroom topics", "শ্রেণিকক্ষের বিষয়")}</Link>
          <Link className="active" href="/library">{s("Library", "লাইব্রেরি")}</Link>
          <Link href="/resources">{s("More resources", "আরও সম্পদ")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>
            {s("বাংলায় দেখুন", "View in English")}
          </button>
        </div>
      </header>

      <div className="adult-content">
        <section className="adult-hero">
          <div>
            <p className="adult-eyebrow">{s("Our source of truth", "আমাদের তথ্যের উৎস")}</p>
            <h1>{s("The government textbooks behind every topic.", "প্রতিটি বিষয়ের পেছনের সরকারি পাঠ্যবই।")}</h1>
            <p>
              {s(
                "Bangladesh's National Curriculum and Textbook Board (NCTB) publishes the official school textbooks and offers them free on its website. On our client's direction, these books are the platform's approved source for culture, history and literature content: we adapt facts to be kid-friendly for heritage learners, cite the book they come from, and present stories and poems exactly as written.",
                "বাংলাদেশের জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি) সরকারি পাঠ্যবই প্রকাশ করে এবং ওয়েবসাইটে বিনামূল্যে দেয়। ক্লায়েন্টের নির্দেশনায় এই বইগুলোই সংস্কৃতি, ইতিহাস ও সাহিত্যের অনুমোদিত উৎস: আমরা তথ্যকে প্রবাসী শিশুদের উপযোগী করি, উৎস বইয়ের নাম উল্লেখ করি, আর গল্প-কবিতা অবিকল রাখি।",
              )}
            </p>
            <a className="primary-button" href={NCTB_PORTAL_URL} target="_blank" rel="noreferrer">
              {s("Open the official NCTB website ↗", "সরকারি এনসিটিবি ওয়েবসাইট খুলুন ↗")}
            </a>
          </div>
        </section>

        {levels.map((level) => (
          <section className="resources-section" key={level.id} aria-label={language === "bn" ? level.bn : level.en}>
            <h2>{language === "bn" ? level.bn : level.en}</h2>
            <p className="resources-note">{level.note[language]}</p>
            <div className="library-grid">
              {libraryBooks
                .filter((book) => book.level === level.id)
                .map((book) => (
                  <article className="library-card" key={book.id} id={book.id}>
                    <header>
                      <strong lang="bn">{book.titleBn}</strong>
                      <small>{book.titleEn}</small>
                    </header>
                    <div className="library-chips">
                      <span>{book.classes[language]}</span>
                      <span>{book.subjectArea[language]}</span>
                      {book.hasEnglishVersion && (
                        <span className="library-chip-en">{s("English version available", "ইংরেজি সংস্করণ আছে")}</span>
                      )}
                      {book.status === "confirm" && (
                        <span className="library-chip-confirm">{s("Edition to confirm with school", "সংস্করণ স্কুলের সঙ্গে মিলিয়ে নিন")}</span>
                      )}
                    </div>
                    <p>{book.covers[language]}</p>
                    <p className="library-why">
                      <em>{book.whyItMatters[language]}</em>
                    </p>
                    <a href={NCTB_PORTAL_URL} target="_blank" rel="noreferrer">
                      {s("Download from NCTB ↗", "এনসিটিবি থেকে নামান ↗")}
                    </a>
                  </article>
                ))}
            </div>
          </section>
        ))}

        <section className="library-policy">
          <h2>{s("How we keep this trustworthy", "আস্থা ধরে রাখার নিয়ম")}</h2>
          <ul>
            <li>
              {s(
                "Yearly refresh: NCTB issues new textbook editions each academic year (books are handed out on 1 January). We re-check this list against the new editions every year, as agreed with the client.",
                "বার্ষিক হালনাগাদ: এনসিটিবি প্রতি শিক্ষাবর্ষে নতুন সংস্করণ দেয় (১ জানুয়ারি বই উৎসব)। ক্লায়েন্টের সঙ্গে সিদ্ধান্ত অনুযায়ী আমরা প্রতি বছর নতুন সংস্করণের সঙ্গে তালিকা মিলিয়ে দেখি।",
              )}
            </li>
            <li>
              {s(
                "Government source first: information on this platform traces to these books. If a fact is wrong in the source, that is the publisher's to fix — we never mix in unreviewed websites.",
                "সরকারি উৎসই প্রথম: এই প্ল্যাটফর্মের তথ্য এই বইগুলো থেকে আসে। উৎসে ভুল থাকলে তা প্রকাশকের সংশোধনের বিষয় — আমরা অযাচাই করা ওয়েবসাইট মেশাই না।",
              )}
            </li>
            <li>
              {s(
                "Anything beyond NCTB — a university course, an academy collection — is used only after the client approves it. Suggestions live on the resources page until then.",
                "এনসিটিবির বাইরের কিছু — বিশ্ববিদ্যালয়ের কোর্স, একাডেমির সংগ্রহ — ক্লায়েন্টের অনুমোদনের পরই ব্যবহার হয়। তার আগে প্রস্তাবগুলো থাকে সম্পদ পাতায়।",
              )}
            </li>
            <li>
              {s(
                "Adapted, never copied: we write our own kid-friendly summaries and quizzes. Only literature (stories, poems) is shown as printed, because literature must not be altered.",
                "অনুকরণ নয়, অভিযোজন: আমরা নিজেরা শিশু-উপযোগী সারমর্ম ও কুইজ লিখি। কেবল সাহিত্য (গল্প, কবিতা) ছাপা অনুযায়ী দেখানো হয়, কারণ সাহিত্য বদলানো চলে না।",
              )}
            </li>
          </ul>
        </section>

        <section className="resources-disclaimer">
          <span aria-hidden="true">☂</span>
          <p>
            {s(
              "The NCTB website is an external government site and is mostly in Bangla; textbook PDFs download free of charge. This page sends nothing to it until you click a link.",
              "এনসিটিবি ওয়েবসাইট একটি বাইরের সরকারি সাইট, মূলত বাংলায়; পাঠ্যবইয়ের পিডিএফ বিনামূল্যে নামানো যায়। লিংকে ক্লিক না করা পর্যন্ত এই পাতা সেখানে কিছুই পাঠায় না।",
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
