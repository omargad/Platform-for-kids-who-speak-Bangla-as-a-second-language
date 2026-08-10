import assert from "node:assert/strict";
import test from "node:test";

const { libraryBooks, NCTB_PORTAL_URL, bookById } = await import("../app/library-content.ts");

test("the NCTB portal link is the official government domain over https", () => {
  assert.match(NCTB_PORTAL_URL, /^https:\/\/nctb\.gov\.bd\/?$/);
});

test("library books are unique, bilingual and levelled", () => {
  assert.ok(libraryBooks.length >= 6, "catalog should cover primary and secondary");
  const ids = new Set();
  for (const book of libraryBooks) {
    assert.ok(!ids.has(book.id), `${book.id}: duplicate id`);
    ids.add(book.id);
    assert.ok(book.titleBn.trim() && book.titleEn.trim(), `${book.id}: needs both titles`);
    assert.ok(["primary", "secondary"].includes(book.level), `${book.id}: bad level`);
    assert.ok(["listed", "confirm"].includes(book.status), `${book.id}: bad status`);
    for (const field of [book.classes, book.subjectArea, book.covers, book.whyItMatters]) {
      assert.ok(field.en.trim() && field.bn.trim(), `${book.id}: missing bilingual field`);
    }
  }
});

test("both school levels are represented", () => {
  assert.ok(libraryBooks.some((book) => book.level === "primary"), "primary books listed");
  assert.ok(libraryBooks.some((book) => book.level === "secondary"), "secondary books listed");
});

test("bookById resolves and misses safely", () => {
  assert.equal(bookById("bgs-primary")?.id, "bgs-primary");
  assert.equal(bookById("nope"), undefined);
});
