/**
 * Tiny Leitner-box spaced-repetition engine for the word practice page.
 * Pure functions with no browser dependencies so they can be unit-tested
 * under node --test. State lives wherever the caller keeps it (the practice
 * page uses localStorage, in line with the platform's local-first model).
 */

export type CardState = {
  box: number; // 0..MAX_BOX
  due: number; // epoch ms when the card should be shown again
};

export const MAX_BOX = 4;

/** Days to wait after a correct answer in each box. */
export const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 8] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export function newCard(now: number): CardState {
  return { box: 0, due: now };
}

export function isDue(state: CardState, now: number): boolean {
  return state.due <= now;
}

/**
 * Apply a review result. "Knew it" promotes the card one box and schedules
 * it by the new box's interval; "still learning" sends it back to box 0 and
 * keeps it due immediately so it reappears within the session.
 */
export function review(state: CardState, knewIt: boolean, now: number): CardState {
  if (!knewIt) return { box: 0, due: now };
  const box = Math.min(state.box + 1, MAX_BOX);
  return { box, due: now + BOX_INTERVAL_DAYS[box] * DAY_MS };
}

/** A card is "strong" once it has climbed past the halfway box. */
export function isStrong(state: CardState): boolean {
  return state.box >= 3;
}

/**
 * Choose the session queue: all due cards first (oldest due first), then
 * unseen cards, capped at `limit`.
 */
export function pickQueue<T extends { id: string }>(
  cards: T[],
  states: Record<string, CardState>,
  now: number,
  limit: number,
): T[] {
  const due = cards
    .filter((card) => states[card.id] && isDue(states[card.id], now))
    .sort((a, b) => states[a.id].due - states[b.id].due);
  const unseen = cards.filter((card) => !states[card.id]);
  return [...due, ...unseen].slice(0, limit);
}
