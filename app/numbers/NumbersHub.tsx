"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { countables, oneToTwenty, tens, type NumberEntry } from "../numbers-content";

type Question = {
  countable: (typeof countables)[number];
  answer: NumberEntry;
  options: NumberEntry[];
};

function randomInt(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive);
}

function makeQuestion(): Question {
  const pool = oneToTwenty.slice(0, 10); // count 1–10 objects
  const answer = pool[randomInt(pool.length)];
  const distractors = new Set<NumberEntry>();
  while (distractors.size < 2) {
    const candidate = pool[randomInt(pool.length)];
    if (candidate.value !== answer.value) distractors.add(candidate);
  }
  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  return { countable: countables[randomInt(countables.length)], answer, options };
}

export default function NumbersHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [stars, setStars] = useState(0);

  useEffect(() => {
    // Questions are random, so create the first one after mount to keep
    // server and client renders identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestion((current) => current ?? makeQuestion());
  }, []);

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

  function choose(option: NumberEntry) {
    if (!question || picked !== null) return;
    setPicked(option.value);
    speak(option.word, `game-${option.value}`);
    if (option.value === question.answer.value) {
      setStars((current) => current + 1);
    }
  }

  function nextQuestion() {
    setPicked(null);
    setQuestion(makeQuestion());
  }

  function NumberCard({ entry }: { entry: NumberEntry }) {
    const key = `n-${entry.value}`;
    return (
      <button
        type="button"
        className={`digit-card ${speaking === key ? "is-speaking" : ""}`}
        onClick={() => speak(entry.word, key)}
        aria-label={`${entry.value}: ${entry.transliteration}`}
      >
        <span className="digit-glyph" lang="bn">{entry.glyph}</span>
        <strong lang="bn">{entry.word}</strong>
        <em>{entry.transliteration}</em>
        <small>{entry.value}</small>
      </button>
    );
  }

  return (
    <main className="explore-app numbers-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Numbers & counting", "সংখ্যা ও গোনা")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/alphabet">{s("Alphabet", "বর্ণমালা")}</Link>
          <Link href="/phrasebook">{s("Phrasebook", "বাক্যের ঝুলি")}</Link>
          <Link className="active" href="/numbers">{s("Numbers", "সংখ্যা")}</Link>
          <Link href="/calendar">{s("Calendar", "দিন-ঋতু")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Count in Bangla", "বাংলায় গোনো")}</p>
        <h1>{s("From êk to êksho, one tap at a time.", "এক থেকে একশো, এক ছোঁয়ায়।")}</h1>
        <p>
          {s(
            "Tap any number to hear it. Learn one to twenty, then the tens up to one hundred, then play the counting game to win stars.",
            "যেকোনো সংখ্যা ছুঁয়ে শোনো। এক থেকে বিশ শেখো, তারপর একশো পর্যন্ত দশের ঘর, তারপর গোনার খেলায় তারা জেতো।",
          )}
        </p>
      </section>

      <section className="explore-section" aria-labelledby="one-twenty-heading">
        <h2 id="one-twenty-heading">{s("One to twenty", "এক থেকে বিশ")}</h2>
        <div className="digit-grid">
          {oneToTwenty.map((entry) => (
            <NumberCard key={entry.value} entry={entry} />
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="tens-heading">
        <h2 id="tens-heading">{s("The tens, to one hundred", "দশের ঘর, একশো পর্যন্ত")}</h2>
        <div className="digit-grid">
          {tens.map((entry) => (
            <NumberCard key={entry.value} entry={entry} />
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="game-heading">
        <h2 id="game-heading">{s("The counting game — কয়টা?", "গোনার খেলা — কয়টা?")}</h2>
        <p className="explore-section-note">
          {s("Count the picture, then tap the right Bangla number.", "ছবিটা গুনে সঠিক বাংলা সংখ্যাটি ছোঁও।")}
        </p>
        {question && (
          <div className="counting-game">
            <div className="counting-stage" aria-label={`${question.answer.value} ${question.countable.en}`}>
              <div className="counting-objects" aria-hidden="true">
                {Array.from({ length: question.answer.value }, (_, index) => (
                  <span key={index}>{question.countable.emoji}</span>
                ))}
              </div>
              <p className="counting-question" lang="bn">
                কয়টা {question.countable.bn}?
              </p>
            </div>
            <div className="counting-options">
              {question.options.map((option) => {
                const isPicked = picked === option.value;
                const isAnswer = option.value === question.answer.value;
                const state =
                  picked === null ? "" : isAnswer ? "correct" : isPicked ? "wrong" : "dim";
                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`counting-option ${state}`}
                    onClick={() => choose(option)}
                    disabled={picked !== null}
                  >
                    <span lang="bn">{option.glyph}</span>
                    <strong lang="bn">{option.word}</strong>
                    <em>{option.transliteration}</em>
                  </button>
                );
              })}
            </div>
            <div className="counting-footer">
              <span className="counting-stars" role="status">
                {s("Stars", "তারা")}: {"⭐".repeat(Math.min(stars, 10))}
                {stars > 10 ? ` ×${stars}` : stars === 0 ? " —" : ""}
              </span>
              {picked !== null && (
                <>
                  <p className="counting-result" role="status">
                    {picked === question.answer.value
                      ? s("Correct! ", "ঠিক! ") + `${question.answer.word} (${question.answer.transliteration})`
                      : s("Almost! It was ", "প্রায় হয়েছিল! সঠিক উত্তর ") + `${question.answer.word} (${question.answer.transliteration})`}
                  </p>
                  <button type="button" className="primary-button" onClick={nextQuestion}>
                    {s("Next one →", "পরেরটা →")}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="explore-cta">
        <Link className="primary-button" href="/">
          {s("Count along in the lessons →", "পাঠে গুনে গুনে এগোও →")}
        </Link>
      </section>
    </main>
  );
}
