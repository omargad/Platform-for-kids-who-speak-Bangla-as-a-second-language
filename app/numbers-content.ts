/**
 * Original numbers content in Bangladesh-standard Bangla (e.g. চৌদ্দ for 14).
 * Extends the Bornomala page's digits (০–৯) with full number words to twenty,
 * the tens to one hundred, and words used by the counting game. Flagged for
 * the Content Studio's Bangla-language review gate like all language content.
 */

export type NumberEntry = {
  value: number;
  glyph: string; // Bangla numeral(s)
  word: string;
  transliteration: string;
};

export const oneToTwenty: NumberEntry[] = [
  { value: 1, glyph: "১", word: "এক", transliteration: "êk" },
  { value: 2, glyph: "২", word: "দুই", transliteration: "dui" },
  { value: 3, glyph: "৩", word: "তিন", transliteration: "tin" },
  { value: 4, glyph: "৪", word: "চার", transliteration: "char" },
  { value: 5, glyph: "৫", word: "পাঁচ", transliteration: "pãch" },
  { value: 6, glyph: "৬", word: "ছয়", transliteration: "chhoy" },
  { value: 7, glyph: "৭", word: "সাত", transliteration: "shat" },
  { value: 8, glyph: "৮", word: "আট", transliteration: "at" },
  { value: 9, glyph: "৯", word: "নয়", transliteration: "noy" },
  { value: 10, glyph: "১০", word: "দশ", transliteration: "dosh" },
  { value: 11, glyph: "১১", word: "এগারো", transliteration: "êgaro" },
  { value: 12, glyph: "১২", word: "বারো", transliteration: "baro" },
  { value: 13, glyph: "১৩", word: "তেরো", transliteration: "têro" },
  { value: 14, glyph: "১৪", word: "চৌদ্দ", transliteration: "chouddo" },
  { value: 15, glyph: "১৫", word: "পনেরো", transliteration: "ponero" },
  { value: 16, glyph: "১৬", word: "ষোলো", transliteration: "sholo" },
  { value: 17, glyph: "১৭", word: "সতেরো", transliteration: "shotero" },
  { value: 18, glyph: "১৮", word: "আঠারো", transliteration: "atharo" },
  { value: 19, glyph: "১৯", word: "উনিশ", transliteration: "unish" },
  { value: 20, glyph: "২০", word: "বিশ", transliteration: "bish" },
];

export const tens: NumberEntry[] = [
  { value: 30, glyph: "৩০", word: "ত্রিশ", transliteration: "trish" },
  { value: 40, glyph: "৪০", word: "চল্লিশ", transliteration: "chollish" },
  { value: 50, glyph: "৫০", word: "পঞ্চাশ", transliteration: "ponchash" },
  { value: 60, glyph: "৬০", word: "ষাট", transliteration: "shat" },
  { value: 70, glyph: "৭০", word: "সত্তর", transliteration: "shottor" },
  { value: 80, glyph: "৮০", word: "আশি", transliteration: "ashi" },
  { value: 90, glyph: "৯০", word: "নব্বই", transliteration: "nobboi" },
  { value: 100, glyph: "১০০", word: "একশো", transliteration: "êksho" },
];

/** Friendly objects for the counting game. */
export const countables: Array<{ emoji: string; bn: string; en: string }> = [
  { emoji: "🐟", bn: "মাছ", en: "fish" },
  { emoji: "⭐", bn: "তারা", en: "stars" },
  { emoji: "🥭", bn: "আম", en: "mangoes" },
  { emoji: "🛶", bn: "নৌকা", en: "boats" },
  { emoji: "🌸", bn: "ফুল", en: "flowers" },
  { emoji: "🐯", bn: "বাঘ", en: "tigers" },
];
