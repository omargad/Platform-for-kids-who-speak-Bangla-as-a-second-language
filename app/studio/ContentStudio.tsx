"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { lessons } from "../curriculum";
import { lessonExtensions } from "../learning-content";
import { useLanguage } from "../../lib/use-language";

type Tab = "governance" | "author" | "audio" | "videos";
type Review = { id: string; lessonId: string; reviewType: string; reviewerName: string; reviewerEmail: string; status: string; notes: string; updatedAt: string };
type Media = { id: string; lessonId: string; slot: string; originalName: string; speakerName: string; dialect: string; reviewStatus: string; consentConfirmed: boolean; byteSize: number; notes: string };
type VideoReview = { id: string; lessonId: string; status: string; captionsStatus: string; suitabilityStatus: string; replacementUrl: string; notes: string };
type Draft = { id: string; lessonId: string; title: string; level: string; status: string; dataJson: string; updatedAt: string };

const gates = [
  { id: "language", label: "Bangla language", description: "Grammar, register, transliteration and age-appropriate scaffolding", required: "Qualified Bangla educator or linguist" },
  { id: "culture", label: "Cultural representation", description: "Specificity, plurality, source accuracy and community perspective", required: "Named Bangladeshi cultural reviewer" },
  { id: "child-development", label: "Learning design", description: "Cognitive load, interaction, safeguarding and age fit", required: "Child-learning specialist or teacher" },
  { id: "accessibility", label: "Accessibility", description: "Keyboard, screen reader, captions, contrast and low-pressure alternatives", required: "Accessibility reviewer / user test" },
  { id: "video", label: "External media", description: "Availability, captions, channel suitability and exact learning segment", required: "Adult content reviewer" },
  { id: "legal-privacy", label: "Legal & privacy", description: "Data flow, notices, consent, retention and current jurisdictional rules", required: "Qualified legal/privacy review" },
];

export default function ContentStudio({ adultName = "" }: { adultName?: string }) {
  const [language, toggleLanguage] = useLanguage();
  const s = (en: string, bn: string) => (language === "bn" ? bn : en);
  const [tab, setTab] = useState<Tab>("governance");
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const approvedGates = reviews.filter((review) => review.status === "approved").length;
  const approvedAudio = media.filter((asset) => asset.reviewStatus === "approved").length;
  const checkedVideos = videos.filter((video) => video.status === "approved").length;
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId)!;
  const moduleReviews = useMemo(() => reviews.filter((review) => review.lessonId === selectedLessonId), [reviews, selectedLessonId]);

  useEffect(() => { void loadStudio(); }, []);

  async function loadStudio() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/studio/reviews", { cache: "no-store" });
      const data = await response.json() as { reviews?: Review[]; media?: Media[]; videos?: VideoReview[]; drafts?: Draft[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load the Content Studio.");
      setReviews(data.reviews || []);
      setMedia(data.media || []);
      setVideos(data.videos || []);
      setDrafts(data.drafts || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the Content Studio.");
    } finally {
      setLoading(false);
    }
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <main className="adult-app studio-app" lang={language}>
      <header className="adult-header">
        <Link className="adult-brand" href="/"><span>বা</span><span><strong>Bangla Adventures</strong><small>{s("Content Studio", "কনটেন্ট স্টুডিও")}</small></span></Link>
        <nav aria-label="Adult tools">
          <Link href="/family">{s("Learners", "শিক্ষার্থী")}</Link>
          <Link className="active" href="/studio">{s("Content Studio", "কনটেন্ট স্টুডিও")}</Link>
          <Link href="/worksheets">{s("Worksheets", "ওয়ার্কশিট")}</Link>
          <Link href="/safety">{s("Safety & access", "নিরাপত্তা ও প্রবেশ")}</Link>
          <Link href="/account">{s("Account", "অ্যাকাউন্ট")}</Link>
        </nav>
        <div className="adult-account">
          <button type="button" className="explore-lang" onClick={toggleLanguage}>{s("বাংলায় দেখুন", "View in English")}</button>
          {adultName && <span>{adultName}</span>}
          <a href="/api/auth/sign-out?returnTo=%2F">{s("Sign out", "সাইন আউট")}</a>
        </div>
      </header>

      <div className="adult-content studio-content">
      <section className="adult-hero studio-hero"><div><p className="adult-eyebrow">{s("Editorial operations", "সম্পাদকীয় কার্যক্রম")}</p><h1>{s("Publish only what named reviewers can stand behind.", "নামসহ পর্যালোচকরা যা সমর্থন করতে পারেন কেবল তাই প্রকাশ করুন।")}</h1><p>{s("The learning experience is complete in structure; this workspace makes language, culture, accessibility, media, child-development and legal approval explicit instead of implied.", "শেখার কাঠামো সম্পূর্ণ; এই কর্মক্ষেত্র ভাষা, সংস্কৃতি, প্রবেশগম্যতা, মিডিয়া, শিশু-বিকাশ ও আইনি অনুমোদনকে স্পষ্ট করে তোলে।")}</p></div><div className="adult-stat-strip"><span><strong>{approvedGates}<small>/108</small></strong>{s("review gates approved", "পর্যালোচনা ধাপ অনুমোদিত")}</span><span><strong>{approvedAudio}</strong>{s("human tracks active", "মানব ট্র্যাক সক্রিয়")}</span><span><strong>{checkedVideos}<small>/18</small></strong>{s("videos checked", "ভিডিও যাচাই")}</span></div></section>
      {error && <div className="adult-alert" role="alert"><strong>{s("Studio data notice", "স্টুডিও তথ্য বিজ্ঞপ্তি")}</strong><span>{error}</span><button type="button" onClick={() => void loadStudio()}>{s("Try again", "আবার চেষ্টা করুন")}</button></div>}
      {notice && <div className="studio-toast" role="status">✓ {notice}</div>}
      <nav className="studio-tabs" aria-label="Content Studio sections">
        {([{ id: "governance", label: s("Review gates", "পর্যালোচনা ধাপ"), icon: "✓" }, { id: "author", label: s("Curriculum drafts", "পাঠ্যক্রম খসড়া"), icon: "✎" }, { id: "audio", label: s("Human audio", "মানব অডিও"), icon: "♪" }, { id: "videos", label: s("Video checks", "ভিডিও যাচাই"), icon: "▶" }] as const).map((item) => <button type="button" key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id as Tab)}><span>{item.icon}</span>{item.label}</button>)}
      </nav>

      <div className="studio-toolbar"><label>{s("Working module", "কর্মরত মডিউল")}<select value={selectedLessonId} onChange={(event) => setSelectedLessonId(event.target.value)}>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.number}. {language === "bn" ? lesson.titleBn : lesson.title} · {lesson.level.toUpperCase()}</option>)}</select></label><div><span className={`review-pill ${moduleReviews.filter((review) => review.status === "approved").length === 6 ? "approved" : ""}`}>{moduleReviews.filter((review) => review.status === "approved").length}/6 {s("gates approved", "ধাপ অনুমোদিত")}</span><a href={`/?module=${selectedLessonId}`} target="_blank">{s("Preview module ↗", "মডিউল প্রিভিউ ↗")}</a></div></div>

      {language === "bn" && <p className="studio-review-note" role="note">সম্পাদকীয় সরঞ্জামের বিস্তারিত অংশ এখনও ইংরেজিতে; পেশাদার বাংলা পর্যালোচনার পর অনুবাদ হবে।</p>}

      {loading && <div className="adult-empty">{s("Loading editorial records…", "সম্পাদকীয় রেকর্ড লোড হচ্ছে…")}</div>}

      {!loading && tab === "governance" && <section className="review-gates"><header><div><p className="adult-eyebrow">Release gates</p><h2>{selectedLesson.title}</h2></div><p>Approval requires a named reviewer. “Built” is not the same as independently verified.</p></header><div className="review-gate-grid">{gates.map((gate) => <ReviewGate key={`${selectedLessonId}-${gate.id}`} lessonId={selectedLessonId} gate={gate} existing={moduleReviews.find((review) => review.reviewType === gate.id)} onSaved={async () => { await loadStudio(); flash(`${gate.label} review saved.`); }} />)}</div></section>}

      {!loading && tab === "author" && <DraftEditor key={selectedLessonId} lessonId={selectedLessonId} drafts={drafts.filter((draft) => draft.lessonId === selectedLessonId)} onSaved={async () => { await loadStudio(); flash("Curriculum draft saved."); }} />}

      {!loading && tab === "audio" && <AudioStudio key={selectedLessonId} lessonId={selectedLessonId} media={media.filter((asset) => asset.lessonId === selectedLessonId)} onSaved={async (message) => { await loadStudio(); flash(message); }} />}

      {!loading && tab === "videos" && <VideoStudio key={selectedLessonId} lessonId={selectedLessonId} existing={videos.find((video) => video.lessonId === selectedLessonId)} onSaved={async () => { await loadStudio(); flash("Video review saved."); }} />}
      </div>
    </main>
  );
}

function ReviewGate({ lessonId, gate, existing, onSaved }: { lessonId: string; gate: typeof gates[number]; existing?: Review; onSaved: () => Promise<void> }) {
  const [status, setStatus] = useState(existing?.status || "not-started");
  const [name, setName] = useState(existing?.reviewerName || "");
  const [email, setEmail] = useState(existing?.reviewerEmail || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setSaving(true); setError("");
    const response = await fetch("/api/studio/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, reviewType: gate.id, status, reviewerName: name, reviewerEmail: email, notes }) });
    const data = await response.json() as { error?: string };
    if (!response.ok) setError(data.error || "Could not save this review."); else await onSaved();
    setSaving(false);
  }
  return <article className={`review-gate-card ${status}`}><header><span>{status === "approved" ? "✓" : status === "changes-requested" ? "!" : "○"}</span><div><h3>{gate.label}</h3><p>{gate.description}</p></div></header><small>Required reviewer: {gate.required}</small><div className="review-fields"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="not-started">Not started</option><option value="in-review">In review</option><option value="changes-requested">Changes requested</option><option value="approved">Approved</option></select></label><label>Reviewer name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Required for approval" /></label><label>Reviewer email (optional)<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="wide">Decision notes<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Evidence checked, changes needed, scope and date…" /></label></div>{error && <p className="field-error">{error}</p>}<button type="button" className="outline-button" onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save gate"}</button></article>;
}

function DraftEditor({ lessonId, drafts, onSaved }: { lessonId: string; drafts: Draft[]; onSaved: () => Promise<void> }) {
  const lesson = lessons.find((item) => item.id === lessonId)!;
  const newest = drafts[0];
  const sourceDocument = JSON.stringify({ module: lesson, sessions: lessonExtensions[lessonId] }, null, 2);
  const [draftId, setDraftId] = useState(newest?.id || "");
  const [title, setTitle] = useState(newest?.title || lesson.title);
  const [status, setStatus] = useState(newest?.status || "draft");
  const [dataJson, setDataJson] = useState(newest?.dataJson || sourceDocument);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function save() { setSaving(true); setError(""); const response = await fetch("/api/studio/drafts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: draftId || undefined, lessonId, title, level: lesson.level, status, dataJson }) }); const data = await response.json() as { draft?: Draft; error?: string }; if (!response.ok) setError(data.error || "Could not save draft."); else { if (data.draft) setDraftId(data.draft.id); await onSaved(); } setSaving(false); }
  return <section className="draft-editor"><header><div><p className="adult-eyebrow">Structured authoring</p><h2>Curriculum draft · {lesson.title}</h2><p>Edit a complete module document. Drafts never silently replace live child-facing content; release requires review gates and a verified deployment.</p></div><div><label>Workflow status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="draft">Draft</option><option value="ready-for-review">Ready for review</option><option value="approved-for-release">Approved for release</option><option value="archived">Archived</option></select></label><button type="button" className="primary-button" onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save draft"}</button></div></header><label>Draft title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Structured module JSON<textarea className="code-editor" rows={28} value={dataJson} onChange={(event) => setDataJson(event.target.value)} spellCheck={false} /></label>{error && <p className="field-error">{error}</p>}<aside className="editorial-boundary"><span>↗</span><p><strong>Release boundary:</strong> “Approved for release” records an editorial decision; it does not bypass source control, automated checks or deployment review.</p></aside></section>;
}

function AudioStudio({ lessonId, media, onSaved }: { lessonId: string; media: Media[]; onSaved: (message: string) => Promise<void> }) {
  const [slot, setSlot] = useState("dialogue"); const [speakerName, setSpeakerName] = useState(""); const [dialect, setDialect] = useState("Bangladesh standard"); const [consent, setConsent] = useState(false); const [file, setFile] = useState<File | null>(null); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  async function upload(event: React.FormEvent) { event.preventDefault(); if (!file) { setError("Choose an audio file."); return; } setSaving(true); setError(""); const form = new FormData(); form.set("file", file); form.set("lessonId", lessonId); form.set("slot", slot); form.set("speakerName", speakerName); form.set("dialect", dialect); form.set("consentConfirmed", String(consent)); const response = await fetch("/api/studio/media", { method: "POST", body: form }); const data = await response.json() as { error?: string }; if (!response.ok) setError(data.error || "Upload failed."); else { setFile(null); setConsent(false); await onSaved("Human audio uploaded for review."); } setSaving(false); }
  async function update(id: string, reviewStatus: string) { const response = await fetch("/api/studio/media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, reviewStatus, notes: reviewStatus === "approved" ? "Approved in Content Studio" : "" }) }); const data = await response.json() as { error?: string }; if (!response.ok) setError(data.error || "Could not update audio."); else await onSaved(reviewStatus === "approved" ? "Approved human audio is now the learner playback source." : "Audio status updated."); }
  return <section className="audio-studio"><div className="audio-workflow-intro"><div><p className="adult-eyebrow">Replacement-ready voice system</p><h2>Human narration with consent and rollback</h2><p>Bundled synthetic Bangla remains available until a named speaker’s recording is uploaded, reviewed and approved for the exact module slot.</p></div><ol><li><span>1</span>Record with a native/proficient speaker</li><li><span>2</span>Confirm consent and credit</li><li><span>3</span>Review language and audio quality</li><li><span>4</span>Approve; old track is retained/retired</li></ol></div><form className="audio-upload-form" onSubmit={upload}><label>Audio slot<select value={slot} onChange={(event) => setSlot(event.target.value)}><option value="dialogue">Complete dialogue</option><option value="reading">Guided reading</option>{[1,2,3,4,5,6].map((index) => <option key={`word-${index}`} value={`word-${index}`}>Vocabulary word {index}</option>)}<option value="pattern-1">Pattern 1</option><option value="pattern-2">Pattern 2</option></select></label><label>Speaker name<input required value={speakerName} onChange={(event) => setSpeakerName(event.target.value)} /></label><label>Dialect / register<input required value={dialect} onChange={(event) => setDialect(event.target.value)} /></label><label>Audio file<input required type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /><small>MP3, WAV, OGG, M4A or WebM · maximum 12 MB</small></label><label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I confirm the speaker (and guardian where applicable) consented to this educational use and credit.</span></label><button type="submit" className="primary-button" disabled={saving}>{saving ? "Uploading…" : "Upload for review"}</button>{error && <p className="field-error">{error}</p>}</form><div className="media-asset-list"><header><h3>Tracks for this module</h3><span>{media.length} uploaded · {media.filter((asset) => asset.reviewStatus === "approved").length} active</span></header>{media.length === 0 && <div className="adult-empty compact"><p>No human recordings yet. Learners hear the bundled, clearly-labelled synthetic fallback.</p></div>}{media.map((asset) => <article key={asset.id}><span className={`asset-status ${asset.reviewStatus}`}>{asset.reviewStatus}</span><div><strong>{asset.slot}</strong><p>{asset.speakerName} · {asset.dialect}</p><small>{asset.originalName} · {(asset.byteSize / 1024 / 1024).toFixed(1)} MB · consent {asset.consentConfirmed ? "confirmed" : "missing"}</small></div><div>{asset.reviewStatus !== "approved" && <button type="button" onClick={() => void update(asset.id, "approved")}>Approve & activate</button>}{asset.reviewStatus === "approved" && <button type="button" onClick={() => void update(asset.id, "retired")}>Retire</button>}<button type="button" onClick={() => void update(asset.id, "changes-requested")}>Request changes</button></div></article>)}</div></section>;
}

function VideoStudio({ lessonId, existing, onSaved }: { lessonId: string; existing?: VideoReview; onSaved: () => Promise<void> }) {
  const lesson = lessons.find((item) => item.id === lessonId)!; const [status, setStatus] = useState(existing?.status || "pending"); const [captions, setCaptions] = useState(existing?.captionsStatus || "unchecked"); const [suitability, setSuitability] = useState(existing?.suitabilityStatus || "unchecked"); const [replacement, setReplacement] = useState(existing?.replacementUrl || ""); const [notes, setNotes] = useState(existing?.notes || ""); const [error, setError] = useState("");
  async function save() { setError(""); const response = await fetch("/api/studio/video-reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, status, captionsStatus: captions, suitabilityStatus: suitability, replacementUrl: replacement, notes }) }); const data = await response.json() as { error?: string }; if (!response.ok) setError(data.error || "Could not save the video review."); else await onSaved(); }
  return <section className="video-studio"><div className="video-review-card"><div className="video-review-preview"><span>▶</span><div><small>Current lesson video</small><h2>{lesson.video.title}</h2><p>{lesson.video.channel} · {lesson.video.duration}</p><a href={`https://www.youtube.com/watch?v=${lesson.video.id}`} target="_blank" rel="noreferrer">Open and verify on YouTube ↗</a></div></div><div className="video-pedagogy-review"><p className="adult-eyebrow">Pedagogy already attached</p><ul><li><strong>Before:</strong> {lessonExtensions[lessonId].watch.before}</li><li><strong>During:</strong> {lessonExtensions[lessonId].watch.during}</li><li><strong>After:</strong> {lessonExtensions[lessonId].watch.after}</li><li><strong>Segment:</strong> {lessonExtensions[lessonId].watch.segment}</li></ul></div></div><div className="video-review-form"><h3>Availability, captions and suitability check</h3><div><label>Overall status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="replace">Replace</option><option value="unavailable">Unavailable</option></select></label><label>Captions<select value={captions} onChange={(event) => setCaptions(event.target.value)}><option value="unchecked">Unchecked</option><option value="available">Available</option><option value="partial">Partial / auto only</option><option value="missing">Missing</option></select></label><label>Child suitability<select value={suitability} onChange={(event) => setSuitability(event.target.value)}><option value="unchecked">Unchecked</option><option value="suitable">Suitable</option><option value="supervision-required">Supervision required</option><option value="unsuitable">Unsuitable</option></select></label></div><label>Replacement URL (if needed)<input type="url" value={replacement} onChange={(event) => setReplacement(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></label><label>Review notes<textarea rows={6} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Date checked, exact segment, ads/recommendations, captions, unsuitable moments, replacement rationale…" /></label>{error && <p className="field-error">{error}</p>}<button type="button" className="primary-button" onClick={() => void save()}>Save video check</button></div></section>;
}
