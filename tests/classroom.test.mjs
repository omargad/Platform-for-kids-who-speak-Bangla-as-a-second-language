import assert from "node:assert/strict";
import test from "node:test";

const {
  generateJoinCode,
  normalizeJoinCode,
  isValidJoinCode,
  validateQuizQuestions,
  gradeAnswers,
  JOIN_CODE_LENGTH,
} = await import("../lib/classroom.ts");

test("join codes are unambiguous and validate round-trip", () => {
  for (let i = 0; i < 200; i += 1) {
    const code = generateJoinCode();
    assert.equal(code.length, JOIN_CODE_LENGTH);
    assert.ok(isValidJoinCode(code), `${code} should validate`);
    assert.doesNotMatch(code, /[01OIL]/, "no ambiguous characters");
    assert.equal(normalizeJoinCode(code.toLowerCase()), code, "case-insensitive entry");
  }
});

test("normalizeJoinCode strips spaces, dashes and junk", () => {
  assert.equal(normalizeJoinCode(" abc-234 "), "ABC234");
  assert.equal(normalizeJoinCode("a b c 2 3 4"), "ABC234");
  assert.ok(!isValidJoinCode(normalizeJoinCode("short")));
  // 0/1 are stripped and O/I/L are not in the code alphabet, so this stays invalid.
  assert.ok(!isValidJoinCode(normalizeJoinCode("0O1IL0")));
});

test("validateQuizQuestions accepts a clean quiz and trims noise", () => {
  const result = validateQuizQuestions([
    { prompt: "  When is Victory Day?  ", options: ["16 December", "1 January", ""], answer: 0 },
  ]);
  assert.ok("questions" in result, JSON.stringify(result));
  assert.equal(result.questions[0].prompt, "When is Victory Day?");
  assert.deepEqual(result.questions[0].options, ["16 December", "1 January"]);
});

test("validateQuizQuestions rejects malformed quizzes", () => {
  assert.ok("error" in validateQuizQuestions("nope"));
  assert.ok("error" in validateQuizQuestions([]));
  assert.ok("error" in validateQuizQuestions([{ prompt: "", options: ["a", "b"], answer: 0 }]));
  assert.ok("error" in validateQuizQuestions([{ prompt: "q", options: ["only one"], answer: 0 }]));
  assert.ok("error" in validateQuizQuestions([{ prompt: "q", options: ["a", "b"], answer: 5 }]));
  assert.ok("error" in validateQuizQuestions([{ prompt: "q", options: ["a", "b"], answer: -1 }]));
  assert.ok("error" in validateQuizQuestions(Array.from({ length: 21 }, () => ({ prompt: "q", options: ["a", "b"], answer: 0 }))));
});

test("gradeAnswers scores strictly and tolerates junk input", () => {
  const questions = [
    { prompt: "a", options: ["x", "y"], answer: 1 },
    { prompt: "b", options: ["x", "y", "z"], answer: 0 },
  ];
  assert.deepEqual(gradeAnswers(questions, [1, 0]), { score: 2, total: 2, picked: [1, 0] });
  assert.deepEqual(gradeAnswers(questions, [0]), { score: 0, total: 2, picked: [0, -1] });
  assert.deepEqual(gradeAnswers(questions, "junk").score, 0);
  assert.equal(gradeAnswers(questions, [1, "x"]).score, 1);
});
