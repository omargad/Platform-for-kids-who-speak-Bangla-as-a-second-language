import assert from "node:assert/strict";
import test from "node:test";

const { oneToTwenty, tens, countables } = await import("../app/numbers-content.ts");

test("numbers one to twenty are complete and sequential", () => {
  assert.equal(oneToTwenty.length, 20);
  oneToTwenty.forEach((entry, index) => {
    assert.equal(entry.value, index + 1, `position ${index} should be ${index + 1}`);
    assert.ok(entry.glyph.trim() && entry.word.trim() && entry.transliteration.trim(), `${entry.value}: incomplete`);
  });
  // Bangladesh-standard fourteen.
  assert.equal(oneToTwenty[13].word, "চৌদ্দ");
});

test("tens run thirty to one hundred", () => {
  assert.deepEqual(tens.map((entry) => entry.value), [30, 40, 50, 60, 70, 80, 90, 100]);
  for (const entry of tens) {
    assert.ok(entry.glyph.trim() && entry.word.trim() && entry.transliteration.trim(), `${entry.value}: incomplete`);
  }
});

test("bangla numerals use the bangla digit glyphs", () => {
  const banglaDigits = /^[০১২৩৪৫৬৭৮৯]+$/;
  for (const entry of [...oneToTwenty, ...tens]) {
    assert.match(entry.glyph, banglaDigits, `${entry.value}: glyph must use Bangla digits`);
  }
});

test("countables for the game are complete", () => {
  assert.ok(countables.length >= 4);
  for (const item of countables) {
    assert.ok(item.emoji && item.bn.trim() && item.en.trim(), "incomplete countable");
  }
});
