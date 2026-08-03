import type { Bilingual } from "./explore-content";

/**
 * Original Bornomala (বর্ণমালা) reference content, authored for this platform
 * in the classic Bangla primer style ("অ-তে অজগর"). The alphabet, letter
 * names, sounds and numerals are facts of the language; every example word,
 * gloss and description here is original to Bangla Adventures. Like all
 * language content, it goes through the Content Studio's Bangla-language
 * review gate before public launch.
 */

export type Letter = {
  glyph: string;
  name: string; // romanized letter name
  sound: string; // approximate sound for English-literate readers
  example: { bn: string; transliteration: string; en: string };
  note?: Bilingual;
};

export type KarForm = {
  vowel: string;
  sign: string; // the dependent sign shown with ক
  combined: string;
  sound: string;
};

export type Digit = {
  glyph: string;
  word: string;
  transliteration: string;
  en: string;
};

export const vowels: Letter[] = [
  { glyph: "অ", name: "shôre ô", sound: "o as in 'song'", example: { bn: "অজগর", transliteration: "ojogor", en: "python" } },
  { glyph: "আ", name: "shôre a", sound: "a as in 'father'", example: { bn: "আম", transliteration: "am", en: "mango" } },
  { glyph: "ই", name: "hrôshsho i", sound: "i as in 'sit'", example: { bn: "ইলিশ", transliteration: "ilish", en: "hilsa fish" } },
  { glyph: "ঈ", name: "dirgho i", sound: "ee as in 'see'", example: { bn: "ঈগল", transliteration: "igol", en: "eagle" } },
  { glyph: "উ", name: "hrôshsho u", sound: "u as in 'put'", example: { bn: "উট", transliteration: "ut", en: "camel" } },
  { glyph: "ঊ", name: "dirgho u", sound: "oo as in 'moon'", example: { bn: "ঊনিশ", transliteration: "unish", en: "nineteen" } },
  { glyph: "ঋ", name: "ri", sound: "ri as in 'ring'", example: { bn: "ঋতু", transliteration: "ritu", en: "season" } },
  { glyph: "এ", name: "e", sound: "e as in 'bed'", example: { bn: "এক", transliteration: "êk", en: "one" } },
  { glyph: "ঐ", name: "oi", sound: "oi as in 'coin'", example: { bn: "ঐরাবত", transliteration: "oirabot", en: "celestial elephant" } },
  { glyph: "ও", name: "o", sound: "o as in 'go'", example: { bn: "ওল", transliteration: "ol", en: "yam" } },
  { glyph: "ঔ", name: "ou", sound: "ou as in 'though' + 'u'", example: { bn: "ঔষধ", transliteration: "oushodh", en: "medicine" } },
];

export const consonants: Letter[] = [
  { glyph: "ক", name: "kô", sound: "k as in 'kite'", example: { bn: "কলা", transliteration: "kola", en: "banana" } },
  { glyph: "খ", name: "khô", sound: "kh (breathy k)", example: { bn: "খাতা", transliteration: "khata", en: "notebook" } },
  { glyph: "গ", name: "gô", sound: "g as in 'go'", example: { bn: "গরু", transliteration: "goru", en: "cow" } },
  { glyph: "ঘ", name: "ghô", sound: "gh (breathy g)", example: { bn: "ঘড়ি", transliteration: "ghori", en: "clock" } },
  { glyph: "ঙ", name: "ungô", sound: "ng as in 'song'", example: { bn: "ব্যাঙ", transliteration: "bêng", en: "frog" }, note: { en: "Usually appears inside or at the end of words.", bn: "সাধারণত শব্দের মাঝে বা শেষে বসে।" } },
  { glyph: "চ", name: "chô", sound: "ch as in 'chat'", example: { bn: "চশমা", transliteration: "choshma", en: "glasses" } },
  { glyph: "ছ", name: "chhô", sound: "chh (breathy ch)", example: { bn: "ছবি", transliteration: "chhobi", en: "picture" } },
  { glyph: "জ", name: "borgio jô", sound: "j as in 'jam'", example: { bn: "জল", transliteration: "jol", en: "water" } },
  { glyph: "ঝ", name: "jhô", sound: "jh (breathy j)", example: { bn: "ঝড়", transliteration: "jhor", en: "storm" } },
  { glyph: "ঞ", name: "niô", sound: "ny as in 'canyon'", example: { bn: "চঞ্চল", transliteration: "chonchol", en: "lively" }, note: { en: "Mostly appears inside words, next to চ-family letters.", bn: "সাধারণত শব্দের ভেতরে, চ-বর্গের পাশে বসে।" } },
  { glyph: "ট", name: "ṭô", sound: "t with tongue curled back", example: { bn: "টমেটো", transliteration: "tometo", en: "tomato" } },
  { glyph: "ঠ", name: "ṭhô", sound: "ṭh (breathy ṭ)", example: { bn: "ঠোঁট", transliteration: "thõt", en: "lips" } },
  { glyph: "ড", name: "ḍô", sound: "d with tongue curled back", example: { bn: "ডিম", transliteration: "dim", en: "egg" } },
  { glyph: "ঢ", name: "ḍhô", sound: "ḍh (breathy ḍ)", example: { bn: "ঢাক", transliteration: "dhak", en: "drum" } },
  { glyph: "ণ", name: "murdhonno nô", sound: "n (retroflex)", example: { bn: "হরিণ", transliteration: "horin", en: "deer" } },
  { glyph: "ত", name: "tô", sound: "t (soft, dental)", example: { bn: "তারা", transliteration: "tara", en: "star" } },
  { glyph: "থ", name: "thô", sound: "th (breathy t)", example: { bn: "থালা", transliteration: "thala", en: "plate" } },
  { glyph: "দ", name: "dô", sound: "d (soft, dental)", example: { bn: "দাদা", transliteration: "dada", en: "big brother" } },
  { glyph: "ধ", name: "dhô", sound: "dh (breathy d)", example: { bn: "ধান", transliteration: "dhan", en: "rice plant" } },
  { glyph: "ন", name: "dontyo nô", sound: "n as in 'nice'", example: { bn: "নদী", transliteration: "nodi", en: "river" } },
  { glyph: "প", name: "pô", sound: "p as in 'pen'", example: { bn: "পাখি", transliteration: "pakhi", en: "bird" } },
  { glyph: "ফ", name: "phô", sound: "ph / f", example: { bn: "ফুল", transliteration: "phul", en: "flower" } },
  { glyph: "ব", name: "bô", sound: "b as in 'ball'", example: { bn: "বই", transliteration: "boi", en: "book" } },
  { glyph: "ভ", name: "bhô", sound: "bh (breathy b)", example: { bn: "ভালুক", transliteration: "bhaluk", en: "bear" } },
  { glyph: "ম", name: "mô", sound: "m as in 'moon'", example: { bn: "মা", transliteration: "ma", en: "mother" } },
  { glyph: "য", name: "ôntostho jô", sound: "j (like জ in most words)", example: { bn: "যাদু", transliteration: "jadu", en: "magic" } },
  { glyph: "র", name: "rô", sound: "r (lightly rolled)", example: { bn: "রাত", transliteration: "rat", en: "night" } },
  { glyph: "ল", name: "lô", sound: "l as in 'lamp'", example: { bn: "লাল", transliteration: "lal", en: "red" } },
  { glyph: "শ", name: "talobbo shô", sound: "sh as in 'ship'", example: { bn: "শাপলা", transliteration: "shapla", en: "water lily" } },
  { glyph: "ষ", name: "murdhonno shô", sound: "sh (retroflex)", example: { bn: "ভাষা", transliteration: "bhasha", en: "language" } },
  { glyph: "স", name: "dontyo shô", sound: "s / sh", example: { bn: "সাপ", transliteration: "shap", en: "snake" } },
  { glyph: "হ", name: "hô", sound: "h as in 'hat'", example: { bn: "হাতি", transliteration: "hati", en: "elephant" } },
  { glyph: "ড়", name: "ṛô", sound: "r with a quick flap", example: { bn: "বড়", transliteration: "boro", en: "big" }, note: { en: "Appears inside or at the end of words.", bn: "শব্দের মাঝে বা শেষে বসে।" } },
  { glyph: "ঢ়", name: "ṛhô", sound: "ṛh (breathy flap)", example: { bn: "আষাঢ়", transliteration: "asharh", en: "the rainy month Asharh" }, note: { en: "Rare; appears inside or at the end of words.", bn: "বিরল; শব্দের মাঝে বা শেষে বসে।" } },
  { glyph: "য়", name: "ôntostho ô (yô)", sound: "y as in 'yes' (soft)", example: { bn: "ময়ূর", transliteration: "moyur", en: "peacock" }, note: { en: "Appears inside or at the end of words.", bn: "শব্দের মাঝে বা শেষে বসে।" } },
  { glyph: "ৎ", name: "khôndo tô", sound: "a quick final t", example: { bn: "হঠাৎ", transliteration: "hothat", en: "suddenly" }, note: { en: "Only appears at the end of a syllable.", bn: "কেবল শব্দাংশের শেষে বসে।" } },
  { glyph: "ং", name: "ônushshar", sound: "ng", example: { bn: "রং", transliteration: "rong", en: "colour" }, note: { en: "A sign that adds an 'ng' sound.", bn: "‘ং’ ধ্বনি যোগ করার চিহ্ন।" } },
  { glyph: "ঃ", name: "bishôrgo", sound: "a soft h-echo", example: { bn: "দুঃখ", transliteration: "dukkho", en: "sadness" }, note: { en: "A sign; often doubles the next sound.", bn: "একটি চিহ্ন; প্রায়ই পরের ধ্বনি দ্বিগুণ করে।" } },
  { glyph: "ঁ", name: "chôndrobindu", sound: "makes the vowel nasal", example: { bn: "চাঁদ", transliteration: "chãd", en: "moon" }, note: { en: "The 'moon-dot' sits above a vowel to make it nasal.", bn: "‘চাঁদ-বিন্দু’ স্বরের ওপরে বসে ধ্বনিকে অনুনাসিক করে।" } },
];

/** How each vowel attaches to a consonant, demonstrated on ক. */
export const karForms: KarForm[] = [
  { vowel: "অ", sign: "—", combined: "ক", sound: "kô" },
  { vowel: "আ", sign: "া", combined: "কা", sound: "ka" },
  { vowel: "ই", sign: "ি", combined: "কি", sound: "ki" },
  { vowel: "ঈ", sign: "ী", combined: "কী", sound: "ki (long)" },
  { vowel: "উ", sign: "ু", combined: "কু", sound: "ku" },
  { vowel: "ঊ", sign: "ূ", combined: "কূ", sound: "ku (long)" },
  { vowel: "ঋ", sign: "ৃ", combined: "কৃ", sound: "kri" },
  { vowel: "এ", sign: "ে", combined: "কে", sound: "ke" },
  { vowel: "ঐ", sign: "ৈ", combined: "কৈ", sound: "koi" },
  { vowel: "ও", sign: "ো", combined: "কো", sound: "ko" },
  { vowel: "ঔ", sign: "ৌ", combined: "কৌ", sound: "kou" },
];

export const digits: Digit[] = [
  { glyph: "০", word: "শূন্য", transliteration: "shunno", en: "zero" },
  { glyph: "১", word: "এক", transliteration: "êk", en: "one" },
  { glyph: "২", word: "দুই", transliteration: "dui", en: "two" },
  { glyph: "৩", word: "তিন", transliteration: "tin", en: "three" },
  { glyph: "৪", word: "চার", transliteration: "char", en: "four" },
  { glyph: "৫", word: "পাঁচ", transliteration: "pãch", en: "five" },
  { glyph: "৬", word: "ছয়", transliteration: "chhoy", en: "six" },
  { glyph: "৭", word: "সাত", transliteration: "shat", en: "seven" },
  { glyph: "৮", word: "আট", transliteration: "at", en: "eight" },
  { glyph: "৯", word: "নয়", transliteration: "noy", en: "nine" },
];
