import assert from "node:assert/strict";
import test from "node:test";

const { grammarSections } = await import("../app/grammar-content.ts");

test("grammar guide covers the five core sections", () => {
  const ids = grammarSections.map((section) => section.id);
  assert.deepEqual(ids, ["pronouns", "word-order", "verbs", "postpositions", "questions"]);
});

test("every section and item is complete and bilingual", () => {
  for (const section of grammarSections) {
    assert.ok(section.title.en.trim() && section.title.bn.trim(), `${section.id}: missing title`);
    assert.ok(section.intro.en.trim() && section.intro.bn.trim(), `${section.id}: missing intro`);
    assert.ok(section.items.length >= 2, `${section.id}: too few items`);
    for (const item of section.items) {
      assert.ok(item.head.trim() && item.transliteration.trim(), `${section.id}/${item.head}: incomplete head`);
      assert.ok(item.meaning.en.trim() && item.meaning.bn.trim(), `${item.head}: missing meaning`);
      assert.ok(
        item.example.bn.trim() && item.example.transliteration.trim() && item.example.en.trim(),
        `${item.head}: incomplete example`,
      );
    }
  }
});

test("politeness distinction (tumi vs apni) is taught", () => {
  const pronouns = grammarSections.find((section) => section.id === "pronouns");
  const heads = pronouns.items.map((item) => item.head);
  assert.ok(heads.includes("তুমি") && heads.includes("আপনি"), "both tumi and apni present");
});
