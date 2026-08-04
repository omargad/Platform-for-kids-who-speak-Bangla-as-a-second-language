import type { Bilingual } from "./explore-content";

/**
 * Original beginner grammar reference in Bangladesh-standard Bangla.
 * Facts of the language expressed in our own words and examples; goes
 * through the Content Studio's Bangla-language review gate.
 */

export type GrammarExample = {
  bn: string;
  transliteration: string;
  en: string;
};

export type GrammarItem = {
  head: string; // the Bangla word/ending this row teaches
  transliteration: string;
  meaning: Bilingual;
  example: GrammarExample;
};

export type GrammarSection = {
  id: string;
  icon: string;
  title: Bilingual;
  intro: Bilingual;
  items: GrammarItem[];
};

export const grammarSections: GrammarSection[] = [
  {
    id: "pronouns",
    icon: "🫶",
    title: { en: "People words (pronouns)", bn: "সর্বনাম" },
    intro: {
      en: "Bangla has a friendly secret: you choose a 'you' to match respect. Children say তুমি to friends and family, and আপনি to teachers and elders.",
      bn: "বাংলার একটি সুন্দর নিয়ম: সম্মান বুঝে ‘তুমি’ বা ‘আপনি’ বেছে নিতে হয়। বন্ধু ও পরিবারে ‘তুমি’, শিক্ষক ও গুরুজনে ‘আপনি’।",
    },
    items: [
      { head: "আমি", transliteration: "ami", meaning: { en: "I", bn: "আমি" }, example: { bn: "আমি বাংলা শিখি।", transliteration: "ami bangla shikhi", en: "I learn Bangla." } },
      { head: "তুমি", transliteration: "tumi", meaning: { en: "you (friendly)", bn: "তুমি (আপন)" }, example: { bn: "তুমি কেমন আছো?", transliteration: "tumi kêmon achho?", en: "How are you?" } },
      { head: "আপনি", transliteration: "apni", meaning: { en: "you (respectful)", bn: "আপনি (সম্মানসূচক)" }, example: { bn: "আপনি কেমন আছেন?", transliteration: "apni kêmon achhen?", en: "How are you? (to an elder)" } },
      { head: "সে", transliteration: "she", meaning: { en: "he / she", bn: "সে" }, example: { bn: "সে আমার বন্ধু।", transliteration: "she amar bondhu", en: "He/she is my friend." } },
      { head: "আমরা", transliteration: "amra", meaning: { en: "we", bn: "আমরা" }, example: { bn: "আমরা গান গাই।", transliteration: "amra gan gai", en: "We sing songs." } },
      { head: "তারা", transliteration: "tara", meaning: { en: "they", bn: "তারা" }, example: { bn: "তারা স্কুলে যায়।", transliteration: "tara skule jay", en: "They go to school." } },
    ],
  },
  {
    id: "word-order",
    icon: "🧩",
    title: { en: "Word order", bn: "বাক্যের সাজ" },
    intro: {
      en: "English says 'I eat rice'. Bangla keeps the doing-word for last: আমি ভাত খাই — 'I rice eat'. Person first, action last!",
      bn: "ইংরেজিতে বলে ‘I eat rice’। বাংলায় কাজের কথাটি শেষে বসে: আমি ভাত খাই। আগে কে, শেষে কী করে!",
    },
    items: [
      { head: "কর্তা + কর্ম + ক্রিয়া", transliteration: "subject + object + verb", meaning: { en: "the Bangla sentence shape", bn: "বাংলা বাক্যের ছাঁচ" }, example: { bn: "আমি ভাত খাই।", transliteration: "ami bhat khai", en: "I eat rice. (I rice eat)" } },
      { head: "না", transliteration: "na", meaning: { en: "'not' — goes after the verb", bn: "‘না’ ক্রিয়ার পরে বসে" }, example: { bn: "আমি জানি না।", transliteration: "ami jani na", en: "I don't know." } },
    ],
  },
  {
    id: "verbs",
    icon: "🏃",
    title: { en: "Doing words (verbs)", bn: "ক্রিয়া" },
    intro: {
      en: "Verbs change their ending, not their order. Watch করা (to do) travel through time:",
      bn: "ক্রিয়ার শেষাংশ বদলায়, জায়গা নয়। ‘করা’ কীভাবে সময়ে বদলায় দেখো:",
    },
    items: [
      { head: "করি", transliteration: "kori", meaning: { en: "do (now, every day)", bn: "করি (নিত্য বর্তমান)" }, example: { bn: "আমি কাজ করি।", transliteration: "ami kaj kori", en: "I do work." } },
      { head: "করছি", transliteration: "korchhi", meaning: { en: "am doing (right now)", bn: "করছি (এখনই)" }, example: { bn: "আমি ছবি আঁকছি।", transliteration: "ami chhobi ãkchhi", en: "I am drawing a picture." } },
      { head: "করেছি", transliteration: "korechhi", meaning: { en: "have done (already)", bn: "করেছি (আগে হয়ে গেছে)" }, example: { bn: "আমি পড়া শেষ করেছি।", transliteration: "ami pora shesh korechhi", en: "I have finished my reading." } },
      { head: "করব", transliteration: "korbo", meaning: { en: "will do (later)", bn: "করব (পরে)" }, example: { bn: "আমি কাল খেলব।", transliteration: "ami kal khelbo", en: "I will play tomorrow." } },
    ],
  },
  {
    id: "postpositions",
    icon: "📍",
    title: { en: "Little place words (postpositions)", bn: "অনুসর্গ" },
    intro: {
      en: "English puts 'in' and 'from' before a word; Bangla puts its helpers after (or hooks them on the end).",
      bn: "ইংরেজিতে ‘in’, ‘from’ শব্দের আগে বসে; বাংলায় সাহায্যকারী শব্দগুলো পরে বসে (বা শব্দের শেষে জুড়ে যায়)।",
    },
    items: [
      { head: "-এ / -তে", transliteration: "-e / -te", meaning: { en: "in, at, to", bn: "মধ্যে/অবস্থানে" }, example: { bn: "আমি স্কুলে যাই।", transliteration: "ami skule jai", en: "I go to school." } },
      { head: "থেকে", transliteration: "theke", meaning: { en: "from", bn: "থেকে" }, example: { bn: "আমরা ঢাকা থেকে এসেছি।", transliteration: "amra Dhaka theke eshechhi", en: "We came from Dhaka." } },
      { head: "সঙ্গে", transliteration: "shongge", meaning: { en: "with", bn: "সঙ্গে" }, example: { bn: "মায়ের সঙ্গে যাব।", transliteration: "mayer shongge jabo", en: "I will go with mum." } },
      { head: "জন্য", transliteration: "jonno", meaning: { en: "for", bn: "জন্য" }, example: { bn: "এটা তোমার জন্য।", transliteration: "eta tomar jonno", en: "This is for you." } },
      { head: "উপরে", transliteration: "upore", meaning: { en: "on / above", bn: "উপরে" }, example: { bn: "বইটা টেবিলের উপরে।", transliteration: "boita tebiler upore", en: "The book is on the table." } },
      { head: "নিচে", transliteration: "niche", meaning: { en: "under / below", bn: "নিচে" }, example: { bn: "বিড়ালটা খাটের নিচে।", transliteration: "biralta khater niche", en: "The cat is under the bed." } },
    ],
  },
  {
    id: "questions",
    icon: "❓",
    title: { en: "Question words", bn: "প্রশ্নের শব্দ" },
    intro: {
      en: "Add one small word and any sentence becomes a question. These seven open every door:",
      bn: "একটি ছোট শব্দ যোগ করলেই বাক্য প্রশ্ন হয়ে যায়। এই সাতটি শব্দ সব দরজা খোলে:",
    },
    items: [
      { head: "কী", transliteration: "ki", meaning: { en: "what", bn: "কী" }, example: { bn: "এটা কী?", transliteration: "eta ki?", en: "What is this?" } },
      { head: "কে", transliteration: "ke", meaning: { en: "who", bn: "কে" }, example: { bn: "ও কে?", transliteration: "o ke?", en: "Who is that?" } },
      { head: "কোথায়", transliteration: "kothay", meaning: { en: "where", bn: "কোথায়" }, example: { bn: "বইটা কোথায়?", transliteration: "boita kothay?", en: "Where is the book?" } },
      { head: "কখন", transliteration: "kokhon", meaning: { en: "when", bn: "কখন" }, example: { bn: "আমরা কখন খাব?", transliteration: "amra kokhon khabo?", en: "When will we eat?" } },
      { head: "কেন", transliteration: "kêno", meaning: { en: "why", bn: "কেন" }, example: { bn: "তুমি কেন হাসছো?", transliteration: "tumi kêno hashchho?", en: "Why are you laughing?" } },
      { head: "কীভাবে", transliteration: "kibhabe", meaning: { en: "how", bn: "কীভাবে" }, example: { bn: "এটা কীভাবে বলে?", transliteration: "eta kibhabe bole?", en: "How do you say this?" } },
      { head: "কয়টা", transliteration: "koyta", meaning: { en: "how many", bn: "কয়টা" }, example: { bn: "কয়টা আম আছে?", transliteration: "koyta am achhe?", en: "How many mangoes are there?" } },
    ],
  },
];
