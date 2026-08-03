"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { lessons } from "../curriculum";
import { useLanguage } from "../../lib/use-language";

type Progress = { id: string; lessonId: string; sessionId: string; skill: string; score: number | null; updatedAt: string };
type Assignment = { id: string; lessonId: string; sessionId: string | null; title: string; dueAt: string | null; status: string };
type Profile = { id: string; displayName: string; ageBand: string; homeLanguages: string[]; progress: Progress[]; assignments: Assignment[] };

const skills = ["listening", "reading", "speaking", "writing", "culture", "mastery"];
const skillLabels: Record<string, string> = {
  listening: "শোনা",
  reading: "পড়া",
  speaking: "বলা",
  writing: "লেখা",
  culture: "সংস্কৃতি",
  mastery: "দক্ষতা",
};

export default function FamilyDashboard({ adultName }: { adultName: string }) {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const skillLabel = (skill: string) => (language === "bn" ? skillLabels[skill] ?? skill : skill);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("not-specified");
  const [newLanguages, setNewLanguages] = useState("Bangla, English");
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<string, { lessonId: string; skill: string; dueAt: string }>>({});

  const totals = useMemo(() => ({
    sessions: profiles.reduce((total, profile) => total + profile.progress.length, 0),
    assignments: profiles.reduce((total, profile) => total + profile.assignments.filter((item) => item.status !== "archived").length, 0),
  }), [profiles]);

  useEffect(() => { void loadProfiles(); }, []);

  async function loadProfiles() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profiles", { cache: "no-store" });
      const data = await response.json() as { profiles?: Profile[]; error?: string };
      if (!response.ok) throw new Error(data.error || s("Could not load learner profiles.", "শিক্ষার্থী প্রোফাইল লোড করা যায়নি।"));
      setProfiles(data.profiles || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : s("Could not load learner profiles.", "শিক্ষার্থী প্রোফাইল লোড করা যায়নি।"));
    } finally {
      setLoading(false);
    }
  }

  async function createProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName: newName, ageBand: newAge, homeLanguages: newLanguages.split(",").map((item) => item.trim()).filter(Boolean) }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || s("Could not create the profile.", "প্রোফাইল তৈরি করা যায়নি।"));
      setNewName("");
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : s("Could not create the profile.", "প্রোফাইল তৈরি করা যায়নি।"));
    } finally {
      setSaving(false);
    }
  }

  function assignmentDraft(profileId: string) {
    return assignmentDrafts[profileId] || { lessonId: lessons[0].id, skill: "all", dueAt: "" };
  }

  function updateAssignmentDraft(profileId: string, field: "lessonId" | "skill" | "dueAt", value: string) {
    setAssignmentDrafts((current) => ({ ...current, [profileId]: { ...assignmentDraft(profileId), [field]: value } }));
  }

  async function createAssignment(profileId: string) {
    const draft = assignmentDraft(profileId);
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId, lessonId: draft.lessonId, sessionId: draft.skill === "all" ? null : `session-${draft.lessonId}-${draft.skill}`, dueAt: draft.dueAt || null }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || s("Could not create the assignment.", "কাজটি তৈরি করা যায়নি।"));
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : s("Could not create the assignment.", "কাজটি তৈরি করা যায়নি।"));
    } finally {
      setSaving(false);
    }
  }

  async function updateAssignment(id: string, status: string) {
    const response = await fetch("/api/assignments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) await loadProfiles();
  }

  async function removeProfile(profile: Profile) {
    const confirmed = window.confirm(
      s(
        `Remove ${profile.displayName}'s profile? Their ${profile.progress.length} recorded sessions and all assignments are permanently deleted. Device-local stars on their own device are not affected.`,
        `${profile.displayName}-এর প্রোফাইল মুছবেন? তার ${profile.progress.length}টি রেকর্ড করা সেশন ও সব কাজ স্থায়ীভাবে মুছে যাবে। তার নিজের ডিভাইসে থাকা তারা অক্ষত থাকবে।`,
      ),
    );
    if (!confirmed) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(profile.id)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || s("Could not remove the profile.", "প্রোফাইল মোছা যায়নি।"));
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : s("Could not remove the profile.", "প্রোফাইল মোছা যায়নি।"));
    } finally {
      setSaving(false);
    }
  }

  function exportCsv(profile: Profile) {
    const rows = [[s("Learner", "শিক্ষার্থী"), s("Module", "মডিউল"), s("Skill", "দক্ষতা"), s("Status", "অবস্থা"), s("Score", "স্কোর"), s("Updated", "হালনাগাদ")], ...profile.progress.map((item) => [profile.displayName, lessons.find((lesson) => lesson.id === item.lessonId)?.title || item.lessonId, item.skill, "complete", item.score ?? "", item.updatedAt])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "learner"}-bangla-progress.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="adult-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>{s("Grown-up dashboard", "বড়দের ড্যাশবোর্ড")}</small></span></Link>
        <nav aria-label="Adult tools">
          <Link className="active" href="/family">{s("Learners", "শিক্ষার্থী")}</Link>
          <Link href="/studio">{s("Content Studio", "কনটেন্ট স্টুডিও")}</Link>
          <Link href="/worksheets">{s("Worksheets", "ওয়ার্কশিট")}</Link>
          <Link href="/safety">{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</Link>
          <Link href="/account">{s("Account", "অ্যাকাউন্ট")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>{s("বাংলায় দেখুন", "View in English")}</button>
          <span>{adultName}</span>
          <a href="/api/auth/sign-out?returnTo=%2F">{s("Sign out", "সাইন আউট")}</a>
        </div>
      </header>

      <div className="adult-content">
      <section className="adult-hero">
        <div><p className="adult-eyebrow">{s("Family & educator workspace", "পরিবার ও শিক্ষকের কর্মক্ষেত্র")}</p><h1>{s("Guide a learner without giving them an account.", "অ্যাকাউন্ট ছাড়াই একজন শিক্ষার্থীকে পথ দেখান।")}</h1><p>{s(`Welcome, ${adultName}. Profiles are adult-managed; learners need only a display name. Assign any of 108 sessions, review each skill and export progress when useful.`, `স্বাগতম, ${adultName}। প্রোফাইল বড়রা পরিচালনা করেন; শিক্ষার্থীর কেবল একটি নাম লাগে। ১০৮টি সেশনের যেকোনোটি বরাদ্দ করুন, প্রতিটি দক্ষতা দেখুন এবং প্রয়োজনে অগ্রগতি রপ্তানি করুন।`)}</p></div>
        <div className="adult-stat-strip"><span><strong>{profiles.length}</strong>{s("learners", "শিক্ষার্থী")}</span><span><strong>{totals.sessions}</strong>{s("sessions complete", "সেশন সম্পন্ন")}</span><span><strong>{totals.assignments}</strong>{s("active assignments", "চলমান কাজ")}</span></div>
      </section>

      {error && <div className="adult-alert" role="alert"><strong>{s("Cloud workspace notice", "কর্মক্ষেত্র বিজ্ঞপ্তি")}</strong><span>{error}</span><button type="button" onClick={() => void loadProfiles()}>{s("Try again", "আবার চেষ্টা করুন")}</button></div>}

      <section className="adult-grid">
        <aside className="profile-creator">
          <p className="adult-eyebrow">{s("Add a learner", "শিক্ষার্থী যোগ করুন")}</p>
          <h2>{s("Private by design", "গোপনীয়তা মাথায় রেখে তৈরি")}</h2>
          <p>{s("No child email, birthday, photo or school is requested. Use a first name, nickname or initials.", "শিশুর ইমেইল, জন্মদিন, ছবি বা স্কুল চাওয়া হয় না। নাম, ডাকনাম বা আদ্যক্ষর ব্যবহার করুন।")}</p>
          <form onSubmit={createProfile}>
            <label>{s("Display name", "নাম")}<input required maxLength={40} value={newName} onChange={(event) => setNewName(event.target.value)} placeholder={s("e.g. Rumi", "যেমন রুমি")} /></label>
            <label>{s("Broad age band", "বিস্তৃত বয়সসীমা")}<select value={newAge} onChange={(event) => setNewAge(event.target.value)}><option value="not-specified">{s("Prefer not to say", "বলতে চাই না")}</option><option value="6-8">6–8</option><option value="9-12">9–12</option><option value="13-15">13–15</option><option value="16+">16+</option></select></label>
            <label>{s("Languages used", "ব্যবহৃত ভাষা")}<input maxLength={150} value={newLanguages} onChange={(event) => setNewLanguages(event.target.value)} /><small>{s("Comma-separated; keep this general.", "কমা দিয়ে আলাদা করুন; সাধারণ রাখুন।")}</small></label>
            <button type="submit" className="primary-button" disabled={saving}>{saving ? s("Saving…", "সংরক্ষণ হচ্ছে…") : s("Create learner profile", "শিক্ষার্থী প্রোফাইল তৈরি করুন")}</button>
          </form>
          <div className="privacy-mini"><span>☂</span><p>{s("Speaking recordings in lessons stay in the learner’s tab and are never attached to profiles.", "পাঠে বলার রেকর্ডিং শিক্ষার্থীর ট্যাবেই থাকে এবং কখনো প্রোফাইলে যুক্ত হয় না।")}</p></div>
        </aside>

        <div className="learner-dashboard-list">
          {loading && <div className="adult-empty">{s("Loading the grown-up workspace…", "কর্মক্ষেত্র লোড হচ্ছে…")}</div>}
          {!loading && profiles.length === 0 && <div className="adult-empty"><span>⌁</span><h2>{s("Create the first learner profile", "প্রথম শিক্ষার্থী প্রোফাইল তৈরি করুন")}</h2><p>{s("Once created, this space will show six-skill progress, assignments and a launch link.", "তৈরি হলে এখানে ছয়-দক্ষতার অগ্রগতি, কাজ ও শুরু করার লিংক দেখা যাবে।")}</p></div>}
          {profiles.map((profile) => {
            const completion = Math.round((profile.progress.length / 108) * 100);
            const draft = assignmentDraft(profile.id);
            return (
              <article className="learner-profile-card" key={profile.id}>
                <header><div className="learner-avatar">{profile.displayName.slice(0, 1).toUpperCase()}</div><div><h2>{profile.displayName}</h2><p>{profile.ageBand === "not-specified" ? s("Age not recorded", "বয়স নেই") : s(`Age ${profile.ageBand}`, `বয়স ${profile.ageBand}`)} · {profile.homeLanguages.join(" · ") || s("Languages not recorded", "ভাষা নেই")}</p></div><a className="primary-button" href={`/?learner=${encodeURIComponent(profile.id)}`}>{s("Open learner view →", "শিক্ষার্থী ভিউ খুলুন →")}</a></header>
                <div className="profile-progress-overview"><div className="profile-progress-ring" style={{ "--progress": `${completion * 3.6}deg` } as React.CSSProperties}><strong>{completion}%</strong></div><div><strong>{profile.progress.length}<small>/108</small></strong><span>{s("guided sessions complete", "সেশন সম্পন্ন")}</span><div className="profile-linear"><i style={{ width: `${completion}%` }} /></div></div><button type="button" onClick={() => exportCsv(profile)}>{s("Export CSV", "CSV রপ্তানি")}</button></div>
                <div className="skill-summary-row">{skills.map((skill) => { const count = profile.progress.filter((item) => item.skill === skill).length; return <div key={skill}><span>{skill.slice(0, 1).toUpperCase()}</span><strong>{count}<small>/18</small></strong><em>{skillLabel(skill)}</em></div>; })}</div>
                <section className="assignment-builder"><div><p className="adult-eyebrow">{s("Assign next", "পরবর্তী কাজ")}</p><h3>{s("Choose a module or one skill session", "একটি মডিউল বা একটি দক্ষতা সেশন বাছুন")}</h3></div><select value={draft.lessonId} onChange={(event) => updateAssignmentDraft(profile.id, "lessonId", event.target.value)}>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.number}. {language === "bn" ? lesson.titleBn : lesson.title}</option>)}</select><select value={draft.skill} onChange={(event) => updateAssignmentDraft(profile.id, "skill", event.target.value)}><option value="all">{s("Whole module", "পুরো মডিউল")}</option>{skills.map((skill) => <option value={skill} key={skill}>{skillLabel(skill)}</option>)}</select><input aria-label={s("Due date", "শেষ তারিখ")} type="date" value={draft.dueAt} onChange={(event) => updateAssignmentDraft(profile.id, "dueAt", event.target.value)} /><button type="button" className="outline-button" disabled={saving} onClick={() => void createAssignment(profile.id)}>{s("Assign", "বরাদ্দ")}</button><a className="worksheet-link" href={`/worksheets/${draft.lessonId}`} target="_blank" rel="noreferrer">{s("Print worksheet ↗", "ওয়ার্কশিট প্রিন্ট ↗")}</a></section>
                {profile.assignments.length > 0 && <div className="assignment-list"><p className="adult-eyebrow">{s("Assignments", "কাজ")}</p>{profile.assignments.filter((item) => item.status !== "archived").map((assignment) => <div key={assignment.id}><span className={`assignment-status ${assignment.status}`}>{assignment.status}</span><strong>{assignment.title}</strong><small>{assignment.dueAt ? s(`Due ${assignment.dueAt}`, `শেষ ${assignment.dueAt}`) : s("No due date", "তারিখ নেই")}</small><button type="button" onClick={() => void updateAssignment(assignment.id, assignment.status === "complete" ? "archived" : "complete")}>{assignment.status === "complete" ? s("Archive", "সংরক্ষণাগার") : s("Mark complete", "সম্পন্ন চিহ্নিত")}</button></div>)}</div>}
                <footer className="profile-card-footer"><button type="button" className="danger-link" disabled={saving} onClick={() => void removeProfile(profile)}>{s("Remove profile and delete its data", "প্রোফাইল ও এর তথ্য মুছুন")}</button></footer>
              </article>
            );
          })}
        </div>
      </section>
      </div>
    </main>
  );
}

