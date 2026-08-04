"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { lessons } from "../curriculum";
import { isStrong, newCard, pickQueue, review, type CardState } from "../../lib/srs";

type WordCard = {
  id: string;
  bn: string;
  transliteration: string;
  en: string;
  lessonTitle: string;
  audio: string;
};

const STORAGE_KEY = "bangla-adventures-word-practice";
const SESSION_SIZE = 12;

const allCards: WordCard[] = lessons.flatMap((lesson) =>
  lesson.vocabulary.map((item, index) => ({
    id: `${lesson.id}:${index}`,
    bn: item.bn,
    transliteration: item.transliteration,
    en: item.en,
    lessonTitle: lesson.title,
    audio: `/audio/lesson-${lesson.id}-word-${index + 1}.ogg`,
  })),
);

function loadStates(): Record<string, CardState> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, CardState>) : {};
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default function PracticeHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [states, setStates] = useState<Record<string, CardState> | null>(null);
  const [queue, setQueue] = useState<WordCard[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const [knewCount, setKnewCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Local-first: everything about practice lives in this browser only.
    const loaded = loadStates();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStates(loaded);
    setQueue(pickQueue(allCards, loaded, Date.now(), SESSION_SIZE));
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

  const hear = useCallback((card: WordCard) => {
    // Prefer the bundled per-word clip; fall back to the device voice.
    const element = audioRef.current ?? new Audio();
    audioRef.current = element;
    element.src = card.audio;
    element.play().catch(() => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.bn);
      utterance.lang = "bn-BD";
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const stats = useMemo(() => {
    if (!states) return { seen: 0, strong: 0 };
    const values = Object.values(states);
    return {
      seen: values.length,
      strong: values.filter((state) => isStrong(state)).length,
    };
  }, [states]);

  const current = queue[0];

  function answer(knewIt: boolean) {
    if (!current || !states) return;
    const now = Date.now();
    const prev = states[current.id] ?? newCard(now);
    const next = { ...states, [current.id]: review(prev, knewIt, now) };
    setStates(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage may be unavailable (private mode); the session still works.
    }
    setFlipped(false);
    setDone((count) => count + 1);
    if (knewIt) setKnewCount((count) => count + 1);
    setQueue((cards) => {
      const [first, ...rest] = cards;
      // "Still learning" words return at the end of this session's queue.
      return knewIt || !first ? rest : [...rest, first];
    });
  }

  function newSession() {
    if (!states) return;
    setQueue(pickQueue(allCards, states, Date.now(), SESSION_SIZE));
    setDone(0);
    setKnewCount(0);
    setFlipped(false);
  }

  return (
    <main className="explore-app practice-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Word practice", "শব্দ অনুশীলন")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/phrasebook">{s("Phrasebook", "বাক্যের ঝুলি")}</Link>
          <Link className="active" href="/practice">{s("Practice", "অনুশীলন")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Remember for keeps", "মনে থাকুক চিরদিন")}</p>
        <h1>{s("Old words come back at just the right time.", "পুরনো শব্দ ফিরে আসে ঠিক সময়ে।")}</h1>
        <p>
          {s(
            "All 108 lesson words live here. Words you know rest longer; words you're learning return sooner. Your practice is saved only on this device — like everything a learner does.",
            "পাঠের ১০৮টি শব্দ এখানে আছে। যে শব্দ জানো তা বেশি দিন বিশ্রামে থাকে; যা শিখছ তা তাড়াতাড়ি ফিরে আসে। অনুশীলনের হিসাব কেবল এই ডিভাইসেই থাকে — শিক্ষার্থীর সবকিছুর মতোই।",
          )}
        </p>
        <div className="practice-stats" role="status">
          <span><strong>{stats.seen}</strong>/108 {s("words met", "শব্দ দেখা হয়েছে")}</span>
          <span><strong>{stats.strong}</strong> {s("strong words", "পাকা শব্দ")}</span>
        </div>
      </section>

      <section className="explore-section practice-stage">
        {states && current && (
          <div className="practice-card-wrap">
            <p className="practice-progress">
              {s("This round:", "এই দফায়:")} {done} ✓ · {queue.length} {s("to go", "বাকি")}
            </p>
            <button
              type="button"
              className={`practice-card ${flipped ? "is-flipped" : ""}`}
              onClick={() => setFlipped((value) => !value)}
              aria-label={flipped ? `${current.transliteration}: ${current.en}` : current.bn}
            >
              {!flipped ? (
                <>
                  <strong lang="bn">{current.bn}</strong>
                  <small>{s("Tap to reveal", "ছুঁয়ে উত্তর দেখো")}</small>
                </>
              ) : (
                <>
                  <strong lang="bn">{current.bn}</strong>
                  <em>{current.transliteration}</em>
                  <span>{current.en}</span>
                  <small>{s("From:", "যে পাঠ থেকে:")} {current.lessonTitle}</small>
                </>
              )}
            </button>
            <div className="practice-actions">
              <button type="button" className="outline-button" onClick={() => hear(current)}>
                ♪ {s("Hear it", "শোনো")}
              </button>
              {flipped && (
                <>
                  <button type="button" className="practice-learning" onClick={() => answer(false)}>
                    {s("Still learning", "এখনও শিখছি")}
                  </button>
                  <button type="button" className="practice-knew" onClick={() => answer(true)}>
                    {s("I knew it! ⭐", "জানতাম! ⭐")}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {states && !current && (
          <div className="practice-done">
            <span aria-hidden="true">🎉</span>
            <h2>{s("Round finished!", "দফা শেষ!")}</h2>
            <p>
              {done > 0
                ? s(`You practised ${done} words and knew ${knewCount}.`, `${done}টি শব্দ অনুশীলন করেছ, ${knewCount}টি জানতে।`)
                : s("No words are waiting right now — come back tomorrow, or start a fresh round.", "এখন কোনো শব্দ অপেক্ষায় নেই — কাল এসো, বা নতুন দফা শুরু করো।")}
            </p>
            <button type="button" className="primary-button" onClick={newSession}>
              {s("Start a new round →", "নতুন দফা শুরু →")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
