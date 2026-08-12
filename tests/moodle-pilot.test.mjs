import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { REQUIRED_GATES, validatePilot } from "../scripts/verify-moodle-pilot.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginData = path.join(repositoryRoot, "moodle/local/banglapilot/data");
const manifest = JSON.parse(fs.readFileSync(path.join(pluginData, "content-manifest.json"), "utf8"));
const lessonContent = JSON.parse(fs.readFileSync(path.join(pluginData, "lesson-content.json"), "utf8"));
const topicsSource = fs.readFileSync(path.join(repositoryRoot, "app/topics-content.ts"), "utf8");
const booksSource = fs.readFileSync(path.join(repositoryRoot, "app/nctb-books.ts"), "utf8");
const giftSource = fs.readFileSync(path.join(pluginData, "questions.gift"), "utf8");

test("the Moodle pilot has three traceable draft modules and a valid question bank", () => {
  const result = validatePilot({ manifest, lessonContent, topicsSource, booksSource, giftSource });
  assert.deepEqual(result.errors, []);
  assert.equal(result.computedReleaseReady, false);
  assert.equal(result.blockers.length, 3 * REQUIRED_GATES.length);
  assert.equal(result.questionCount, 9);
  assert.equal(result.chapterCount, 15);
  assert.ok(result.contentBlockCount >= 45);
});

test("an approval without named evidence is rejected", () => {
  const changed = structuredClone(manifest);
  changed.modules[0].gates.sourceMapping.status = "approved";
  const result = validatePilot({ manifest: changed, lessonContent, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("cannot be approved without reviewer, date and evidence")));
  assert.equal(result.computedReleaseReady, false);
});

test("an unknown NCTB source cannot enter the pilot", () => {
  const changed = structuredClone(manifest);
  changed.modules[0].sources[0].sourceId = "unverified-web-source";
  const result = validatePilot({ manifest: changed, lessonContent, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("does not match app/nctb-books.ts")));
});

test("external media cannot enter the unreviewed first pilot", () => {
  const changed = structuredClone(lessonContent);
  changed.externalMedia.push({ type: "youtube", url: "https://youtube.example/watch" });
  const result = validatePilot({ manifest, lessonContent: changed, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("externalMedia list must remain empty")));
  assert.equal(result.computedReleaseReady, false);
});

test("thin or missing lesson chapters fail the content contract", () => {
  const changed = structuredClone(lessonContent);
  changed.modules[0].chapters.pop();
  const result = validatePilot({ manifest, lessonContent: changed, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("exactly five substantive chapters")));
});
