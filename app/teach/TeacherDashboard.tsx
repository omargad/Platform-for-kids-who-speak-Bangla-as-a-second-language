"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/use-language";
import { topics } from "../topics-content";
import { NCTB_PORTAL_URL } from "../library-content";

type ClassSummary = {
  id: string;
  name: string;
  joinCode: string;
  createdAt: string;
  studentCount: number;
  activityCount: number;
  submissionCount: number;
};

type Question = { prompt: string; options: string[]; answer: number };

type SubmissionRow = {
  id: string;
  studentName: string;
  score: number;
  total: number;
  submittedAt: string;
  answers: number[];
};

type ActivityDetail = {
  id: string;
  title: string;
  instructions: string;
  topicId: string | null;
  status: string;
  createdAt: string;
  questions: Question[];
  submissions: SubmissionRow[];
};

type ClassDetail = {
  class: { id: string; name: string; joinCode: string };
  students: Array<{ id: string; displayName: string; createdAt: string }>;
  announcements: Array<{ id: string; body: string; createdAt: string }>;
  activities: ActivityDetail[];
};

type SourceRow = {
  id: string;
  titleBn: string;
  titleEn: string;
  classes: { en: string; bn: string };
  level: "primary" | "secondary";
  status: "listed" | "confirm";
  hasEnglishVersion: boolean;
  downloadUrl?: string;
  customised: boolean;
};

const emptyQuestion = (): Question => ({ prompt: "", options: ["", ""], answer: 0 });

export default function TeacherDashboard({ teacherName }: { teacherName: string }) {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);

  const [classList, setClassList] = useState<ClassSummary[]>([]);
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const [activityTitle, setActivityTitle] = useState("");
  const [activityInstructions, setActivityInstructions] = useState("");
  const [activityTopic, setActivityTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [openSubmissions, setOpenSubmissions] = useState<string | null>(null);

  const loadClasses = useCallback(async () => {
    const response = await fetch("/api/classes");
    const data = await response.json().catch(() => ({}));
    if (response.ok) setClassList(data.classes ?? []);
    else setMessage(data.error ?? "Could not load classes.");
  }, []);

  const loadSources = useCallback(async () => {
    const response = await fetch("/api/library");
    const data = await response.json().catch(() => ({}));
    if (response.ok) setSources(data.books ?? []);
  }, []);

  useEffect(() => {
    // Initial data fetch: state updates land after the network round-trip,
    // not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadClasses();
    void loadSources();
  }, [loadClasses, loadSources]);

  const openClass = useCallback(async (id: string) => {
    const response = await fetch(`/api/classes/${id}`);
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setDetail(data as ClassDetail);
      setOpenSubmissions(null);
    } else setMessage(data.error ?? "Could not open the class.");
  }, []);

  const createClass = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newClassName.trim() || busy) return;
    setBusy(true);
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClassName.trim() }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.ok) {
      setNewClassName("");
      setMessage(s("Class created — share the join code with your students.", "ক্লাস তৈরি হয়েছে — কোডটি শিক্ষার্থীদের দিন।"));
      await loadClasses();
    } else setMessage(data.error ?? "Could not create the class.");
  };

  const removeClass = async (id: string) => {
    if (!window.confirm(s("Delete this class, its activities and submissions?", "এই ক্লাস, কার্যক্রম ও জমাগুলো মুছে ফেলবেন?"))) return;
    const response = await fetch(`/api/classes/${id}`, { method: "DELETE" });
    if (response.ok) {
      setDetail(null);
      await loadClasses();
    }
  };

  const postAnnouncement = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!detail || !announcement.trim() || busy) return;
    setBusy(true);
    const response = await fetch(`/api/classes/${detail.class.id}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: announcement.trim() }),
    });
    setBusy(false);
    if (response.ok) {
      setAnnouncement("");
      await openClass(detail.class.id);
    }
  };

  const removeAnnouncement = async (announcementId: string) => {
    if (!detail) return;
    await fetch(`/api/classes/${detail.class.id}/announcements`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcementId }),
    });
    await openClass(detail.class.id);
  };

  const updateQuestion = (index: number, updater: (question: Question) => Question) => {
    setQuestions((current) => current.map((question, i) => (i === index ? updater(question) : question)));
  };

  const createActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!detail || busy) return;
    setBusy(true);
    const response = await fetch(`/api/classes/${detail.class.id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: activityTitle,
        instructions: activityInstructions,
        topicId: activityTopic || undefined,
        questions,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.ok) {
      setActivityTitle("");
      setActivityInstructions("");
      setActivityTopic("");
      setQuestions([emptyQuestion()]);
      setMessage(s("Activity published to the class.", "কার্যক্রমটি ক্লাসে প্রকাশিত হয়েছে।"));
      await openClass(detail.class.id);
    } else setMessage(data.error ?? "Could not create the activity.");
  };

  const setActivityStatus = async (activityId: string, status: "open" | "closed") => {
    if (!detail) return;
    await fetch(`/api/classes/${detail.class.id}/activities`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, status }),
    });
    await openClass(detail.class.id);
  };

  const removeActivity = async (activityId: string) => {
    if (!detail) return;
    if (!window.confirm(s("Remove this activity and its submissions?", "এই কার্যক্রম ও জমাগুলো মুছবেন?"))) return;
    await fetch(`/api/classes/${detail.class.id}/activities`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });
    await openClass(detail.class.id);
  };

  const saveSourceUrl = async (source: SourceRow, downloadUrl: string) => {
    const response = await fetch("/api/library", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: source.id, data: { downloadUrl } }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(s("Source link saved.", "উৎসের লিংক সংরক্ষিত।"));
      await loadSources();
    } else setMessage(data.error ?? "Could not save the source.");
  };

  const resetSource = async (id: string) => {
    await fetch("/api/library", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadSources();
  };

  const topicTitle = (topicId: string | null) =>
    topicId ? topics.find((topic) => topic.id === topicId)?.title[language] ?? topicId : null;

  return (
    <main className="adult-app teach-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/">
          <span>বা</span>
          <span>
            <strong>Bangla Adventures</strong>
            <small>{s("Teacher workspace", "শিক্ষকের কর্মক্ষেত্র")}</small>
          </span>
        </Link>
        <nav aria-label="Sections">
          <Link className="active" href="/teach">{s("Classes", "ক্লাস")}</Link>
          <Link href="/family">{s("Family", "পরিবার")}</Link>
          <Link href="/studio">{s("Studio", "স্টুডিও")}</Link>
          <Link href="/library">{s("Library", "লাইব্রেরি")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>
            {s("বাংলায় দেখুন", "View in English")}
          </button>
        </div>
      </header>

      <div className="adult-content">
        <section className="adult-hero">
          <div>
            <p className="adult-eyebrow">{s(`Welcome, ${teacherName}`, `স্বাগতম, ${teacherName}`)}</p>
            <h1>{s("Run your Bangla-school class here.", "আপনার বাংলা স্কুলের ক্লাস এখানেই চালান।")}</h1>
            <p>
              {s(
                "Create a class and share its join code — students join with a first name only, no email and no password. Set quizzes and activities (optionally tied to a classroom topic), post announcements, and watch submissions arrive.",
                "ক্লাস তৈরি করে জয়েন-কোডটি দিন — শিক্ষার্থীরা কেবল ডাকনাম দিয়ে যোগ দেয়, ইমেইল বা পাসওয়ার্ড লাগে না। কুইজ ও কার্যক্রম দিন (চাইলে শ্রেণিকক্ষ-বিষয়ের সঙ্গে যুক্ত), ঘোষণা দিন, আর জমা দেখুন।",
              )}
            </p>
            {message && <p className="teach-message" role="status">{message}</p>}
          </div>
        </section>

        {!detail && (
          <>
            <section className="teach-panel" aria-label={s("Your classes", "আপনার ক্লাস")}>
              <h2>{s("Your classes", "আপনার ক্লাস")}</h2>
              <form className="teach-inline-form" onSubmit={createClass}>
                <input
                  value={newClassName}
                  onChange={(event) => setNewClassName(event.target.value)}
                  placeholder={s("e.g. Sunday Level 2", "যেমন: রবিবার লেভেল ২")}
                  maxLength={60}
                  aria-label={s("New class name", "নতুন ক্লাসের নাম")}
                />
                <button className="primary-button" type="submit" disabled={busy || !newClassName.trim()}>
                  {s("Create class", "ক্লাস তৈরি করুন")}
                </button>
              </form>
              {classList.length === 0 ? (
                <p className="teach-empty">{s("No classes yet — create your first one above.", "এখনো কোনো ক্লাস নেই — উপরে প্রথমটি তৈরি করুন।")}</p>
              ) : (
                <div className="teach-class-grid">
                  {classList.map((item) => (
                    <button type="button" className="teach-class-card" key={item.id} onClick={() => openClass(item.id)}>
                      <strong>{item.name}</strong>
                      <span className="teach-code">{item.joinCode}</span>
                      <small>
                        {item.studentCount} {s("students", "শিক্ষার্থী")} · {item.activityCount} {s("activities", "কার্যক্রম")} · {item.submissionCount} {s("submissions", "জমা")}
                      </small>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="teach-panel" aria-label={s("Textbook knowledge sources", "পাঠ্যবই জ্ঞানভান্ডার")}>
              <h2>{s("Textbook knowledge sources", "পাঠ্যবই জ্ঞানভান্ডার")}</h2>
              <p className="teach-note">
                {s(
                  "NCTB refreshes textbooks every academic year. Update each book's official download link here after the yearly review — the public library page updates instantly, with no code change.",
                  "এনসিটিবি প্রতি শিক্ষাবর্ষে বই হালনাগাদ করে। বার্ষিক পর্যালোচনার পর এখানে প্রতিটি বইয়ের অফিসিয়াল ডাউনলোড লিংক দিন — লাইব্রেরি পাতা সঙ্গে সঙ্গে বদলে যাবে, কোনো কোড বদলাতে হবে না।",
                )}{" "}
                <a href={NCTB_PORTAL_URL} target="_blank" rel="noreferrer">{s("Open the NCTB portal ↗", "এনসিটিবি পোর্টাল ↗")}</a>
              </p>
              <div className="teach-sources">
                {sources.map((source) => (
                  <SourceEditor
                    key={`${source.id}:${source.downloadUrl ?? ""}`}
                    source={source}
                    language={language}
                    onSave={saveSourceUrl}
                    onReset={resetSource}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {detail && (
          <>
            <section className="teach-panel teach-class-head" aria-label={detail.class.name}>
              <button type="button" className="topics-back" onClick={() => { setDetail(null); void loadClasses(); }}>
                ← {s("All classes", "সব ক্লাস")}
              </button>
              <div className="teach-class-title">
                <h2>{detail.class.name}</h2>
                <p>
                  {s("Join code:", "জয়েন কোড:")} <strong className="teach-code teach-code-big">{detail.class.joinCode}</strong>
                  {" · "}
                  {s("students visit", "শিক্ষার্থীরা যাবে")} <code>/classroom</code>
                </p>
              </div>
              <button type="button" className="text-button danger" onClick={() => removeClass(detail.class.id)}>
                {s("Delete class", "ক্লাস মুছুন")}
              </button>
            </section>

            <section className="teach-panel" aria-label={s("Students", "শিক্ষার্থী")}>
              <h3>{s("Students", "শিক্ষার্থী")} ({detail.students.length})</h3>
              {detail.students.length === 0 ? (
                <p className="teach-empty">{s("Nobody has joined yet. Share the code above.", "এখনো কেউ যোগ দেয়নি। উপরের কোডটি দিন।")}</p>
              ) : (
                <ul className="teach-roster">
                  {detail.students.map((student) => (
                    <li key={student.id}>{student.displayName}</li>
                  ))}
                </ul>
              )}
            </section>

            <section className="teach-panel" aria-label={s("Announcements", "ঘোষণা")}>
              <h3>{s("Announcements", "ঘোষণা")}</h3>
              <form className="teach-inline-form" onSubmit={postAnnouncement}>
                <input
                  value={announcement}
                  onChange={(event) => setAnnouncement(event.target.value)}
                  placeholder={s("e.g. This term's theme is festivals — read the Pohela Boishakh topic!", "যেমন: এবারের থিম উৎসব — পহেলা বৈশাখ বিষয়টি পড়ে এসো!")}
                  maxLength={500}
                  aria-label={s("New announcement", "নতুন ঘোষণা")}
                />
                <button className="primary-button" type="submit" disabled={busy || !announcement.trim()}>
                  {s("Post", "প্রকাশ")}
                </button>
              </form>
              {detail.announcements.length > 0 && (
                <ul className="teach-announcements">
                  {detail.announcements.map((item) => (
                    <li key={item.id}>
                      <p>{item.body}</p>
                      <button type="button" className="text-button danger" onClick={() => removeAnnouncement(item.id)}>
                        {s("Remove", "মুছুন")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="teach-panel" aria-label={s("New activity", "নতুন কার্যক্রম")}>
              <h3>{s("Set a quiz or activity", "কুইজ বা কার্যক্রম দিন")}</h3>
              <form className="teach-activity-form" onSubmit={createActivity}>
                <input
                  value={activityTitle}
                  onChange={(event) => setActivityTitle(event.target.value)}
                  placeholder={s("Activity title, e.g. Festivals check-in", "কার্যক্রমের নাম, যেমন: উৎসব যাচাই")}
                  maxLength={120}
                  required
                />
                <textarea
                  value={activityInstructions}
                  onChange={(event) => setActivityInstructions(event.target.value)}
                  placeholder={s("Instructions for students (optional)", "শিক্ষার্থীদের জন্য নির্দেশনা (ঐচ্ছিক)")}
                  maxLength={1000}
                  rows={2}
                />
                <label className="teach-topic-pick">
                  {s("Link a classroom topic (students get a 'read this first' pointer):", "শ্রেণিকক্ষ-বিষয় যুক্ত করুন (শিক্ষার্থীরা ‘আগে এটি পড়ো’ নির্দেশ পাবে):")}
                  <select value={activityTopic} onChange={(event) => setActivityTopic(event.target.value)}>
                    <option value="">{s("No linked topic", "কোনো বিষয় নয়")}</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.title[language]}</option>
                    ))}
                  </select>
                </label>

                {questions.map((question, questionIndex) => (
                  <fieldset className="teach-question" key={questionIndex}>
                    <legend>{s("Question", "প্রশ্ন")} {questionIndex + 1}</legend>
                    <input
                      value={question.prompt}
                      onChange={(event) => updateQuestion(questionIndex, (q) => ({ ...q, prompt: event.target.value }))}
                      placeholder={s("The question prompt", "প্রশ্নটি লিখুন")}
                      maxLength={300}
                      required
                    />
                    {question.options.map((option, optionIndex) => (
                      <div className="teach-option-row" key={optionIndex}>
                        <input
                          type="radio"
                          name={`answer-${questionIndex}`}
                          checked={question.answer === optionIndex}
                          onChange={() => updateQuestion(questionIndex, (q) => ({ ...q, answer: optionIndex }))}
                          aria-label={s("Mark as the correct answer", "সঠিক উত্তর চিহ্নিত করুন")}
                        />
                        <input
                          value={option}
                          onChange={(event) =>
                            updateQuestion(questionIndex, (q) => ({
                              ...q,
                              options: q.options.map((item, i) => (i === optionIndex ? event.target.value : item)),
                            }))
                          }
                          placeholder={`${s("Option", "অপশন")} ${optionIndex + 1}`}
                          maxLength={200}
                          required
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            className="text-button danger"
                            onClick={() =>
                              updateQuestion(questionIndex, (q) => ({
                                ...q,
                                options: q.options.filter((_, i) => i !== optionIndex),
                                answer: q.answer === optionIndex ? 0 : q.answer > optionIndex ? q.answer - 1 : q.answer,
                              }))
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="teach-question-actions">
                      {question.options.length < 6 && (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => updateQuestion(questionIndex, (q) => ({ ...q, options: [...q.options, ""] }))}
                        >
                          + {s("Add option", "অপশন যোগ")}
                        </button>
                      )}
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="text-button danger"
                          onClick={() => setQuestions((current) => current.filter((_, i) => i !== questionIndex))}
                        >
                          {s("Remove question", "প্রশ্ন বাদ দিন")}
                        </button>
                      )}
                    </div>
                  </fieldset>
                ))}

                <div className="teach-form-actions">
                  {questions.length < 20 && (
                    <button type="button" className="text-button" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>
                      + {s("Add question", "প্রশ্ন যোগ করুন")}
                    </button>
                  )}
                  <button className="primary-button" type="submit" disabled={busy}>
                    {s("Publish to the class", "ক্লাসে প্রকাশ করুন")}
                  </button>
                </div>
              </form>
            </section>

            <section className="teach-panel" aria-label={s("Activities and submissions", "কার্যক্রম ও জমা")}>
              <h3>{s("Activities & submissions", "কার্যক্রম ও জমা")}</h3>
              {detail.activities.length === 0 ? (
                <p className="teach-empty">{s("No activities yet.", "এখনো কোনো কার্যক্রম নেই।")}</p>
              ) : (
                detail.activities.map((activity) => (
                  <article className="teach-activity" key={activity.id}>
                    <header>
                      <div>
                        <strong>{activity.title}</strong>
                        <small>
                          {activity.questions.length} {s("questions", "প্রশ্ন")}
                          {activity.topicId && <> · {s("topic:", "বিষয়:")} {topicTitle(activity.topicId)}</>}
                          {" · "}
                          {activity.status === "open" ? s("open", "খোলা") : s("closed", "বন্ধ")}
                        </small>
                      </div>
                      <div className="teach-activity-buttons">
                        <button type="button" className="text-button" onClick={() => setOpenSubmissions(openSubmissions === activity.id ? null : activity.id)}>
                          {activity.submissions.length} {s("submissions", "জমা")}
                        </button>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => setActivityStatus(activity.id, activity.status === "open" ? "closed" : "open")}
                        >
                          {activity.status === "open" ? s("Close", "বন্ধ করুন") : s("Reopen", "আবার খুলুন")}
                        </button>
                        <button type="button" className="text-button danger" onClick={() => removeActivity(activity.id)}>
                          {s("Delete", "মুছুন")}
                        </button>
                      </div>
                    </header>
                    {openSubmissions === activity.id && (
                      activity.submissions.length === 0 ? (
                        <p className="teach-empty">{s("No submissions yet.", "এখনো কোনো জমা নেই।")}</p>
                      ) : (
                        <table className="teach-submissions">
                          <thead>
                            <tr>
                              <th>{s("Student", "শিক্ষার্থী")}</th>
                              <th>{s("Score", "স্কোর")}</th>
                              <th>{s("Submitted", "জমার সময়")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activity.submissions.map((submission) => (
                              <tr key={submission.id}>
                                <td>{submission.studentName}</td>
                                <td>{submission.score}/{submission.total}</td>
                                <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )}
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SourceEditor({
  source,
  language,
  onSave,
  onReset,
}: {
  source: SourceRow;
  language: "en" | "bn";
  onSave: (source: SourceRow, url: string) => Promise<void>;
  onReset: (id: string) => Promise<void>;
}) {
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  // The parent keys this component by downloadUrl, so a saved link remounts
  // the row with a fresh initial value — no prop-sync effect needed.
  const [url, setUrl] = useState(source.downloadUrl ?? "");

  return (
    <div className="teach-source-row">
      <div className="teach-source-name">
        <strong lang="bn">{source.titleBn}</strong>
        <small>
          {source.titleEn} · {source.classes[language]}
          {source.customised && <span className="teach-source-custom"> · {s("customised", "কাস্টমাইজড")}</span>}
        </small>
      </div>
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder={s("https:// official download link for this year's edition", "https:// এ বছরের সংস্করণের অফিসিয়াল লিংক")}
        aria-label={`${source.titleEn} URL`}
      />
      <div className="teach-source-actions">
        <button type="button" className="text-button" disabled={!/^https:\/\//.test(url)} onClick={() => onSave(source, url)}>
          {s("Save", "সংরক্ষণ")}
        </button>
        {source.customised && (
          <button type="button" className="text-button danger" onClick={() => onReset(source.id)}>
            {s("Reset", "রিসেট")}
          </button>
        )}
      </div>
    </div>
  );
}
