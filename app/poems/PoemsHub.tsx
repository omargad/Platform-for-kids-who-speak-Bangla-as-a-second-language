"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { poems, poemsPagePolicy } from "../poems-content";

export default function PoemsHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current = voices.find((voice) => voice.lang?.toLowerCase().startsWith("bn")) ?? null;
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
    utterance.rate = 0.7;
    utterance.onstart = () => setSpeaking(key);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <main className="explore-app poems-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Poetry corner", "কবিতার কোণ")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/topics">{s("Topics", "বিষয়")}</Link>
          <Link href="/stories">{s("Stories", "গল্প")}</Link>
          <Link className="active" href="/poems">{s("Poems", "কবিতা")}</Link>
          <Link href="/library">{s("Library", "লাইব্রেরি")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Literature, exactly as written", "সাহিত্য, অবিকল যেমন লেখা")}</p>
        <h1>{s("Poems every Bengali child grows up with.", "যে কবিতা নিয়ে প্রতিটি বাঙালি শিশু বড় হয়।")}</h1>
        <p>{poemsPagePolicy[language]}</p>
      </section>

      <section className="explore-section" aria-label={s("Poems", "কবিতা")}>
        <div className="poems-grid">
          {poems.map((poem) => (
            <article className="poem-card" key={poem.id}>
              <header>
                <h2 lang="bn">{poem.titleBn}</h2>
                <p className="poem-author">
                  {language === "bn" ? poem.author.bn : poem.author.en}
                  <span> · {poem.author.years}</span>
                </p>
              </header>
              <blockquote lang="bn">
                {poem.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {poem.excerpt && <cite>{s("(opening lines)", "(শুরুর পঙ্‌ক্তি)")}</cite>}
              </blockquote>
              <button
                type="button"
                className={`sound-button poem-listen ${speaking === poem.id ? "is-speaking" : ""}`}
                onClick={() => speak(poem.lines.join(" "), poem.id)}
              >
                <span aria-hidden="true">♪</span> {s("Hear it in Bangla", "বাংলায় শুনি")}
              </button>
              <p className="poem-gloss">{poem.gloss[language]}</p>
              <p className="poem-where">
                <em>{poem.whereFound[language]}</em>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="topics-teacher-note">
        <span aria-hidden="true">📚</span>
        <p>
          {s(
            "Want more? The full poems — and many more by Tagore, Nazrul, Jasimuddin and others — live in the official NCTB Bangla readers, free to download.",
            "আরও চাই? পুরো কবিতাগুলো — আর রবীন্দ্রনাথ, নজরুল, জসীমউদ্দীনসহ আরও অনেকের কবিতা — আছে সরকারি এনসিটিবি বাংলা পাঠ্যবইয়ে, বিনামূল্যে নামানো যায়।",
          )}{" "}
          <Link href="/library">{s("Open the textbook library →", "পাঠ্যবই লাইব্রেরি →")}</Link>
        </p>
      </section>
    </main>
  );
}
