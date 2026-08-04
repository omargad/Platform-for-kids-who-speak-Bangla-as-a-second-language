"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { conjuncts, consonants, digits, karForms, vowels, type Letter } from "../alphabet-content";

export default function AlphabetHub() {
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

  function LetterCard({ letter, group }: { letter: Letter; group: string }) {
    const key = `${group}-${letter.glyph}`;
    return (
      <button
        type="button"
        className={`letter-card ${speaking === key ? "is-speaking" : ""}`}
        onClick={() => speak(`${letter.glyph}। ${letter.example.bn}।`, key)}
        aria-label={`${letter.name}. ${letter.example.transliteration}, ${letter.example.en}`}
      >
        <span className="letter-glyph" lang="bn">{letter.glyph}</span>
        <span className="letter-name">{letter.name}</span>
        <span className="letter-sound">{letter.sound}</span>
        <span className="letter-example">
          <strong lang="bn">{letter.example.bn}</strong>
          <em>{letter.example.transliteration}</em>
          <small>{letter.example.en}</small>
        </span>
        {letter.note && <span className="letter-note">{letter.note[language]}</span>}
      </button>
    );
  }

  return (
    <main className="explore-app alphabet-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Bornomala — the alphabet", "বর্ণমালা")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{s("Learner site", "শেখার সাইট")}</Link>
          <Link href="/explore">{s("Explore", "ঘুরে দেখো")}</Link>
          <Link className="active" href="/alphabet">{s("Alphabet", "বর্ণমালা")}</Link>
          <Link href="/phrasebook">{s("Phrasebook", "বাক্যের ঝুলি")}</Link>
          <Link href="/numbers">{s("Numbers", "সংখ্যা")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("The Bangla alphabet", "বাংলা বর্ণমালা")}</p>
        <h1>{s("Fifty friendly letters, one beautiful script.", "পঞ্চাশটি বন্ধু-বর্ণ, একটি সুন্দর লিপি।")}</h1>
        <p>
          {s(
            "Tap any letter to hear it with its word, just like a classic Bangla primer: ô is for ojogor! Vowels first, then consonants, then how vowels ride along with consonants, and the Bangla numbers.",
            "যেকোনো বর্ণ ছুঁয়ে শব্দসহ শোনো, ঠিক পুরনো বর্ণ-পরিচয়ের মতো: অ-তে অজগর! আগে স্বরবর্ণ, তারপর ব্যঞ্জনবর্ণ, তারপর কার-চিহ্ন আর বাংলা সংখ্যা।",
          )}
        </p>
        {!canSpeak && (
          <p className="alphabet-nosound" role="note">
            {s(
              "This device has no speech voices; the letters still show sounds in writing.",
              "এই ডিভাইসে কথা বলার ভয়েস নেই; বর্ণগুলোর ধ্বনি লেখায় দেখানো আছে।",
            )}
          </p>
        )}
      </section>

      <section className="explore-section" aria-labelledby="vowels-heading">
        <h2 id="vowels-heading">{s("Vowels · স্বরবর্ণ", "স্বরবর্ণ")} <span className="alphabet-count">11</span></h2>
        <div className="letter-grid">
          {vowels.map((letter) => (
            <LetterCard key={letter.glyph} letter={letter} group="v" />
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="consonants-heading">
        <h2 id="consonants-heading">{s("Consonants · ব্যঞ্জনবর্ণ", "ব্যঞ্জনবর্ণ")} <span className="alphabet-count">39</span></h2>
        <div className="letter-grid">
          {consonants.map((letter) => (
            <LetterCard key={letter.glyph} letter={letter} group="c" />
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="kar-heading">
        <h2 id="kar-heading">{s("Vowel signs on ক · কার", "কার-চিহ্ন (ক দিয়ে)")}</h2>
        <p className="explore-section-note">
          {s(
            "When a vowel follows a consonant it becomes a small sign. Watch what each vowel does to ক:",
            "ব্যঞ্জনের পরে স্বর এলে সেটি ছোট চিহ্ন হয়ে যায়। দেখো প্রতিটি স্বর ক-কে কেমন বদলায়:",
          )}
        </p>
        <div className="kar-grid">
          {karForms.map((form) => (
            <button
              type="button"
              className={`kar-card ${speaking === `k-${form.combined}` ? "is-speaking" : ""}`}
              key={form.combined}
              onClick={() => speak(`${form.combined}`, `k-${form.combined}`)}
            >
              <span className="kar-formula" lang="bn">ক + {form.vowel} =</span>
              <span className="kar-result" lang="bn">{form.combined}</span>
              <small>{form.sound}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="conjuncts-heading">
        <h2 id="conjuncts-heading">{s("Joined letters · যুক্তবর্ণ", "যুক্তবর্ণ")} <span className="alphabet-count">16</span></h2>
        <p className="explore-section-note">
          {s(
            "Sometimes two consonants hold hands and become one new shape — the hidden helper is a tiny sign called hasanta (্). These sixteen appear in words you already know:",
            "কখনো দুটি ব্যঞ্জন হাত ধরাধরি করে একটাই নতুন রূপ নেয় — লুকোনো সাহায্যকারী হলো হসন্ত (্)। চেনা শব্দে এই ষোলোটি পাবে:",
          )}
        </p>
        <div className="letter-grid">
          {conjuncts.map((conjunct) => {
            const key = `j-${conjunct.glyph}`;
            return (
              <button
                type="button"
                key={conjunct.glyph}
                className={`letter-card ${speaking === key ? "is-speaking" : ""}`}
                onClick={() => speak(`${conjunct.example.bn}`, key)}
                aria-label={`${conjunct.parts[0]} plus ${conjunct.parts[1]} makes ${conjunct.transliteration}. ${conjunct.example.transliteration}, ${conjunct.example.en}`}
              >
                <span className="conjunct-formula" lang="bn">
                  {conjunct.parts[0]} + {conjunct.parts[1]} =
                </span>
                <span className="letter-glyph" lang="bn">{conjunct.glyph}</span>
                <span className="letter-sound">{conjunct.transliteration}</span>
                <span className="letter-example">
                  <strong lang="bn">{conjunct.example.bn}</strong>
                  <em>{conjunct.example.transliteration}</em>
                  <small>{conjunct.example.en}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="digits-heading">
        <h2 id="digits-heading">{s("Numbers · সংখ্যা", "সংখ্যা")}</h2>
        <div className="digit-grid">
          {digits.map((digit) => (
            <button
              type="button"
              className={`digit-card ${speaking === `d-${digit.glyph}` ? "is-speaking" : ""}`}
              key={digit.glyph}
              onClick={() => speak(digit.word, `d-${digit.glyph}`)}
            >
              <span className="digit-glyph" lang="bn">{digit.glyph}</span>
              <strong lang="bn">{digit.word}</strong>
              <em>{digit.transliteration}</em>
              <small>{digit.en}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="explore-cta">
        <Link className="primary-button" href="/">
          {s("Practise these letters in the lessons →", "পাঠে এই বর্ণগুলো অনুশীলন করো →")}
        </Link>
      </section>
    </main>
  );
}
