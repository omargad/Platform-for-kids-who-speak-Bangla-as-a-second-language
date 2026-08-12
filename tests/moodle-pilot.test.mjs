import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { REQUIRED_GATES, validatePilot } from "../scripts/verify-moodle-pilot.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "moodle/pilot/content-manifest.json"), "utf8"));
const topicsSource = fs.readFileSync(path.join(repositoryRoot, "app/topics-content.ts"), "utf8");
const booksSource = fs.readFileSync(path.join(repositoryRoot, "app/nctb-books.ts"), "utf8");
const giftSource = fs.readFileSync(path.join(repositoryRoot, "moodle/pilot/questions.gift"), "utf8");

test("the Moodle pilot has three traceable draft modules and a valid question bank", () => {
  const result = validatePilot({ manifest, topicsSource, booksSource, giftSource });
  assert.deepEqual(result.errors, []);
  assert.equal(result.computedReleaseReady, false);
  assert.equal(result.blockers.length, 3 * REQUIRED_GATES.length);
  assert.equal(result.questionCount, 9);
});

test("an approval without named evidence is rejected", () => {
  const changed = structuredClone(manifest);
  changed.modules[0].gates.sourceMapping.status = "approved";
  const result = validatePilot({ manifest: changed, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("cannot be approved without reviewer, date and evidence")));
  assert.equal(result.computedReleaseReady, false);
});

test("an unknown NCTB source cannot enter the pilot", () => {
  const changed = structuredClone(manifest);
  changed.modules[0].sources[0].sourceId = "unverified-web-source";
  const result = validatePilot({ manifest: changed, topicsSource, booksSource, giftSource });
  assert.ok(result.errors.some((error) => error.includes("does not match app/nctb-books.ts")));
});
