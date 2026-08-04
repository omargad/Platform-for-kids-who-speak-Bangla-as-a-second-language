import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const { lessons, levelBands } = await import("../app/curriculum.ts");
const { lessonExtensions, lessonSessionSkills } = await import("../app/learning-content.ts");

test("curriculum has 18 lessons across six bands", () => {
  assert.equal(lessons.length, 18);
  assert.equal(levelBands.length, 6);
  const levels = new Set(lessons.map((lesson) => lesson.level));
  for (const band of levelBands) {
    assert.ok(levels.has(band.id), `no lessons for band ${band.id}`);
  }
});

test("every lesson is complete and unique", () => {
  const ids = new Set();
  for (const lesson of lessons) {
    assert.ok(!ids.has(lesson.id), `duplicate lesson id ${lesson.id}`);
    ids.add(lesson.id);
    assert.ok(lesson.title && lesson.titleBn, `${lesson.id}: missing titles`);
    assert.equal(lesson.vocabulary.length, 6, `${lesson.id}: expected 6 vocabulary items`);
    assert.equal(lesson.patterns.length, 2, `${lesson.id}: expected 2 patterns`);
    assert.ok(lesson.objectives.length >= 1, `${lesson.id}: needs objectives`);
    for (const item of lesson.vocabulary) {
      assert.ok(item.bn && item.en && item.transliteration, `${lesson.id}: incomplete vocabulary`);
    }
  }
});

test("every lesson has a complete four-skill extension", () => {
  for (const lesson of lessons) {
    const extension = lessonExtensions[lesson.id];
    assert.ok(extension, `${lesson.id}: missing lesson extension`);
    assert.ok(extension.dialogue.length >= 2, `${lesson.id}: dialogue too short`);
    for (const check of [extension.listening.check, extension.reading.check]) {
      assert.ok(check.prompt && check.options.length >= 2, `${lesson.id}: incomplete quick check`);
      assert.ok(
        check.answer >= 0 && check.answer < check.options.length,
        `${lesson.id}: quick check answer index out of range`,
      );
    }
    assert.ok(extension.speaking.mission, `${lesson.id}: missing speaking mission`);
    assert.ok(extension.writing.starters.length >= 2, `${lesson.id}: missing writing starters`);
    assert.ok(extension.watch.before && extension.watch.after, `${lesson.id}: missing watch guidance`);
  }
  assert.equal(lessonSessionSkills.length, 6);
});

test("every lesson has a well-formed video and playlist reference", () => {
  const videoId = /^[A-Za-z0-9_-]{11}$/;
  const playlistId = /^PL[A-Za-z0-9_-]+$/;
  for (const lesson of lessons) {
    assert.ok(lesson.video?.id, `${lesson.id}: missing video`);
    assert.match(lesson.video.id, videoId, `${lesson.id}: video id not a valid YouTube id`);
    assert.ok(lesson.video.title && lesson.video.channel, `${lesson.id}: video needs title/channel`);
    assert.ok(lesson.playlist?.id, `${lesson.id}: missing playlist`);
    assert.match(lesson.playlist.id, playlistId, `${lesson.id}: playlist id not a valid YouTube list id`);
  }
});

test("bundled pronunciation audio exists for every lesson slot", () => {
  const slots = ["dialogue", "reading", "pattern-1", "pattern-2", "word-1", "word-2", "word-3", "word-4", "word-5", "word-6"];
  for (const lesson of lessons) {
    for (const slot of slots) {
      const file = new URL(`../public/audio/lesson-${lesson.id}-${slot}.ogg`, import.meta.url);
      assert.ok(existsSync(file), `missing audio: lesson-${lesson.id}-${slot}.ogg`);
    }
  }
});

test("every lesson has at least two extra videos with valid ids", () => {
  const videoId = /^[A-Za-z0-9_-]{11}$/;
  for (const lesson of lessons) {
    assert.ok(Array.isArray(lesson.extraVideos) && lesson.extraVideos.length >= 2, `${lesson.id}: needs 2+ extra videos`);
    const ids = new Set();
    for (const extra of lesson.extraVideos) {
      assert.match(extra.id, videoId, `${lesson.id}: bad extra video id ${extra.id}`);
      assert.ok(extra.title.trim(), `${lesson.id}: extra video missing title`);
      assert.ok(!ids.has(extra.id), `${lesson.id}: duplicate extra video`);
      ids.add(extra.id);
      assert.notEqual(extra.id, lesson.video.id, `${lesson.id}: extra duplicates the main video`);
    }
  }
});
