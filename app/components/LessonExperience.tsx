"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "../curriculum";
import { lessonExtensions, lessonSessionSkills, type LearningSkill, type QuickCheck } from "../learning-content";

type Language = "en" | "bn";
type Cue = "tap" | "success" | "retry" | "star";
type LessonStep = "overview" | LearningSkill;

type LevelBand = {
  code: string;
  title: string;
  titleBn: string;
  tone: string;
};

type LessonExperienceProps = {
  lesson: Lesson;
  level: LevelBand;
  language: Language;
  completed: string[];
  soundEnabled: boolean;
  isSpeaking: boolean;
  onSpeak: (text: string, lang?: string, fallbackSource?: string) => void;
  onStopAudio: () => void;
  onAward: (activity: string, amount?: number) => void;
  onCue: (cue: Cue) => void;
  onClose: () => void;
};

const steps: LessonStep[] = [
  "overview",
  "listening",
  "reading",
  "speaking",
  "writing",
  "culture",
  "mastery",
];

const labels: Record<Language, Record<LessonStep, string>> = {
  en: {
    overview: "Overview",
    listening: "Listen",
    reading: "Read",
    speaking: "Speak",
    writing: "Write",
    culture: "Watch",
    mastery: "Mastery",
  },
  bn: {
    overview: "শুরু",
    listening: "শুনি",
    reading: "পড়ি",
    speaking: "বলি",
    writing: "লিখি",
    culture: "দেখি",
    mastery: "যাচাই",
  },
};

function sessionKey(lessonId: string, skill: LearningSkill) {
  return `session-${lessonId}-${skill}`;
}

function QuickCheckCard({
  check,
  answer,
  submitted,
  onAnswer,
  onSubmit,
}: {
  check: QuickCheck;
  answer: number | null;
  submitted: boolean;
  onAnswer: (answer: number) => void;
  onSubmit: () => void;
}) {
  const correct = answer === check.answer;
  return (
    <section className="session-check" aria-label="Quick check">
      <p className="modal-kicker">Quick check · ছোট যাচাই</p>
      <h4>{check.prompt}</h4>
      <div className="session-check-options">
        {check.options.map((option, index) => (
          <button
            type="button"
            key={option}
            className={`${answer === index ? "selected" : ""} ${submitted && answer === index ? (correct ? "correct" : "wrong") : ""}`}
            aria-pressed={answer === index}
            onClick={() => onAnswer(index)}
          >
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
      </div>
      <button className="outline-button compact-button" type="button" onClick={onSubmit}>
        Check this answer
      </button>
      {submitted && (
        <p className={`session-feedback ${correct ? "success" : "retry"}`} role="status">
          <strong>{correct ? "✓ That’s it." : "↻ Try once more."}</strong> {check.explanation}
        </p>
      )}
    </section>
  );
}

export default function LessonExperience({
  lesson,
  level,
  language,
  completed,
  soundEnabled,
  isSpeaking,
  onSpeak,
  onStopAudio,
  onAward,
  onCue,
  onClose,
}: LessonExperienceProps) {
  const extension = lessonExtensions[lesson.id];
  const [step, setStep] = useState<LessonStep>("overview");
  const [showTranscript, setShowTranscript] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [listenAnswer, setListenAnswer] = useState<number | null>(null);
  const [listenSubmitted, setListenSubmitted] = useState(false);
  const [readAnswer, setReadAnswer] = useState<number | null>(null);
  const [readSubmitted, setReadSubmitted] = useState(false);
  const [writing, setWriting] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [watchChecks, setWatchChecks] = useState([false, false, false]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "ready">("idle");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const paneHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const completeSessions = useMemo(
    () => lessonSessionSkills.filter((skill) => completed.includes(sessionKey(lesson.id, skill))).length,
    [completed, lesson.id],
  );

  useEffect(() => {
    const url = recordingUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [recordingUrl]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!extension) {
    return (
      <div className="lesson-shell lesson-content-missing">
        <h2>Lesson content is being reviewed.</h2>
        <button type="button" className="primary-button" onClick={onClose}>Close</button>
      </div>
    );
  }

  const allQuizAnswered = lesson.quiz.every((_, index) => quizAnswers[index] !== undefined);
  const allQuizCorrect = allQuizAnswered && lesson.quiz.every((question, index) => quizAnswers[index] === question.answer);

  function changeStep(nextStep: LessonStep) {
    onStopAudio();
    onCue("tap");
    setStep(nextStep);
    window.setTimeout(() => paneHeadingRef.current?.focus(), 0);
  }

  function complete(skill: LearningSkill) {
    onAward(sessionKey(lesson.id, skill));
  }

  function submitListen() {
    setListenSubmitted(true);
    if (listenAnswer === extension.listening.check.answer) {
      onCue("success");
      complete("listening");
    } else {
      onCue("retry");
    }
  }

  function submitRead() {
    setReadSubmitted(true);
    if (readAnswer === extension.reading.check.answer) {
      onCue("success");
      complete("reading");
    } else {
      onCue("retry");
    }
  }

  async function startRecording() {
    setRecordingError("");
    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setRecordingError("Recording is not supported in this browser. You can still rehearse aloud and complete the session.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setRecordingUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        setRecordingState("ready");
      };
      recorder.start();
      setRecordingState("recording");
    } catch {
      setRecordingError("Microphone access was not granted. Nothing was recorded; rehearse aloud or try again when you are ready.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  function deleteRecording() {
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null);
    setRecordingState("idle");
    setRecordingError("");
  }

  function submitMastery() {
    setQuizSubmitted(true);
    if (!allQuizAnswered) {
      onCue("retry");
      return;
    }
    if (allQuizCorrect) {
      onAward(sessionKey(lesson.id, "mastery"));
      onAward(`lesson-${lesson.id}`, 2);
    } else {
      onCue("retry");
    }
  }

  const stepIndex = steps.indexOf(step);
  const isSessionStep = step !== "overview";
  const currentSessionComplete = isSessionStep && completed.includes(sessionKey(lesson.id, step));
  const sectionTitle = labels[language][step];

  return (
    <div className="lesson-shell expanded-lesson-shell">
      <header className={`lesson-modal-hero ${level.tone}`}>
        <div className="lesson-modal-meta">
          <span>{level.code}</span>
          <span>{language === "en" ? "Module" : "মডিউল"} {lesson.number} / 18</span>
          <span>6 {language === "en" ? "guided sessions" : "টি শেখার ধাপ"}</span>
        </div>
        <div className="lesson-modal-title-row">
          <div>
            <p>{level.title} · <span lang="bn">{level.titleBn}</span></p>
            <h2>{lesson.title}</h2>
            <p className="lesson-modal-title-bn" lang="bn">{lesson.titleBn}</p>
          </div>
          <span className={`module-session-seal ${completeSessions === 6 ? "complete" : ""}`}>
            <strong>{completeSessions}/6</strong><small>{completeSessions === 6 ? "Module complete" : "sessions complete"}</small>
          </span>
        </div>
        <div className="lesson-step-progress" aria-label={`${completeSessions} of 6 sessions complete`}>
          {lessonSessionSkills.map((skill) => (
            <span key={skill} className={completed.includes(sessionKey(lesson.id, skill)) ? "filled" : ""} />
          ))}
        </div>
      </header>

      <nav className="lesson-step-tabs expanded-tabs" aria-label={language === "en" ? "Module sections" : "মডিউলের অংশ"}>
        {steps.map((item, index) => (
          <button
            type="button"
            key={item}
            className={`${step === item ? "active" : ""} ${item !== "overview" && completed.includes(sessionKey(lesson.id, item)) ? "complete" : ""}`}
            aria-current={step === item ? "step" : undefined}
            onClick={() => changeStep(item)}
          >
            <span>{item === "overview" ? "⌂" : index}</span>{labels[language][item]}
          </button>
        ))}
      </nav>

      <div className="lesson-pane expanded-lesson-pane">
        <h3 ref={paneHeadingRef} className="sr-only" tabIndex={-1}>{sectionTitle}</h3>

        {step === "overview" && (
          <div className="lesson-start-pane">
            <div className="module-overview-banner">
              <div><span>108-session pathway</span><strong>6 × {lesson.duration}</strong></div>
              <p>{lesson.summary}</p>
            </div>
            <div className="lesson-can-do large">
              <span aria-hidden="true">✓</span>
              <p><strong>By the end, I can…</strong>{lesson.canDo}</p>
            </div>
            <div className="lesson-start-grid">
              <section>
                <p className="modal-kicker">Learning goals · শেখার লক্ষ্য</p>
                <ol className="objective-list">
                  {lesson.objectives.map((objective, index) => <li key={objective}><span>{index + 1}</span>{objective}</li>)}
                </ol>
              </section>
              <section className="lesson-route-card six-session-route">
                <p className="modal-kicker">Six-session route · ছয় ধাপের পথ</p>
                <ul>
                  {lessonSessionSkills.map((skill, index) => (
                    <li key={skill}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{labels[language][skill]}</strong>
                      <small>{completed.includes(sessionKey(lesson.id, skill)) ? "✓ Complete" : skill === "culture" ? "video + culture inquiry" : `${skill} practice`}</small>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <aside className="adaptive-tip">
              <span aria-hidden="true">↺</span>
              <div><strong>Adaptive route</strong><p>Start with Listen. If a check feels difficult, replay with the transcript, visit Read, then return. Confident learners can go straight to the skill they need.</p></div>
            </aside>
          </div>
        )}

        {step === "listening" && (
          <div className="session-pane listening-session">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 1 · Listening · শোনা</p>
              <h3>Hear the whole message before decoding every word</h3>
              <p>{extension.listening.focus}</p>
            </div>
            <div className="audio-story-card">
              <div className="audio-story-controls">
                <button
                  type="button"
                  className={`primary-button coral ${isSpeaking ? "is-speaking" : ""}`}
                  disabled={!soundEnabled}
                  onClick={() => onSpeak(extension.dialogue.map((line) => `${line.speaker}। ${line.bn}`).join(" "), "bn-BD", `/api/audio/${lesson.id}/dialogue`)}
                >
                  <span aria-hidden="true">♪</span>{isSpeaking ? "Playing dialogue…" : "Play complete dialogue"}
                </button>
                <button type="button" className="text-button" onClick={() => setShowTranscript((value) => !value)}>{showTranscript ? "Hide transcript" : "Reveal transcript after listening"}</button>
              </div>
              <p className="audio-source-note">Bundled Bangla voice model · replay as often as needed · no timer</p>
              {showTranscript ? (
                <ol className="dialogue-transcript">
                  {extension.dialogue.map((line, index) => (
                    <li key={`${line.speaker}-${line.bn}`}>
                      <button type="button" onClick={() => onSpeak(line.bn, "bn-BD")} disabled={!soundEnabled} aria-label={`Play line ${index + 1}`}>♪</button>
                      <div><span>{line.speaker}</span><strong lang="bn">{line.bn}</strong><em>/{line.transliteration}/</em><p>{line.en}</p></div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="transcript-gate"><span aria-hidden="true">👂</span><p>First listen: names, places, feelings or actions.<br />Second listen: exact words and sequence.</p></div>
              )}
            </div>
            <QuickCheckCard check={extension.listening.check} answer={listenAnswer} submitted={listenSubmitted} onAnswer={(answer) => { setListenAnswer(answer); setListenSubmitted(false); }} onSubmit={submitListen} />
          </div>
        )}

        {step === "reading" && (
          <div className="session-pane reading-session">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 2 · Reading · পড়া</p>
              <h3>{extension.reading.title}</h3>
              <p>Read for the main idea, listen, then reread for detail. The English scaffold is optional.</p>
            </div>
            <article className="guided-reading-card">
              <div className="guided-reading-toolbar">
                <button type="button" className="listen-line" disabled={!soundEnabled} onClick={() => onSpeak(extension.reading.bn, "bn-BD", `/api/audio/${lesson.id}/reading`)}>♪ Read aloud in Bangla</button>
                <button type="button" className="text-button" onClick={() => setShowEnglish((value) => !value)}>{showEnglish ? "Hide English scaffold" : "Show English scaffold"}</button>
              </div>
              <p className="guided-reading-bn" lang="bn">{extension.reading.bn}</p>
              {showEnglish && <p className="guided-reading-en">{extension.reading.en}</p>}
            </article>
            <div className="reading-glossary">
              <p className="modal-kicker">Word bank</p>
              <div>{lesson.vocabulary.map((word) => <span key={word.bn}><strong lang="bn">{word.bn}</strong><small>{word.en}</small></span>)}</div>
            </div>
            <QuickCheckCard check={extension.reading.check} answer={readAnswer} submitted={readSubmitted} onAnswer={(answer) => { setReadAnswer(answer); setReadSubmitted(false); }} onSubmit={submitRead} />
          </div>
        )}

        {step === "speaking" && (
          <div className="session-pane speaking-session">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 3 · Speaking · বলা</p>
              <h3>Rehearse, record locally if you choose, then reflect</h3>
              <p>{extension.speaking.mission}</p>
            </div>
            <div className="roleplay-grid">
              <article><span>A</span><h4>First role</h4><p>{extension.speaking.roleA}</p></article>
              <article><span>B</span><h4>Second role</h4><p>{extension.speaking.roleB}</p></article>
            </div>
            <aside className="pronunciation-lab"><span aria-hidden="true">◌</span><div><p className="modal-kicker">Pronunciation focus—not accent scoring</p><p>{extension.speaking.pronunciation}</p></div></aside>
            <section className="local-recorder">
              <div>
                <p className="modal-kicker">Optional record & compare</p>
                <h4>Your recording stays inside this tab</h4>
                <p>The microphone is requested only when you press record. Audio is never uploaded and disappears when you close or delete it.</p>
              </div>
              <div className="recorder-actions">
                {recordingState === "idle" && <button type="button" className="primary-button coral" onClick={startRecording}>● Allow mic & record</button>}
                {recordingState === "recording" && <button type="button" className="primary-button recording-button" onClick={stopRecording}>■ Stop recording</button>}
                {recordingUrl && <audio className="learner-recording" controls src={recordingUrl}>Your browser cannot play this recording.</audio>}
                {recordingUrl && <button type="button" className="text-button danger" onClick={deleteRecording}>Delete this recording</button>}
              </div>
              {recordingError && <p className="recording-error" role="alert">{recordingError}</p>}
            </section>
            <div className="success-checklist">
              <p className="modal-kicker">Reflect, don’t rank</p>
              {extension.speaking.success.map((item) => <label key={item}><input type="checkbox" /> <span>{item}</span></label>)}
            </div>
            <button type="button" className="primary-button session-complete-button" onClick={() => complete("speaking")} disabled={currentSessionComplete}>{currentSessionComplete ? "✓ Speaking session complete" : "I rehearsed and reflected"}</button>
          </div>
        )}

        {step === "writing" && (
          <div className="session-pane writing-session">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 4 · Writing · লেখা</p>
              <h3>Build a message with support, then make it yours</h3>
              <p>{extension.writing.mission}</p>
            </div>
            <div className="writing-workbench">
              <div className="sentence-starters">
                <p className="modal-kicker">Tap a starter to add it</p>
                {extension.writing.starters.map((starter) => <button type="button" key={starter} onClick={() => setWriting((current) => `${current}${current ? "\n" : ""}${starter}`)} lang="bn">+ {starter}</button>)}
              </div>
              <label className="writing-pad">
                <span>Your draft · তোমার লেখা</span>
                <textarea value={writing} onChange={(event) => setWriting(event.target.value)} placeholder="Write, copy or trace here. English planning is allowed." rows={8} />
                <small>{writing.length} characters · saved only while this module is open</small>
              </label>
              <div className="model-answer-card">
                <button type="button" className="text-button" onClick={() => setShowModel((value) => !value)}>{showModel ? "Hide model" : "Reveal one possible model after trying"}</button>
                {showModel && <div><p lang="bn">{extension.writing.modelBn}</p><p>{extension.writing.modelEn}</p><small>Model, not the only correct answer</small></div>}
              </div>
              <aside className="stretch-card"><span aria-hidden="true">↗</span><p><strong>Stretch:</strong> {extension.writing.stretch}</p></aside>
            </div>
            <button type="button" className="primary-button session-complete-button" disabled={writing.trim().length < 5 || currentSessionComplete} onClick={() => complete("writing")}>{currentSessionComplete ? "✓ Writing session complete" : writing.trim().length < 5 ? "Add a short draft to complete" : "I drafted and checked my message"}</button>
          </div>
        )}

        {step === "culture" && (
          <div className="session-pane lesson-watch-pane">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 5 · Video & culture · দেখা ও সংস্কৃতি</p>
              <h3>{lesson.video.title}</h3>
              <p>{lesson.video.reason}</p>
            </div>
            <div className="video-learning-cycle">
              {[{ label: "Before", text: extension.watch.before }, { label: "During", text: extension.watch.during }, { label: "After", text: extension.watch.after }].map((item, index) => (
                <label key={item.label} className={watchChecks[index] ? "complete" : ""}>
                  <input type="checkbox" checked={watchChecks[index]} onChange={() => setWatchChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} />
                  <span>{index + 1}</span><div><strong>{item.label}</strong><p>{item.text}</p></div>
                </label>
              ))}
            </div>
            <div className="video-resource-meta">
              <span>YouTube</span><strong>{lesson.video.channel}</strong><span>{lesson.video.duration}</span><em>{extension.watch.segment}</em>
              <a href={`https://www.youtube.com/watch?v=${lesson.video.id}`} target="_blank" rel="noreferrer">Open on YouTube ↗</a>
            </div>
            {videoLoaded ? (
              <div className="lesson-video-frame">
                <iframe src={`https://www.youtube-nocookie.com/embed/${lesson.video.id}?rel=0&cc_load_policy=1`} title={lesson.video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
            ) : (
              <div className="video-gate">
                <div className="video-gate-art" aria-hidden="true"><span>▶</span><i>নদী · গল্প · বাংলা</i></div>
                <div><h4>Load only when you are ready</h4><p>YouTube stays disconnected until this button is pressed. Loading applies YouTube’s privacy terms. A grown-up should preview and supervise external media.</p><button type="button" className="primary-button coral" onClick={() => setVideoLoaded(true)}>Load privacy-enhanced video ▶</button></div>
              </div>
            )}
            <a className="playlist-card" href={`https://www.youtube.com/playlist?list=${lesson.playlist.id}`} target="_blank" rel="noreferrer"><span className="playlist-icon" aria-hidden="true">☷</span><span><small>Curated follow-on playlist</small><strong>{lesson.playlist.title}</strong><em>{lesson.playlist.channel} · external YouTube</em></span><span aria-hidden="true">↗</span></a>
            <aside className="media-review-note"><span aria-hidden="true">CC</span><p><strong>Caption and availability check:</strong> captions and recommendations are controlled by YouTube and may change. The adult Content Studio includes a link, caption and suitability review queue.</p></aside>
            <button type="button" className="primary-button session-complete-button" disabled={!watchChecks.every(Boolean) || currentSessionComplete} onClick={() => complete("culture")}>{currentSessionComplete ? "✓ Video & culture session complete" : watchChecks.every(Boolean) ? "I completed before, during and after" : "Complete the three viewing prompts"}</button>
          </div>
        )}

        {step === "mastery" && (
          <div className="session-pane lesson-check-pane">
            <div className="lesson-pane-heading">
              <p className="modal-kicker">Session 6 · Mastery · দক্ষতা যাচাই</p>
              <h3>Show what you know, then choose the right review</h3>
              <p>No timer and no penalty. Explanations point back to the most useful session.</p>
            </div>
            <div className="lesson-quiz-list">
              {lesson.quiz.map((question, questionIndex) => {
                const selectedAnswer = quizAnswers[questionIndex];
                const correct = selectedAnswer === question.answer;
                return (
                  <fieldset className="lesson-quiz-question" key={question.question}>
                    <legend><span>{questionIndex + 1}</span>{question.question}</legend>
                    <div className="lesson-quiz-options">
                      {question.options.map((option, optionIndex) => (
                        <button type="button" key={option} className={`${selectedAnswer === optionIndex ? "selected" : ""} ${quizSubmitted && selectedAnswer === optionIndex ? (correct ? "correct" : "wrong") : ""}`} aria-pressed={selectedAnswer === optionIndex} onClick={() => { setQuizAnswers((current) => ({ ...current, [questionIndex]: optionIndex })); setQuizSubmitted(false); }}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>
                      ))}
                    </div>
                    {quizSubmitted && selectedAnswer !== undefined && <p className={correct ? "answer-explanation correct" : "answer-explanation wrong"}><strong>{correct ? "✓" : "↻"}</strong>{question.explanation}</p>}
                  </fieldset>
                );
              })}
            </div>
            {quizSubmitted && (
              <div className={`mastery-result ${allQuizCorrect ? "success" : "retry"}`} role="status">
                <strong>{!allQuizAnswered ? "Choose every answer first." : allQuizCorrect ? "Module mastered—your six-session badge is complete." : "A short review will help."}</strong>
                {!allQuizCorrect && allQuizAnswered && <div><button type="button" onClick={() => changeStep("listening")}>Replay Listen</button><button type="button" onClick={() => changeStep("reading")}>Review Read</button></div>}
              </div>
            )}
            <button className="primary-button lesson-check-button" type="button" onClick={submitMastery}>Check my answers <span aria-hidden="true">✓</span></button>
          </div>
        )}
      </div>

      <div className="lesson-modal-footer expanded-footer">
        <button type="button" onClick={() => changeStep(steps[Math.max(0, stepIndex - 1)])} disabled={stepIndex === 0}>← Previous</button>
        <span>{stepIndex === 0 ? "Overview" : `Session ${stepIndex} of 6`} {currentSessionComplete ? "· ✓ complete" : ""}</span>
        {stepIndex === steps.length - 1 ? <button className="primary-button" type="button" onClick={onClose}>Close module ×</button> : <button className="primary-button" type="button" onClick={() => changeStep(steps[stepIndex + 1])}>Next <span aria-hidden="true">→</span></button>}
      </div>
    </div>
  );
}

