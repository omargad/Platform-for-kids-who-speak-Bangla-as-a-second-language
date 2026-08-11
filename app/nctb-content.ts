export type NctbContentsEntry = {
  number: number;
  titleBn: string;
  page: number;
  adaptationFocus: string;
};

/**
 * Contents transcribed from the audited 2026 Class 5 NCTB Bangla reader.
 * Only titles, order and starting pages are recorded. The app does not copy
 * textbook prose, poems, illustrations or exercises.
 */
export const class5BanglaContents: NctbContentsEntry[] = [
  { number: 1, titleBn: "বৈচিত্র্যময় বাংলাদেশ", page: 1, adaptationFocus: "Compare places and identities without presenting one community as the whole country." },
  { number: 2, titleBn: "তিতুমীর", page: 6, adaptationFocus: "Build an evidence-based biography and distinguish event, source and interpretation." },
  { number: 3, titleBn: "দূরের পাল্লা", page: 19, adaptationFocus: "Notice sound, movement and river imagery before creating a short journey description." },
  { number: 4, titleBn: "পত্র লিখি", page: 24, adaptationFocus: "Write an audience-aware message with greeting, purpose, detail and closing." },
  { number: 5, titleBn: "ঠিক আছে", page: 28, adaptationFocus: "Practise agreement, clarification and polite conversational responses." },
  { number: 6, titleBn: "সুখু আর দুখু", page: 32, adaptationFocus: "Retell events, compare choices and support a character inference with evidence." },
  { number: 7, titleBn: "সাইক্লোন", page: 38, adaptationFocus: "Use calm weather and safety language; check current advice before any real-world guidance." },
  { number: 8, titleBn: "রয়েল বেঙ্গল টাইগার", page: 42, adaptationFocus: "Describe wildlife and habitat while separating verified facts from dramatic claims." },
  { number: 9, titleBn: "টুকটুক ও চিকু", page: 47, adaptationFocus: "Sequence a narrative and identify how a problem changes across the story." },
  { number: 10, titleBn: "রাখাল ছেলে", page: 53, adaptationFocus: "Describe setting, character and action without treating rural life as a stereotype." },
  { number: 11, titleBn: "কুটির শিল্প", page: 57, adaptationFocus: "Explain a making process and credit the artisan, community and source." },
  { number: 12, titleBn: "শিষ্যের সাধনা", page: 63, adaptationFocus: "Discuss practice, goals and persistence with age-appropriate reflection." },
  { number: 13, titleBn: "পাখির মতো", page: 69, adaptationFocus: "Explore comparison and imagery through listening, movement and a short response." },
  { number: 14, titleBn: "কুপোকাত", page: 78, adaptationFocus: "Infer tone and humour, then explain which textual clue supports the reading." },
  { number: 15, titleBn: "সংকল্প", page: 84, adaptationFocus: "Express intention, reasons and realistic next steps." },
  { number: 16, titleBn: "স্মরণীয় যাঁরা বরণীয় যাঁরা", page: 90, adaptationFocus: "Research a person with named sources and avoid unsupported heroic simplification." },
  { number: 17, titleBn: "মাটির নিচে পুরানো নগর", page: 98, adaptationFocus: "Ask how archaeology supports claims about a place and its past." },
  { number: 18, titleBn: "ইচ্ছামতী", page: 102, adaptationFocus: "Collect place and sensory language before comparing two interpretations." },
  { number: 19, titleBn: "ভাষার খেলা", page: 107, adaptationFocus: "Investigate Bangla sound and word patterns through playful, accessible examples." },
  { number: 20, titleBn: "শিক্ষাগুরুর মর্যাদা", page: 112, adaptationFocus: "Compare respectful forms of address and discuss how relationships shape register." },
  { number: 21, titleBn: "বিদায় হজের ভাষণ", page: 119, adaptationFocus: "Provide historical and religious context with family choice and qualified review." },
  { number: 22, titleBn: "আমরা তোমাদের ভুলব না", page: 124, adaptationFocus: "Handle public memory with calm language, verified dates and respect for differing family knowledge." },
  { number: 23, titleBn: "পোস্টার লিখি, প্ল্যাকার্ড লিখি", page: 130, adaptationFocus: "Create a concise public message with audience, purpose, hierarchy and source credit." },
];

export type LessonSourceBridge = {
  lessonId: string;
  sourceIds: string[];
  evidenceAnchor: string;
  adaptation: string;
  approvalStatus: "pending-educator-review";
};

/**
 * A review queue, not an automatic publication rule. Each bridge must be
 * approved for spelling, interpretation, age, diaspora context and copyright.
 */
export const lessonSourceBridges: LessonSourceBridge[] = [
  {
    lessonId: "hello-me",
    sourceIds: ["amar-bangla-class-1"],
    evidenceAnchor: "Class 1 oral-language and familiar-word progression",
    adaptation: "Check the current greeting and self-introduction sequence against first-reader language load without copying exercises.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "my-family",
    sourceIds: ["preprimary-story-archive", "amar-bangla-class-1"],
    evidenceAnchor: "Story archive items Amader Bari and Amra Apno Jon",
    adaptation: "Develop an inclusive family-language activity after accessible transcription, image description and family-structure review.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "letters-sounds",
    sourceIds: ["preprimary-writing", "amar-bangla-class-1", "amar-bangla-class-2", "amar-bangla-class-5"],
    evidenceAnchor: "Early writing sequence and Class 5 unit 19, ভাষার খেলা, page 107",
    adaptation: "Cross-check letter order, sound examples and handwriting prompts with a Bangla literacy specialist before release.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "river-journey",
    sourceIds: ["amar-bangla-class-5"],
    evidenceAnchor: "Class 5 unit 3, দূরের পাল্লা, page 19",
    adaptation: "Use the source as a reviewer reference for sound and river imagery; create original, levelled prompts for diaspora learners.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "sundarbans-voices",
    sourceIds: ["amar-bangla-class-5", "bangladesh-global-studies-class-5"],
    evidenceAnchor: "Class 5 Bangla unit 8, রয়েল বেঙ্গল টাইগার, page 42, plus the Class 5 BGS source",
    adaptation: "Triangulate species, habitat and community claims with current conservation authorities; avoid lifting textbook prose or images.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "language-movement",
    sourceIds: ["bangladesh-global-studies-class-5", "amar-bangla-class-5"],
    evidenceAnchor: "Class 5 history source and unit 22, আমরা তোমাদের ভুলব না, page 124",
    adaptation: "A history reviewer must confirm whether the literary unit is directly relevant before it is cited inside the lesson; retain independent institutional sources.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "heritage-comparison",
    sourceIds: ["amar-bangla-class-5", "bangladesh-global-studies-class-5"],
    evidenceAnchor: "Class 5 unit 17, মাটির নিচে পুরানো নগর, page 98",
    adaptation: "Use the archaeology prompt as a bridge to independently verified heritage records, not as evidence for every heritage claim.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "living-arts",
    sourceIds: ["amar-bangla-class-5", "bangladesh-global-studies-class-5"],
    evidenceAnchor: "Class 5 unit 11, কুটির শিল্প, page 57",
    adaptation: "Create an original process-and-maker inquiry with named artisans or institutional sources and clear image permissions.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "two-homes",
    sourceIds: ["amar-bangla-class-5"],
    evidenceAnchor: "Class 5 unit 1, বৈচিত্র্যময় বাংলাদেশ, page 1",
    adaptation: "Use diversity as a discussion bridge while keeping migration, mixed identity and Australian diaspora experiences visible.",
    approvalStatus: "pending-educator-review",
  },
  {
    lessonId: "research-exhibition",
    sourceIds: [
      "bangladesh-global-studies-class-3",
      "bangladesh-global-studies-class-4",
      "bangladesh-global-studies-class-5",
    ],
    evidenceAnchor: "Bilingual Class 3–5 Bangladesh and Global Studies sequence",
    adaptation: "Use the Bangla/English pairs to model source comparison, then require current and independently verified evidence for the exhibition.",
    approvalStatus: "pending-educator-review",
  },
];

export const nctbTeenSubjectOutlines = [
  {
    sourceId: "class-6-bgs",
    status: "conditional-teen-extension" as const,
    themes: [
      "History of social evolution",
      "History of Bangladesh",
      "Culture and society",
      "Economy",
      "Bangladesh and its citizens",
      "Environment",
      "Growing up and socialisation",
      "Bangladesh and regional cooperation",
    ],
  },
  {
    sourceId: "class-8-bgs",
    status: "conditional-teen-extension" as const,
    themes: [
      "Colonial era and the independence struggle",
      "Archaeological heritage",
      "The Liberation War",
      "Economy",
      "State and government",
      "Cultural change",
      "Socialisation",
      "Ethnic groups",
      "Social problems",
      "Population and development",
      "Climate and disaster",
      "Natural resources",
      "International cooperation",
    ],
  },
];

export const nctbPdfAuditFindings = [
  "All 143 discovered government download endpoints responded during the audit: 142 PDFs and one ZIP archive.",
  "The 26 representative PDFs inspected were not encrypted and exposed no JavaScript, launch actions, embedded files or rich media.",
  "Most learner books are image- or vector-heavy and do not provide a dependable reading order or searchable text layer.",
  "The 1,097-page primary curriculum contained an empty AcroForm dictionary with no fields or widgets; it was not an interactive form.",
  "Official PDFs remain source evidence. Learner-facing material must be rewritten as accessible HTML with citations and independent review.",
];
