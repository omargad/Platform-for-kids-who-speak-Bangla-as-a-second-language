import assert from "node:assert/strict";
import test from "node:test";

const { phraseCategories } = await import("../app/phrasebook-content.ts");

test("phrasebook has at least six categories and forty phrases", () => {
  assert.ok(phraseCategories.length >= 6);
  const total = phraseCategories.reduce((sum, category) => sum + category.phrases.length, 0);
  assert.ok(total >= 40, `expected 40+ phrases, got ${total}`);
});

test("every category and phrase is complete, bilingual and unique", () => {
  const seen = new Set();
  for (const category of phraseCategories) {
    assert.ok(category.icon, `${category.id}: missing icon`);
    assert.ok(category.title.en.trim() && category.title.bn.trim(), `${category.id}: missing title`);
    assert.ok(category.phrases.length >= 5, `${category.id}: too few phrases`);
    for (const phrase of category.phrases) {
      assert.ok(phrase.bn.trim(), `${category.id}: missing Bangla text`);
      assert.ok(phrase.transliteration.trim(), `${phrase.bn}: missing transliteration`);
      assert.ok(phrase.en.trim(), `${phrase.bn}: missing English`);
      assert.ok(!seen.has(phrase.bn), `${phrase.bn}: duplicate phrase`);
      seen.add(phrase.bn);
      if (phrase.note) {
        assert.ok(phrase.note.en.trim() && phrase.note.bn.trim(), `${phrase.bn}: incomplete note`);
      }
    }
  }
});

test("phrasebook uses Bangladesh-standard vocabulary (pani, not jol)", () => {
  const all = phraseCategories.flatMap((category) => category.phrases.map((phrase) => phrase.bn)).join(" ");
  assert.ok(all.includes("পানি"), "expected pani to appear");
  assert.ok(!all.includes("জল"), "jol should not appear; platform uses Bangladesh standard");
});
