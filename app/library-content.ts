// The NCTB textbook library. Per the client's direction (meeting, 10 Aug 2026),
// textbooks published by Bangladesh's National Curriculum and Textbook Board
// (NCTB) are the platform's approved source of truth for culture, history and
// literature content. This catalog lists the relevant books, which classes use
// them, and where to download the official PDFs. It is reviewed once per
// academic year — NCTB refreshes textbooks each January — and any non-NCTB
// source must be approved by the client before use.

import type { Bilingual } from "./topics-content";

export const NCTB_PORTAL_URL = "https://nctb.gov.bd/";

export type BookChapter = {
  title: Bilingual;
  // Classroom topic on /topics that adapts this chapter, when one exists.
  topicId?: string;
};

export type ChapterMap = {
  // Which edition the map was read from, and how sure we are.
  note: Bilingual;
  verified: boolean;
  chapters: BookChapter[];
};

export type LibraryBook = {
  id: string;
  // Bangla title as printed on the cover, and the English name used for it.
  titleBn: string;
  titleEn: string;
  classes: Bilingual;
  level: "primary" | "secondary" | "higher-secondary";
  subjectArea: Bilingual;
  covers: Bilingual;
  whyItMatters: Bilingual;
  hasEnglishVersion: boolean;
  // "listed" = title/classes confirmed; "confirm" = include, but double-check
  // the exact edition with the client/school before relying on it in class.
  status: "listed" | "confirm";
  chapterMap?: ChapterMap;
};

export const libraryBooks: LibraryBook[] = [
  {
    id: "amar-boi-pre-primary",
    titleBn: "আমার বই",
    titleEn: "Amar Boi (My Book) — pre-primary",
    classes: { en: "Pre-primary (prep)", bn: "প্রাক-প্রাথমিক" },
    level: "primary",
    subjectArea: { en: "First picture book", bn: "প্রথম ছবির বই" },
    covers: {
      en: "NCTB's picture book for the very youngest: colours, animals, family, rhymes and first ideas of home — the gentlest possible start.",
      bn: "সবচেয়ে ছোটদের জন্য এনসিটিবির ছবির বই: রং, পশুপাখি, পরিবার, ছড়া আর দেশের প্রথম ধারণা — সবচেয়ে নরম শুরু।",
    },
    whyItMatters: {
      en: "The client's scope starts at prep — this is the official book that age group holds in Bangladesh, full of picture ideas for our youngest topics and crafts.",
      bn: "ক্লায়েন্টের পরিধি প্রেপ থেকে শুরু — বাংলাদেশে এই বয়সের শিশুরা এই সরকারি বইটিই পড়ে; ছোটদের বিষয় ও হাতের কাজের ছবির ধারণায় ভরপুর।",
    },
    hasEnglishVersion: false,
    status: "listed",
  },
  {
    id: "amar-bangla-boi",
    titleBn: "আমার বাংলা বই",
    titleEn: "Amar Bangla Boi (My Bangla Book)",
    classes: { en: "Classes 1–5", bn: "১ম–৫ম শ্রেণি" },
    level: "primary",
    subjectArea: { en: "Bangla reader — literature", bn: "বাংলা পাঠ — সাহিত্য" },
    covers: {
      en: "Rhymes, poems and short stories that Bangladeshi children read first — including harvest poems, river lessons and folk rhymes.",
      bn: "বাংলাদেশের শিশুরা প্রথম যা পড়ে — ছড়া, কবিতা, ছোটগল্প; নবান্নের কবিতা, নদীর পাঠ, লোকছড়া।",
    },
    whyItMatters: {
      en: "The gentlest window into Bangla literature. Poems and stories from here are presented as written — literature is never altered.",
      bn: "বাংলা সাহিত্যে ঢোকার সবচেয়ে নরম দরজা। এখানকার কবিতা-গল্প অবিকল উপস্থাপন করা হয় — সাহিত্য কখনো বদলানো হয় না।",
    },
    hasEnglishVersion: false,
    status: "listed",
  },
  {
    id: "bgs-primary",
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies (primary)",
    classes: { en: "Classes 3–5", bn: "৩য়–৫ম শ্রেণি" },
    level: "primary",
    subjectArea: { en: "Society, culture & history", bn: "সমাজ, সংস্কৃতি ও ইতিহাস" },
    covers: {
      en: "Our Bangladesh: tradition and culture, the Language Movement, the Liberation War, national symbols, festivals, rivers, rights and responsibilities.",
      bn: "আমাদের বাংলাদেশ: ঐতিহ্য ও সংস্কৃতি, ভাষা আন্দোলন, মুক্তিযুদ্ধ, জাতীয় প্রতীক, উৎসব, নদ-নদী, অধিকার ও কর্তব্য।",
    },
    whyItMatters: {
      en: "The single most useful book for this platform's younger learners — it covers almost every classroom topic at just the right depth.",
      bn: "ছোটদের জন্য এই প্ল্যাটফর্মের সবচেয়ে দরকারি বই — প্রায় সব শ্রেণিকক্ষ-বিষয় ঠিক মাপের গভীরতায় আছে।",
    },
    hasEnglishVersion: true,
    status: "listed",
    chapterMap: {
      note: {
        en: "Chapter map of the Class 5 volume (English version). Re-check against the 2026 PDF after ingestion.",
        bn: "৫ম শ্রেণির বইয়ের (ইংরেজি সংস্করণ) অধ্যায়-তালিকা। ২০২৬-এর পিডিএফ নামানোর পর মিলিয়ে নিন।",
      },
      verified: true,
      chapters: [
        { title: { en: "Our Liberation War", bn: "আমাদের মুক্তিযুদ্ধ" }, topicId: "liberation-1971" },
        { title: { en: "British Rule", bn: "ব্রিটিশ শাসন" }, topicId: "british-rule" },
        { title: { en: "Historical places and artifacts of Bangladesh", bn: "বাংলাদেশের ঐতিহাসিক স্থান ও নিদর্শন" }, topicId: "ancient-bengal" },
        { title: { en: "Our economy: agriculture and industry", bn: "আমাদের অর্থনীতি: কৃষি ও শিল্প" } },
        { title: { en: "Population and human resources", bn: "জনসংখ্যা ও মানবসম্পদ" } },
        { title: { en: "Climate and disaster", bn: "জলবায়ু ও দুর্যোগ" }, topicId: "climate-and-disasters" },
        { title: { en: "Human rights", bn: "মানবাধিকার" } },
        { title: { en: "Equal rights of women and men", bn: "নারী-পুরুষের সমান অধিকার" } },
        { title: { en: "Our duties and responsibilities", bn: "আমাদের কর্তব্য ও দায়িত্ব" } },
        { title: { en: "Democratic attitude", bn: "গণতান্ত্রিক মনোভাব" } },
        { title: { en: "Ethnic groups of Bangladesh", bn: "বাংলাদেশের নৃগোষ্ঠী" }, topicId: "ethnic-communities" },
        { title: { en: "Bangladesh and the world", bn: "বাংলাদেশ ও বিশ্ব" }, topicId: "amar-ekushey" },
      ],
    },
  },
  {
    id: "bgs-secondary",
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয় (মাধ্যমিক)",
    titleEn: "Bangladesh and Global Studies (secondary)",
    classes: { en: "Classes 6–10", bn: "৬ষ্ঠ–১০ম শ্রেণি" },
    level: "secondary",
    subjectArea: { en: "Society, culture & history", bn: "সমাজ, সংস্কৃতি ও ইতিহাস" },
    covers: {
      en: "Bangladesh's history, geography, economy, culture, heritage sites and diversity — one volume per class, in Bangla and English versions.",
      bn: "বাংলাদেশের ইতিহাস, ভূগোল, অর্থনীতি, সংস্কৃতি, ঐতিহ্য ও বৈচিত্র্য — প্রতিটি শ্রেণির আলাদা বই, বাংলা ও ইংরেজি সংস্করণে।",
    },
    whyItMatters: {
      en: "The backbone source for older students' topics, and the English version helps team members who don't read Bangla verify content.",
      bn: "বড়দের বিষয়গুলোর মূল উৎস; ইংরেজি সংস্করণ বাংলা-না-জানা দলের সদস্যদের যাচাইয়ে সাহায্য করে।",
    },
    hasEnglishVersion: true,
    status: "listed",
  },
  {
    id: "history-9-10",
    titleBn: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা",
    titleEn: "History of Bangladesh and World Civilization",
    classes: { en: "Classes 9–10 (SSC)", bn: "৯ম–১০ম শ্রেণি (এসএসসি)" },
    level: "secondary",
    subjectArea: { en: "History", bn: "ইতিহাস" },
    covers: {
      en: "Ancient Bengal (Mahasthangarh, Paharpur), the medieval and colonial periods, the Language Movement and the Liberation War — in full depth.",
      bn: "প্রাচীন বাংলা (মহাস্থানগড়, পাহাড়পুর), মধ্যযুগ ও ঔপনিবেশিক কাল, ভাষা আন্দোলন ও মুক্তিযুদ্ধ — পূর্ণ গভীরতায়।",
    },
    whyItMatters: {
      en: "The authoritative history reference. Facts in the platform's history topics trace back to this book. English version available.",
      bn: "ইতিহাসের নির্ভরযোগ্য উৎস। প্ল্যাটফর্মের ইতিহাস-বিষয়ের তথ্য এই বইয়ে মেলে। ইংরেজি সংস্করণ আছে।",
    },
    hasEnglishVersion: true,
    status: "listed",
    chapterMap: {
      note: {
        en: "Unit map by theme — chapter numbers/titles to be confirmed against the 2026 PDF after ingestion.",
        bn: "থিম অনুযায়ী ইউনিট-তালিকা — অধ্যায় নম্বর/নাম ২০২৬-এর পিডিএফের সঙ্গে মিলিয়ে নেওয়া হবে।",
      },
      verified: false,
      chapters: [
        { title: { en: "What history is, and why it matters", bn: "ইতিহাস কী ও কেন" } },
        { title: { en: "World civilizations (Egypt, Greece, Rome)", bn: "বিশ্বসভ্যতা (মিশর, গ্রিস, রোম)" } },
        { title: { en: "Janapadas and rulers of ancient Bengal", bn: "প্রাচীন বাংলার জনপদ ও শাসকগণ" }, topicId: "ancient-bengal" },
        { title: { en: "Medieval Bengal: sultans and Mughals", bn: "মধ্যযুগের বাংলা: সুলতানি ও মুঘল আমল" } },
        { title: { en: "Colonial rule and the road to 1947", bn: "ঔপনিবেশিক শাসন ও ১৯৪৭-এর পথ" }, topicId: "british-rule" },
        { title: { en: "The Language Movement of 1952", bn: "১৯৫২-এর ভাষা আন্দোলন" }, topicId: "amar-ekushey" },
        { title: { en: "The Liberation War and independent Bangladesh", bn: "মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশ" }, topicId: "liberation-1971" },
      ],
    },
  },
  {
    id: "literature-secondary",
    titleBn: "চারুপাঠ · সপ্তবর্ণা · সাহিত্য কণিকা · আনন্দপাঠ",
    titleEn: "The secondary Bangla readers (Charupath, Saptabarna, Sahitya Kanika, Anandapath)",
    classes: { en: "Classes 6–8", bn: "৬ষ্ঠ–৮ম শ্রেণি" },
    level: "secondary",
    subjectArea: { en: "Bangla literature", bn: "বাংলা সাহিত্য" },
    covers: {
      en: "Selected poems, essays and stories by Tagore, Nazrul, Jasimuddin and more — the literature canon as Bangladesh's schools teach it.",
      bn: "রবীন্দ্রনাথ, নজরুল, জসীমউদ্দীনসহ নানা লেখকের নির্বাচিত কবিতা, প্রবন্ধ ও গল্প — বাংলাদেশের স্কুলে পড়ানো সাহিত্যের মূল ধারা।",
    },
    whyItMatters: {
      en: "Our literature topics point here for the real texts. Poems and stories are read as printed — never adapted.",
      bn: "সাহিত্য-বিষয়গুলো মূল পাঠের জন্য এখানেই নির্দেশ করে। কবিতা-গল্প ছাপা অনুযায়ীই পড়া হয় — কখনো বদলানো হয় না।",
    },
    hasEnglishVersion: false,
    status: "confirm",
  },
  {
    id: "arts-crafts",
    titleBn: "চারু ও কারুকলা",
    titleEn: "Arts and Crafts (Charu O Karukola)",
    classes: { en: "Classes 6–9", bn: "৬ষ্ঠ–৯ম শ্রেণি" },
    level: "secondary",
    subjectArea: { en: "Arts & crafts", bn: "শিল্পকলা ও কারুশিল্প" },
    covers: {
      en: "Folk arts of Bangladesh — nakshi kantha, pottery, weaving, festival art — plus drawing and craft activities for students.",
      bn: "বাংলাদেশের লোকশিল্প — নকশি কাঁথা, মৃৎশিল্প, বয়ন, উৎসবের শিল্প — এবং আঁকা ও হাতের কাজের অনুশীলন।",
    },
    whyItMatters: {
      en: "The client specifically pointed to this subject in our meeting; it anchors the crafts topics and classroom poster/craft activities.",
      bn: "ক্লায়েন্ট মিটিংয়ে এই বিষয়টির কথা আলাদা করে বলেছেন; কারুশিল্প-বিষয় ও পোস্টার/হাতের কাজের ভিত্তি এটিই।",
    },
    hasEnglishVersion: true,
    status: "confirm",
  },
  {
    id: "ethnic-culture",
    titleBn: "ক্ষুদ্র নৃগোষ্ঠীর ভাষা ও সংস্কৃতি",
    titleEn: "Language and Culture of Minority Ethnic Groups",
    classes: { en: "Secondary level", bn: "মাধ্যমিক স্তর" },
    level: "secondary",
    subjectArea: { en: "Culture & diversity", bn: "সংস্কৃতি ও বৈচিত্র্য" },
    covers: {
      en: "The languages, festivals, dress and crafts of the Chakma, Marma, Garo, Santal and other communities of Bangladesh.",
      bn: "চাকমা, মারমা, গারো, সাঁওতালসহ বাংলাদেশের নৃগোষ্ঠীগুলোর ভাষা, উৎসব, পোশাক ও কারুশিল্প।",
    },
    whyItMatters: {
      en: "Chosen with the client during the meeting ('culture of minority ethnic groups'). It grounds the hill-and-plains communities topic.",
      bn: "মিটিংয়ে ক্লায়েন্টের সঙ্গে বাছাই করা বই। পাহাড় ও সমতলের জনগোষ্ঠী বিষয়টির ভিত্তি।",
    },
    hasEnglishVersion: true,
    status: "confirm",
  },
  {
    id: "geography-9-10",
    titleBn: "ভূগোল ও পরিবেশ",
    titleEn: "Geography and Environment",
    classes: { en: "Classes 9–10 (SSC)", bn: "৯ম–১০ম শ্রেণি (এসএসসি)" },
    level: "secondary",
    subjectArea: { en: "Geography & environment", bn: "ভূগোল ও পরিবেশ" },
    covers: {
      en: "Bangladesh's land, rivers and delta, climate and monsoon, natural disasters and how people adapt — the geographic backbone of everyday life.",
      bn: "বাংলাদেশের ভূমি, নদী ও ব-দ্বীপ, জলবায়ু ও বর্ষা, প্রাকৃতিক দুর্যোগ আর মানুষের অভিযোজন — দৈনন্দিন জীবনের ভৌগোলিক ভিত্তি।",
    },
    whyItMatters: {
      en: "Grounds the rivers and climate/disaster topics for older students; pairs naturally with Bangladesh and Global Studies.",
      bn: "বড়দের জন্য নদী ও জলবায়ু-দুর্যোগ বিষয়ের ভিত্তি; বাংলাদেশ ও বিশ্বপরিচয়ের স্বাভাবিক সঙ্গী।",
    },
    hasEnglishVersion: true,
    status: "confirm",
  },
  {
    id: "mother-tongue-books",
    titleBn: "মাতৃভাষার বই (চাকমা · মারমা · ত্রিপুরা · গারো · সাদরি)",
    titleEn: "Mother-tongue books (Chakma, Marma, Tripura, Garo, Sadri)",
    classes: { en: "Pre-primary–primary", bn: "প্রাক-প্রাথমিক–প্রাথমিক" },
    level: "primary",
    subjectArea: { en: "Ethnic-community languages", bn: "নৃগোষ্ঠীর ভাষা" },
    covers: {
      en: "NCTB publishes early-grade books in five ethnic-community languages so children can start school in their own mother tongue.",
      bn: "এনসিটিবি পাঁচটি নৃগোষ্ঠীর ভাষায় শুরুর শ্রেণির বই ছাপে, যেন শিশুরা নিজের মাতৃভাষায় স্কুল শুরু করতে পারে।",
    },
    whyItMatters: {
      en: "Living proof of the Ekushey promise — the country of Mother Language Day prints schoolbooks in its smaller languages too. A wonderful show-and-tell for the hill-and-plains communities topic.",
      bn: "একুশের প্রতিশ্রুতির জীবন্ত প্রমাণ — মাতৃভাষা দিবসের দেশ ছোট ভাষাগুলোর জন্যও পাঠ্যবই ছাপে। পাহাড় ও সমতলের জনগোষ্ঠী বিষয়ের চমৎকার উদাহরণ।",
    },
    hasEnglishVersion: false,
    status: "confirm",
  },
  {
    id: "hsc-sahityapath",
    titleBn: "সাহিত্যপাঠ · বাংলা সহপাঠ",
    titleEn: "Sahityapath & Bangla Shohopath (HSC literature)",
    classes: { en: "Classes 11–12 (HSC)", bn: "একাদশ–দ্বাদশ শ্রেণি (এইচএসসি)" },
    level: "higher-secondary",
    subjectArea: { en: "Bangla literature", bn: "বাংলা সাহিত্য" },
    covers: {
      en: "The senior literature pair: Sahityapath collects the prescribed poems and prose; Shohopath carries the novel and drama read alongside them.",
      bn: "বড়দের সাহিত্যের জুটি: সাহিত্যপাঠে নির্ধারিত কবিতা ও গদ্য; সহপাঠে সঙ্গে পড়ার উপন্যাস ও নাটক।",
    },
    whyItMatters: {
      en: "Completes the prep-to-year-12 span the client asked for — year 11–12 students get the same trusted-source pathway as the younger ones.",
      bn: "ক্লায়েন্টের চাওয়া প্রেপ-থেকে-দ্বাদশ পরিসর পূর্ণ করে — একাদশ-দ্বাদশের শিক্ষার্থীরাও ছোটদের মতোই নির্ভরযোগ্য উৎস পায়।",
    },
    hasEnglishVersion: false,
    status: "listed",
  },
];

export function bookById(id: string): LibraryBook | undefined {
  return libraryBooks.find((book) => book.id === id);
}
