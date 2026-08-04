import assert from "node:assert/strict";
import test from "node:test";

const { vowels, consonants, karForms, digits } = await import("../app/alphabet-content.ts");

test("the alphabet is complete: 11 vowels and 39 consonants", () => {
  assert.equal(vowels.length, 11);
  assert.equal(consonants.length, 39);
  const glyphs = new Set([...vowels, ...consonants].map((letter) => letter.glyph));
  assert.equal(glyphs.size, 50, "letters are unique");
});

test("every letter has a name, sound and complete example word", () => {
  for (const letter of [...vowels, ...consonants]) {
    assert.ok(letter.name.trim(), `${letter.glyph}: missing name`);
    assert.ok(letter.sound.trim(), `${letter.glyph}: missing sound`);
    assert.ok(letter.example.bn.trim(), `${letter.glyph}: missing Bangla example`);
    assert.ok(letter.example.transliteration.trim(), `${letter.glyph}: missing transliteration`);
    assert.ok(letter.example.en.trim(), `${letter.glyph}: missing English gloss`);
    if (letter.note) {
      assert.ok(letter.note.en.trim() && letter.note.bn.trim(), `${letter.glyph}: incomplete note`);
    }
  }
});

test("kar forms cover all 11 vowels on ক", () => {
  assert.equal(karForms.length, 11);
  const vowelGlyphs = new Set(vowels.map((letter) => letter.glyph));
  for (const form of karForms) {
    assert.ok(vowelGlyphs.has(form.vowel), `${form.vowel}: not a vowel`);
    assert.ok(form.combined.startsWith("ক"), `${form.combined}: must be built on ক`);
    assert.ok(form.sound.trim(), `${form.combined}: missing sound`);
  }
});

test("digits cover ০-৯ with words", () => {
  assert.equal(digits.length, 10);
  const expected = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  assert.deepEqual(digits.map((digit) => digit.glyph), expected);
  for (const digit of digits) {
    assert.ok(digit.word.trim() && digit.transliteration.trim() && digit.en.trim(), `${digit.glyph}: incomplete`);
  }
});

test("conjuncts are well-formed and built from real consonants", async () => {
  const { conjuncts, consonants } = await import("../app/alphabet-content.ts");
  assert.equal(conjuncts.length, 16);
  const consonantGlyphs = new Set(consonants.map((letter) => letter.glyph));
  const seen = new Set();
  for (const conjunct of conjuncts) {
    assert.ok(!seen.has(conjunct.glyph), `${conjunct.glyph}: duplicate`);
    seen.add(conjunct.glyph);
    for (const part of conjunct.parts) {
      assert.ok(consonantGlyphs.has(part), `${conjunct.glyph}: part ${part} is not a consonant`);
    }
    // The joined glyph must contain the hasanta that fuses the two parts.
    assert.ok(conjunct.glyph.includes("্"), `${conjunct.glyph}: missing hasanta`);
    assert.ok(
      conjunct.example.bn.includes(conjunct.glyph),
      `${conjunct.glyph}: example ${conjunct.example.bn} does not contain the conjunct`,
    );
    assert.ok(conjunct.example.transliteration.trim() && conjunct.example.en.trim(), `${conjunct.glyph}: incomplete example`);
  }
});
