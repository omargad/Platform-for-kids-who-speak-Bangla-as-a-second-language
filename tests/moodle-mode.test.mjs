import assert from "node:assert/strict";
import test from "node:test";

const {
  normalizeMoodleUrl,
  retiredLmsApiPrefixes,
  retiredLmsPages,
} = await import("../lib/moodle-mode.ts");

test("Moodle mode retires every custom LMS and language surface", () => {
  for (const route of ["/teach/:path*", "/classroom/:path*", "/studio/:path*", "/learn/:path*", "/worksheets/:path*"]) {
    assert.ok(retiredLmsPages.includes(route), `missing retired page ${route}`);
  }
  for (const prefix of ["auth", "classes", "classroom", "studio", "audio"]) {
    assert.ok(retiredLmsApiPrefixes.includes(prefix), `missing retired API ${prefix}`);
  }
  assert.ok(!retiredLmsApiPrefixes.includes("health"));
  assert.ok(!retiredLmsApiPrefixes.includes("library"));
});

test("Moodle URL accepts HTTPS and local development only", () => {
  assert.equal(normalizeMoodleUrl("https://learn.example.org/"), "https://learn.example.org");
  assert.equal(normalizeMoodleUrl("http://127.0.0.1:8080/"), "http://127.0.0.1:8080");
  assert.equal(normalizeMoodleUrl(undefined), "");
  assert.throws(() => normalizeMoodleUrl("http://learn.example.org"), /must use HTTPS/);
  assert.throws(() => normalizeMoodleUrl("https://user:pass@learn.example.org"), /must not contain credentials/);
  assert.throws(() => normalizeMoodleUrl("https://learn.example.org/?course=1"), /must not contain credentials/);
});
