import type { Bilingual } from "./explore-content";

/**
 * Original days/months/seasons content in Bangladesh-standard Bangla.
 * The Bengali calendar's twelve months and six seasons are facts of the
 * culture; all wording here is original to Bangla Adventures and goes
 * through the Content Studio's Bangla-language review gate.
 */

export type DayEntry = {
  bn: string;
  transliteration: string;
  en: string;
};

export type MonthEntry = {
  bn: string;
  transliteration: string;
  gregorian: string; // approximate Gregorian span
};

export type SeasonEntry = {
  emoji: string;
  bn: string;
  transliteration: string;
  en: string;
  months: [string, string]; // the two Bengali months of the season
  description: Bilingual;
};

export const days: DayEntry[] = [
  { bn: "শনিবার", transliteration: "shonibar", en: "Saturday" },
  { bn: "রবিবার", transliteration: "robibar", en: "Sunday" },
  { bn: "সোমবার", transliteration: "shombar", en: "Monday" },
  { bn: "মঙ্গলবার", transliteration: "monggolbar", en: "Tuesday" },
  { bn: "বুধবার", transliteration: "budhbar", en: "Wednesday" },
  { bn: "বৃহস্পতিবার", transliteration: "brihoshpotibar", en: "Thursday" },
  { bn: "শুক্রবার", transliteration: "shukrobar", en: "Friday" },
];

export const months: MonthEntry[] = [
  { bn: "বৈশাখ", transliteration: "Boishakh", gregorian: "April–May" },
  { bn: "জ্যৈষ্ঠ", transliteration: "Joishtho", gregorian: "May–June" },
  { bn: "আষাঢ়", transliteration: "Asharh", gregorian: "June–July" },
  { bn: "শ্রাবণ", transliteration: "Srabon", gregorian: "July–August" },
  { bn: "ভাদ্র", transliteration: "Bhadro", gregorian: "August–September" },
  { bn: "আশ্বিন", transliteration: "Ashshin", gregorian: "September–October" },
  { bn: "কার্তিক", transliteration: "Kartik", gregorian: "October–November" },
  { bn: "অগ্রহায়ণ", transliteration: "Ogrohayon", gregorian: "November–December" },
  { bn: "পৌষ", transliteration: "Poush", gregorian: "December–January" },
  { bn: "মাঘ", transliteration: "Magh", gregorian: "January–February" },
  { bn: "ফাল্গুন", transliteration: "Falgun", gregorian: "February–March" },
  { bn: "চৈত্র", transliteration: "Choitro", gregorian: "March–April" },
];

export const seasons: SeasonEntry[] = [
  {
    emoji: "☀️",
    bn: "গ্রীষ্ম",
    transliteration: "grishsho",
    en: "summer",
    months: ["বৈশাখ", "জ্যৈষ্ঠ"],
    description: {
      en: "Hot days, ripe mangoes and the Bengali New Year on the first of Boishakh.",
      bn: "গরম দিন, পাকা আম আর পহেলা বৈশাখে বাংলা নববর্ষ।",
    },
  },
  {
    emoji: "🌧️",
    bn: "বর্ষা",
    transliteration: "borsha",
    en: "monsoon",
    months: ["আষাঢ়", "শ্রাবণ"],
    description: {
      en: "Big rains fill the rivers; boats glide and frogs sing.",
      bn: "বড় বৃষ্টিতে নদী ভরে যায়; নৌকা ভাসে, ব্যাঙ ডাকে।",
    },
  },
  {
    emoji: "🌾",
    bn: "শরৎ",
    transliteration: "shorot",
    en: "autumn",
    months: ["ভাদ্র", "আশ্বিন"],
    description: {
      en: "Clear blue skies and white kash flowers along the riverbanks.",
      bn: "ঝকঝকে নীল আকাশ আর নদীর ধারে সাদা কাশফুল।",
    },
  },
  {
    emoji: "🌫️",
    bn: "হেমন্ত",
    transliteration: "hemonto",
    en: "late autumn",
    months: ["কার্তিক", "অগ্রহায়ণ"],
    description: {
      en: "Harvest time: new rice, pitha cakes and the Nabanna festival.",
      bn: "ফসল তোলার সময়: নতুন চাল, পিঠা আর নবান্ন উৎসব।",
    },
  },
  {
    emoji: "🧣",
    bn: "শীত",
    transliteration: "sheet",
    en: "winter",
    months: ["পৌষ", "মাঘ"],
    description: {
      en: "Cool misty mornings, date-palm sweets and warm shawls.",
      bn: "কুয়াশা-ভরা শীতল সকাল, খেজুর গুড়ের মিষ্টি আর গরম চাদর।",
    },
  },
  {
    emoji: "🌼",
    bn: "বসন্ত",
    transliteration: "boshonto",
    en: "spring",
    months: ["ফাল্গুন", "চৈত্র"],
    description: {
      en: "Flowers bloom, cuckoos call, and Falgun begins with festivals of colour.",
      bn: "ফুল ফোটে, কোকিল ডাকে, আর রঙের উৎসবে ফাল্গুন শুরু হয়।",
    },
  },
];
