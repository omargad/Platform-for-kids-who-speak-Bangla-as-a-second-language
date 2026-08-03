"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { days, months, seasons } from "../calendar-content";

export default function CalendarHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((voice) => voice.lang?.toLowerCase().startsWith("bn")) ?? null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, []);

  const speak = useCallback((text: string, key: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "bn-BD";
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.75;
    utterance.onstart = () => setSpeaking(key);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <main className="explore-app calendar-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Days & seasons", "দিন ও ঋতু")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/alphabet">{s("Alphabet", "বর্ণমালা")}</Link>
          <Link href="/numbers">{s("Numbers", "সংখ্যা")}</Link>
          <Link className="active" href="/calendar">{s("Calendar", "দিন-ঋতু")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Time, the Bangla way", "বাংলার নিয়মে সময়")}</p>
        <h1>{s("Seven days, twelve months, six seasons.", "সাত দিন, বারো মাস, ছয় ঋতু।")}</h1>
        <p>
          {s(
            "Bangladesh keeps its own beautiful calendar: the year starts in Boishakh, and instead of four seasons there are six. Tap anything to hear it.",
            "বাংলাদেশের আছে নিজের সুন্দর পঞ্জিকা: বছর শুরু হয় বৈশাখে, আর চারটির বদলে ঋতু ছয়টি। যেকোনোটি ছুঁয়ে শোনো।",
          )}
        </p>
      </section>

      <section className="explore-section" aria-labelledby="days-heading">
        <h2 id="days-heading">{s("Days of the week", "সপ্তাহের দিন")}</h2>
        <p className="explore-section-note">
          {s(
            "In Bangladesh the weekend is Friday and Saturday, so the school week starts on Sunday!",
            "বাংলাদেশে ছুটির দিন শুক্র ও শনিবার, তাই স্কুল-সপ্তাহ শুরু হয় রবিবারে!",
          )}
        </p>
        <div className="digit-grid">
          {days.map((day) => (
            <button
              type="button"
              key={day.bn}
              className={`digit-card ${speaking === `day-${day.bn}` ? "is-speaking" : ""}`}
              onClick={() => speak(day.bn, `day-${day.bn}`)}
            >
              <strong lang="bn">{day.bn}</strong>
              <em>{day.transliteration}</em>
              <small>{day.en}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="months-heading">
        <h2 id="months-heading">{s("The twelve Bengali months", "বারো মাস")}</h2>
        <div className="digit-grid">
          {months.map((month, index) => (
            <button
              type="button"
              key={month.bn}
              className={`digit-card ${speaking === `month-${month.bn}` ? "is-speaking" : ""}`}
              onClick={() => speak(month.bn, `month-${month.bn}`)}
            >
              <span className="month-number">{index + 1}</span>
              <strong lang="bn">{month.bn}</strong>
              <em>{month.transliteration}</em>
              <small>{month.gregorian}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="seasons-heading">
        <h2 id="seasons-heading">{s("The six seasons — ছয় ঋতু", "ছয় ঋতু")}</h2>
        <div className="season-grid">
          {seasons.map((season) => (
            <button
              type="button"
              key={season.bn}
              className={`season-card ${speaking === `season-${season.bn}` ? "is-speaking" : ""}`}
              onClick={() => speak(season.bn, `season-${season.bn}`)}
            >
              <span className="season-emoji" aria-hidden="true">{season.emoji}</span>
              <strong lang="bn">{season.bn}</strong>
              <em>
                {season.transliteration} · {season.en}
              </em>
              <span className="season-months" lang="bn">
                {season.months.join(" · ")}
              </span>
              <p>{season.description[language]}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="explore-cta">
        <Link className="primary-button" href="/explore">
          {s("Explore more of Bangladesh →", "বাংলাদেশ আরও ঘুরে দেখো →")}
        </Link>
      </section>
    </main>
  );
}
