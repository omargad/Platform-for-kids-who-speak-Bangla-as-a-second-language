import assert from "node:assert/strict";
import test from "node:test";

const { newCard, isDue, review, isStrong, pickQueue, MAX_BOX, BOX_INTERVAL_DAYS } = await import("../lib/srs.ts");

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_000_000_000_000;

test("new cards are due immediately", () => {
  const card = newCard(NOW);
  assert.equal(card.box, 0);
  assert.ok(isDue(card, NOW));
});

test("knowing a card promotes it and schedules by the new box interval", () => {
  let state = newCard(NOW);
  state = review(state, true, NOW);
  assert.equal(state.box, 1);
  assert.equal(state.due, NOW + BOX_INTERVAL_DAYS[1] * DAY);
  assert.ok(!isDue(state, NOW));
  assert.ok(isDue(state, NOW + BOX_INTERVAL_DAYS[1] * DAY));
});

test("cards cap at the top box and forgetting resets to box 0", () => {
  let state = newCard(NOW);
  for (let i = 0; i < 10; i += 1) state = review(state, true, NOW);
  assert.equal(state.box, MAX_BOX);
  assert.ok(isStrong(state));
  state = review(state, false, NOW);
  assert.equal(state.box, 0);
  assert.ok(isDue(state, NOW));
  assert.ok(!isStrong(state));
});

test("queue picks due cards oldest-first, then unseen, capped at limit", () => {
  const cards = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const states = {
    a: { box: 1, due: NOW - 2 * DAY },
    b: { box: 2, due: NOW + DAY }, // not due
    c: { box: 1, due: NOW - DAY },
  };
  const queue = pickQueue(cards, states, NOW, 3);
  assert.deepEqual(queue.map((card) => card.id), ["a", "c", "d"]);
});
