// The poetry corner — literature presented AS WRITTEN, per the client's rule:
// "we cannot change a story, we cannot change the poem. If we are presenting
// it, we have to present it as it is."
//
// Copyright: only public-domain verse appears here verbatim. Bangladesh's
// copyright term is the author's life + 60 years, so Rabindranath Tagore
// (d. 1941) and Kusumkumari Das (d. 1948) are public domain, and folk rhymes
// have no author to hold copyright. Kazi Nazrul Islam (d. 1976) remains under
// copyright until 2036 — his poems are cited in the topics but NOT reproduced.

import type { Bilingual } from "./topics-content";

export type Poem = {
  id: string;
  titleBn: string;
  titleEn: string;
  author: { bn: string; en: string; years: string };
  // The verse itself, verbatim, one array item per line. Never edited.
  lines: string[];
  excerpt: boolean;
  // Original prose helper for heritage learners — clearly separate from the verse.
  gloss: Bilingual;
  whereFound: Bilingual;
  publicDomain: string;
};

export const poems: Poem[] = [
  {
    id: "amader-choto-nodi",
    titleBn: "আমাদের ছোট নদী",
    titleEn: "Our Little River",
    author: { bn: "রবীন্দ্রনাথ ঠাকুর", en: "Rabindranath Tagore", years: "1861–1941" },
    lines: [
      "আমাদের ছোট নদী চলে বাঁকে বাঁকে",
      "বৈশাখ মাসে তার হাঁটু জল থাকে।",
      "পার হয়ে যায় গরু, পার হয় গাড়ি,",
      "দুই ধার উঁচু তার, ঢালু তার পাড়ি।",
      "চিক চিক করে বালি, কোথা নাই কাদা,",
      "একধারে কাশবন ফুলে ফুলে সাদা।",
    ],
    excerpt: true,
    gloss: {
      en: "A small village river winds along, knee-deep in the month of Boishakh — cows and carts wade across, sand glitters, and a white kash-flower forest lines one bank.",
      bn: "গাঁয়ের ছোট নদী এঁকেবেঁকে চলে, বৈশাখে হাঁটু জল — গরু-গাড়ি পার হয়, বালি চিকচিক করে, এক পাড়ে সাদা কাশবন।",
    },
    whereFound: {
      en: "From Tagore's beginner reader 'Sahaj Path'; generations of Bangladeshi children learn it in the early primary classes.",
      bn: "রবীন্দ্রনাথের ‘সহজ পাঠ’ থেকে; প্রাথমিকের শুরুর শ্রেণিতে প্রজন্মের পর প্রজন্ম এটি পড়ে।",
    },
    publicDomain: "Tagore died in 1941 — public domain worldwide (Bangladesh: life + 60 years).",
  },
  {
    id: "talgachh",
    titleBn: "তালগাছ",
    titleEn: "The Palm Tree",
    author: { bn: "রবীন্দ্রনাথ ঠাকুর", en: "Rabindranath Tagore", years: "1861–1941" },
    lines: [
      "তালগাছ এক পায়ে দাঁড়িয়ে",
      "সব গাছ ছাড়িয়ে",
      "উঁকি মারে আকাশে।",
      "মনে সাধ, কালো মেঘ ফুঁড়ে যায়,",
      "একেবারে উড়ে যায়;",
      "কোথা পাবে পাখা সে?",
    ],
    excerpt: true,
    gloss: {
      en: "The palm tree stands on one leg, taller than every other tree, peeping into the sky — it dreams of piercing the black clouds and flying away. But where would it find wings?",
      bn: "তালগাছ এক পায়ে দাঁড়িয়ে সব গাছ ছাড়িয়ে আকাশে উঁকি দেয় — মেঘ ফুঁড়ে উড়ে যেতে চায়। কিন্তু পাখা পাবে কোথায়?",
    },
    whereFound: {
      en: "A favourite in the primary Bangla readers — kids love acting out the one-legged tree.",
      bn: "প্রাথমিক বাংলা বইয়ের প্রিয় কবিতা — এক পায়ে দাঁড়ানো গাছ সাজতে শিশুরা ভালোবাসে।",
    },
    publicDomain: "Tagore died in 1941 — public domain worldwide (Bangladesh: life + 60 years).",
  },
  {
    id: "adorsho-chhele",
    titleBn: "আদর্শ ছেলে",
    titleEn: "The Ideal Boy",
    author: { bn: "কুসুমকুমারী দাশ", en: "Kusumkumari Das", years: "1875–1948" },
    lines: [
      "আমাদের দেশে হবে সেই ছেলে কবে",
      "কথায় না বড় হয়ে কাজে বড় হবে?",
      "মুখে হাসি বুকে বল, তেজে ভরা মন",
      "‘মানুষ হইতে হবে’ — এই যার পণ।",
    ],
    excerpt: true,
    gloss: {
      en: "When will our land have the child who grows great by deeds, not words — a smile on the face, courage in the chest, and one vow: to become a true human being?",
      bn: "কবে আসবে সেই সন্তান, যে কথায় নয়, কাজে বড় হবে — মুখে হাসি, বুকে সাহস, আর একটাই পণ: মানুষ হতে হবে।",
    },
    whereFound: {
      en: "Recited at school assemblies across Bangladesh; the poet was also the mother of poet Jibanananda Das.",
      bn: "বাংলাদেশের স্কুল অ্যাসেম্বলিতে নিয়মিত আবৃত্তি হয়; কবি ছিলেন কবি জীবনানন্দ দাশের মা।",
    },
    publicDomain: "Kusumkumari Das died in 1948 — public domain in Bangladesh (life + 60 years).",
  },
  {
    id: "chand-mama",
    titleBn: "আয় আয় চাঁদ মামা",
    titleEn: "Come, Uncle Moon",
    author: { bn: "প্রচলিত ছড়া", en: "Traditional folk rhyme", years: "passed down for generations" },
    lines: [
      "আয় আয় চাঁদ মামা, টিপ দিয়ে যা,",
      "চাঁদের কপালে চাঁদ টিপ দিয়ে যা।",
      "ধান ভানলে কুঁড়ো দেব,",
      "মাছ কাটলে মুড়ো দেব।",
    ],
    excerpt: true,
    gloss: {
      en: "A lullaby inviting Uncle Moon to come and press a tiny tip (beauty spot) on the baby's forehead — offering him rice bran and a fish head in return!",
      bn: "ঘুমপাড়ানি ছড়া — চাঁদ মামাকে ডেকে শিশুর কপালে টিপ দিতে বলা হয়, বিনিময়ে কুঁড়ো আর মাছের মুড়োর লোভ!",
    },
    whereFound: {
      en: "Sung to babies in nearly every Bengali home; the first 'poem' most children ever hear.",
      bn: "প্রায় প্রতিটি বাঙালি ঘরে শিশুদের শোনানো হয়; বেশির ভাগ শিশুর শোনা প্রথম ‘কবিতা’।",
    },
    publicDomain: "Traditional folk rhyme — no individual author; part of the shared oral heritage.",
  },
  {
    id: "hattimatim",
    titleBn: "হাট্টিমাটিম টিম",
    titleEn: "Hattimatim Tim",
    author: { bn: "প্রচলিত ছড়া", en: "Traditional folk rhyme", years: "passed down for generations" },
    lines: [
      "হাট্টিমাটিম টিম,",
      "তারা মাঠে পাড়ে ডিম,",
      "তাদের খাড়া দুটো শিং,",
      "তারা হাট্টিমাটিম টিম।",
    ],
    excerpt: false,
    gloss: {
      en: "Pure nonsense fun: the mysterious Hattimatim Tim lay eggs in the field and have two straight horns. Nobody knows what they are — that's the joke!",
      bn: "নির্ভেজাল মজার ছড়া: হাট্টিমাটিম টিম মাঠে ডিম পাড়ে, মাথায় খাড়া দুটো শিং। তারা আসলে কী — কেউ জানে না, মজাটা সেখানেই!",
    },
    whereFound: {
      en: "The most famous Bengali nonsense rhyme — every Bengali child can chant it.",
      bn: "বাংলার সবচেয়ে বিখ্যাত মজার ছড়া — প্রতিটি বাঙালি শিশুর মুখস্থ।",
    },
    publicDomain: "Traditional folk rhyme (the familiar four lines) — part of the shared oral heritage.",
  },
];

export const poemsPagePolicy = {
  en: "Poems appear here exactly as written — literature is never adapted or simplified. Only public-domain verse is reproduced: Kazi Nazrul Islam's poems, for example, stay under copyright in Bangladesh until 2036, so we tell you about them in the topics but link you to the official textbooks to read them.",
  bn: "কবিতা এখানে অবিকল ছাপা হয় — সাহিত্য কখনো বদলানো বা সহজ করা হয় না। কেবল পাবলিক ডোমেইনের কবিতাই তুলে ধরা হয়: যেমন কাজী নজরুল ইসলামের কবিতা বাংলাদেশে ২০৩৬ সাল পর্যন্ত কপিরাইটের আওতায়, তাই বিষয়ের পাতায় তাঁর কথা বলা হয়, আর পড়ার জন্য সরকারি পাঠ্যবইয়ের লিংক দেওয়া হয়।",
};
