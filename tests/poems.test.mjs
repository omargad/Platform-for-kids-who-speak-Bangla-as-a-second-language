import assert from "node:assert/strict";
import test from "node:test";

const { poems, poemsPagePolicy } = await import("../app/poems-content.ts");

test("every poem is verbatim-ready: author, lines and provenance present", () => {
  assert.ok(poems.length >= 4, "a real poetry corner");
  const ids = new Set();
  for (const poem of poems) {
    assert.ok(!ids.has(poem.id), `${poem.id}: duplicate id`);
    ids.add(poem.id);
    assert.ok(poem.titleBn.trim() && poem.titleEn.trim(), `${poem.id}: needs both titles`);
    assert.ok(poem.author.bn.trim() && poem.author.en.trim(), `${poem.id}: needs an author credit`);
    assert.ok(poem.lines.length >= 2, `${poem.id}: needs the verse`);
    for (const line of poem.lines) assert.ok(line.trim(), `${poem.id}: empty line`);
    assert.equal(typeof poem.excerpt, "boolean", `${poem.id}: excerpt flag`);
    assert.ok(poem.gloss.en.trim() && poem.gloss.bn.trim(), `${poem.id}: bilingual gloss`);
    assert.ok(poem.whereFound.en.trim() && poem.whereFound.bn.trim(), `${poem.id}: provenance`);
    assert.ok(poem.publicDomain.trim(), `${poem.id}: must state why it is public domain`);
  }
});

test("copyright policy: no Nazrul verse is reproduced (in copyright until 2036)", () => {
  for (const poem of poems) {
    assert.ok(!poem.author.en.includes("Nazrul"), "Nazrul poems must not be reproduced verbatim");
  }
  assert.ok(poemsPagePolicy.en.includes("2036"), "policy explains the Nazrul copyright boundary");
});
