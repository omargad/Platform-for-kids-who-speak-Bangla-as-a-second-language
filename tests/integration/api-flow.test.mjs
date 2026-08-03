import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { after, before } from "node:test";

/**
 * Full HTTP integration test against the production server.
 * Requires `npm run build` to have produced `.next` first (CI runs it after the build step).
 */

const PORT = 3211;
const BASE = `http://127.0.0.1:${PORT}`;
const stateDir = mkdtempSync(path.join(tmpdir(), "bangla-int-"));
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

let cookie;
let recoveryCodes;
let profileId;

test("sign-up issues a session and recovery codes", async () => {
  const response = await fetch(`${BASE}/api/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "it@example.com",
      displayName: "Integration Parent",
      password: "integration-pass-1",
    }),
  });
  assert.equal(response.status, 201);
  const data = await response.json();
  assert.equal(data.adult.email, "it@example.com");
  assert.equal(data.recoveryCodes.length, 8);
  recoveryCodes = data.recoveryCodes;
  cookie = cookieFrom(response);
  assert.ok(cookie, "session cookie set");
});

test("profile, progress and export round-trip", async () => {
  const created = await fetch(`${BASE}/api/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ displayName: "Nila", ageBand: "6-8", homeLanguages: ["Bangla"] }),
  });
  assert.equal(created.status, 201);
  profileId = (await created.json()).profile.id;

  const progress = await fetch(`${BASE}/api/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({
      profileId,
      lessonId: "hello-me",
      sessionId: "session-hello-me-listening",
      skill: "listening",
      score: 88,
    }),
  });
  assert.equal(progress.status, 201);

  const exported = await fetch(`${BASE}/api/account/export`, { headers: { cookie } });
  assert.equal(exported.status, 200);
  const payload = await exported.json();
  assert.equal(payload.learnerProfiles.length, 1);
  assert.equal(payload.learnerProfiles[0].progress.length, 1);
  assert.equal(payload.learnerProfiles[0].progress[0].score, 88);
});

test("recovery code resets the password and consumes the code", async () => {
  const recovered = await fetch(`${BASE}/api/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "it@example.com",
      recoveryCode: recoveryCodes[0],
      newPassword: "recovered-pass-1",
    }),
  });
  assert.equal(recovered.status, 200);
  const newCookie = cookieFrom(recovered);
  assert.ok(newCookie);

  // Old session was destroyed by the reset.
  const staleSession = await fetch(`${BASE}/api/profiles`, { headers: { cookie } });
  assert.equal(staleSession.status, 401);
  cookie = newCookie;

  // Old password no longer works; new one does.
  const oldPassword = await fetch(`${BASE}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "it@example.com", password: "integration-pass-1" }),
  });
  assert.equal(oldPassword.status, 401);

  // The same code cannot be used twice.
  const reused = await fetch(`${BASE}/api/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "it@example.com",
      recoveryCode: recoveryCodes[0],
      newPassword: "another-pass-12",
    }),
  });
  assert.equal(reused.status, 401);
});

test("profile deletion removes its progress", async () => {
  const removed = await fetch(`${BASE}/api/profiles/${profileId}`, {
    method: "DELETE",
    headers: { cookie },
  });
  assert.equal(removed.status, 200);

  const exported = await fetch(`${BASE}/api/account/export`, { headers: { cookie } });
  const payload = await exported.json();
  assert.equal(payload.learnerProfiles.length, 0);
});

test("worksheets render for every lesson entry point", async () => {
  const index = await fetch(`${BASE}/worksheets`);
  assert.equal(index.status, 200);
  const indexHtml = await index.text();
  assert.ok(indexHtml.includes("worksheet"), "index mentions worksheets");

  const sheet = await fetch(`${BASE}/worksheets/hello-me`);
  assert.equal(sheet.status, 200);
  const sheetHtml = await sheet.text();
  assert.ok(sheetHtml.includes("Words to learn"), "vocabulary section present");
  assert.ok(sheetHtml.includes("Family mission"), "family mission present");

  const missing = await fetch(`${BASE}/worksheets/not-a-lesson`);
  assert.equal(missing.status, 404);
});

test("sign-out rejects off-origin returnTo, including the backslash bypass", async () => {
  for (const evil of ["//evil.com", "/\\evil.com", "https://evil.com"]) {
    const response = await fetch(
      `${BASE}/api/auth/sign-out?returnTo=${encodeURIComponent(evil)}`,
      { redirect: "manual" },
    );
    assert.equal(response.status, 303);
    const location = response.headers.get("location");
    const target = new URL(location, BASE);
    assert.ok(
      target.hostname === "127.0.0.1" || target.hostname === "localhost",
      `must not redirect off-origin for ${evil}, got ${location}`,
    );
  }
});

test("account deletion removes access entirely", async () => {
  const deleted = await fetch(`${BASE}/api/account/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ password: "recovered-pass-1" }),
  });
  assert.equal(deleted.status, 200);

  const signIn = await fetch(`${BASE}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "it@example.com", password: "recovered-pass-1" }),
  });
  assert.equal(signIn.status, 401);
});
