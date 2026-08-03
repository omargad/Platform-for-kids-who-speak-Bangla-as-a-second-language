import assert from "node:assert/strict";
import test from "node:test";

const mod = await import("../app/explore-content.ts");
const { quickFacts, timeline, regions, landmarks, festivals, cultureCards } = mod;

function assertBilingual(value, label) {
  assert.ok(value && typeof value.en === "string" && value.en.trim(), `${label}: missing English`);
  assert.ok(value && typeof value.bn === "string" && value.bn.trim(), `${label}: missing Bangla`);
}

test("quick facts are complete and bilingual", () => {
  assert.ok(quickFacts.length >= 6);
  for (const fact of quickFacts) {
    assert.ok(fact.icon, "fact needs an icon");
    assertBilingual(fact.label, "fact.label");
    assertBilingual(fact.value, "fact.value");
  }
});

test("history timeline is ordered set of bilingual events", () => {
  assert.ok(timeline.length >= 4);
  const tones = new Set(["ancient", "language", "freedom", "today"]);
  for (const event of timeline) {
    assert.ok(event.year, "event needs a year");
    assert.ok(tones.has(event.tone), `unknown tone ${event.tone}`);
    assertBilingual(event.title, "event.title");
    assertBilingual(event.body, "event.body");
  }
  // The two defining dates for this audience must be present.
  const years = timeline.map((event) => event.year);
  assert.ok(years.includes("1952"), "Language Movement (1952) present");
  assert.ok(years.includes("1971"), "Independence (1971) present");
});

test("regions and culture cards are bilingual", () => {
  assert.ok(regions.length >= 6);
  for (const region of regions) {
    assertBilingual(region.name, "region.name");
    assertBilingual(region.known, "region.known");
  }
  for (const card of [...landmarks, ...festivals, ...cultureCards]) {
    assert.ok(card.icon, "card needs an icon");
    assertBilingual(card.title, "card.title");
    assertBilingual(card.body, "card.body");
    if (card.heritage) assertBilingual(card.heritage, "card.heritage");
  }
});
