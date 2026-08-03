import assert from "node:assert/strict";
import test from "node:test";

const {
  hashPassword,
  verifyPassword,
  createSessionToken,
  hashSessionToken,
  generateRecoveryCode,
  normalizeRecoveryCode,
} = await import("../lib/password.ts");

test("hashed passwords verify and reject wrong input", () => {
  const hash = hashPassword("correct horse battery staple");
  assert.notEqual(hash, "correct horse battery staple");
  assert.ok(hash.startsWith("scrypt:"));
  assert.ok(verifyPassword("correct horse battery staple", hash));
  assert.ok(!verifyPassword("wrong password", hash));
});

test("same password hashes differently per salt", () => {
  const first = hashPassword("shared-password-123");
  const second = hashPassword("shared-password-123");
  assert.notEqual(first, second);
  assert.ok(verifyPassword("shared-password-123", first));
  assert.ok(verifyPassword("shared-password-123", second));
});

test("malformed stored hashes are rejected, not thrown", () => {
  assert.ok(!verifyPassword("anything", "not-a-hash"));
  assert.ok(!verifyPassword("anything", "scrypt:bad:parts"));
  assert.ok(!verifyPassword("anything", ""));
});

test("recovery codes use the safe alphabet and normalize consistently", () => {
  const codes = new Set();
  for (let i = 0; i < 50; i += 1) {
    const code = generateRecoveryCode();
    assert.match(code, /^[A-HJ-KM-NP-Z2-9]{5}-[A-HJ-KM-NP-Z2-9]{5}$/, code);
    codes.add(code);
  }
  assert.equal(codes.size, 50, "codes are unique");
  assert.equal(normalizeRecoveryCode(" abcde-23456 "), "ABCDE23456");
  assert.equal(normalizeRecoveryCode("ABCDE23456"), normalizeRecoveryCode("abcde-234-56"));
});

test("session tokens are unique and hash deterministically", () => {
  const a = createSessionToken();
  const b = createSessionToken();
  assert.notEqual(a, b);
  assert.ok(a.length >= 40);
  assert.equal(hashSessionToken(a), hashSessionToken(a));
  assert.notEqual(hashSessionToken(a), hashSessionToken(b));
});
