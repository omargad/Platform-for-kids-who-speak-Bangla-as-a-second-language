"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";

type HubCard = {
  href: string;
  emoji: string;
  title: { en: string; bn: string };
  blurb: { en: string; bn: string };
};

// Core mission (client brief, 10 Aug 2026): Bangladesh's culture, history and
// literature for community-school kids, sourced from NCTB government textbooks.
const cultureHubs: HubCard[] = [
  { href: "/topics", emoji: "🏛️", title: { en: "Classroom topics", bn: "শ্রেণিকক্ষের বিষয়" }, blurb: { en: "History, festivals, literature and arts — short readings with quizzes, each citing its NCTB textbook.", bn: "ইতিহাস, উৎসব, সাহিত্য ও শিল্প — কুইজসহ ছোট পাঠ, প্রতিটিতে এনসিটিবি বইয়ের উৎস।" } },
  { href: "/library", emoji: "📚", title: { en: "NCTB textbook library", bn: "এনসিটিবি পাঠ্যবই লাইব্রেরি" }, blurb: { en: "The government textbooks behind every topic, with official free download links.", bn: "প্রতিটি বিষয়ের পেছনের সরকারি পাঠ্যবই, বিনামূল্যের অফিসিয়াল ডাউনলোড লিংকসহ।" } },
  { href: "/classroom", emoji: "🏫", title: { en: "My classroom", bn: "আমার শ্রেণিকক্ষ" }, blurb: { en: "Join your Bangla-school class with a code, do the activities your teacher sets.", bn: "কোড দিয়ে ক্লাসে যোগ দাও, শিক্ষকের দেওয়া কার্যক্রম করো।" } },
  { href: "/poems", emoji: "🪶", title: { en: "Poetry corner", bn: "কবিতার কোণ" }, blurb: { en: "Beloved poems and rhymes, exactly as the poets wrote them.", bn: "প্রিয় কবিতা ও ছড়া — কবি যেমন লিখেছেন, ঠিক তেমনই।" } },
  { href: "/explore", emoji: "🗺️", title: { en: "Explore Bangladesh", bn: "বাংলাদেশ ঘুরে দেখো" }, blurb: { en: "History timeline, landmarks, festivals, food and music of the homeland.", bn: "ইতিহাস, দর্শনীয় স্থান, উৎসব, খাবার ও গান।" } },
  { href: "/stories", emoji: "📖", title: { en: "Story time", bn: "গল্পের সময়" }, blurb: { en: "Folk tales retold gently, and stories about two homes.", bn: "নরম করে বলা লোককথা আর দুই বাড়ির গল্প।" } },
  { href: "/calendar", emoji: "🗓️", title: { en: "Days & seasons", bn: "দিন ও ঋতু" }, blurb: { en: "The week, the twelve Bengali months and the six seasons.", bn: "সপ্তাহ, বারো মাস আর ছয় ঋতু।" } },
  { href: "/resources", emoji: "🌐", title: { en: "More ways to learn", bn: "শেখার আরও পথ" }, blurb: { en: "Verified external courses and free tools, for grown-ups to review.", bn: "যাচাই করা বাইরের কোর্স ও টুল — বড়দের দেখার জন্য।" } },
];

// The language corner stays available as an extension — the client parked
// language teaching for the future because community schools already run a
// set language curriculum.
const languageHubs: HubCard[] = [
  { href: "/", emoji: "🛶", title: { en: "The 18 lessons", bn: "১৮টি পাঠ" }, blurb: { en: "108 guided sessions from first words to confident heritage speech.", bn: "প্রথম শব্দ থেকে আত্মবিশ্বাসী বাংলা পর্যন্ত ১০৮টি সেশন।" } },
  { href: "/alphabet", emoji: "🔤", title: { en: "Bornomala — the alphabet", bn: "বর্ণমালা" }, blurb: { en: "All 50 letters, vowel signs, joined letters and numerals, with sound.", bn: "৫০টি বর্ণ, কার-চিহ্ন, যুক্তবর্ণ ও সংখ্যা — শব্দসহ।" } },
  { href: "/phrasebook", emoji: "💬", title: { en: "First phrases", bn: "বাক্যের ঝুলি" }, blurb: { en: "Forty everyday phrases for home, play and the dinner table.", bn: "বাড়ি, খেলা ও খাবার টেবিলের চল্লিশটি দৈনন্দিন কথা।" } },
  { href: "/numbers", emoji: "💯", title: { en: "Numbers & counting", bn: "সংখ্যা ও গোনা" }, blurb: { en: "One to one hundred, plus a star-earning counting game.", bn: "এক থেকে একশো, সঙ্গে তারা-জেতা গোনার খেলা।" } },
  { href: "/grammar", emoji: "🧩", title: { en: "How Bangla works", bn: "বাংলার নিয়ম" }, blurb: { en: "A friendly look-it-up guide: pronouns, verbs, word order, questions.", bn: "সহজ গাইড: সর্বনাম, ক্রিয়া, বাক্যের সাজ, প্রশ্ন।" } },
  { href: "/practice", emoji: "🌟", title: { en: "Word practice", bn: "শব্দ অনুশীলন" }, blurb: { en: "All 108 lesson words return at just the right time to stick.", bn: "১০৮টি শব্দ ঠিক সময়ে ফিরে আসে, মনে থাকে।" } },
  { href: "/worksheets", emoji: "✏️", title: { en: "Printable worksheets", bn: "ওয়ার্কশিট" }, blurb: { en: "A print-ready practice sheet for every lesson.", bn: "প্রতিটি পাঠের প্রিন্ট-উপযোগী অনুশীলন পাতা।" } },
  { href: "/certificate", emoji: "🏵️", title: { en: "Make a certificate", bn: "সনদ তৈরি" }, blurb: { en: "Celebrate a milestone with a printable certificate.", bn: "প্রিন্ট করা সনদে সাফল্য উদযাপন।" } },
];

export default function LearnHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  const renderGrid = (cards: HubCard[]) => (
    <div className="learn-grid">
      {cards.map((hub) => (
        <Link className="learn-card" key={hub.href} href={hub.href}>
          <span className="learn-emoji" aria-hidden="true">{hub.emoji}</span>
          <strong>{hub.title[language]}</strong>
          <p>{hub.blurb[language]}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <main className="explore-app learn-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Learn more", "আরও শেখো")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link className="active" href="/learn">{s("All activities", "সব কার্যক্রম")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Everything in one place", "সবকিছু এক জায়গায়")}</p>
        <h1>{s("Discover Bangladesh — then keep exploring.", "বাংলাদেশকে জানো — তারপর আরও এগোও।")}</h1>
        <p>
          {s(
            "Every space is free, works in English and Bangla, and needs no account. Start with the classroom topics your Bangla school talks about, then wander.",
            "প্রতিটি জায়গা বিনামূল্যে, ইংরেজি ও বাংলায় চলে, কোনো অ্যাকাউন্ট লাগে না। বাংলা স্কুলের শ্রেণিকক্ষের বিষয় দিয়ে শুরু করো, তারপর ঘুরে দেখো।",
          )}
        </p>
      </section>

      <section className="explore-section" aria-label={s("Culture, history and literature", "সংস্কৃতি, ইতিহাস ও সাহিত্য")}>
        <h2>🏵️ {s("Culture, history & literature", "সংস্কৃতি, ইতিহাস ও সাহিত্য")}</h2>
        <p className="explore-section-note">
          {s(
            "The heart of the platform — built from Bangladesh's official NCTB textbooks.",
            "প্ল্যাটফর্মের প্রাণ — বাংলাদেশের সরকারি এনসিটিবি পাঠ্যবই থেকে গড়া।",
          )}
        </p>
        {renderGrid(cultureHubs)}
      </section>

      <section className="explore-section" aria-label={s("Bangla language corner", "বাংলা ভাষার কোণ")}>
        <h2>🔤 {s("Bangla language corner", "বাংলা ভাষার কোণ")}</h2>
        <p className="explore-section-note">
          {s(
            "An optional extension. Community schools run their own language levels — these spaces back that up at home, whenever a family wants them.",
            "ঐচ্ছিক সম্প্রসারণ। কমিউনিটি স্কুলে ভাষার নিজস্ব স্তর আছে — পরিবার চাইলে বাড়িতে এই জায়গাগুলো তা-ই এগিয়ে নেয়।",
          )}
        </p>
        {renderGrid(languageHubs)}
      </section>
    </main>
  );
}
