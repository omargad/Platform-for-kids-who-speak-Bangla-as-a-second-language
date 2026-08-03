/**
 * Bilingual "Explore Bangladesh" content: history, geography and culture for
 * children learning about their heritage country from abroad.
 *
 * Facts are kept to well-established, age-appropriate material. Cultural and
 * heritage items align with the UNESCO references already used across the
 * platform (see docs/PROJECT_PACK.md). Content is curated for a learning
 * audience and should still pass the community and educator review tracked in
 * the Content Studio before public launch.
 */

export type Bilingual = { en: string; bn: string };

export type QuickFact = {
  icon: string;
  label: Bilingual;
  value: Bilingual;
};

export type TimelineEvent = {
  year: string;
  title: Bilingual;
  body: Bilingual;
  tone: "ancient" | "language" | "freedom" | "today";
};

export type Region = {
  name: Bilingual;
  known: Bilingual;
};

export type CultureCard = {
  icon: string;
  title: Bilingual;
  body: Bilingual;
  heritage?: Bilingual;
};

export const quickFacts: QuickFact[] = [
  { icon: "🏙️", label: { en: "Capital", bn: "রাজধানী" }, value: { en: "Dhaka", bn: "ঢাকা" } },
  { icon: "🗣️", label: { en: "Language", bn: "ভাষা" }, value: { en: "Bangla (Bengali)", bn: "বাংলা" } },
  { icon: "💰", label: { en: "Currency", bn: "মুদ্রা" }, value: { en: "Taka (৳)", bn: "টাকা (৳)" } },
  { icon: "🐯", label: { en: "National animal", bn: "জাতীয় পশু" }, value: { en: "Royal Bengal Tiger", bn: "রয়েল বেঙ্গল টাইগার" } },
  { icon: "🐦", label: { en: "National bird", bn: "জাতীয় পাখি" }, value: { en: "Magpie robin (doyel)", bn: "দোয়েল" } },
  { icon: "🌸", label: { en: "National flower", bn: "জাতীয় ফুল" }, value: { en: "Water lily (shapla)", bn: "শাপলা" } },
  { icon: "🐟", label: { en: "National fish", bn: "জাতীয় মাছ" }, value: { en: "Hilsa (ilish)", bn: "ইলিশ" } },
  { icon: "🥭", label: { en: "National fruit", bn: "জাতীয় ফল" }, value: { en: "Jackfruit (kathal)", bn: "কাঁঠাল" } },
];

export const timeline: TimelineEvent[] = [
  {
    year: "c. 300 BCE",
    tone: "ancient",
    title: { en: "Ancient cities", bn: "প্রাচীন নগর" },
    body: {
      en: "One of the oldest known cities in the region grew at Mahasthangarh, in today's Bogura. People here farmed, traded and built along great rivers thousands of years ago.",
      bn: "আজকের বগুড়ার মহাস্থানগড়ে অঞ্চলের অন্যতম প্রাচীন নগর গড়ে ওঠে। হাজার হাজার বছর আগে এখানকার মানুষ নদীর ধারে চাষ, ব্যবসা ও নির্মাণ করত।",
    },
  },
  {
    year: "8th century",
    tone: "ancient",
    title: { en: "Great learning centre", bn: "বড় শিক্ষাকেন্দ্র" },
    body: {
      en: "The huge Buddhist monastery at Paharpur (Somapura Mahavihara) became a famous place of study. It is now a UNESCO World Heritage site.",
      bn: "পাহাড়পুরের বিশাল বৌদ্ধ বিহার (সোমপুর মহাবিহার) বিখ্যাত শিক্ষাকেন্দ্র হয়ে ওঠে। এটি এখন ইউনেস্কো বিশ্ব ঐতিহ্যস্থল।",
    },
  },
  {
    year: "1952",
    tone: "language",
    title: { en: "The Language Movement", bn: "ভাষা আন্দোলন" },
    body: {
      en: "On 21 February, students and people stood up for the right to speak and learn in Bangla. This brave day is remembered every year as Ekushey February.",
      bn: "২১ ফেব্রুয়ারি ছাত্র-জনতা বাংলায় কথা বলা ও শেখার অধিকারের জন্য দাঁড়িয়েছিল। এই সাহসী দিনটি প্রতি বছর একুশে ফেব্রুয়ারি হিসেবে স্মরণ করা হয়।",
    },
  },
  {
    year: "1971",
    tone: "freedom",
    title: { en: "Independence", bn: "স্বাধীনতা" },
    body: {
      en: "After a long struggle, Bangladesh became an independent country. Independence Day is 26 March and Victory Day is 16 December.",
      bn: "দীর্ঘ সংগ্রামের পর বাংলাদেশ স্বাধীন দেশ হয়। ২৬ মার্চ স্বাধীনতা দিবস এবং ১৬ ডিসেম্বর বিজয় দিবস।",
    },
  },
  {
    year: "1999",
    tone: "today",
    title: { en: "A day for every language", bn: "সব ভাষার দিন" },
    body: {
      en: "UNESCO named 21 February International Mother Language Day, so the world now honours every mother tongue — a gift from Bangladesh to all children.",
      bn: "ইউনেস্কো ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে; তাই সারা বিশ্ব এখন প্রতিটি মাতৃভাষাকে সম্মান জানায় — বাংলাদেশের পক্ষ থেকে সব শিশুর জন্য উপহার।",
    },
  },
];

export const regions: Region[] = [
  { name: { en: "Dhaka", bn: "ঢাকা" }, known: { en: "The capital and busiest city, full of rickshaws.", bn: "রাজধানী ও ব্যস্ততম শহর, রিকশায় ভরা।" } },
  { name: { en: "Chattogram", bn: "চট্টগ্রাম" }, known: { en: "A big seaport by the Bay of Bengal, near green hills.", bn: "বঙ্গোপসাগরের ধারে বড় সমুদ্রবন্দর, সবুজ পাহাড়ের কাছে।" } },
  { name: { en: "Khulna", bn: "খুলনা" }, known: { en: "Gateway to the Sundarbans mangrove forest and its tigers.", bn: "সুন্দরবন ও এর বাঘের প্রবেশদ্বার।" } },
  { name: { en: "Sylhet", bn: "সিলেট" }, known: { en: "Rolling tea gardens and clear river water.", bn: "ঢেউখেলানো চা-বাগান আর স্বচ্ছ নদীর জল।" } },
  { name: { en: "Rajshahi", bn: "রাজশাহী" }, known: { en: "Famous for sweet mangoes and silk.", bn: "মিষ্টি আম আর রেশমের জন্য বিখ্যাত।" } },
  { name: { en: "Barishal", bn: "বরিশাল" }, known: { en: "Rivers, boats and floating guava markets.", bn: "নদী, নৌকা আর ভাসমান পেয়ারার বাজার।" } },
  { name: { en: "Rangpur", bn: "রংপুর" }, known: { en: "Wide farming land in the north.", bn: "উত্তরের বিস্তীর্ণ কৃষিজমি।" } },
  { name: { en: "Mymensingh", bn: "ময়মনসিংহ" }, known: { en: "Green fields along the old Brahmaputra river.", bn: "পুরনো ব্রহ্মপুত্র নদীর ধারে সবুজ মাঠ।" } },
];

export const landmarks: CultureCard[] = [
  {
    icon: "🌊",
    title: { en: "The Sundarbans", bn: "সুন্দরবন" },
    body: {
      en: "The world's largest mangrove forest, where rivers meet the sea and the Royal Bengal Tiger lives.",
      bn: "পৃথিবীর সবচেয়ে বড় ম্যানগ্রোভ বন, যেখানে নদী সাগরে মেশে আর রয়েল বেঙ্গল টাইগার থাকে।",
    },
    heritage: { en: "UNESCO World Heritage", bn: "ইউনেস্কো বিশ্ব ঐতিহ্য" },
  },
  {
    icon: "🕌",
    title: { en: "Mosque City of Bagerhat", bn: "বাগেরহাটের মসজিদ শহর" },
    body: {
      en: "A very old city with beautiful brick mosques, including the Sixty Dome Mosque.",
      bn: "সুন্দর ইটের মসজিদে ভরা প্রাচীন শহর, যেখানে আছে ষাট গম্বুজ মসজিদ।",
    },
    heritage: { en: "UNESCO World Heritage", bn: "ইউনেস্কো বিশ্ব ঐতিহ্য" },
  },
  {
    icon: "🏛️",
    title: { en: "Paharpur Vihara", bn: "পাহাড়পুর বিহার" },
    body: {
      en: "The ruins of a giant Buddhist monastery where students came to learn long ago.",
      bn: "বিশাল বৌদ্ধ বিহারের ধ্বংসাবশেষ, যেখানে বহুকাল আগে ছাত্ররা শিখতে আসত।",
    },
    heritage: { en: "UNESCO World Heritage", bn: "ইউনেস্কো বিশ্ব ঐতিহ্য" },
  },
  {
    icon: "🏖️",
    title: { en: "Cox's Bazar", bn: "কক্সবাজার" },
    body: {
      en: "One of the longest natural sea beaches in the world, stretching along the coast.",
      bn: "পৃথিবীর অন্যতম দীর্ঘ প্রাকৃতিক সমুদ্রসৈকত, উপকূল ধরে বিস্তৃত।",
    },
  },
];

export const festivals: CultureCard[] = [
  {
    icon: "🎉",
    title: { en: "Pohela Boishakh", bn: "পহেলা বৈশাখ" },
    body: {
      en: "Bengali New Year in April. People wear red and white, eat panta-ilish and join colourful processions.",
      bn: "এপ্রিলে বাংলা নববর্ষ। মানুষ লাল-সাদা পরে, পান্তা-ইলিশ খায় আর রঙিন শোভাযাত্রায় যোগ দেয়।",
    },
    heritage: { en: "Mangal Shobhajatra is UNESCO-listed", bn: "মঙ্গল শোভাযাত্রা ইউনেস্কো-তালিকাভুক্ত" },
  },
  {
    icon: "🕯️",
    title: { en: "Ekushey February", bn: "একুশে ফেব্রুয়ারি" },
    body: {
      en: "Language Martyrs' Day and International Mother Language Day. People bring flowers to remember those who stood up for Bangla.",
      bn: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস। মানুষ ফুল দিয়ে বাংলার জন্য দাঁড়ানো মানুষদের স্মরণ করে।",
    },
  },
  {
    icon: "🌙",
    title: { en: "Eid", bn: "ঈদ" },
    body: {
      en: "Families dress up, share special meals and sweets, and visit relatives and neighbours.",
      bn: "পরিবার সেজেগুজে বিশেষ খাবার ও মিষ্টি ভাগ করে, আত্মীয় ও প্রতিবেশীদের সঙ্গে দেখা করে।",
    },
  },
  {
    icon: "🌾",
    title: { en: "Nabanna", bn: "নবান্ন" },
    body: {
      en: "A harvest festival that celebrates the new rice with pitha (rice cakes) and songs.",
      bn: "নতুন ধানের ফসল উৎসব, যেখানে পিঠা আর গান দিয়ে আনন্দ করা হয়।",
    },
  },
];

export const cultureCards: CultureCard[] = [
  {
    icon: "🎵",
    title: { en: "Songs and poets", bn: "গান ও কবি" },
    body: {
      en: "Rabindranath Tagore wrote the national anthem, Amar Sonar Bangla. Kazi Nazrul Islam is the national poet.",
      bn: "রবীন্দ্রনাথ ঠাকুর জাতীয় সংগীত ‘আমার সোনার বাংলা’ লিখেছেন। কাজী নজরুল ইসলাম জাতীয় কবি।",
    },
  },
  {
    icon: "🎶",
    title: { en: "Baul songs", bn: "বাউল গান" },
    body: {
      en: "Wandering singers called Bauls sing gentle songs about life and kindness.",
      bn: "বাউল নামের ঘুরে বেড়ানো গায়করা জীবন ও ভালোবাসা নিয়ে মধুর গান গায়।",
    },
    heritage: { en: "UNESCO cultural heritage", bn: "ইউনেস্কো সাংস্কৃতিক ঐতিহ্য" },
  },
  {
    icon: "🧵",
    title: { en: "Jamdani weaving", bn: "জামদানি বুনন" },
    body: {
      en: "Weavers make Jamdani cloth by hand with beautiful patterns, a skill passed down for generations.",
      bn: "তাঁতিরা হাতে সুন্দর নকশায় জামদানি কাপড় বোনে, যা প্রজন্মের পর প্রজন্ম চলে আসছে।",
    },
    heritage: { en: "UNESCO cultural heritage", bn: "ইউনেস্কো সাংস্কৃতিক ঐতিহ্য" },
  },
  {
    icon: "🍚",
    title: { en: "Food to share", bn: "ভাগ করে খাওয়া" },
    body: {
      en: "Rice and fish (maach-bhaat) is everyday food. Treats include pitha, biryani and sweet mishti like roshogolla.",
      bn: "মাছ-ভাত রোজকার খাবার। মজার খাবারের মধ্যে আছে পিঠা, বিরিয়ানি আর রসগোল্লার মতো মিষ্টি।",
    },
  },
];
