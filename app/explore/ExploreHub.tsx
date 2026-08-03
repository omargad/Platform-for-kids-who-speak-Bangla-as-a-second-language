"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import {
  cultureCards,
  festivals,
  landmarks,
  quickFacts,
  regions,
  timeline,
  type Bilingual,
  type CultureCard,
} from "../explore-content";

const ui = {
  en: {
    eyebrow: "Explore Bangladesh",
    title: "Meet the country behind the language.",
    intro:
      "Wander through Bangladesh's story, places and celebrations. Everything here is made for children learning about their heritage from far away — read it in English or Bangla.",
    facts: "Quick facts",
    history: "A short history",
    historyNote: "Tap along the river of time.",
    regions: "Divisions and places",
    landmarks: "Wonders to visit",
    festivals: "Festivals and celebrations",
    culture: "Arts, music and food",
    heritageBadge: "Heritage",
    backToLessons: "Back to lessons",
    lessonsCta: "Ready to learn the words? Start a lesson",
    langToggle: "বাংলায় দেখুন",
    home: "Learner site",
    explore: "Explore",
    safety: "Safety & access",
  },
  bn: {
    eyebrow: "বাংলাদেশ ঘুরে দেখো",
    title: "ভাষার পেছনের দেশটিকে চেনো।",
    intro:
      "বাংলাদেশের গল্প, জায়গা আর উৎসব ঘুরে দেখো। দূরে থেকে নিজের শিকড় সম্পর্কে শেখা শিশুদের জন্য এটি তৈরি — ইংরেজি বা বাংলায় পড়ো।",
    facts: "সংক্ষিপ্ত তথ্য",
    history: "সংক্ষিপ্ত ইতিহাস",
    historyNote: "সময়ের নদী ধরে এগোও।",
    regions: "বিভাগ ও জায়গা",
    landmarks: "দেখার মতো বিস্ময়",
    festivals: "উৎসব ও আয়োজন",
    culture: "শিল্প, গান ও খাবার",
    heritageBadge: "ঐতিহ্য",
    backToLessons: "পাঠে ফিরে যাও",
    lessonsCta: "শব্দগুলো শিখতে তৈরি? একটি পাঠ শুরু করো",
    langToggle: "View in English",
    home: "শেখার সাইট",
    explore: "ঘুরে দেখো",
    safety: "নিরাপত্তা ও প্রবেশ",
  },
} as const;

export default function ExploreHub() {
  const [language, toggleLanguage] = useLanguage();

  const t = ui[language];
  const say = (value: Bilingual) => value[language];

  function renderCards(items: CultureCard[]) {
    return (
      <div className="explore-card-grid">
        {items.map((card) => (
          <article className="explore-card" key={card.title.en}>
            <span className="explore-card-icon" aria-hidden="true">
              {card.icon}
            </span>
            <h3>{say(card.title)}</h3>
            <p>{say(card.body)}</p>
            {card.heritage && (
              <span className="explore-heritage">{say(card.heritage)}</span>
            )}
          </article>
        ))}
      </div>
    );
  }

  return (
    <main className={`explore-app${language === "bn" ? " lang-bn" : ""}`} lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{t.explore}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/">{t.home}</Link>
          <Link className="active" href="/explore">
            {t.explore}
          </Link>
          <Link href="/alphabet">{language === "bn" ? "বর্ণমালা" : "Alphabet"}</Link>
          <Link href="/safety">{t.safety}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {t.langToggle}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

      <section className="explore-section" aria-labelledby="facts-heading">
        <h2 id="facts-heading">{t.facts}</h2>
        <div className="explore-facts">
          {quickFacts.map((fact) => (
            <div className="explore-fact" key={fact.label.en}>
              <span aria-hidden="true">{fact.icon}</span>
              <div>
                <small>{say(fact.label)}</small>
                <strong>{say(fact.value)}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="history-heading">
        <h2 id="history-heading">{t.history}</h2>
        <p className="explore-section-note">{t.historyNote}</p>
        <ol className="explore-timeline">
          {timeline.map((event) => (
            <li key={event.year} className={`explore-event tone-${event.tone}`}>
              <span className="explore-year">{event.year}</span>
              <div>
                <h3>{say(event.title)}</h3>
                <p>{say(event.body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="explore-section" aria-labelledby="regions-heading">
        <h2 id="regions-heading">{t.regions}</h2>
        <div className="explore-region-grid">
          {regions.map((region) => (
            <article className="explore-region" key={region.name.en}>
              <h3>{say(region.name)}</h3>
              <p>{say(region.known)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section" aria-labelledby="landmarks-heading">
        <h2 id="landmarks-heading">{t.landmarks}</h2>
        {renderCards(landmarks)}
      </section>

      <section className="explore-section" aria-labelledby="festivals-heading">
        <h2 id="festivals-heading">{t.festivals}</h2>
        {renderCards(festivals)}
      </section>

      <section className="explore-section" aria-labelledby="culture-heading">
        <h2 id="culture-heading">{t.culture}</h2>
        {renderCards(cultureCards)}
      </section>

      <section className="explore-cta">
        <Link className="primary-button" href="/">
          {t.lessonsCta} →
        </Link>
      </section>
    </main>
  );
}
