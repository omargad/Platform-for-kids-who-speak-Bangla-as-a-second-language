export type NctbLanguage = "bn" | "en";

export type NctbPdfAccessibility = "image-heavy" | "mixed-text";

export type NctbBookVariant = {
  id: string;
  label: string;
  language: NctbLanguage;
  url: string;
  pages: number;
  format: "pdf";
  accessibility: NctbPdfAccessibility;
};

export type NctbCoreBook = {
  id: string;
  grade: 1 | 2 | 3 | 4 | 5;
  subject: "bangla" | "bangladesh-and-global-studies";
  titleBn: string;
  titleEn: string;
  officialPage: string;
  contentsCount: number;
  variants: NctbBookVariant[];
  curriculumUse: string;
  reviewStatus: "source-audited-adaptation-pending";
};

const auditedPdf = (
  id: string,
  label: string,
  language: NctbLanguage,
  url: string,
  pages: number,
): NctbBookVariant => ({
  id,
  label,
  language,
  url,
  pages,
  format: "pdf",
  accessibility: "image-heavy",
});

/**
 * Official 2026 NCTB source books selected for the current 6–12 pathway.
 * A verified source link is not a curriculum approval. The PDFs are evidence
 * for human-reviewed adaptations and are not embedded as the lesson interface.
 */
export const nctbCoreBooks: NctbCoreBook[] = [
  {
    id: "amar-bangla-class-1",
    grade: 1,
    subject: "bangla",
    titleBn: "আমার বাংলা বই",
    titleEn: "My Bangla Book",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9adec4774958d7b708cd",
    contentsCount: 54,
    variants: [
      auditedPdf(
        "amar-bangla-class-1-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/j2OipTMp0QihpIR/download",
        90,
      ),
    ],
    curriculumUse: "Early sound–symbol recognition, familiar words, oral language and supported first reading.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "amar-bangla-class-2",
    grade: 2,
    subject: "bangla",
    titleBn: "আমার বাংলা বই",
    titleEn: "My Bangla Book",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9935c4774958d7b70508",
    contentsCount: 29,
    variants: [
      auditedPdf(
        "amar-bangla-class-2-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/hQkbdKeleEWmqQ5/download",
        74,
      ),
    ],
    curriculumUse: "Supported sentence reading, vocabulary in context and short oral-to-written responses.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "amar-bangla-class-3",
    grade: 3,
    subject: "bangla",
    titleBn: "আমার বাংলা বই",
    titleEn: "My Bangla Book",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9980c4774958d7b70591",
    contentsCount: 30,
    variants: [
      auditedPdf(
        "amar-bangla-class-3-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/09v2RIHbjCIHV8g/download",
        110,
      ),
    ],
    curriculumUse: "Narrative sequencing, fluent supported reading and discussion of familiar social contexts.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "bangladesh-global-studies-class-3",
    grade: 3,
    subject: "bangladesh-and-global-studies",
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9980c4774958d7b70591",
    contentsCount: 13,
    variants: [
      auditedPdf(
        "bangladesh-global-studies-class-3-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/mjAT4z4uvNEVIlV/download",
        118,
      ),
      auditedPdf(
        "bangladesh-global-studies-class-3-en",
        "English version",
        "en",
        "https://drive.egovcloud.gov.bd/index.php/s/nNQPqJmobrS2HXX/download",
        118,
      ),
    ],
    curriculumUse: "Bilingual evidence for place, community, citizenship, environment and introductory history themes.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "amar-bangla-class-4",
    grade: 4,
    subject: "bangla",
    titleBn: "আমার বাংলা বই",
    titleEn: "My Bangla Book",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b99ccc4774958d7b70680",
    contentsCount: 23,
    variants: [
      auditedPdf(
        "amar-bangla-class-4-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/MBny2ZiG5TBOtdc/download",
        134,
      ),
    ],
    curriculumUse: "Longer reading, expressive language, cultural themes and structured spoken or written response.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "bangladesh-global-studies-class-4",
    grade: 4,
    subject: "bangladesh-and-global-studies",
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b99ccc4774958d7b70680",
    contentsCount: 15,
    variants: [
      auditedPdf(
        "bangladesh-global-studies-class-4-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/I9DhBWDI8i1dKFR/download",
        122,
      ),
      auditedPdf(
        "bangladesh-global-studies-class-4-en",
        "English version",
        "en",
        "https://drive.egovcloud.gov.bd/index.php/s/w58QzVKoKqkDhpw/download",
        122,
      ),
    ],
    curriculumUse: "Bilingual source comparison for history, geography, civic life and environmental responsibility.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "amar-bangla-class-5",
    grade: 5,
    subject: "bangla",
    titleBn: "আমার বাংলা বই",
    titleEn: "My Bangla Book",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9a68c4774958d7b707a5",
    contentsCount: 23,
    variants: [
      auditedPdf(
        "amar-bangla-class-5-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/faKgRD9CEwmZwkf/download",
        142,
      ),
    ],
    curriculumUse: "Source text for literature, writing genres, Bangladesh themes and the reviewed B1–B2 bridge.",
    reviewStatus: "source-audited-adaptation-pending",
  },
  {
    id: "bangladesh-global-studies-class-5",
    grade: 5,
    subject: "bangladesh-and-global-studies",
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies",
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9a68c4774958d7b707a5",
    contentsCount: 17,
    variants: [
      auditedPdf(
        "bangladesh-global-studies-class-5-bn",
        "বাংলা সংস্করণ",
        "bn",
        "https://drive.egovcloud.gov.bd/index.php/s/11OTb3vX4sca3VD/download",
        166,
      ),
      auditedPdf(
        "bangladesh-global-studies-class-5-en",
        "English version",
        "en",
        "https://drive.egovcloud.gov.bd/index.php/s/X3Qrwjr1u8dYEkL/download",
        166,
      ),
    ],
    curriculumUse: "Bilingual evidence for deeper history, society, citizenship, environment and inquiry work.",
    reviewStatus: "source-audited-adaptation-pending",
  },
];

export type NctbEarlyResource = {
  id: string;
  titleBn: string;
  titleEn: string;
  ageBand: "4+" | "5+";
  officialPage: string;
  url: string;
  format: "pdf" | "zip";
  pages: number;
  containedPdfCount?: number;
  containedTitles?: string[];
  useBoundary: string;
};

const prePrimaryPage = "https://nctb.gov.bd/pages/static-pages/695b9a96c4774958d7b70809";

export const nctbPrePrimaryResources: NctbEarlyResource[] = [
  {
    id: "preprimary-my-book",
    titleBn: "আমার বই",
    titleEn: "My Book",
    ageBand: "5+",
    officialPage: prePrimaryPage,
    url: "https://drive.egovcloud.gov.bd/index.php/s/48pqefpS3RjuLPC/download",
    format: "pdf",
    pages: 174,
    useBoundary: "A 13-area play and readiness source; individual activities still need age, language and diaspora-context review.",
  },
  {
    id: "preprimary-writing",
    titleBn: "এসো লিখতে শিখি",
    titleEn: "Let’s Learn to Write",
    ageBand: "5+",
    officialPage: prePrimaryPage,
    url: "https://drive.egovcloud.gov.bd/index.php/s/9DnZoqSFxiQxPs8/download",
    format: "pdf",
    pages: 138,
    useBoundary: "Candidate source for large-motor and first-mark activities; do not treat tracing as a substitute for oral language.",
  },
  {
    id: "preprimary-drawing",
    titleBn: "এসো আঁকিবুঁকি করি",
    titleEn: "Let’s Doodle",
    ageBand: "4+",
    officialPage: prePrimaryPage,
    url: "https://drive.egovcloud.gov.bd/index.php/s/6JO3StbYKXnx2Pd/download",
    format: "pdf",
    pages: 70,
    useBoundary: "Candidate visual-motor and creative-response source, pending child pilot and accessibility review.",
  },
  {
    id: "preprimary-story-archive",
    titleBn: "প্রাক-প্রাথমিক গল্পের সংকলন",
    titleEn: "Pre-primary illustrated story archive",
    ageBand: "4+",
    officialPage: prePrimaryPage,
    url: "https://drive.egovcloud.gov.bd/index.php/s/eggJxPzefoZcrHP/download",
    format: "zip",
    pages: 176,
    containedPdfCount: 10,
    containedTitles: [
      "Amader Bari",
      "Amra Apno Jon",
      "Guchie Rakhi",
      "Lal Pokar Golpo",
      "Shabbash Shabdhani",
      "Chutto Pakhi",
      "Jhorer Pore",
      "Oishir Ful",
      "Putu Gutu",
      "Schooler Prothom Din",
    ],
    useBoundary: "The ten PDFs are almost entirely image-only. Create reviewed HTML transcripts, descriptions and human audio before learner use.",
  },
];

export type NctbEducatorDocument = {
  id: string;
  title: string;
  language: NctbLanguage;
  pages: number | null;
  officialPage: string;
  url: string;
  purpose: string;
};

const revisedCurriculumPage = "https://nctb.gov.bd/pages/static-pages/6922dd0b933eb65569e13492";

export const nctbEducatorDocuments: NctbEducatorDocument[] = [
  {
    id: "preprimary-curriculum-2025-en",
    title: "Pre-primary Curriculum 2022, revised 2025 — English",
    language: "en",
    pages: 94,
    officialPage: revisedCurriculumPage,
    url: "https://drive.google.com/file/d/1wyOSM1P375V-ZRBOqMRGULOobX4-yJqy/view?usp=sharing",
    purpose: "Educator evidence for learning domains, pedagogy and developmentally appropriate planning.",
  },
  {
    id: "preprimary-curriculum-2025-bn",
    title: "প্রাক-প্রাথমিক শিক্ষাক্রম ২০২২, পরিমার্জিত ২০২৫",
    language: "bn",
    pages: 78,
    officialPage: revisedCurriculumPage,
    url: "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/7f253b13aac049a38b268d439b7f0d3f.pdf",
    purpose: "Bangla educator reference for the same early-years curriculum framework.",
  },
  {
    id: "primary-curriculum-2025-en",
    title: "National Curriculum 2021, Primary Level, revised 2025 — English",
    language: "en",
    pages: 1097,
    officialPage: revisedCurriculumPage,
    url: "https://drive.google.com/file/d/1rUVVbLapdoFFl0eb2_pbG0DoljmLtP5R/view?usp=sharing",
    purpose: "Primary authority for competencies, outcomes, teaching approaches and assessment proportions.",
  },
  {
    id: "primary-curriculum-2025-bn",
    title: "জাতীয় শিক্ষাক্রম ২০২১, প্রাথমিক স্তর, পরিমার্জিত ২০২৫",
    language: "bn",
    pages: null,
    officialPage: revisedCurriculumPage,
    url: "https://drive.google.com/file/d/1rq9rJ1u8dcjOLLOxC5iWuqICtvptyV2v/view",
    purpose: "Bangla authority for the primary curriculum; its page count remains unrecorded until a separate edition-level check.",
  },
];

export type NctbTeacherGuideCollection = {
  grade: 1 | 2 | 3 | 4 | 5;
  officialPage: string;
  banglaGuide: string;
  socialStudiesGuide: string;
  status: "educator-only-review-required";
};

export const nctbTeacherGuideCollections: NctbTeacherGuideCollection[] = [
  {
    grade: 1,
    officialPage: "https://nctb.gov.bd/pages/static-pages/69afb7aee79e59e52d1be481",
    banglaGuide: "https://drive.google.com/file/d/1z82Lbbd5WgFBARNv3z2sdwMevU-sb1lh/view?usp=sharing",
    socialStudiesGuide: "https://drive.google.com/file/d/1Lhy-gp84hzFHuq5pLmffxTK_69I-Fp0n/view?usp=drive_link",
    status: "educator-only-review-required",
  },
  {
    grade: 2,
    officialPage: "https://nctb.gov.bd/pages/static-pages/69afb81aa52ffd47032d0757",
    banglaGuide: "https://drive.google.com/file/d/1sZQJiVpOzjfAGnH8A0mWtOILiVXj6B1n/view?usp=drive_link",
    socialStudiesGuide: "https://drive.google.com/file/d/1ke3Edjmb7xWTh6TdAWJ3mMznS105fbTE/view?usp=drive_link",
    status: "educator-only-review-required",
  },
  {
    grade: 3,
    officialPage: "https://nctb.gov.bd/pages/static-pages/69afb842138848bf0fa5e79b",
    banglaGuide: "https://drive.google.com/file/d/1kXEZqsaPJ0GwAME3juy_B4KHHERipxZc/view?usp=drive_link",
    socialStudiesGuide: "https://drive.google.com/file/d/1TOKiZpK_DMbxZeRBvkvMQUQxJr-9qZwE/view?usp=drive_link",
    status: "educator-only-review-required",
  },
  {
    grade: 4,
    officialPage: "https://nctb.gov.bd/pages/static-pages/69afb8a7e79e59e52d1be566",
    banglaGuide: "https://drive.google.com/file/d/10CQ6qPlrjcLtRTuojnrLzn4rfNGDxn2-/view?usp=drive_link",
    socialStudiesGuide: "https://drive.google.com/file/d/1PWGb-sDdyPGNVYTqgafVulNfckgR-4o8/view?usp=drive_link",
    status: "educator-only-review-required",
  },
  {
    grade: 5,
    officialPage: "https://nctb.gov.bd/pages/static-pages/69afb8d3a938e1f3ef6312d0",
    banglaGuide: "https://drive.google.com/file/d/1BLEh5sgRwr3XnYsiS7QNnRdzm-9juRS3/view?usp=drive_link",
    socialStudiesGuide: "https://drive.google.com/file/d/1QeitjaNMjomWIqAvs7B5fn5ospDk0PQK/view?usp=drive_link",
    status: "educator-only-review-required",
  },
];

export type NctbTeenResource = {
  id: string;
  grade: 6 | 8;
  titleBn: string;
  titleEn: string;
  subject: "bangla" | "bangladesh-and-global-studies";
  pages: number;
  officialPage: string;
  url: string;
  status: "conditional-teen-extension";
};

export const nctbConditionalTeenResources: NctbTeenResource[] = [
  {
    id: "class-6-charupath",
    grade: 6,
    titleBn: "চারুপাঠ",
    titleEn: "Charupath",
    subject: "bangla",
    pages: 110,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b",
    url: "https://drive.egovcloud.gov.bd/index.php/s/WZ2FQlnIXv7NfZW/download",
    status: "conditional-teen-extension",
  },
  {
    id: "class-6-anandapath",
    grade: 6,
    titleBn: "আনন্দপাঠ",
    titleEn: "Anandapath",
    subject: "bangla",
    pages: 66,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b",
    url: "https://drive.egovcloud.gov.bd/index.php/s/Jm5nOcbFhMspLrB/download",
    status: "conditional-teen-extension",
  },
  {
    id: "class-6-bangla-grammar",
    grade: 6,
    titleBn: "বাংলা ব্যাকরণ ও নির্মিতি",
    titleEn: "Bangla Grammar and Composition",
    subject: "bangla",
    pages: 110,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b",
    url: "https://drive.egovcloud.gov.bd/index.php/s/72udd7yiI8ZE32J/download",
    status: "conditional-teen-extension",
  },
  {
    id: "class-6-bgs",
    grade: 6,
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies",
    subject: "bangladesh-and-global-studies",
    pages: 70,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b987ac4774958d7b7040b",
    url: "https://drive.egovcloud.gov.bd/index.php/s/lCmgQketjBzgGWD/download",
    status: "conditional-teen-extension",
  },
  {
    id: "class-8-literature",
    grade: 8,
    titleBn: "সাহিত্য-কণিকা",
    titleEn: "Literature Reader",
    subject: "bangla",
    pages: 138,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9858c4774958d7b703d8",
    url: "https://drive.egovcloud.gov.bd/index.php/s/YBnK8nxVuF8YHaD/download",
    status: "conditional-teen-extension",
  },
  {
    id: "class-8-bgs",
    grade: 8,
    titleBn: "বাংলাদেশ ও বিশ্বপরিচয়",
    titleEn: "Bangladesh and Global Studies",
    subject: "bangladesh-and-global-studies",
    pages: 149,
    officialPage: "https://nctb.gov.bd/pages/static-pages/695b9858c4774958d7b703d8",
    url: "https://drive.egovcloud.gov.bd/index.php/s/yc5DKo4i94aicwV/download",
    status: "conditional-teen-extension",
  },
];

export const nctbTeenCatalogPages = [
  {
    grade: "Class 7",
    url: "https://nctb.gov.bd/pages/static-pages/695b9aeec4774958d7b70908",
    status: "catalogued-not-yet-approved",
  },
  {
    grade: "Classes 9–10",
    url: "https://nctb.gov.bd/pages/static-pages/695b99afc4774958d7b70612",
    status: "catalogued-not-yet-approved",
  },
] as const;

export const nctbCommunityDiscovery = [
  { language: "Chakma", languageBn: "চাকমা" },
  { language: "Marma", languageBn: "মারমা" },
  { language: "Garo", languageBn: "গারো" },
  { language: "Sadri", languageBn: "সাদরি" },
  { language: "Tripura", languageBn: "ত্রিপুরা" },
].map((item) => ({
  ...item,
  prePrimaryPage: "https://nctb.gov.bd/pages/static-pages/695b9ab5c4774958d7b70861",
  primaryPage: "https://nctb.gov.bd/pages/static-pages/695b993bc4774958d7b7050e",
  status: "community-governed-discovery" as const,
}));

const coreVariants = nctbCoreBooks.flatMap((book) => book.variants);

export const nctbCoreStats = {
  titles: nctbCoreBooks.length,
  pdfVariants: coreVariants.length,
  uniqueContentPages: nctbCoreBooks.reduce((sum, book) => sum + book.variants[0].pages, 0),
  variantPages: coreVariants.reduce((sum, variant) => sum + variant.pages, 0),
};

export const nctbAuditSummary = {
  auditedOn: "11 August 2026",
  officialPagesChecked: 25,
  uniqueDownloadEndpoints: 143,
  pdfEndpoints: 142,
  zipEndpoints: 1,
  representativePdfsInspected: 26,
  encryptedPdfs: 0,
  activeContentFindings: 0,
  primaryBookTitles: nctbCoreStats.titles,
  primaryPdfVariants: nctbCoreStats.pdfVariants,
};

export const nctbAssessmentFramework = [
  {
    grades: "Classes 1–2",
    sourceMode: "Textbook and teacher guide subjects",
    continuous: 50,
    summative: 50,
  },
  {
    grades: "Classes 3–5",
    sourceMode: "Textbook and teacher guide subjects",
    continuous: 30,
    summative: 70,
  },
  {
    grades: "Classes 1–5",
    sourceMode: "Teacher-guide-only subjects",
    continuous: 100,
    summative: 0,
  },
] as const;
