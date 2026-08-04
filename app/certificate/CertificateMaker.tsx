"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";

type Achievement = {
  id: string;
  en: string;
  bn: string;
  emoji: string;
};

const achievements: Achievement[] = [
  { id: "alphabet", emoji: "🔤", en: "learned the Bangla alphabet", bn: "বাংলা বর্ণমালা শিখেছে" },
  { id: "numbers", emoji: "💯", en: "counted to one hundred in Bangla", bn: "বাংলায় একশো পর্যন্ত গুনেছে" },
  { id: "phrases", emoji: "💬", en: "spoke first Bangla phrases", bn: "প্রথম বাংলা কথা বলেছে" },
  { id: "story", emoji: "📖", en: "read a whole Bangla story", bn: "একটি পুরো বাংলা গল্প পড়েছে" },
  { id: "module", emoji: "🏵️", en: "completed a whole lesson module", bn: "একটি পুরো পাঠ-মডিউল শেষ করেছে" },
  { id: "explorer", emoji: "🗺️", en: "explored the story of Bangladesh", bn: "বাংলাদেশের গল্প ঘুরে দেখেছে" },
];

export default function CertificateMaker() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [name, setName] = useState("");
  const [achievementId, setAchievementId] = useState(achievements[0].id);
  const achievement = achievements.find((item) => item.id === achievementId) ?? achievements[0];
  const today = new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="explore-app certificate-app" lang={language}>
      <header className="explore-header worksheet-no-print">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Make a certificate", "সনদ তৈরি করো")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/worksheets">{s("Worksheets", "ওয়ার্কশিট")}</Link>
          <Link className="active" href="/certificate">{s("Certificate", "সনদ")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero worksheet-no-print">
        <p className="adult-eyebrow">{s("Celebrate a milestone", "সাফল্য উদযাপন")}</p>
        <h1>{s("A certificate, warm off the printer.", "প্রিন্টার থেকে সদ্য বের হওয়া সনদ।")}</h1>
        <p>
          {s(
            "Type a name, pick the achievement, print. The name is used only to draw this page — it is never saved or sent anywhere.",
            "নাম লেখো, সাফল্য বাছো, প্রিন্ট করো। নামটি কেবল এই পাতা আঁকতেই ব্যবহার হয় — কোথাও সংরক্ষণ বা পাঠানো হয় না।",
          )}
        </p>
      </section>

      <section className="explore-section certificate-controls worksheet-no-print">
        <label>
          {s("Learner's name", "শিক্ষার্থীর নাম")}
          <input
            type="text"
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={s("e.g. Rumi", "যেমন রুমি")}
          />
        </label>
        <label>
          {s("Achievement", "সাফল্য")}
          <select value={achievementId} onChange={(event) => setAchievementId(event.target.value)}>
            {achievements.map((item) => (
              <option key={item.id} value={item.id}>
                {item.emoji} {language === "bn" ? item.bn : item.en}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="primary-button" onClick={() => window.print()}>
          {s("Print the certificate", "সনদ প্রিন্ট করো")}
        </button>
      </section>

      <section className="certificate-sheet-wrap">
        <article className="certificate-sheet" aria-label="Certificate preview">
          <div className="certificate-border">
            <p className="certificate-brand">বা · Bangla Adventures</p>
            <span className="certificate-emoji" aria-hidden="true">{achievement.emoji}</span>
            <h2 className="certificate-title">
              {s("Certificate of Achievement", "সাফল্যের সনদ")}
            </h2>
            <p className="certificate-presented">{s("proudly presented to", "সগর্বে দেওয়া হলো")}</p>
            <p className="certificate-name">{name.trim() || s("________________", "________________")}</p>
            <p className="certificate-because">
              {s("who has", "যে")}{" "}
              <strong>{language === "bn" ? achievement.bn : achievement.en}</strong>
              {language === "bn" ? "" : "."}
            </p>
            <p className="certificate-bn" lang={language === "bn" ? "en" : "bn"}>
              {language === "bn" ? achievement.en : achievement.bn}
            </p>
            <div className="certificate-footer">
              <span>⭐ ⭐ ⭐</span>
              <span>{today}</span>
              <span className="certificate-sign">{s("Grown-up's signature", "অভিভাবকের স্বাক্ষর")}: ____________</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
