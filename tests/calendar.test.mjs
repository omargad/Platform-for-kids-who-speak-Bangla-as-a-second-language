import assert from "node:assert/strict";
import test from "node:test";

const { days, months, seasons } = await import("../app/calendar-content.ts");

test("seven days, twelve months, six seasons", () => {
  assert.equal(days.length, 7);
  assert.equal(months.length, 12);
  assert.equal(seasons.length, 6);
});

test("days and months are complete and unique", () => {
  const seen = new Set();
  for (const entry of [...days, ...months]) {
    assert.ok(entry.bn.trim() && entry.transliteration.trim(), `${entry.bn}: incomplete`);
    assert.ok(!seen.has(entry.bn), `${entry.bn}: duplicate`);
    seen.add(entry.bn);
  }
  assert.equal(months[0].bn, "বৈশাখ", "the Bengali year starts with Boishakh");
});

test("every season maps to two real consecutive Bengali months", () => {
  const monthNames = months.map((month) => month.bn);
  const covered = [];
  for (const season of seasons) {
    assert.equal(season.months.length, 2, `${season.bn}: needs two months`);
    const [first, second] = season.months.map((name) => monthNames.indexOf(name));
    assert.ok(first >= 0 && second >= 0, `${season.bn}: unknown month`);
    assert.equal(second, first + 1, `${season.bn}: months must be consecutive`);
    assert.ok(season.description.en.trim() && season.description.bn.trim(), `${season.bn}: missing description`);
    covered.push(...season.months);
  }
  assert.equal(new Set(covered).size, 12, "the six seasons cover all twelve months");
});
