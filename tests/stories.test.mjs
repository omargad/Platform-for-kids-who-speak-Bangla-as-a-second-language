import assert from "node:assert/strict";
import test from "node:test";

const { stories } = await import("../app/stories-content.ts");

test("the library has three complete stories", () => {
  assert.equal(stories.length, 3);
  const ids = new Set(stories.map((story) => story.id));
  assert.equal(ids.size, 3);
});

test("every story is fully bilingual with a valid check", () => {
  for (const story of stories) {
    assert.ok(story.emoji, `${story.id}: missing emoji`);
    assert.ok(story.title.en.trim() && story.title.bn.trim(), `${story.id}: missing title`);
    assert.ok(story.pages.length >= 3, `${story.id}: needs at least 3 pages`);
    for (const page of story.pages) {
      assert.ok(page.bn.trim() && page.en.trim(), `${story.id}: incomplete page`);
    }
    assert.ok(story.check.options.length >= 3, `${story.id}: needs 3 options`);
    assert.ok(
      story.check.answer >= 0 && story.check.answer < story.check.options.length,
      `${story.id}: answer index out of range`,
    );
    for (const option of story.check.options) {
      assert.ok(option.en.trim() && option.bn.trim(), `${story.id}: incomplete option`);
    }
    assert.ok(story.moral.en.trim() && story.moral.bn.trim(), `${story.id}: missing moral`);
  }
});
