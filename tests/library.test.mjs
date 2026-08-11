import assert from "node:assert/strict";
import test from "node:test";

const { libraryBooks, NCTB_PORTAL_URL, bookById } = await import("../app/library-content.ts");
const { topics } = await import("../app/topics-content.ts");

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
    assert.ok(["primary", "secondary", "higher-secondary"].includes(book.level), `${book.id}: bad level`);
    assert.ok(["listed", "confirm"].includes(book.status), `${book.id}: bad status`);
    for (const field of [book.classes, book.subjectArea, book.covers, book.whyItMatters]) {
      assert.ok(field.en.trim() && field.bn.trim(), `${book.id}: missing bilingual field`);
    }
  }
});

test("the full prep-to-year-12 span is represented", () => {
  assert.ok(libraryBooks.some((book) => book.level === "primary"), "primary books listed");
  assert.ok(libraryBooks.some((book) => book.level === "secondary"), "secondary books listed");
  assert.ok(libraryBooks.some((book) => book.level === "higher-secondary"), "higher-secondary books listed");
});

test("chapter maps are bilingual, volume-labelled and cross-link only real topics", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  const mapped = libraryBooks.filter((book) => book.chapterMaps?.length);
  assert.ok(mapped.length >= 2, "core books carry chapter maps");
  assert.ok(
    mapped.some((book) => book.chapterMaps.some((map) => map.verified)),
    "at least one map has been verified against an extracted book",
  );
  for (const book of mapped) {
    for (const map of book.chapterMaps) {
      assert.ok(map.volume.en.trim() && map.volume.bn.trim(), `${book.id}: map needs a bilingual volume label`);
      assert.ok(map.note.en.trim() && map.note.bn.trim(), `${book.id}: chapter map needs a bilingual note`);
      assert.equal(typeof map.verified, "boolean", `${book.id}: verified flag`);
      assert.ok(map.chapters.length >= 5, `${book.id}: chapter map looks too short`);
      for (const chapter of map.chapters) {
        assert.ok(chapter.title.en.trim() && chapter.title.bn.trim(), `${book.id}: chapter title must be bilingual`);
        if (chapter.topicId) {
          assert.ok(topicIds.has(chapter.topicId), `${book.id}: chapter links unknown topic '${chapter.topicId}'`);
        }
      }
    }
  }
});

test("bookById resolves and misses safely", () => {
  assert.equal(bookById("bgs-primary")?.id, "bgs-primary");
  assert.equal(bookById("nope"), undefined);
});
