import type { Bilingual } from "./explore-content";

/**
 * Curated external Bangla learning providers and resource collections,
 * supplied by the project team for families who want structured courses
 * beyond this platform. These are independent external sites: listing is not
 * endorsement, offerings and prices change, and a grown-up should review a
 * provider before involving a child. Check links with `npm run verify:links`.
 */

export type ResourceCategory = "university" | "community" | "self-study" | "free";

export type ExternalResource = {
  name: string;
  url: string;
  category: ResourceCategory;
  location: Bilingual;
  description: Bilingual;
};

export const resourceCategories: Array<{ id: ResourceCategory; title: Bilingual; note: Bilingual }> = [
  {
    id: "university",
    title: { en: "Universities & institutes", bn: "বিশ্ববিদ্যালয় ও ইনস্টিটিউট" },
    note: {
      en: "Structured courses with teachers, from Bangladesh and abroad.",
      bn: "বাংলাদেশ ও বিদেশের শিক্ষকসহ কাঠামোবদ্ধ কোর্স।",
    },
  },
  {
    id: "community",
    title: { en: "Community & heritage schools", bn: "কমিউনিটি ও ঐতিহ্য স্কুল" },
    note: {
      en: "Providers focused on diaspora families and heritage learners.",
      bn: "প্রবাসী পরিবার ও ঐতিহ্য-শিক্ষার্থীদের জন্য নিবেদিত।",
    },
  },
  {
    id: "self-study",
    title: { en: "Self-study courses & apps", bn: "স্ব-শিক্ষা কোর্স ও অ্যাপ" },
    note: {
      en: "Learn at your own pace; usually paid, adult-led.",
      bn: "নিজের গতিতে শেখা; সাধারণত সশুল্ক, বড়দের পরিচালনায়।",
    },
  },
  {
    id: "free",
    title: { en: "Free resource collections", bn: "বিনামূল্যের সম্পদ সংগ্রহ" },
    note: {
      en: "Curated lists and open materials to explore further.",
      bn: "আরও জানার জন্য বাছাই করা তালিকা ও উন্মুক্ত উপকরণ।",
    },
  },
];

export const externalResources: ExternalResource[] = [
  {
    name: "BRAC Institute of Languages — Easy Bangla",
    url: "https://www.bracu.ac.bd/academics/institutes/brac-institute-languages/short-courses/easy-bangla-online-bangla-course-foreign",
    category: "university",
    location: { en: "BRAC University, Dhaka · online", bn: "ব্র্যাক বিশ্ববিদ্যালয়, ঢাকা · অনলাইন" },
    description: {
      en: "A seven-week, ten-lesson beginner course for foreign learners from BRAC Institute of Languages: everyday conversation skills, self-paced with up to three months' access and a certificate on completion.",
      bn: "ব্র্যাক ইনস্টিটিউট অব ল্যাঙ্গুয়েজেসের সাত সপ্তাহের দশ-পাঠের প্রাথমিক কোর্স: দৈনন্দিন কথোপকথনের দক্ষতা, নিজের গতিতে (তিন মাস পর্যন্ত প্রবেশাধিকার) এবং শেষে সনদ।",
    },
  },
  {
    name: "SOAS University of London — Bengali courses",
    url: "https://www.soas.ac.uk/bengali-language-courses",
    category: "university",
    location: { en: "London, UK", bn: "লন্ডন, যুক্তরাজ্য" },
    description: {
      en: "Language Centre short courses (Beginners and Elementary 1–3, adults 18+): about 20 hours of blended learning per term — 15 hours of live online lessons plus guided independent study — covering all four skills.",
      bn: "ল্যাঙ্গুয়েজ সেন্টারের সংক্ষিপ্ত কোর্স (বিগিনার্স ও এলিমেন্টারি ১–৩, ১৮+): প্রতি টার্মে প্রায় ২০ ঘণ্টা — ১৫ ঘণ্টা শিক্ষকসহ অনলাইন ক্লাস ও নির্দেশিত স্ব-অধ্যয়ন — চার দক্ষতা জুড়ে।",
    },
  },
  {
    name: "Scottish Church College — online courses",
    url: "https://onlinecourses.scottishchurch.ac.in/",
    category: "university",
    location: { en: "Kolkata, India · online", bn: "কলকাতা, ভারত · অনলাইন" },
    description: {
      en: "Free online courses (videos, assignments, certificates) from the historic Scottish Church College, founded 1830. Browse the current catalogue for Bangla-related offerings.",
      bn: "১৮৩০ সালে প্রতিষ্ঠিত ঐতিহাসিক স্কটিশ চার্চ কলেজের বিনামূল্যের অনলাইন কোর্স (ভিডিও, অ্যাসাইনমেন্ট, সনদ)। বাংলা-সংক্রান্ত কোর্সের জন্য বর্তমান তালিকা দেখুন।",
    },
  },
  {
    name: "Bangla Institute",
    url: "https://banglainstitute.com/courses/",
    category: "community",
    location: { en: "Online", bn: "অনলাইন" },
    description: {
      en: "One-on-one online classes designed for the diaspora: children's reading & writing, adult speaking & listening, a Sylheti course, and a Bangladesh Studies programme for reconnecting with heritage.",
      bn: "প্রবাসীদের জন্য একের-সঙ্গে-এক অনলাইন ক্লাস: শিশুদের পড়া-লেখা, বড়দের বলা-শোনা, সিলেটি কোর্স এবং শিকড়ের সঙ্গে যুক্ত হতে ‘বাংলাদেশ স্টাডিজ’।",
    },
  },
  {
    name: "Grace Bangla Language Center",
    url: "https://www.gracebangla.com/courses/",
    category: "university",
    location: { en: "Bangladesh · in person", bn: "বাংলাদেশ · সশরীরে" },
    description: {
      en: "A classroom language centre in Bangladesh teaching Bangla to foreigners and expatriates — small groups, intensive daily classes from alphabet to conversation. Relevant for families visiting or relocating.",
      bn: "বাংলাদেশে বিদেশি ও প্রবাসীদের বাংলা শেখানোর শ্রেণিকক্ষভিত্তিক কেন্দ্র — ছোট দল, বর্ণ থেকে কথোপকথন পর্যন্ত নিবিড় দৈনিক ক্লাস। বেড়াতে বা ফিরে যাওয়া পরিবারের জন্য প্রাসঙ্গিক।",
    },
  },
  {
    name: "Dar Al Arqam — Bangla Level 1",
    url: "https://online.daralarqam.co.uk/courses/bangla-language-level-1",
    category: "community",
    location: { en: "UK · online", bn: "যুক্তরাজ্য · অনলাইন" },
    description: {
      en: "A first-steps Bangla course from a London-based online institute, concentrating on the Bengali alphabet — a gentle structured entry point.",
      bn: "লন্ডনভিত্তিক অনলাইন ইনস্টিটিউটের প্রথম-ধাপের বাংলা কোর্স, বর্ণমালার ওপর কেন্দ্রীভূত — কাঠামোবদ্ধ সহজ সূচনা।",
    },
  },
  {
    name: "Sololingual — Bengali",
    url: "https://www.sololingual.com/bengali",
    category: "self-study",
    location: { en: "Online, self-paced", bn: "অনলাইন, নিজের গতিতে" },
    description: {
      en: "A self-paced platform with short, gamified units for pronunciation, grammar and vocabulary — games, achievements and a leaderboard keep practice light.",
      bn: "উচ্চারণ, ব্যাকরণ ও শব্দভান্ডারের জন্য ছোট, খেলাধর্মী ইউনিটের স্ব-গতির প্ল্যাটফর্ম — খেলা, অর্জন ও লিডারবোর্ডে অনুশীলন হালকা থাকে।",
    },
  },
  {
    name: "Language Corner (EU) — Learn Bengali",
    url: "https://languagecorner.eu/en/learn-bengali-fast-and-fun/",
    category: "self-study",
    location: { en: "Online, self-paced", bn: "অনলাইন, নিজের গতিতে" },
    description: {
      en: "A storefront for the '17 minutes a day' self-study method: a basic course of ~1,300 words (toward A2) and a larger package toward advanced levels. Same method family as 17 Minute Languages below.",
      bn: "‘দিনে ১৭ মিনিট’ স্ব-শিক্ষা পদ্ধতির বিক্রয়কেন্দ্র: প্রায় ১,৩০০ শব্দের বেসিক কোর্স (A2 অভিমুখে) ও উচ্চতর স্তরের বড় প্যাকেজ। নিচের 17 Minute Languages-এর একই পদ্ধতি-পরিবার।",
    },
  },
  {
    name: "17 Minute Languages — Bengali",
    url: "https://www.17-minute-languages.com/en/learn-bengali/",
    category: "self-study",
    location: { en: "Online, self-paced", bn: "অনলাইন, নিজের গতিতে" },
    description: {
      en: "No-subscription self-study software using spaced repetition ('long-term memory method'): a beginner course of ~1,300 words toward A2, and a complete package of ~5,000 words toward advanced levels, driven by a daily trainer.",
      bn: "সাবস্ক্রিপশনবিহীন স্ব-শিক্ষা সফটওয়্যার, ব্যবধানে পুনরাবৃত্তি পদ্ধতিতে: A2 অভিমুখে প্রায় ১,৩০০ শব্দের প্রাথমিক কোর্স এবং উচ্চতর স্তরের জন্য প্রায় ৫,০০০ শব্দের পূর্ণ প্যাকেজ, দৈনিক ট্রেনারসহ।",
    },
  },
  {
    name: "University of Iowa — Bengali language & culture resources",
    url: "https://clcl.uiowa.edu/language-resources/bengali-language-and-culture-resources",
    category: "free",
    location: { en: "Free directory", bn: "বিনামূল্যের তালিকা" },
    description: {
      en: "A university-curated directory of free Bengali materials: dictionaries, grammar guides, vocabulary trainers, reading and writing tools, and listening resources.",
      bn: "বিশ্ববিদ্যালয়ের বাছাই করা বিনামূল্যের বাংলা উপকরণের তালিকা: অভিধান, ব্যাকরণ, শব্দভান্ডার, পড়া-লেখার সরঞ্জাম ও শোনার সম্পদ।",
    },
  },
  {
    name: "Omniglot — Bengali alphabet & pronunciation",
    url: "https://www.omniglot.com/writing/bengali.htm",
    category: "free",
    location: { en: "Free reference", bn: "বিনামূল্যের রেফারেন্স" },
    description: {
      en: "A clear reference page on the Bengali script: every letter, how vowels attach to consonants, and the script's history. Pairs well with our Bornomala page.",
      bn: "বাংলা লিপির স্পষ্ট রেফারেন্স: প্রতিটি বর্ণ, কার-চিহ্নের নিয়ম ও লিপির ইতিহাস। আমাদের বর্ণমালা পাতার সঙ্গে ভালো মানায়।",
    },
  },
  {
    name: "Forvo — Bengali pronunciation dictionary",
    url: "https://forvo.com/languages/bn/",
    category: "free",
    location: { en: "Free, community-recorded", bn: "বিনামূল্যে, কমিউনিটির রেকর্ড" },
    description: {
      en: "Hear thousands of Bengali words pronounced by native speakers — useful when a family wants a human model for a specific word.",
      bn: "হাজারো বাংলা শব্দ স্থানীয় ভাষাভাষীদের কণ্ঠে শুনুন — নির্দিষ্ট শব্দের মানব উচ্চারণ দরকার হলে কাজে লাগে।",
    },
  },
  {
    name: "Lexilogos — Bengali dictionaries",
    url: "https://www.lexilogos.com/english/bengali_dictionary.htm",
    category: "free",
    location: { en: "Free dictionary hub", bn: "বিনামূল্যের অভিধান কেন্দ্র" },
    description: {
      en: "A gateway to Bengali–English dictionaries, a pronunciation dictionary and an online Bangla keyboard.",
      bn: "বাংলা–ইংরেজি অভিধান, উচ্চারণ অভিধান ও অনলাইন বাংলা কিবোর্ডের প্রবেশদ্বার।",
    },
  },
  {
    name: "Ekushey — free Bangla fonts",
    url: "https://ekushey.org/",
    category: "free",
    location: { en: "Free Unicode fonts", bn: "বিনামূল্যের ইউনিকোড ফন্ট" },
    description: {
      en: "Free, open Bangla Unicode fonts from the Ekushey localisation project — handy for printing worksheets with beautiful Bangla type.",
      bn: "একুশে প্রকল্পের বিনামূল্যের উন্মুক্ত বাংলা ইউনিকোড ফন্ট — সুন্দর বাংলা হরফে ওয়ার্কশিট প্রিন্টে কাজে লাগে।",
    },
  },
];
