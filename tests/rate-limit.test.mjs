import assert from "node:assert/strict";
import test from "node:test";

const { checkRateLimit, resetRateLimits, clientKey } = await import("../lib/rate-limit.ts");

test("allows up to the limit inside a window, then blocks", () => {
  resetRateLimits();
  const start = 1_000_000;
  for (let i = 0; i < 5; i += 1) {
    assert.equal(checkRateLimit("k", 5, 60_000, start + i).allowed, true, `attempt ${i + 1}`);
  }
  const blocked = checkRateLimit("k", 5, 60_000, start + 10);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});

test("window expiry resets the counter", () => {
  resetRateLimits();
  const start = 2_000_000;
  for (let i = 0; i < 5; i += 1) checkRateLimit("k2", 5, 60_000, start);
  assert.equal(checkRateLimit("k2", 5, 60_000, start).allowed, false);
  assert.equal(checkRateLimit("k2", 5, 60_000, start + 60_001).allowed, true);
});

test("keys are independent", () => {
  resetRateLimits();
  const start = 3_000_000;
  for (let i = 0; i < 5; i += 1) checkRateLimit("a", 5, 60_000, start);
  assert.equal(checkRateLimit("a", 5, 60_000, start).allowed, false);
  assert.equal(checkRateLimit("b", 5, 60_000, start).allowed, true);
});

test("clientKey prefers first x-forwarded-for hop", () => {
  const withHeader = new Request("http://localhost/", {
    headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
  });
  assert.equal(clientKey(withHeader), "203.0.113.9");
  assert.equal(clientKey(new Request("http://localhost/")), "local");
});
