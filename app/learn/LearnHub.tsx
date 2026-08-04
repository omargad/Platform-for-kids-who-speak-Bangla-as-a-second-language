"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";

type HubCard = {
  href: string;
  emoji: string;
  title: { en: string; bn: string };
  blurb: { en: string; bn: string };
};

const hubs: HubCard[] = [
  { href: "/", emoji: "🛶", title: { en: "The 18 lessons", bn: "১৮টি পাঠ" }, blurb: { en: "The main quest: 108 guided sessions from first words to confident heritage speech.", bn: "মূল যাত্রা: প্রথম শব্দ থেকে আত্মবিশ্বাসী বাংলা পর্যন্ত ১০৮টি সেশন।" } },
  { href: "/alphabet", emoji: "🔤", title: { en: "Bornomala — the alphabet", bn: "বর্ণমালা" }, blurb: { en: "All 50 letters, vowel signs, joined letters and numerals, with sound.", bn: "৫০টি বর্ণ, কার-চিহ্ন, যুক্তবর্ণ ও সংখ্যা — শব্দসহ।" } },
  { href: "/phrasebook", emoji: "💬", title: { en: "First phrases", bn: "বাক্যের ঝুলি" }, blurb: { en: "Forty everyday phrases for home, play and the dinner table.", bn: "বাড়ি, খেলা ও খাবার টেবিলের চল্লিশটি দৈনন্দিন কথা।" } },
  { href: "/numbers", emoji: "💯", title: { en: "Numbers & counting", bn: "সংখ্যা ও গোনা" }, blurb: { en: "One to one hundred, plus a star-earning counting game.", bn: "এক থেকে একশো, সঙ্গে তারা-জেতা গোনার খেলা।" } },
  { href: "/calendar", emoji: "🗓️", title: { en: "Days & seasons", bn: "দিন ও ঋতু" }, blurb: { en: "The week, the twelve Bengali months and the six seasons.", bn: "সপ্তাহ, বারো মাস আর ছয় ঋতু।" } },
  { href: "/grammar", emoji: "🧩", title: { en: "How Bangla works", bn: "বাংলার নিয়ম" }, blurb: { en: "A friendly look-it-up guide: pronouns, verbs, word order, questions.", bn: "সহজ গাইড: সর্বনাম, ক্রিয়া, বাক্যের সাজ, প্রশ্ন।" } },
  { href: "/stories", emoji: "📖", title: { en: "Story time", bn: "গল্পের সময়" }, blurb: { en: "Folk tales retold gently, and stories about two homes.", bn: "নরম করে বলা লোককথা আর দুই বাড়ির গল্প।" } },
  { href: "/practice", emoji: "🌟", title: { en: "Word practice", bn: "শব্দ অনুশীলন" }, blurb: { en: "All 108 lesson words return at just the right time to stick.", bn: "১০৮টি শব্দ ঠিক সময়ে ফিরে আসে, মনে থাকে।" } },
  { href: "/explore", emoji: "🗺️", title: { en: "Explore Bangladesh", bn: "বাংলাদেশ ঘুরে দেখো" }, blurb: { en: "History, landmarks, festivals, food and music of the homeland.", bn: "ইতিহাস, দর্শনীয় স্থান, উৎসব, খাবার ও গান।" } },
  { href: "/worksheets", emoji: "✏️", title: { en: "Printable worksheets", bn: "ওয়ার্কশিট" }, blurb: { en: "A print-ready practice sheet for every lesson.", bn: "প্রতিটি পাঠের প্রিন্ট-উপযোগী অনুশীলন পাতা।" } },
  { href: "/certificate", emoji: "🏵️", title: { en: "Make a certificate", bn: "সনদ তৈরি" }, blurb: { en: "Celebrate a milestone with a printable certificate.", bn: "প্রিন্ট করা সনদে সাফল্য উদযাপন।" } },
  { href: "/resources", emoji: "🌐", title: { en: "More ways to learn", bn: "শেখার আরও পথ" }, blurb: { en: "Verified external courses and free tools, for grown-ups to review.", bn: "যাচাই করা বাইরের কোর্স ও টুল — বড়দের দেখার জন্য।" } },
];

export default function LearnHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

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
        <h1>{s("Twelve doors into Bangla.", "বাংলায় ঢোকার বারোটি দরজা।")}</h1>
        <p>
          {s(
            "Every space is free, works in English and Bangla, and needs no account. Pick a door!",
            "প্রতিটি জায়গা বিনামূল্যে, ইংরেজি ও বাংলায় চলে, কোনো অ্যাকাউন্ট লাগে না। একটি দরজা বেছে নাও!",
          )}
        </p>
      </section>

      <section className="explore-section">
        <div className="learn-grid">
          {hubs.map((hub) => (
            <Link className="learn-card" key={hub.href} href={hub.href}>
              <span className="learn-emoji" aria-hidden="true">{hub.emoji}</span>
              <strong>{hub.title[language]}</strong>
              <p>{hub.blurb[language]}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
