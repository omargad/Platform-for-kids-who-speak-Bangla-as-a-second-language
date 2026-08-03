"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import AuthCard from "./AuthCard";

export default function GrownUpsContent({ destination }: { destination: string }) {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  return (
    <main className="adult-app auth-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Grown-up sign in", "বড়দের সাইন ইন")}</small>
          </span>
        </Link>
        <nav aria-label="Platform information">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link className="active" href="/grown-ups">{s("Grown-up sign in", "বড়দের সাইন ইন")}</Link>
          <Link href="/safety">{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>
            {s("বাংলায় দেখুন", "View in English")}
          </button>
        </div>
      </header>
      <div className="auth-layout">
        <section className="auth-intro">
          <p className="adult-eyebrow">{s("For parents, carers and educators", "অভিভাবক, যত্নকারী ও শিক্ষকদের জন্য")}</p>
          <h1>{s("One grown-up account for progress, assignments and content review.", "অগ্রগতি, কাজ ও কনটেন্ট পর্যালোচনার জন্য একটি বড়দের অ্যাকাউন্ট।")}</h1>
          <p>
            {s(
              "Children never need an account: every lesson, story and game works anonymously on the learner site. A grown-up account only adds optional learner profiles, saved progress and the content studio, all under your control.",
              "শিশুদের কখনো অ্যাকাউন্ট লাগে না: প্রতিটি পাঠ, গল্প ও খেলা শেখার সাইটে নাম ছাড়াই চলে। বড়দের অ্যাকাউন্ট কেবল ঐচ্ছিক শিক্ষার্থী প্রোফাইল, সংরক্ষিত অগ্রগতি ও কনটেন্ট স্টুডিও যোগ করে — সবই আপনার নিয়ন্ত্রণে।",
            )}
          </p>
          <ul>
            <li>{s("Create learner profiles with just a display name — no child emails or birthdays.", "কেবল একটি নাম দিয়ে শিক্ষার্থী প্রোফাইল তৈরি করুন — শিশুর ইমেইল বা জন্মদিন নয়।")}</li>
            <li>{s("Assign lessons and see listening, reading, speaking and writing progress.", "পাঠ বরাদ্দ করুন এবং শোনা, পড়া, বলা ও লেখার অগ্রগতি দেখুন।")}</li>
            <li>{s("Review pronunciation audio and lesson videos before children meet them.", "শিশুরা দেখার আগে উচ্চারণ অডিও ও পাঠ-ভিডিও পর্যালোচনা করুন।")}</li>
          </ul>
        </section>
        <AuthCard returnTo={destination} language={language} />
      </div>
    </main>
  );
}
