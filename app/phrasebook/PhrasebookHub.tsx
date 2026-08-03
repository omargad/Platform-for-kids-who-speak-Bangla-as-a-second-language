"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { phraseCategories } from "../phrasebook-content";

export default function PhrasebookHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [canSpeak, setCanSpeak] = useState(true);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanSpeak(false);
      return;
    }
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
    <main className="explore-app phrasebook-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("First phrases", "প্রথম কথাগুলো")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/explore">{s("Explore", "ঘুরে দেখো")}</Link>
          <Link href="/alphabet">{s("Alphabet", "বর্ণমালা")}</Link>
          <Link className="active" href="/phrasebook">{s("Phrasebook", "বাক্যের ঝুলি")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Little phrases, big smiles", "ছোট কথা, বড় হাসি")}</p>
        <h1>{s("Say it in Bangla today.", "আজই বাংলায় বলো।")}</h1>
        <p>
          {s(
            "Forty-plus everyday phrases for home, play and the dinner table. Tap any card to hear it aloud, read it in Bangla letters, or say it from the sounds. Try one phrase with your family tonight!",
            "বাড়ি, খেলা আর খাবার টেবিলের জন্য চল্লিশের বেশি দৈনন্দিন কথা। কার্ড ছুঁয়ে শোনো, বাংলা হরফে পড়ো, বা ধ্বনি দেখে বলো। আজ রাতেই পরিবারের সঙ্গে একটি কথা বলে দেখো!",
          )}
        </p>
        {!canSpeak && (
          <p className="alphabet-nosound" role="note">
            {s(
              "This device has no speech voices; the phrases still show their sounds in writing.",
              "এই ডিভাইসে কথা বলার ভয়েস নেই; কথাগুলোর ধ্বনি লেখায় দেখানো আছে।",
            )}
          </p>
        )}
      </section>

      {phraseCategories.map((category) => (
        <section className="explore-section" key={category.id} aria-label={category.title[language]}>
          <h2>
            <span aria-hidden="true">{category.icon}</span> {category.title[language]}
          </h2>
          <div className="phrase-grid">
            {category.phrases.map((phrase) => {
              const key = `${category.id}-${phrase.bn}`;
              return (
                <button
                  type="button"
                  key={key}
                  className={`phrase-card ${speaking === key ? "is-speaking" : ""}`}
                  onClick={() => speak(phrase.bn, key)}
                  aria-label={`${phrase.transliteration} — ${phrase.en}`}
                >
                  <strong lang="bn">{phrase.bn}</strong>
                  <em>{phrase.transliteration}</em>
                  <small>{phrase.en}</small>
                  {phrase.note && <span className="letter-note">{phrase.note[language]}</span>}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="explore-cta">
        <Link className="primary-button" href="/">
          {s("Use these phrases in the lessons →", "পাঠে এই কথাগুলো ব্যবহার করো →")}
        </Link>
      </section>
    </main>
  );
}
