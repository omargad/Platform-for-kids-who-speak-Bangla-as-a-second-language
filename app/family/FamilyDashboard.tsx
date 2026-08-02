"use client";

import { useEffect, useMemo, useState } from "react";
import { lessons } from "../curriculum";

type Progress = { id: string; lessonId: string; sessionId: string; skill: string; score: number | null; updatedAt: string };
type Assignment = { id: string; lessonId: string; sessionId: string | null; title: string; dueAt: string | null; status: string };
type Profile = { id: string; displayName: string; ageBand: string; homeLanguages: string[]; progress: Progress[]; assignments: Assignment[] };

const skills = ["listening", "reading", "speaking", "writing", "culture", "mastery"];

export default function FamilyDashboard({ adultName }: { adultName: string }) {
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
      if (!response.ok) throw new Error(data.error || "Could not load learner profiles.");
      setProfiles(data.profiles || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load learner profiles.");
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
      if (!response.ok) throw new Error(data.error || "Could not create the profile.");
      setNewName("");
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the profile.");
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
      if (!response.ok) throw new Error(data.error || "Could not create the assignment.");
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the assignment.");
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
      `Remove ${profile.displayName}'s profile? Their ${profile.progress.length} recorded sessions and all assignments are permanently deleted. Device-local stars on their own device are not affected.`,
    );
    if (!confirmed) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(profile.id)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not remove the profile.");
      await loadProfiles();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove the profile.");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv(profile: Profile) {
    const rows = [["Learner", "Module", "Skill", "Status", "Score", "Updated"], ...profile.progress.map((item) => [profile.displayName, lessons.find((lesson) => lesson.id === item.lessonId)?.title || item.lessonId, item.skill, "complete", item.score ?? "", item.updatedAt])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "learner"}-bangla-progress.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="adult-content">
      <section className="adult-hero">
        <div><p className="adult-eyebrow">Family & educator workspace</p><h1>Guide a learner without giving them an account.</h1><p>Welcome, {adultName}. Profiles are adult-managed; learners need only a display name. Assign any of 108 sessions, review each skill and export progress when useful.</p></div>
        <div className="adult-stat-strip"><span><strong>{profiles.length}</strong>learners</span><span><strong>{totals.sessions}</strong>sessions complete</span><span><strong>{totals.assignments}</strong>active assignments</span></div>
      </section>

      {error && <div className="adult-alert" role="alert"><strong>Cloud workspace notice</strong><span>{error}</span><button type="button" onClick={() => void loadProfiles()}>Try again</button></div>}

      <section className="adult-grid">
        <aside className="profile-creator">
          <p className="adult-eyebrow">Add a learner</p>
          <h2>Private by design</h2>
          <p>No child email, birthday, photo or school is requested. Use a first name, nickname or initials.</p>
          <form onSubmit={createProfile}>
            <label>Display name<input required maxLength={40} value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="e.g. Rumi" /></label>
            <label>Broad age band<select value={newAge} onChange={(event) => setNewAge(event.target.value)}><option value="not-specified">Prefer not to say</option><option value="6-8">6–8</option><option value="9-12">9–12</option><option value="13-15">13–15</option><option value="16+">16+</option></select></label>
            <label>Languages used<input maxLength={150} value={newLanguages} onChange={(event) => setNewLanguages(event.target.value)} /><small>Comma-separated; keep this general.</small></label>
            <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : "Create learner profile"}</button>
          </form>
          <div className="privacy-mini"><span>☂</span><p>Speaking recordings in lessons stay in the learner’s tab and are never attached to profiles.</p></div>
        </aside>

        <div className="learner-dashboard-list">
          {loading && <div className="adult-empty">Loading the grown-up workspace…</div>}
          {!loading && profiles.length === 0 && <div className="adult-empty"><span>⌁</span><h2>Create the first learner profile</h2><p>Once created, this space will show six-skill progress, assignments and a launch link.</p></div>}
          {profiles.map((profile) => {
            const completion = Math.round((profile.progress.length / 108) * 100);
            const draft = assignmentDraft(profile.id);
            return (
              <article className="learner-profile-card" key={profile.id}>
                <header><div className="learner-avatar">{profile.displayName.slice(0, 1).toUpperCase()}</div><div><h2>{profile.displayName}</h2><p>{profile.ageBand === "not-specified" ? "Age not recorded" : `Age ${profile.ageBand}`} · {profile.homeLanguages.join(" · ") || "Languages not recorded"}</p></div><a className="primary-button" href={`/?learner=${encodeURIComponent(profile.id)}`}>Open learner view →</a></header>
                <div className="profile-progress-overview"><div className="profile-progress-ring" style={{ "--progress": `${completion * 3.6}deg` } as React.CSSProperties}><strong>{completion}%</strong></div><div><strong>{profile.progress.length}<small>/108</small></strong><span>guided sessions complete</span><div className="profile-linear"><i style={{ width: `${completion}%` }} /></div></div><button type="button" onClick={() => exportCsv(profile)}>Export CSV</button></div>
                <div className="skill-summary-row">{skills.map((skill) => { const count = profile.progress.filter((item) => item.skill === skill).length; return <div key={skill}><span>{skill.slice(0, 1).toUpperCase()}</span><strong>{count}<small>/18</small></strong><em>{skill}</em></div>; })}</div>
                <section className="assignment-builder"><div><p className="adult-eyebrow">Assign next</p><h3>Choose a module or one skill session</h3></div><select value={draft.lessonId} onChange={(event) => updateAssignmentDraft(profile.id, "lessonId", event.target.value)}>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.number}. {lesson.title}</option>)}</select><select value={draft.skill} onChange={(event) => updateAssignmentDraft(profile.id, "skill", event.target.value)}><option value="all">Whole module</option>{skills.map((skill) => <option value={skill} key={skill}>{skill}</option>)}</select><input aria-label="Due date" type="date" value={draft.dueAt} onChange={(event) => updateAssignmentDraft(profile.id, "dueAt", event.target.value)} /><button type="button" className="outline-button" disabled={saving} onClick={() => void createAssignment(profile.id)}>Assign</button><a className="worksheet-link" href={`/worksheets/${draft.lessonId}`} target="_blank" rel="noreferrer">Print worksheet ↗</a></section>
                {profile.assignments.length > 0 && <div className="assignment-list"><p className="adult-eyebrow">Assignments</p>{profile.assignments.filter((item) => item.status !== "archived").map((assignment) => <div key={assignment.id}><span className={`assignment-status ${assignment.status}`}>{assignment.status}</span><strong>{assignment.title}</strong><small>{assignment.dueAt ? `Due ${assignment.dueAt}` : "No due date"}</small><button type="button" onClick={() => void updateAssignment(assignment.id, assignment.status === "complete" ? "archived" : "complete")}>{assignment.status === "complete" ? "Archive" : "Mark complete"}</button></div>)}</div>}
                <footer className="profile-card-footer"><button type="button" className="danger-link" disabled={saving} onClick={() => void removeProfile(profile)}>Remove profile and delete its data</button></footer>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

