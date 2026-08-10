"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { topics, topicThemes, topicsByTheme } from "../topics-content";
import type { Topic } from "../topics-content";
import { bookById } from "../library-content";

const DONE_KEY = "bangla-adventures-topics-done";

function loadDone(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(DONE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default function TopicsHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState<Record<string, number>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted quiz results after mount so server and first client render match
    setDone(loadDone());
  }, []);

  const active: Topic | null = useMemo(
    () => topics.find((topic) => topic.id === activeId) ?? null,
    [activeId],
  );

  const openTopic = (id: string) => {
    setActiveId(id);
    setAnswers({});
    setChecked(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const closeTopic = () => {
    setActiveId(null);
    setAnswers({});
    setChecked(false);
  };

  const score = active
    ? active.quiz.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0,
      )
    : 0;

  const submitQuiz = () => {
    if (!active) return;
    setChecked(true);
    const next = { ...done, [active.id]: score };
    setDone(next);
    try {
      window.localStorage.setItem(DONE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing — the score screen still shows.
    }
  };

  if (active) {
    const allAnswered = active.quiz.every((_, index) => answers[index] !== undefined);
    return (
      <main className="explore-app topics-app" lang={language}>
        <header className="explore-header">
          <Link className="adult-brand" href="/">
            <span>বা</span>
            <span>
              <strong>Bangla Adventures</strong>
              <small>{s("Classroom topics", "শ্রেণিকক্ষের বিষয়")}</small>
            </span>
          </Link>
          <nav aria-label="Sections">
            <button type="button" className="topics-back" onClick={closeTopic}>
              ← {s("All topics", "সব বিষয়")}
            </button>
          </nav>
          <button type="button" className="explore-lang" onClick={toggleLanguage}>
            {s("বাংলায় দেখুন", "View in English")}
          </button>
        </header>

        <article className="topic-reader">
          <header className="topic-reader-head">
            <span className="topic-emoji" aria-hidden="true">{active.emoji}</span>
            <h1>{active.title[language]}</h1>
            <p>{active.tagline[language]}</p>
            <small>
              {s(`About ${active.minutes} minutes of reading`, `পড়তে লাগবে প্রায় ${active.minutes} মিনিট`)}
            </small>
          </header>

          {active.sections.map((section) => (
            <section className="topic-section" key={section.heading.en}>
              <h2>{section.heading[language]}</h2>
              <p>{section.body[language]}</p>
            </section>
          ))}

          <section className="topic-facts" aria-label={s("Fun facts", "মজার তথ্য")}>
            <h2>✨ {s("Did you know?", "জানো কি?")}</h2>
            <ul>
              {active.funFacts.map((fact) => (
                <li key={fact.en}>{fact[language]}</li>
              ))}
            </ul>
          </section>

          <section className="topic-sources" aria-label={s("Trusted source", "নির্ভরযোগ্য উৎস")}>
            <h2>📖 {s("From the government textbooks", "সরকারি পাঠ্যবই থেকে")}</h2>
            <p className="topic-sources-note">
              {s(
                "This reading was written for heritage learners, but every fact traces back to Bangladesh's official NCTB textbooks:",
                "এই লেখাটি প্রবাসী শিক্ষার্থীদের জন্য লেখা, তবে প্রতিটি তথ্যের উৎস বাংলাদেশের সরকারি এনসিটিবি পাঠ্যবই:",
              )}
            </p>
            <ul>
              {active.sources.map((source) => {
                const book = bookById(source.bookId);
                if (!book) return null;
                return (
                  <li key={source.bookId}>
                    <strong lang="bn">{book.titleBn}</strong>
                    <span> — {language === "bn" ? book.classes.bn : `${book.titleEn}, ${book.classes.en}`}</span>
                    <em>{source.note[language]}</em>
                  </li>
                );
              })}
            </ul>
            <Link href="/library">{s("Open the textbook library →", "পাঠ্যবই লাইব্রেরি খোলো →")}</Link>
          </section>

          <section className="topic-quiz" aria-label={s("Quiz", "কুইজ")}>
            <h2>📝 {s("Show what you know", "কতটা জানলে দেখাও")}</h2>
            {active.quiz.map((question, questionIndex) => (
              <fieldset className="topic-question" key={question.question.en}>
                <legend>
                  {questionIndex + 1}. {question.question[language]}
                </legend>
                <div className="topic-options">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex;
                    const isRight = checked && optionIndex === question.answer;
                    const isWrong = checked && selected && optionIndex !== question.answer;
                    return (
                      <button
                        type="button"
                        key={option.en}
                        className={`topic-option ${selected ? "is-selected" : ""} ${isRight ? "is-right" : ""} ${isWrong ? "is-wrong" : ""}`}
                        disabled={checked}
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))
                        }
                      >
                        {option[language]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {checked ? (
              <div className="topic-result" role="status">
                <strong>
                  {s(
                    `You got ${score} out of ${active.quiz.length}!`,
                    `তুমি ${active.quiz.length}টির মধ্যে ${score}টি পেরেছ!`,
                  )}
                </strong>
                <p>
                  {s(
                    "Show this screen to your teacher or family — or read the topic again and try for a full score.",
                    "এই পর্দাটি শিক্ষক বা পরিবারকে দেখাও — অথবা আবার পড়ে পুরো নম্বরের চেষ্টা করো।",
                  )}
                </p>
                <div className="topic-result-actions">
                  <button type="button" onClick={() => { setAnswers({}); setChecked(false); }}>
                    {s("Try again", "আবার চেষ্টা")}
                  </button>
                  <button type="button" onClick={closeTopic}>
                    {s("Pick another topic", "অন্য বিষয় বেছে নাও")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="primary-button topic-submit"
                disabled={!allAnswered}
                onClick={submitQuiz}
              >
                {allAnswered
                  ? s("Check my answers", "উত্তর মিলিয়ে দেখো")
                  : s("Answer every question first", "আগে সব প্রশ্নের উত্তর দাও")}
              </button>
            )}
          </section>
        </article>
      </main>
    );
  }

  return (
    <main className="explore-app topics-app" lang={language}>
      <header className="explore-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Classroom topics", "শ্রেণিকক্ষের বিষয়")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link href="/learn">{s("All activities", "সব কার্যক্রম")}</Link>
          <Link className="active" href="/topics">{s("Topics", "বিষয়")}</Link>
          <Link href="/library">{s("Textbook library", "পাঠ্যবই লাইব্রেরি")}</Link>
        </nav>
        <button type="button" className="explore-lang" onClick={toggleLanguage}>
          {s("বাংলায় দেখুন", "View in English")}
        </button>
      </header>

      <section className="explore-hero">
        <p className="adult-eyebrow">{s("Culture · history · literature", "সংস্কৃতি · ইতিহাস · সাহিত্য")}</p>
        <h1>{s("Got a topic from Bangla school? Start here.", "বাংলা স্কুল থেকে বিষয় পেয়েছ? শুরু এখানেই।")}</h1>
        <p>
          {s(
            "Read a short, kid-friendly page, check the government textbook it comes from, then take a three-question quiz you can show your teacher. Everything works in English and Bangla.",
            "ছোট, সহজ একটি পাতা পড়ো, কোন সরকারি পাঠ্যবই থেকে এসেছে দেখো, তারপর তিন প্রশ্নের কুইজ দিয়ে শিক্ষককে দেখাও। সবকিছু ইংরেজি ও বাংলায় চলে।",
          )}
        </p>
      </section>

      {topicThemes.map((theme) => (
        <section className="explore-section" key={theme.id} aria-label={theme.title[language]}>
          <h2>
            <span aria-hidden="true">{theme.icon}</span> {theme.title[language]}
          </h2>
          <p className="explore-section-note">{theme.note[language]}</p>
          <div className="topics-grid">
            {topicsByTheme(theme.id).map((topic) => {
              const finished = done[topic.id];
              return (
                <button
                  type="button"
                  className="topic-card"
                  key={topic.id}
                  onClick={() => openTopic(topic.id)}
                >
                  <span className="topic-emoji" aria-hidden="true">{topic.emoji}</span>
                  <strong>{topic.title[language]}</strong>
                  <p>{topic.tagline[language]}</p>
                  <small>
                    {finished !== undefined
                      ? s(`Quiz done — best ${finished}/${topic.quiz.length} ⭐`, `কুইজ শেষ — সেরা ${finished}/${topic.quiz.length} ⭐`)
                      : s(`${topic.minutes} min read + quiz`, `${topic.minutes} মিনিট পড়া + কুইজ`)}
                  </small>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="topics-teacher-note">
        <span aria-hidden="true">🍎</span>
        <p>
          {s(
            "Teachers: every topic names the NCTB textbook it draws from, so you can match topics to your term plan. Quizzes run on the child's device and store nothing on our servers.",
            "শিক্ষকদের জন্য: প্রতিটি বিষয়ে উৎস এনসিটিবি পাঠ্যবইয়ের নাম দেওয়া আছে, তাই টার্ম-পরিকল্পনার সঙ্গে মেলানো সহজ। কুইজ শিশুর ডিভাইসেই চলে, আমাদের সার্ভারে কিছুই জমা হয় না।",
          )}
        </p>
      </section>
    </main>
  );
}
