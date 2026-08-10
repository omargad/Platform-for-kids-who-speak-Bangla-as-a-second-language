"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";

const STORAGE_KEY = "bangla-adventures-classroom";

type Stored = { token: string; name: string; className: string };

type FeedActivity = {
  id: string;
  title: string;
  instructions: string;
  topicId: string | null;
  status: string;
  questions: Array<{ prompt: string; options: string[] }>;
  submission: { score: number; total: number; submittedAt: string } | null;
};

type Feed = {
  student: { id: string; displayName: string };
  class: { id: string; name: string; teacherName: string };
  announcements: Array<{ id: string; body: string; createdAt: string }>;
  activities: FeedActivity[];
};

type Review = Array<{ prompt: string; picked: number; answer: number; correct: boolean }>;

function loadStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    return parsed && typeof parsed.token === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export default function ClassroomHub() {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  const [stored, setStored] = useState<Stored | null>(null);
  const [ready, setReady] = useState(false);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");

  const [activeActivity, setActiveActivity] = useState<FeedActivity | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; review: Review } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the stored classroom pass after mount so server and first client render match
    setStored(loadStored());
    setReady(true);
  }, []);

  const loadFeed = useCallback(async (token: string) => {
    const response = await fetch("/api/classroom/feed", { headers: { "x-student-token": token } });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setFeed(data as Feed);
      setError("");
    } else if (response.status === 401) {
      window.localStorage.removeItem(STORAGE_KEY);
      setStored(null);
      setFeed(null);
    } else {
      setError(data.error ?? "Could not load your classroom.");
    }
  }, []);

  useEffect(() => {
    // Fetch the feed when a stored classroom pass appears; state updates land
    // after the network round-trip, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) void loadFeed(stored.token);
  }, [stored, loadFeed]);

  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/classroom/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name: joinName }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.ok) {
      const next: Stored = { token: data.token, name: data.student.displayName, className: data.class.name };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStored(next);
    } else {
      setError(data.error ?? "Could not join the class.");
    }
  };

  const leave = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setStored(null);
    setFeed(null);
    setActiveActivity(null);
    setResult(null);
  };

  const openActivity = (activity: FeedActivity) => {
    setActiveActivity(activity);
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  const submit = async () => {
    if (!stored || !activeActivity || busy) return;
    setBusy(true);
    const response = await fetch("/api/classroom/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-student-token": stored.token },
      body: JSON.stringify({
        activityId: activeActivity.id,
        answers: activeActivity.questions.map((_, index) => answers[index] ?? -1),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.ok) {
      setResult(data as { score: number; total: number; review: Review });
      void loadFeed(stored.token);
    } else {
      setError(data.error ?? "Could not send your answers.");
    }
  };

  if (!ready) return <main className="explore-app classroom-app" />;

  // ---------------------------------------------------------------- join view
  if (!stored) {
    return (
      <main className="explore-app classroom-app" lang={language}>
        <Header s={s} toggleLanguage={toggleLanguage} subtitle={s("My classroom", "আমার শ্রেণিকক্ষ")} />
        <section className="explore-hero">
          <p className="adult-eyebrow">{s("For Bangla-school students", "বাংলা স্কুলের শিক্ষার্থীদের জন্য")}</p>
          <h1>{s("Join your class with the secret code.", "গোপন কোড দিয়ে তোমার ক্লাসে যোগ দাও।")}</h1>
          <p>
            {s(
              "Your teacher gives you a 6-letter code. You only need a first name or nickname — never an email, birthday or password.",
              "শিক্ষক তোমাকে ৬ অক্ষরের একটি কোড দেবেন। শুধু ডাকনাম হলেই চলবে — ইমেইল, জন্মদিন বা পাসওয়ার্ড কখনো লাগবে না।",
            )}
          </p>
        </section>
        <section className="classroom-join">
          <form onSubmit={join}>
            <label>
              {s("Class code", "ক্লাস কোড")}
              <input
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                placeholder="ABC234"
                maxLength={8}
                autoCapitalize="characters"
                autoComplete="off"
                required
              />
            </label>
            <label>
              {s("Your first name or nickname", "তোমার ডাকনাম")}
              <input
                value={joinName}
                onChange={(event) => setJoinName(event.target.value)}
                placeholder={s("e.g. Maya", "যেমন: মায়া")}
                maxLength={30}
                autoComplete="off"
                required
              />
            </label>
            {error && <p className="classroom-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit" disabled={busy}>
              {s("Join my class →", "ক্লাসে যোগ দিই →")}
            </button>
          </form>
          <p className="classroom-privacy">
            ☂ {s(
              "Privacy promise: we store only the nickname you type and your quiz scores, linked to your class. Nothing else — and your teacher can see them, just like handing in paper.",
              "গোপনীয়তার প্রতিশ্রুতি: শুধু তোমার লেখা ডাকনাম আর কুইজের স্কোর তোমার ক্লাসের সঙ্গে জমা থাকে। আর কিছুই না — শিক্ষক সেগুলো দেখতে পান, খাতা জমা দেওয়ার মতোই।",
            )}
          </p>
        </section>
      </main>
    );
  }

  // ------------------------------------------------------------ activity view
  if (activeActivity) {
    const allAnswered = activeActivity.questions.every((_, index) => answers[index] !== undefined);
    return (
      <main className="explore-app classroom-app" lang={language}>
        <Header s={s} toggleLanguage={toggleLanguage} subtitle={feed?.class.name ?? ""} />
        <article className="topic-reader">
          <header className="topic-reader-head">
            <h1>{activeActivity.title}</h1>
            {activeActivity.instructions && <p>{activeActivity.instructions}</p>}
            {activeActivity.topicId && (
              <Link href="/topics" className="classroom-topic-link">
                📖 {s("Tip: read the linked classroom topic first!", "টিপ: আগে যুক্ত শ্রেণিকক্ষ-বিষয়টি পড়ে নাও!")}
              </Link>
            )}
          </header>

          {!result && (
            <section className="topic-quiz" aria-label={activeActivity.title}>
              {activeActivity.questions.map((question, questionIndex) => (
                <fieldset className="topic-question" key={questionIndex}>
                  <legend>{questionIndex + 1}. {question.prompt}</legend>
                  <div className="topic-options">
                    {question.options.map((option, optionIndex) => (
                      <button
                        type="button"
                        key={optionIndex}
                        className={`topic-option ${answers[questionIndex] === optionIndex ? "is-selected" : ""}`}
                        onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              {error && <p className="classroom-error" role="alert">{error}</p>}
              <button type="button" className="primary-button topic-submit" disabled={!allAnswered || busy} onClick={submit}>
                {allAnswered
                  ? s("Send to my teacher", "শিক্ষকের কাছে পাঠাই")
                  : s("Answer every question first", "আগে সব প্রশ্নের উত্তর দাও")}
              </button>
            </section>
          )}

          {result && (
            <section className="topic-quiz" aria-label={s("Result", "ফলাফল")}>
              <div className="topic-result" role="status">
                <strong>{s(`You got ${result.score} out of ${result.total}!`, `তুমি ${result.total}টির মধ্যে ${result.score}টি পেরেছ!`)}</strong>
                <p>{s("Sent to your teacher. You can try again any time while it's open.", "শিক্ষকের কাছে পৌঁছে গেছে। খোলা থাকা পর্যন্ত আবার চেষ্টা করতে পারো।")}</p>
              </div>
              <ul className="classroom-review">
                {result.review.map((item, index) => (
                  <li key={index} className={item.correct ? "is-right" : "is-wrong"}>
                    <span>{item.correct ? "✅" : "❌"}</span> {item.prompt}
                  </li>
                ))}
              </ul>
              <div className="topic-result-actions">
                <button type="button" onClick={() => { setAnswers({}); setResult(null); }}>{s("Try again", "আবার চেষ্টা")}</button>
                <button type="button" onClick={() => setActiveActivity(null)}>{s("Back to my class", "ক্লাসে ফিরে যাই")}</button>
              </div>
            </section>
          )}
        </article>
      </main>
    );
  }

  // ----------------------------------------------------------------- feed view
  return (
    <main className="explore-app classroom-app" lang={language}>
      <Header s={s} toggleLanguage={toggleLanguage} subtitle={feed?.class.name ?? stored.className} />
      <section className="explore-hero">
        <p className="adult-eyebrow">{feed ? `${feed.class.name} · ${feed.class.teacherName}` : stored.className}</p>
        <h1>{s(`Hi ${stored.name}!`, `হাই ${stored.name}!`)}</h1>
        <p>{s("Here is what your teacher has set for the class.", "শিক্ষক ক্লাসের জন্য যা দিয়েছেন তা এখানে।")}</p>
        <button type="button" className="text-button" onClick={leave}>
          {s("Leave this class on this device", "এই ডিভাইসে ক্লাস ছেড়ে দিই")}
        </button>
      </section>

      {feed?.announcements && feed.announcements.length > 0 && (
        <section className="explore-section" aria-label={s("Announcements", "ঘোষণা")}>
          <h2>📣 {s("Announcements", "ঘোষণা")}</h2>
          <ul className="classroom-announcements">
            {feed.announcements.map((item) => (
              <li key={item.id}>{item.body}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="explore-section" aria-label={s("Activities", "কার্যক্রম")}>
        <h2>📝 {s("Activities", "কার্যক্রম")}</h2>
        {error && <p className="classroom-error" role="alert">{error}</p>}
        {!feed || feed.activities.length === 0 ? (
          <p className="explore-section-note">
            {s("Nothing yet — check back after your teacher sets an activity. Meanwhile, explore the classroom topics!", "এখনো কিছু নেই — শিক্ষক কার্যক্রম দিলে আবার দেখো। ততক্ষণে শ্রেণিকক্ষের বিষয়গুলো ঘুরে দেখো!")}
            {" "}<Link href="/topics">{s("Open topics →", "বিষয়গুলো খোলো →")}</Link>
          </p>
        ) : (
          <div className="topics-grid">
            {feed.activities.map((activity) => (
              <button
                type="button"
                className="topic-card"
                key={activity.id}
                disabled={activity.status !== "open" && !activity.submission}
                onClick={() => activity.status === "open" && openActivity(activity)}
              >
                <strong>{activity.title}</strong>
                {activity.instructions && <p>{activity.instructions}</p>}
                <small>
                  {activity.submission
                    ? s(`Done — ${activity.submission.score}/${activity.submission.total} ⭐`, `হয়ে গেছে — ${activity.submission.score}/${activity.submission.total} ⭐`)
                    : activity.status === "open"
                      ? s(`${activity.questions.length} questions · tap to start`, `${activity.questions.length}টি প্রশ্ন · শুরু করতে ছোঁও`)
                      : s("Closed by your teacher", "শিক্ষক বন্ধ করেছেন")}
                </small>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Header({
  s,
  toggleLanguage,
  subtitle,
}: {
  s: (en: string, bn: string) => string;
  toggleLanguage: () => void;
  subtitle: string;
}) {
  return (
    <header className="explore-header">
      <Link className="adult-brand" href="/">
        <span>বা</span>
        <span>
          <strong>Bangla Adventures</strong>
          <small>{subtitle}</small>
        </span>
      </Link>
      <nav aria-label="Sections">
        <Link href="/topics">{s("Topics", "বিষয়")}</Link>
        <Link className="active" href="/classroom">{s("My classroom", "আমার শ্রেণিকক্ষ")}</Link>
      </nav>
      <button type="button" className="explore-lang" onClick={toggleLanguage}>
        {s("বাংলায় দেখুন", "View in English")}
      </button>
    </header>
  );
}
