import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { after, before } from "node:test";

/**
 * End-to-end classroom flow against the production server:
 * teacher signs up → creates a class → sets an activity + announcement →
 * student joins with the code → feed hides the answer key → student submits →
 * teacher sees the graded submission → knowledge-source override flows to the
 * public library API.
 */

const PORT = 3212;
const BASE = `http://127.0.0.1:${PORT}`;
const stateDir = mkdtempSync(path.join(tmpdir(), "bangla-class-"));
let server;

function cookieFrom(response) {
  const header = response.headers.getSetCookie?.() ?? [];
  const session = header.find((value) => value.startsWith("ba_adult_session="));
  return session ? session.split(";")[0] : null;
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/safety`);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Server did not become ready in time");
}

before(async () => {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: new URL("../..", import.meta.url).pathname,
    env: {
      ...process.env,
      NODE_ENV: "production",
      DATABASE_PATH: path.join(stateDir, "test.db"),
      MEDIA_ROOT: path.join(stateDir, "media"),
    },
    stdio: "ignore",
  });
  await waitForServer();
});

after(() => {
  server?.kill("SIGTERM");
  rmSync(stateDir, { recursive: true, force: true });
});

let teacherCookie;
let classId;
let joinCode;
let activityId;
let studentToken;

test("teacher signs up and creates a class with a join code", async () => {
  const signUp = await fetch(`${BASE}/api/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "teacher@example.com", displayName: "Ms Rahman", password: "sunny-river-42" }),
  });
  assert.equal(signUp.status, 201);
  teacherCookie = cookieFrom(signUp);
  assert.ok(teacherCookie, "session cookie issued");

  const created = await fetch(`${BASE}/api/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ name: "Sunday Level 2" }),
  });
  assert.equal(created.status, 201);
  const data = await created.json();
  classId = data.class.id;
  joinCode = data.class.joinCode;
  assert.match(joinCode, /^[A-Z2-9]{6}$/);
});

test("teacher publishes an announcement and a quiz activity", async () => {
  const announced = await fetch(`${BASE}/api/classes/${classId}/announcements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ body: "This term's theme is festivals!" }),
  });
  assert.equal(announced.status, 201);

  const activity = await fetch(`${BASE}/api/classes/${classId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({
      title: "Festivals check-in",
      instructions: "Read the Pohela Boishakh topic first.",
      topicId: "pohela-boishakh",
      questions: [
        { prompt: "Which month starts the Bengali year?", options: ["Boishakh", "Poush"], answer: 0 },
        { prompt: "What do shops open on Pohela Boishakh?", options: ["Halkhata", "Umbrellas", "Kites"], answer: 0 },
      ],
    }),
  });
  assert.equal(activity.status, 201);
  const data = await activity.json();
  activityId = data.activity.id;
});

test("activity creation rejects a quiz without a valid answer key", async () => {
  const bad = await fetch(`${BASE}/api/classes/${classId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ title: "Broken", questions: [{ prompt: "q", options: ["a", "b"], answer: 9 }] }),
  });
  assert.equal(bad.status, 400);
});

test("a student joins with the class code and a first name only", async () => {
  const joined = await fetch(`${BASE}/api/classroom/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: joinCode.toLowerCase(), name: "Maya" }),
  });
  assert.equal(joined.status, 201);
  const data = await joined.json();
  studentToken = data.token;
  assert.ok(studentToken);
  assert.equal(data.class.name, "Sunday Level 2");

  const wrongCode = await fetch(`${BASE}/api/classroom/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "ZZZZZ9", name: "Maya" }),
  });
  assert.equal(wrongCode.status, 404);
});

test("the student feed shows the work but never the answer key", async () => {
  const feed = await fetch(`${BASE}/api/classroom/feed`, { headers: { "x-student-token": studentToken } });
  assert.equal(feed.status, 200);
  const data = await feed.json();
  assert.equal(data.announcements.length, 1);
  assert.equal(data.activities.length, 1);
  const [activity] = data.activities;
  assert.equal(activity.questions.length, 2);
  for (const question of activity.questions) {
    assert.equal(question.answer, undefined, "answer key must not leak to students");
  }
  const raw = JSON.stringify(data);
  assert.ok(!raw.includes('"answer"'), "no answer field anywhere in the student feed");
});

test("submitting grades server-side and the teacher sees it", async () => {
  const submitted = await fetch(`${BASE}/api/classroom/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-student-token": studentToken },
    body: JSON.stringify({ activityId, answers: [0, 1] }),
  });
  assert.equal(submitted.status, 200);
  const result = await submitted.json();
  assert.equal(result.score, 1);
  assert.equal(result.total, 2);
  assert.equal(result.review[0].correct, true);
  assert.equal(result.review[1].correct, false);

  // Resubmission replaces the previous attempt.
  const again = await fetch(`${BASE}/api/classroom/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-student-token": studentToken },
    body: JSON.stringify({ activityId, answers: [0, 0] }),
  });
  assert.equal((await again.json()).score, 2);

  const detail = await fetch(`${BASE}/api/classes/${classId}`, { headers: { cookie: teacherCookie } });
  assert.equal(detail.status, 200);
  const data = await detail.json();
  assert.equal(data.students.length, 1);
  const [activity] = data.activities;
  assert.equal(activity.submissions.length, 1);
  assert.equal(activity.submissions[0].studentName, "Maya");
  assert.equal(activity.submissions[0].score, 2);
});

test("closed activities refuse new submissions", async () => {
  const closed = await fetch(`${BASE}/api/classes/${classId}/activities`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ activityId, status: "closed" }),
  });
  assert.equal(closed.status, 200);

  const rejected = await fetch(`${BASE}/api/classroom/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-student-token": studentToken },
    body: JSON.stringify({ activityId, answers: [0, 0] }),
  });
  assert.equal(rejected.status, 409);
});

test("another teacher cannot read someone else's class", async () => {
  const other = await fetch(`${BASE}/api/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "other@example.com", displayName: "Mr Khan", password: "quiet-boat-77" }),
  });
  const otherCookie = cookieFrom(other);
  const denied = await fetch(`${BASE}/api/classes/${classId}`, { headers: { cookie: otherCookie } });
  assert.equal(denied.status, 404);
});

test("knowledge-source overrides flow to the public library API", async () => {
  const anonymousPut = await fetch(`${BASE}/api/library`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: "bgs-primary", data: { downloadUrl: "https://nctb.gov.bd/some-book.pdf" } }),
  });
  assert.equal(anonymousPut.status, 401, "editing sources requires a signed-in adult");

  const put = await fetch(`${BASE}/api/library`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ id: "bgs-primary", data: { downloadUrl: "https://nctb.gov.bd/some-book.pdf" } }),
  });
  assert.equal(put.status, 200);

  const merged = await fetch(`${BASE}/api/library`);
  const { books } = await merged.json();
  const updated = books.find((book) => book.id === "bgs-primary");
  assert.equal(updated.downloadUrl, "https://nctb.gov.bd/some-book.pdf");
  assert.equal(updated.customised, true);

  const reset = await fetch(`${BASE}/api/library`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", cookie: teacherCookie },
    body: JSON.stringify({ id: "bgs-primary" }),
  });
  assert.equal(reset.status, 200);
  const restored = await (await fetch(`${BASE}/api/library`)).json();
  assert.equal(restored.books.find((book) => book.id === "bgs-primary").customised, false);
});
