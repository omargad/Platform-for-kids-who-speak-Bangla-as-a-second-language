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
      en: "An online Bangla short course from a leading Bangladeshi university, designed for non-native speakers.",
      bn: "বাংলাদেশের শীর্ষস্থানীয় বিশ্ববিদ্যালয়ের অনলাইন সংক্ষিপ্ত বাংলা কোর্স, অ-বাংলাভাষীদের জন্য তৈরি।",
    },
  },
  {
    name: "SOAS University of London — Bengali courses",
    url: "https://www.soas.ac.uk/bengali-language-courses",
    category: "university",
    location: { en: "London, UK", bn: "লন্ডন, যুক্তরাজ্য" },
    description: {
      en: "Bengali language courses from SOAS, a university known for South Asian language teaching.",
      bn: "দক্ষিণ এশীয় ভাষা শিক্ষার জন্য পরিচিত SOAS বিশ্ববিদ্যালয়ের বাংলা কোর্স।",
    },
  },
  {
    name: "Scottish Church College — online courses",
    url: "https://onlinecourses.scottishchurch.ac.in/",
    category: "university",
    location: { en: "Kolkata, India · online", bn: "কলকাতা, ভারত · অনলাইন" },
    description: {
      en: "The online course portal of a historic Kolkata college; check current offerings for Bangla-related courses.",
      bn: "কলকাতার ঐতিহাসিক কলেজের অনলাইন কোর্স পোর্টাল; বাংলা-সংক্রান্ত কোর্সের বর্তমান তালিকা দেখুন।",
    },
  },
  {
    name: "Bangla Institute",
    url: "https://banglainstitute.com/courses/",
    category: "community",
    location: { en: "Online", bn: "অনলাইন" },
    description: {
      en: "Online Bangla courses with live teachers, including options aimed at heritage learners.",
      bn: "সরাসরি শিক্ষকসহ অনলাইন বাংলা কোর্স, ঐতিহ্য-শিক্ষার্থীদের জন্য বিকল্পসহ।",
    },
  },
  {
    name: "Grace Bangla",
    url: "https://www.gracebangla.com/courses/",
    category: "community",
    location: { en: "Online", bn: "অনলাইন" },
    description: {
      en: "Bangla courses built for diaspora families; review their current offerings for children's options.",
      bn: "প্রবাসী পরিবারের জন্য তৈরি বাংলা কোর্স; শিশুদের বিকল্পের জন্য বর্তমান তালিকা দেখুন।",
    },
  },
  {
    name: "Dar Al Arqam — Bangla Level 1",
    url: "https://online.daralarqam.co.uk/courses/bangla-language-level-1",
    category: "community",
    location: { en: "UK · online", bn: "যুক্তরাজ্য · অনলাইন" },
    description: {
      en: "A structured beginner Bangla course from a UK-based online institute.",
      bn: "যুক্তরাজ্যভিত্তিক অনলাইন ইনস্টিটিউটের কাঠামোবদ্ধ প্রাথমিক বাংলা কোর্স।",
    },
  },
  {
    name: "Sololingual — Bengali",
    url: "https://www.sololingual.com/bengali",
    category: "self-study",
    location: { en: "Online, self-paced", bn: "অনলাইন, নিজের গতিতে" },
    description: {
      en: "A self-paced Bengali learning site for independent study.",
      bn: "স্বাধীনভাবে শেখার জন্য নিজের গতির বাংলা শেখার সাইট।",
    },
  },
  {
    name: "Language Corner — Learn Bengali",
    url: "https://languagecorner.eu/en/learn-bengali-fast-and-fun/",
    category: "self-study",
    location: { en: "Amsterdam, NL · online options", bn: "আমস্টারডাম, নেদারল্যান্ডস · অনলাইন বিকল্প" },
    description: {
      en: "A European language school offering Bengali classes with a light, practical approach.",
      bn: "সহজ, ব্যবহারিক পদ্ধতিতে বাংলা ক্লাস দেওয়া একটি ইউরোপীয় ভাষা স্কুল।",
    },
  },
  {
    name: "17 Minute Languages — Bengali",
    url: "https://www.17-minute-languages.com/en/learn-bengali/",
    category: "self-study",
    location: { en: "Online, self-paced", bn: "অনলাইন, নিজের গতিতে" },
    description: {
      en: "A commercial self-study Bengali course based on short daily practice sessions.",
      bn: "প্রতিদিন অল্প সময়ের অনুশীলনভিত্তিক বাণিজ্যিক স্ব-শিক্ষা বাংলা কোর্স।",
    },
  },
  {
    name: "University of Iowa — Bengali language & culture resources",
    url: "https://clcl.uiowa.edu/language-resources/bengali-language-and-culture-resources",
    category: "free",
    location: { en: "Free directory", bn: "বিনামূল্যের তালিকা" },
    description: {
      en: "A university-curated collection of free Bengali language and culture links to explore.",
      bn: "বিশ্ববিদ্যালয়ের বাছাই করা বিনামূল্যের বাংলা ভাষা ও সংস্কৃতি লিংকের সংগ্রহ।",
    },
  },
];
