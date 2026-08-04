"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { grammarSections } from "../grammar-content";

export default function GrammarHub() {
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
    <main className="explore-app grammar-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("How Bangla works", "বাংলার নিয়ম")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/alphabet">{s("Alphabet", "বর্ণমালা")}</Link>
          <Link href="/phrasebook">{s("Phrasebook", "বাক্যের ঝুলি")}</Link>
          <Link className="active" href="/grammar">{s("Grammar", "ব্যাকরণ")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("A friendly grammar guide", "সহজ ব্যাকরণ গাইড")}</p>
        <h1>{s("Five little rules unlock a lot of Bangla.", "পাঁচটি ছোট নিয়মে অনেকখানি বাংলা।")}</h1>
        <p>
          {s(
            "This is a look-it-up page, not a test. When a lesson makes you wonder 'why is the verb at the end?' — the answer lives here. Tap any example to hear it.",
            "এটি খুঁজে-দেখার পাতা, পরীক্ষা নয়। পাঠে যখন মনে হবে ‘ক্রিয়া শেষে কেন?’ — উত্তর এখানেই। যেকোনো উদাহরণ ছুঁয়ে শোনো।",
          )}
        </p>
      </section>

      {grammarSections.map((section) => (
        <section className="explore-section" key={section.id} aria-label={section.title[language]}>
          <h2>
            <span aria-hidden="true">{section.icon}</span> {section.title[language]}
          </h2>
          <p className="explore-section-note grammar-intro">{section.intro[language]}</p>
          <div className="grammar-table" role="table" aria-label={section.title[language]}>
            <div className="grammar-head" role="row">
              <span role="columnheader">{s("Bangla", "বাংলা")}</span>
              <span role="columnheader">{s("Say it", "উচ্চারণ")}</span>
              <span role="columnheader">{s("Meaning", "অর্থ")}</span>
              <span role="columnheader">{s("Example (tap to hear)", "উদাহরণ (ছুঁয়ে শোনো)")}</span>
            </div>
            {section.items.map((item) => {
              const key = `${section.id}-${item.head}`;
              return (
                <div className="grammar-row" role="row" key={key}>
                  <strong role="cell" lang="bn">{item.head}</strong>
                  <em role="cell">{item.transliteration}</em>
                  <span role="cell">{item.meaning[language]}</span>
                  <button
                    type="button"
                    role="cell"
                    className={`grammar-example ${speaking === key ? "is-speaking" : ""}`}
                    onClick={() => speak(item.example.bn, key)}
                  >
                    <span lang="bn">{item.example.bn}</span>
                    <small>
                      {item.example.transliteration} — {item.example.en}
                    </small>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="explore-cta">
        <Link className="primary-button" href="/phrasebook">
          {s("Now use the rules in real phrases →", "এবার সত্যিকারের কথায় নিয়মগুলো কাজে লাগাও →")}
        </Link>
      </section>
    </main>
  );
}
