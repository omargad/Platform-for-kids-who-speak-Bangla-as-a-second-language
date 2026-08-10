import assert from "node:assert/strict";
import test from "node:test";

const { topics, topicThemes } = await import("../app/topics-content.ts");
const { libraryBooks } = await import("../app/library-content.ts");

const bookIds = new Set(libraryBooks.map((book) => book.id));

test("classroom topics are complete and bilingual", () => {
  assert.ok(topics.length >= 12, "at least a dozen classroom topics");
  const ids = new Set();
  const themeIds = new Set(topicThemes.map((theme) => theme.id));
  for (const topic of topics) {
    assert.ok(!ids.has(topic.id), `${topic.id}: duplicate id`);
    ids.add(topic.id);
    assert.ok(themeIds.has(topic.theme), `${topic.id}: unknown theme`);
    assert.ok(topic.title.en.trim() && topic.title.bn.trim(), `${topic.id}: missing title`);
    assert.ok(topic.tagline.en.trim() && topic.tagline.bn.trim(), `${topic.id}: missing tagline`);
    assert.ok(topic.minutes >= 1, `${topic.id}: needs a reading time`);
    assert.ok(topic.sections.length >= 2, `${topic.id}: needs at least two sections`);
    for (const section of topic.sections) {
      assert.ok(section.heading.en.trim() && section.heading.bn.trim(), `${topic.id}: section heading`);
      assert.ok(section.body.en.trim() && section.body.bn.trim(), `${topic.id}: section body`);
    }
    assert.ok(topic.funFacts.length >= 2, `${topic.id}: needs fun facts`);
    for (const fact of topic.funFacts) {
      assert.ok(fact.en.trim() && fact.bn.trim(), `${topic.id}: fun fact must be bilingual`);
    }
  }
});

test("every theme has at least three topics and bilingual headings", () => {
  for (const theme of topicThemes) {
    assert.ok(theme.title.en && theme.title.bn, `${theme.id}: missing title`);
    assert.ok(theme.note.en && theme.note.bn, `${theme.id}: missing note`);
    const count = topics.filter((topic) => topic.theme === theme.id).length;
    assert.ok(count >= 3, `${theme.id}: only ${count} topics`);
  }
});

test("every quiz question has a valid answer and bilingual options", () => {
  for (const topic of topics) {
    assert.ok(topic.quiz.length >= 3, `${topic.id}: quiz needs 3 questions`);
    for (const question of topic.quiz) {
      assert.ok(question.question.en.trim() && question.question.bn.trim(), `${topic.id}: question text`);
      assert.ok(question.options.length >= 2, `${topic.id}: needs options`);
      assert.ok(
        Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length,
        `${topic.id}: answer index out of range`,
      );
      for (const option of question.options) {
        assert.ok(option.en.trim() && option.bn.trim(), `${topic.id}: option must be bilingual`);
      }
    }
  }
});

test("every topic cites at least one known NCTB library book", () => {
  for (const topic of topics) {
    assert.ok(topic.sources.length >= 1, `${topic.id}: needs an NCTB source`);
    for (const source of topic.sources) {
      assert.ok(bookIds.has(source.bookId), `${topic.id}: unknown book '${source.bookId}'`);
      assert.ok(source.note.en.trim() && source.note.bn.trim(), `${topic.id}: source note must be bilingual`);
    }
  }
});
