"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { lessons, levelBands, type CurriculumLevel } from "./curriculum";
import LessonExperience from "./components/LessonExperience";
import FourSkillDiagnostic from "./components/FourSkillDiagnostic";

type Language = "en" | "bn";
type LessonStep = "start" | "learn" | "practice" | "watch" | "check";
type CloudLearner = { id: string; displayName: string };
type ModalState =
  | { type: "word"; id: string }
  | { type: "story" }
  | { type: "place"; id: string }
  | { type: "lesson"; id: string }
  | { type: "placement" }
  | { type: "grownups" }
  | null;

const copy = {
  en: {
    navLearn: "Learn",
    navLessons: "Lessons",
    navStory: "Story",
    navExplore: "Explore",
    navPlay: "Play",
    grownups: "Grown-ups",
    age: "Made for curious explorers aged 6–12",
    eyebrow: "Listen · Play · Discover",
    title: "A little Bangla in every adventure.",
    intro:
      "Travel along Bangladesh’s rivers with Bagh the tiger. Pick up words, open story postcards, and collect stars as you go.",
    start: "Start my quest",
    hearHello: "Hear ‘hello’",
    hello: "Hello, friend!",
    helloBn: "হ্যালো, বন্ধু!",
    mapTitle: "Your Bangladesh quest",
    mapText: "Six bands, 18 modules and 108 guided learning sessions.",
    stars: "stars",
    wordsTitle: "Pack four Bangla words",
    wordsIntro:
      "Tap a card, listen closely, then say it your way. There is no timer and no wrong accent here.",
    listen: "Listen",
    openWord: "Open word card",
    storyKicker: "River story",
    storyTitle: "Maya and the moonlit boat",
    storyIntro:
      "A short bilingual tale about a boat, a new friend, and a song floating over the water.",
    readStory: "Read the story",
    storyTime: "About 3 minutes · listen or read",
    cultureTitle: "Stamp your culture passport",
    cultureIntro:
      "Meet three real places in Bangladesh recognised by UNESCO. Each card holds a small wonder.",
    visit: "Open postcard",
    gameKicker: "Mini game",
    gameTitle: "Match the word pairs",
    gameIntro:
      "Choose an English word, then tap its Bangla partner. Match all four to earn a star.",
    english: "English",
    bangla: "বাংলা",
    reset: "Play again",
    matched: "Wonderful — every pair matches!",
    chooseEnglish: "Now choose its Bangla partner.",
    tryAgain: "Almost! Try another Bangla word.",
    safeTitle: "A calm, child-safe corner of the internet",
    safeText:
      "No account, chat, location tracking, or personal details. Progress stays on this device; external videos load only when chosen.",
    sourceTitle: "Created with care",
    sourceText:
      "A complete, review-ready curriculum with cultural facts grounded in UNESCO and proficiency goals adapted from CEFR-style progression.",
    back: "Back",
    next: "Next",
    finish: "Finish story",
    close: "Close",
    sayIt: "Hear it again",
    practice: "I practised this word",
    practised: "Word practised — star collected!",
    quiz: "Quick story question",
    quizQuestion: "What carried Maya across the river?",
    correct: "Yes! A boat carried Maya across the river.",
    notQuite: "Not quite — look back at the story and try again.",
    progress: "Quest progress",
    activities: "activities completed",
    resetProgress: "Reset progress on this device",
    privacy: "Privacy promise",
    privacyText:
      "Children are not asked to sign in or submit personal information. Progress is saved only in this browser. YouTube connects only after a learner chooses to load a video.",
    skip: "Skip to the adventure",
    soundOn: "Sound on",
    soundOff: "Sound muted",
    riverOn: "Play gentle river sounds",
    riverOff: "Stop river sounds",
    listenEnglish: "Listen in English",
    listenBangla: "বাংলায় শুনি",
    audioUnavailable: "Voice playback is not available on this device.",
    curriculumKicker: "18 modules · 108 guided sessions · six proficiency bands",
    curriculumTitle: "Your complete Bangla learning path",
    curriculumIntro:
      "Start with listening and first words, then grow into conversation, stories, culture, research and confident heritage-language use.",
    levelGuide:
      "Levels are based on what a learner can do—not their age. Pre-A1 to B1 is the core path; B2 is a stretch path; C1–C2 is an advanced heritage extension.",
    allLevels: "All levels",
    findLevel: "Find my starting level",
    fullLesson: "Open six-session module",
    continueLesson: "Continue module",
    completedLesson: "Module complete",
    lessonCount: "modules",
    pathway: "Pathway",
    canDo: "By the end, I can…",
    objectives: "Learning goals",
    lessonStart: "Start",
    lessonLearn: "Learn",
    lessonPractice: "Practise",
    lessonWatch: "Watch",
    lessonCheck: "Check",
    wordsPatterns: "Words and useful patterns",
    teachingNotes: "Mini lesson",
    guidedPractice: "Guided practice",
    familyMission: "Family mission",
    videoResource: "Lesson video",
    videoPrivacy:
      "YouTube stays off until you choose to load it. Loading a video connects to YouTube and is subject to its privacy terms.",
    loadVideo: "Load lesson video",
    openPlaylist: "Open curated playlist",
    knowledgeCheck: "Show what you know",
    checkAnswers: "Check my answers",
    chooseEveryAnswer: "Choose an answer for both questions first.",
    allCorrect: "Brilliant work—lesson complete and two stars collected!",
    tryLessonCheck: "Good try. Read the explanations, change an answer, and check again.",
    previousStep: "Previous",
    nextStep: "Next step",
    placementTitle: "Find a sensible starting point",
    placementIntro:
      "This two-minute self-check is a guide, not an exam or certificate. Choose what the learner can usually do without being coached.",
    yesUsually: "Yes, usually",
    notYet: "Not yet",
    seeSuggestion: "See my suggestion",
    placementIncomplete: "Answer every statement to see a suggestion.",
    suggestedLevel: "Suggested starting band",
    startHere: "See lessons at this level",
    levelNote: "If the first lesson feels too easy or too hard, move one band. That is good learning, not failure.",
    sourceNote:
      "This is a child- and heritage-learner adaptation of CEFR-style ‘can do’ progression, not an official CEFR assessment.",
  },
  bn: {
    navLearn: "শিখি",
    navLessons: "পাঠ",
    navStory: "গল্প",
    navExplore: "ঘুরি",
    navPlay: "খেলি",
    grownups: "বড়দের জন্য",
    age: "৬–১২ বছরের কৌতূহলী অভিযাত্রীদের জন্য",
    eyebrow: "শোনো · খেলো · আবিষ্কার করো",
    title: "প্রতিটি অভিযানে একটু বাংলা।",
    intro:
      "বাঘের সঙ্গে বাংলাদেশের নদীপথে চলো। নতুন শব্দ শেখো, গল্পের পোস্টকার্ড খোলো আর তারা সংগ্রহ করো।",
    start: "অভিযান শুরু করি",
    hearHello: "‘হ্যালো’ শুনি",
    hello: "Hello, friend!",
    helloBn: "হ্যালো, বন্ধু!",
    mapTitle: "তোমার বাংলাদেশ অভিযান",
    mapText: "ছয়টি ধাপ, ১৮টি মডিউল, ১০৮টি শেখার সেশন।",
    stars: "তারা",
    wordsTitle: "চারটি বাংলা শব্দ সঙ্গে নাও",
    wordsIntro:
      "কার্ডে ট্যাপ করো, মন দিয়ে শোনো, তারপর নিজের মতো করে বলো। এখানে কোনো তাড়া নেই।",
    listen: "শুনি",
    openWord: "শব্দের কার্ড খুলি",
    storyKicker: "নদীর গল্প",
    storyTitle: "মায়া আর চাঁদের নৌকা",
    storyIntro:
      "নৌকা, নতুন বন্ধু আর জলের উপর ভেসে আসা গান নিয়ে ছোট্ট দুই ভাষার গল্প।",
    readStory: "গল্প পড়ি",
    storyTime: "প্রায় ৩ মিনিট · শোনো বা পড়ো",
    cultureTitle: "সংস্কৃতির পাসপোর্টে ছাপ নাও",
    cultureIntro:
      "ইউনেস্কো স্বীকৃত বাংলাদেশের তিনটি সত্যিকারের জায়গা ঘুরে দেখো। প্রতিটি কার্ডে আছে ছোট্ট বিস্ময়।",
    visit: "পোস্টকার্ড খুলি",
    gameKicker: "ছোট্ট খেলা",
    gameTitle: "শব্দের জোড়া মেলাও",
    gameIntro:
      "আগে একটি ইংরেজি শব্দ বেছে নাও, তারপর তার বাংলা জোড়ায় ট্যাপ করো। চারটি মিললেই একটি তারা।",
    english: "English",
    bangla: "বাংলা",
    reset: "আবার খেলি",
    matched: "দারুণ — সব জোড়া মিলে গেছে!",
    chooseEnglish: "এবার এর বাংলা জোড়া বেছে নাও।",
    tryAgain: "প্রায় হয়েছে! আরেকটি বাংলা শব্দ চেষ্টা করো।",
    safeTitle: "শিশুদের জন্য শান্ত ও নিরাপদ অনলাইন জায়গা",
    safeText:
      "কোনো অ্যাকাউন্ট, চ্যাট, লোকেশন বা ব্যক্তিগত তথ্য নেই। অগ্রগতি এই ডিভাইসে থাকে; বাইরের ভিডিও শুধু বেছে নিলে লোড হয়।",
    sourceTitle: "যত্ন নিয়ে তৈরি",
    sourceText:
      "সম্পূর্ণ ও পর্যালোচনার উপযোগী পাঠক্রম—সংস্কৃতির তথ্য UNESCO-ভিত্তিক এবং দক্ষতার লক্ষ্য CEFR-এর ধাঁচে অভিযোজিত।",
    back: "আগে",
    next: "পরের পাতা",
    finish: "গল্প শেষ",
    close: "বন্ধ করি",
    sayIt: "আবার শুনি",
    practice: "শব্দটি অনুশীলন করেছি",
    practised: "অনুশীলন হয়েছে — তারা পেয়েছ!",
    quiz: "গল্পের ছোট্ট প্রশ্ন",
    quizQuestion: "মায়া কীসে নদী পার হলো?",
    correct: "ঠিক! মায়া নৌকায় নদী পার হলো।",
    notQuite: "আরেকবার চেষ্টা করো — গল্পে উত্তরটি আছে।",
    progress: "অভিযানের অগ্রগতি",
    activities: "টি কাজ শেষ",
    resetProgress: "এই ডিভাইসের অগ্রগতি মুছি",
    privacy: "গোপনীয়তার প্রতিশ্রুতি",
    privacyText:
      "শিশুকে সাইন ইন করতে বা ব্যক্তিগত তথ্য দিতে হয় না। অগ্রগতি শুধু এই ব্রাউজারে থাকে। বেছে নিয়ে ভিডিও চালালেই কেবল YouTube-এর সঙ্গে সংযোগ হয়।",
    skip: "সরাসরি অভিযানে যাই",
    soundOn: "শব্দ চালু",
    soundOff: "শব্দ বন্ধ",
    riverOn: "নদীর মৃদু শব্দ চালু করি",
    riverOff: "নদীর শব্দ বন্ধ করি",
    listenEnglish: "ইংরেজিতে শুনি",
    listenBangla: "বাংলায় শুনি",
    audioUnavailable: "এই ডিভাইসে কণ্ঠ শোনার সুবিধা নেই।",
    curriculumKicker: "১৮টি মডিউল · ১০৮টি সেশন · ছয়টি দক্ষতার ধাপ",
    curriculumTitle: "তোমার সম্পূর্ণ বাংলা শেখার পথ",
    curriculumIntro:
      "শোনা আর প্রথম শব্দ দিয়ে শুরু করো, তারপর কথোপকথন, গল্প, সংস্কৃতি, গবেষণা ও আত্মবিশ্বাসী ভাষা ব্যবহারে এগিয়ে যাও।",
    levelGuide:
      "বয়স নয়—শিক্ষার্থী কী করতে পারে তার ভিত্তিতে ধাপ বেছে নাও। Pre-A1 থেকে B1 মূল পথ, B2 বাড়তি চ্যালেঞ্জ, আর C1–C2 উন্নত heritage extension।",
    allLevels: "সব ধাপ",
    findLevel: "আমার শুরুর ধাপ খুঁজি",
    fullLesson: "ছয় সেশনের মডিউল খুলি",
    continueLesson: "মডিউল চালিয়ে যাই",
    completedLesson: "মডিউল শেষ",
    lessonCount: "টি মডিউল",
    pathway: "শেখার পথ",
    canDo: "পাঠ শেষে আমি পারব…",
    objectives: "শেখার লক্ষ্য",
    lessonStart: "শুরু",
    lessonLearn: "শিখি",
    lessonPractice: "অনুশীলন",
    lessonWatch: "ভিডিও",
    lessonCheck: "যাচাই",
    wordsPatterns: "শব্দ ও দরকারি বাক্য",
    teachingNotes: "ছোট্ট পাঠ",
    guidedPractice: "ধাপে ধাপে অনুশীলন",
    familyMission: "পরিবারের সঙ্গে কাজ",
    videoResource: "পাঠের ভিডিও",
    videoPrivacy:
      "তুমি লোড করার আগে YouTube বন্ধ থাকে। ভিডিও লোড করলে YouTube-এর সঙ্গে সংযোগ হবে এবং তাদের গোপনীয়তার নিয়ম প্রযোজ্য হবে।",
    loadVideo: "পাঠের ভিডিও চালাই",
    openPlaylist: "বাছাই করা প্লেলিস্ট খুলি",
    knowledgeCheck: "কতটা শিখেছি দেখি",
    checkAnswers: "উত্তর যাচাই করি",
    chooseEveryAnswer: "আগে দুটি প্রশ্নেরই উত্তর বেছে নাও।",
    allCorrect: "দারুণ—পাঠ শেষ এবং দুটি তারা পেয়েছ!",
    tryLessonCheck: "ভালো চেষ্টা। ব্যাখ্যা পড়ে উত্তর বদলে আবার যাচাই করো।",
    previousStep: "আগের ধাপ",
    nextStep: "পরের ধাপ",
    placementTitle: "শুরুর জন্য ঠিক ধাপটি খুঁজি",
    placementIntro:
      "এটি দুই মিনিটের সহায়ক যাচাই—পরীক্ষা বা সনদ নয়। সাহায্য ছাড়া শিক্ষার্থী সাধারণত যা পারে সেটি বেছে নাও।",
    yesUsually: "হ্যাঁ, সাধারণত পারি",
    notYet: "এখনও নয়",
    seeSuggestion: "পরামর্শ দেখি",
    placementIncomplete: "পরামর্শ পেতে প্রতিটি বক্তব্যের উত্তর দাও।",
    suggestedLevel: "শুরুর প্রস্তাবিত ধাপ",
    startHere: "এই ধাপের পাঠ দেখি",
    levelNote: "প্রথম পাঠ খুব সহজ বা কঠিন লাগলে এক ধাপ বদলাও। এটিই ভালো শেখা—ব্যর্থতা নয়।",
    sourceNote:
      "এটি শিশু ও heritage learner-দের জন্য CEFR-এর ‘can do’ অগ্রগতির অভিযোজন; কোনো আনুষ্ঠানিক CEFR মূল্যায়ন নয়।",
  },
} as const;

const words = [
  {
    id: "river",
    bn: "নদী",
    transliteration: "nô-di",
    en: "river",
    emoji: "〰",
    exampleBn: "নদী বয়ে যায়।",
    exampleEn: "The river flows.",
    tone: "river",
  },
  {
    id: "boat",
    bn: "নৌকা",
    transliteration: "nou-ka",
    en: "boat",
    emoji: "◒",
    exampleBn: "নৌকা জলে চলে।",
    exampleEn: "The boat moves on the water.",
    tone: "saffron",
  },
  {
    id: "tiger",
    bn: "বাঘ",
    transliteration: "bagh",
    en: "tiger",
    emoji: "✦",
    exampleBn: "বাঘ বনে থাকে।",
    exampleEn: "The tiger lives in the forest.",
    tone: "coral",
  },
  {
    id: "friend",
    bn: "বন্ধু",
    transliteration: "bon-dhu",
    en: "friend",
    emoji: "●",
    exampleBn: "তুমি আমার বন্ধু।",
    exampleEn: "You are my friend.",
    tone: "indigo",
  },
];

const places = [
  {
    id: "sundarbans",
    number: "01",
    title: "The Sundarbans",
    titleBn: "সুন্দরবন",
    tag: "Mangrove forest",
    tagBn: "ম্যানগ্রোভ বন",
    fact:
      "This immense tidal mangrove forest stretches across river channels and mudflats. It is home to remarkable wildlife, including the Royal Bengal tiger.",
    factBn:
      "জোয়ার-ভাটার নদী আর কাদামাটির চরজুড়ে বিস্তৃত এই বিশাল ম্যানগ্রোভ বন। রয়েল বেঙ্গল টাইগারসহ অনেক প্রাণীর আবাস এটি।",
    prompt: "Can you trace a winding river in the picture?",
    promptBn: "ছবিতে আঁকাবাঁকা নদীটি খুঁজে পাবে?",
  },
  {
    id: "bagerhat",
    number: "02",
    title: "Historic Bagerhat",
    titleBn: "ঐতিহাসিক বাগেরহাট",
    tag: "Brick mosque city",
    tagBn: "ইটের মসজিদের শহর",
    fact:
      "Bagerhat grew as a medieval city in the 1400s. Its many brick mosques show clever building traditions shaped by the green delta landscape.",
    factBn:
      "১৪০০-এর দশকে বাগেরহাট মধ্যযুগের একটি শহর হিসেবে গড়ে ওঠে। এখানকার ইটের মসজিদগুলো বদ্বীপ অঞ্চলের চমৎকার নির্মাণকৌশল দেখায়।",
    prompt: "Look for domes — how many shapes can you imagine?",
    promptBn: "গম্বুজ খুঁজে দেখো — কত রকম আকার কল্পনা করতে পারো?",
  },
  {
    id: "paharpur",
    number: "03",
    title: "Paharpur Vihara",
    titleBn: "পাহাড়পুর বিহার",
    tag: "Ancient learning place",
    tagBn: "প্রাচীন শিক্ষাকেন্দ্র",
    fact:
      "The ruins at Paharpur are the remains of a vast Buddhist monastery and centre of learning that influenced architecture far beyond Bangladesh.",
    factBn:
      "পাহাড়পুরের ধ্বংসাবশেষ এক বিশাল বৌদ্ধ বিহার ও শিক্ষাকেন্দ্রের স্মৃতি। এর স্থাপত্য বাংলাদেশের বাইরেও প্রভাব ফেলেছিল।",
    prompt: "Imagine the learners who walked through these courtyards.",
    promptBn: "এই আঙিনায় হেঁটে যাওয়া প্রাচীন শিক্ষার্থীদের কল্পনা করো।",
  },
];

const storyPages = [
  {
    en: "Maya stood beside a wide river. A little boat rocked near the bank.",
    bn: "মায়া একটি চওড়া নদীর পাশে দাঁড়াল। তীরে একটি ছোট নৌকা দুলছিল।",
    word: "নদী · river",
  },
  {
    en: "‘Come aboard!’ called Rafi. Together, the new friends followed the moonlight.",
    bn: "‘নৌকায় এসো!’ রাফি ডাকল। নতুন দুই বন্ধু চাঁদের আলো ধরে এগিয়ে গেল।",
    word: "নৌকা · boat",
  },
  {
    en: "Across the water came a gentle song. Maya smiled and sang the last line in Bangla.",
    bn: "জলের ওপার থেকে মিষ্টি গান ভেসে এল। মায়া হেসে শেষ লাইনটি বাংলায় গাইল।",
    word: "বন্ধু · friend",
  },
];

const pairs = [
  { id: "water", en: "water", bn: "পানি" },
  { id: "flower", en: "flower", bn: "ফুল" },
  { id: "home", en: "home", bn: "বাড়ি" },
  { id: "song", en: "song", bn: "গান" },
];

const rightOrder = [pairs[2], pairs[0], pairs[3], pairs[1]];

const placementStatements = [
  {
    en: "I can greet someone, say my name and recognise a handful of familiar Bangla words.",
    bn: "আমি কাউকে শুভেচ্ছা জানাতে, নিজের নাম বলতে এবং পরিচিত কয়েকটি বাংলা শব্দ চিনতে পারি।",
  },
  {
    en: "I can talk in short phrases about family, food and my everyday routine.",
    bn: "আমি পরিবার, খাবার ও প্রতিদিনের কাজ নিয়ে ছোট বাক্যে কথা বলতে পারি।",
  },
  {
    en: "I can connect several sentences to describe a journey, event or past experience.",
    bn: "আমি ভ্রমণ, ঘটনা বা অতীত অভিজ্ঞতা নিয়ে কয়েকটি বাক্য জুড়ে বলতে পারি।",
  },
  {
    en: "I can compare cultural ideas, explain my opinion and follow detailed Bangla media.",
    bn: "আমি সাংস্কৃতিক বিষয় তুলনা করতে, মতামত ব্যাখ্যা করতে এবং বিস্তারিত বাংলা মিডিয়া বুঝতে পারি।",
  },
  {
    en: "I can interpret an authentic story or poem and adapt nuanced Bangla for different audiences.",
    bn: "আমি মৌলিক গল্প বা কবিতা ব্যাখ্যা করতে এবং ভিন্ন শ্রোতার জন্য সূক্ষ্ম বাংলা ব্যবহার করতে পারি।",
  },
];

const lessonSteps: LessonStep[] = ["start", "learn", "practice", "watch", "check"];

function legacyExperienceEnabled() {
  return false;
}

type AudioCue = "tap" | "success" | "retry" | "star";

type AmbienceNodes = {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [stars, setStars] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [storyPage, setStoryPage] = useState(0);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameMessage, setGameMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambienceEnabled, setAmbienceEnabled] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | "all">("pre-a1");
  const [cloudLearner, setCloudLearner] = useState<CloudLearner | null>(null);
  const [syncStatus, setSyncStatus] = useState<"device" | "syncing" | "synced" | "pending">("device");
  const [lessonStep, setLessonStep] = useState<LessonStep>("start");
  const [lessonQuizAnswers, setLessonQuizAnswers] = useState<Record<number, number>>({});
  const [lessonQuizSubmitted, setLessonQuizSubmitted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [placementAnswers, setPlacementAnswers] = useState<Array<boolean | null>>(
    () => placementStatements.map(() => null),
  );
  const [placementSubmitted, setPlacementSubmitted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambienceRef = useRef<AmbienceNodes | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechTokenRef = useRef(0);
  const completedRef = useRef<string[]>([]);
  const cloudLoadStartedRef = useRef(false);
  const t = copy[language];
  const lessonStepLabels: Record<LessonStep, string> = {
    start: t.lessonStart,
    learn: t.lessonLearn,
    practice: t.lessonPractice,
    watch: t.lessonWatch,
    check: t.lessonCheck,
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedStars = Number(window.localStorage.getItem("bangla-adventures-stars"));
        const savedCompleted = JSON.parse(
          window.localStorage.getItem("bangla-adventures-completed") || "[]",
        );
        if (Number.isFinite(savedStars)) setStars(savedStars);
        if (Array.isArray(savedCompleted)) {
          completedRef.current = savedCompleted;
          setCompleted(savedCompleted);
        }
        if (window.localStorage.getItem("bangla-adventures-sound") === "off") {
          setSoundEnabled(false);
        }
      } catch {
        // The learning experience still works when browser storage is unavailable.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem("bangla-adventures-stars", String(stars));
      window.localStorage.setItem(
        "bangla-adventures-completed",
        JSON.stringify(completed),
      );
      window.localStorage.setItem(
        "bangla-adventures-sound",
        soundEnabled ? "on" : "off",
      );
    } catch {
      // Keep progress in memory for this visit.
    }
  }, [stars, completed, soundEnabled, ready]);

  useEffect(() => {
    if (!ready || cloudLoadStartedRef.current) return;
    cloudLoadStartedRef.current = true;
    const parameters = new URLSearchParams(window.location.search);
    const profileId = parameters.get("learner");
    const moduleId = parameters.get("module");

    if (moduleId) {
      const lesson = lessons.find((item) => item.id === moduleId);
      if (lesson) {
        window.setTimeout(() => {
          setSelectedLevel(lesson.level);
          openLesson(lesson.id);
        }, 0);
      }
    }

    if (!profileId) return;
    window.setTimeout(() => setSyncStatus("syncing"), 0);
    void fetch(`/api/profiles/${encodeURIComponent(profileId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { profile?: CloudLearner; progress?: Array<{ sessionId: string }>; error?: string };
        if (!response.ok || !data.profile) throw new Error(data.error || "Cloud profile unavailable.");
        setCloudLearner(data.profile);
        const cloudSessions = (data.progress || []).map((item) => item.sessionId);
        const merged = Array.from(new Set([...completedRef.current, ...cloudSessions]));
        completedRef.current = merged;
        setCompleted(merged);
        setSyncStatus("synced");
        void flushProgressQueue(data.profile.id);
      })
      .catch(() => setSyncStatus("pending"));
  }, [ready]);

  useEffect(() => {
    const syncWhenOnline = () => {
      if (cloudLearner) void flushProgressQueue(cloudLearner.id);
    };
    window.addEventListener("online", syncWhenOnline);
    return () => window.removeEventListener("online", syncWhenOnline);
  }, [cloudLearner]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const speech = window.speechSynthesis;
    const loadVoices = () => setVoices(speech.getVoices());
    loadVoices();
    speech.addEventListener("voiceschanged", loadVoices);
    return () => speech.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => {
    return () => {
      speechTokenRef.current += 1;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      recordedAudioRef.current?.pause();
      recordedAudioRef.current = null;
      const ambience = ambienceRef.current;
      if (ambience) {
        try {
          ambience.source.stop();
          ambience.lfo.stop();
        } catch {
          // Audio may already have stopped while the page is closing.
        }
        ambience.source.disconnect();
        ambience.filter.disconnect();
        ambience.gain.disconnect();
        ambience.lfo.disconnect();
        ambience.lfoGain.disconnect();
      }
      const context = audioContextRef.current;
      if (context && context.state !== "closed") void context.close();
    };
  }, []);

  useEffect(() => {
    if (!modal) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        speechTokenRef.current += 1;
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        recordedAudioRef.current?.pause();
        recordedAudioRef.current = null;
        setIsSpeaking(false);
        const context = audioContextRef.current;
        const ambience = ambienceRef.current;
        if (context && ambience && context.state !== "closed") {
          ambience.gain.gain.setValueAtTime(0.028, context.currentTime);
        }
        setModal(null);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
    };
  }, [modal]);

  const completedSessions = completed.filter((item) => item.startsWith("session-")).length;
  const totalActivities = (lessons.length * 6) + words.length + places.length + 2;
  const completedActivities = completed.filter((item) =>
    item.startsWith("session-") ||
    item.startsWith("word-") ||
    item.startsWith("place-") ||
    item === "river-story" ||
    item === "match-game",
  ).length;
  const progress = Math.min(100, Math.round((completedActivities / totalActivities) * 100));
  const filteredLessons = useMemo(
    () => selectedLevel === "all" ? lessons : lessons.filter((lesson) => lesson.level === selectedLevel),
    [selectedLevel],
  );
  const activeLesson = useMemo(
    () => modal?.type === "lesson" ? lessons.find((lesson) => lesson.id === modal.id) : null,
    [modal],
  );
  const activeLevel = useMemo(
    () => activeLesson ? levelBands.find((level) => level.id === activeLesson.level) : null,
    [activeLesson],
  );
  const completedLessons = useMemo(
    () => completed.filter((item) => item.startsWith("lesson-")).length,
    [completed],
  );
  const placementSuggestion = useMemo(() => {
    const yesCount = placementAnswers.filter((answer) => answer === true).length;
    const levelIndex = Math.min(yesCount, levelBands.length - 1);
    return levelBands[levelIndex];
  }, [placementAnswers]);
  const activeWord = useMemo(
    () => (modal?.type === "word" ? words.find((word) => word.id === modal.id) : null),
    [modal],
  );
  const activePlace = useMemo(
    () => (modal?.type === "place" ? places.find((place) => place.id === modal.id) : null),
    [modal],
  );

  function getAudioContext() {
    if (!("AudioContext" in window)) return null;
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }

  function playCue(cue: AudioCue) {
    if (!soundEnabled) return;
    const context = getAudioContext();
    if (!context) return;

    const patterns: Record<AudioCue, Array<[number, number, number]>> = {
      tap: [[0, 440, 0.055]],
      success: [[0, 523, 0.08], [0.085, 659, 0.11]],
      retry: [[0, 330, 0.08], [0.09, 247, 0.12]],
      star: [[0, 523, 0.1], [0.075, 659, 0.1], [0.15, 784, 0.16]],
    };

    patterns[cue].forEach(([offset, frequency, duration]) => {
      const start = context.currentTime + offset;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = cue === "tap" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(cue === "star" ? 0.055 : 0.04, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.025);
    });
  }

  function stopAmbience() {
    const ambience = ambienceRef.current;
    if (!ambience) return;
    try {
      ambience.source.stop();
      ambience.lfo.stop();
    } catch {
      // The nodes may already be stopped.
    }
    ambience.source.disconnect();
    ambience.filter.disconnect();
    ambience.gain.disconnect();
    ambience.lfo.disconnect();
    ambience.lfoGain.disconnect();
    ambienceRef.current = null;
  }

  function startAmbience() {
    if (!soundEnabled || ambienceRef.current) return false;
    const context = getAudioContext();
    if (!context) return false;

    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const channel = buffer.getChannelData(0);
    let current = 0;
    let seed = 0x6d2b79f5;
    for (let index = 0; index < channel.length; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const noise = (seed / 4294967295) * 2 - 1;
      current = current * 0.985 + noise * 0.035;
      channel[index] = Math.max(-1, Math.min(1, current)) * 0.48;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 720;
    filter.Q.value = 0.35;
    gain.gain.value = 0.028;
    lfo.type = "sine";
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.009;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    source.start();
    lfo.start();
    ambienceRef.current = { source, filter, gain, lfo, lfoGain };
    return true;
  }

  function toggleAmbience() {
    if (ambienceEnabled) {
      stopAmbience();
      setAmbienceEnabled(false);
      setAudioMessage(language === "en" ? "River sounds stopped." : "নদীর শব্দ বন্ধ হয়েছে।");
      return;
    }
    if (startAmbience()) {
      setAmbienceEnabled(true);
      setAudioMessage(language === "en" ? "Gentle river sounds are playing." : "নদীর মৃদু শব্দ বাজছে।");
    }
  }

  function toggleSound() {
    if (soundEnabled) {
      stopNarration();
      stopAmbience();
      setAmbienceEnabled(false);
      setSoundEnabled(false);
      setAudioMessage(language === "en" ? "All sound is muted." : "সব শব্দ বন্ধ আছে।");
    } else {
      setSoundEnabled(true);
      setAudioMessage(language === "en" ? "Sound is on." : "শব্দ চালু হয়েছে।");
    }
  }

  function stopNarration() {
    speechTokenRef.current += 1;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    recordedAudioRef.current?.pause();
    recordedAudioRef.current = null;
    setIsSpeaking(false);
    duckAmbience(false);
  }

  function duckAmbience(ducked: boolean) {
    const context = audioContextRef.current;
    const ambience = ambienceRef.current;
    if (!context || !ambience || context.state === "closed") return;
    ambience.gain.gain.cancelScheduledValues(context.currentTime);
    ambience.gain.gain.linearRampToValueAtTime(
      ducked ? 0.011 : 0.028,
      context.currentTime + 0.18,
    );
  }

  function playRecordedVoice(source: string, languageRoot: string, token: number) {
    recordedAudioRef.current?.pause();
    const audio = new Audio(source);
    audio.preload = "auto";
    audio.volume = 0.92;
    recordedAudioRef.current = audio;
    audio.onplay = () => {
      if (speechTokenRef.current !== token) return;
      setIsSpeaking(true);
      duckAmbience(true);
      setAudioMessage(languageRoot === "bn" ? "বাংলা কণ্ঠ বাজছে।" : "English narration is playing.");
    };
    audio.onended = () => {
      if (speechTokenRef.current !== token) return;
      recordedAudioRef.current = null;
      setIsSpeaking(false);
      duckAmbience(false);
      setAudioMessage(languageRoot === "bn" ? "বাংলা কণ্ঠ শেষ হয়েছে।" : "English narration finished.");
    };
    audio.onerror = () => {
      if (speechTokenRef.current !== token) return;
      recordedAudioRef.current = null;
      setIsSpeaking(false);
      duckAmbience(false);
      setAudioMessage(t.audioUnavailable);
    };
    void audio.play().catch(() => {
      if (speechTokenRef.current !== token) return;
      recordedAudioRef.current = null;
      setIsSpeaking(false);
      duckAmbience(false);
      setAudioMessage(t.audioUnavailable);
    });
  }

  function speak(text: string, lang = "bn-BD", fallbackSource?: string) {
    if (!soundEnabled) {
      setAudioMessage(language === "en" ? "Turn sound on to listen." : "শুনতে শব্দ চালু করো।");
      return;
    }
    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    const languageRoot = lang.toLowerCase().split("-")[0];
    const preferredVoice =
      voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith(languageRoot));
    recordedAudioRef.current?.pause();
    recordedAudioRef.current = null;

    if (!("speechSynthesis" in window) || !preferredVoice) {
      if (fallbackSource) {
        playRecordedVoice(fallbackSource, languageRoot, token);
      } else {
        setAudioMessage(t.audioUnavailable);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = languageRoot === "bn" ? 0.78 : 0.88;
    utterance.pitch = 1.04;
    utterance.volume = 0.95;
    utterance.onstart = () => {
      if (speechTokenRef.current !== token) return;
      setIsSpeaking(true);
      duckAmbience(true);
      setAudioMessage(languageRoot === "bn" ? "বাংলা কণ্ঠ বাজছে।" : "English narration is playing.");
    };
    utterance.onend = () => {
      if (speechTokenRef.current !== token) return;
      setIsSpeaking(false);
      duckAmbience(false);
      setAudioMessage(languageRoot === "bn" ? "বাংলা কণ্ঠ শেষ হয়েছে।" : "English narration finished.");
    };
    utterance.onerror = (event) => {
      if (speechTokenRef.current !== token || event.error === "canceled" || event.error === "interrupted") return;
      setIsSpeaking(false);
      duckAmbience(false);
      if (fallbackSource) {
        playRecordedVoice(fallbackSource, languageRoot, token);
      } else {
        setAudioMessage(t.audioUnavailable);
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  function progressPayload(profileId: string, activity: string) {
    const lesson = lessons.find((item) => activity.startsWith(`session-${item.id}-`));
    if (!lesson) return null;
    const skill = activity.slice(`session-${lesson.id}-`.length);
    return { profileId, lessonId: lesson.id, sessionId: activity, skill };
  }

  async function postProgress(payload: { profileId: string; lessonId: string; sessionId: string; skill: string }) {
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Progress sync failed");
  }

  function queueProgress(payload: { profileId: string; lessonId: string; sessionId: string; skill: string }) {
    try {
      const current = JSON.parse(window.localStorage.getItem("bangla-adventures-sync-queue") || "[]") as Array<typeof payload>;
      const queue = Array.isArray(current) ? current.filter((item) => item.sessionId !== payload.sessionId || item.profileId !== payload.profileId) : [];
      queue.push(payload);
      window.localStorage.setItem("bangla-adventures-sync-queue", JSON.stringify(queue));
    } catch {
      // The session remains complete on this device even when a queue cannot be stored.
    }
  }

  async function syncSessionActivity(activity: string) {
    if (!cloudLearner) return;
    const payload = progressPayload(cloudLearner.id, activity);
    if (!payload) return;
    setSyncStatus("syncing");
    try {
      await postProgress(payload);
      setSyncStatus("synced");
    } catch {
      queueProgress(payload);
      setSyncStatus("pending");
    }
  }

  async function flushProgressQueue(profileId: string) {
    try {
      const stored = JSON.parse(window.localStorage.getItem("bangla-adventures-sync-queue") || "[]") as Array<{ profileId: string; lessonId: string; sessionId: string; skill: string }>;
      if (!Array.isArray(stored) || stored.length === 0) return;
      setSyncStatus("syncing");
      const remaining: typeof stored = [];
      for (const payload of stored) {
        if (payload.profileId !== profileId) {
          remaining.push(payload);
          continue;
        }
        try {
          await postProgress(payload);
        } catch {
          remaining.push(payload);
        }
      }
      window.localStorage.setItem("bangla-adventures-sync-queue", JSON.stringify(remaining));
      setSyncStatus(remaining.some((item) => item.profileId === profileId) ? "pending" : "synced");
    } catch {
      setSyncStatus("pending");
    }
  }

  function award(activity: string, amount = 1) {
    if (completedRef.current.includes(activity)) return;
    const nextCompleted = [...completedRef.current, activity];
    completedRef.current = nextCompleted;
    setCompleted(nextCompleted);
    setStars((value) => value + amount);
    playCue("star");
    void syncSessionActivity(activity);
  }

  function startQuest() {
    playCue("tap");
    document.querySelector("#curriculum")?.scrollIntoView({ behavior: "smooth" });
  }

  function openLesson(id: string) {
    stopNarration();
    playCue("tap");
    setLessonStep("start");
    setLessonQuizAnswers({});
    setLessonQuizSubmitted(false);
    setVideoLoaded(false);
    setModal({ type: "lesson", id });
  }

  function moveLessonStep(direction: -1 | 1) {
    const currentIndex = lessonSteps.indexOf(lessonStep);
    const nextIndex = Math.max(0, Math.min(lessonSteps.length - 1, currentIndex + direction));
    stopNarration();
    playCue("tap");
    setLessonStep(lessonSteps[nextIndex]);
  }

  function submitLessonQuiz() {
    if (!activeLesson || activeLesson.quiz.some((_, index) => lessonQuizAnswers[index] === undefined)) {
      setLessonQuizSubmitted(true);
      playCue("retry");
      return;
    }
    const allCorrect = activeLesson.quiz.every(
      (question, index) => lessonQuizAnswers[index] === question.answer,
    );
    setLessonQuizSubmitted(true);
    if (allCorrect) award(`lesson-${activeLesson.id}`, 2);
    else playCue("retry");
  }

  function submitPlacement() {
    if (placementAnswers.some((answer) => answer === null)) {
      setPlacementSubmitted(true);
      playCue("retry");
      return;
    }
    setPlacementSubmitted(true);
    playCue("success");
  }

  function choosePlacementLevel() {
    setSelectedLevel(placementSuggestion.id);
    setModal(null);
    window.setTimeout(() => {
      document.querySelector("#lesson-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function matchBangla(id: string) {
    if (!selectedEnglish || matchedPairs.includes(id)) return;
    if (selectedEnglish === id) {
      const next = [...matchedPairs, id];
      setMatchedPairs(next);
      setSelectedEnglish(null);
      if (next.length === pairs.length) {
        setGameMessage(t.matched);
        award("match-game");
      } else {
        setGameMessage("✓");
        playCue("success");
      }
    } else {
      setGameMessage(t.tryAgain);
      playCue("retry");
    }
  }

  function resetGame() {
    setMatchedPairs([]);
    setSelectedEnglish(null);
    setGameMessage("");
  }

  function resetProgress() {
    setStars(0);
    completedRef.current = [];
    setCompleted([]);
    setLessonQuizAnswers({});
    setLessonQuizSubmitted(false);
    resetGame();
    try {
      window.localStorage.removeItem("bangla-adventures-stars");
      window.localStorage.removeItem("bangla-adventures-completed");
    } catch {
      // Nothing else to clear.
    }
  }

  function answerQuiz(answer: string) {
    if (answer === "boat") {
      setQuizResult("correct");
      award("river-story");
    } else {
      setQuizResult("wrong");
      playCue("retry");
    }
  }

  return (
    <>
      <a className="skip-link" href="#adventure">
        {t.skip}
      </a>
      <p className="sr-only" role="status" aria-live="polite">{audioMessage}</p>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Bangla Adventures home">
          <span className="brand-mark" aria-hidden="true">বা</span>
          <span>
            <strong>Bangla</strong>
            <small>Adventures</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#curriculum">{t.navLessons}</a>
          <a href="#story">{t.navStory}</a>
          <a href="#culture">{t.navExplore}</a>
          <a href="#game">{t.navPlay}</a>
        </nav>
        <div className="header-actions">
          <div className="audio-controls" aria-label={language === "en" ? "Audio controls" : "অডিও নিয়ন্ত্রণ"}>
            <button
              className={`audio-toggle ${soundEnabled ? "active" : ""}`}
              type="button"
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
              aria-pressed={soundEnabled}
              title={soundEnabled ? t.soundOn : t.soundOff}
              onClick={toggleSound}
            >
              <span aria-hidden="true">{soundEnabled ? "◖))" : "◖×"}</span>
            </button>
            <button
              className={`audio-toggle river-toggle ${ambienceEnabled ? "active is-playing" : ""}`}
              type="button"
              aria-label={ambienceEnabled ? t.riverOff : t.riverOn}
              aria-pressed={ambienceEnabled}
              title={ambienceEnabled ? t.riverOff : t.riverOn}
              disabled={!soundEnabled}
              onClick={toggleAmbience}
            >
              <span aria-hidden="true">≋</span>
            </button>
          </div>
          <div className="language-switch" aria-label="Language">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "bn" ? "active" : ""}
              aria-pressed={language === "bn"}
              onClick={() => setLanguage("bn")}
            >
              বাংলা
            </button>
          </div>
          <button className="grownups-button" type="button" onClick={() => setModal({ type: "grownups" })}>
            {t.grownups}
          </button>
        </div>
      </header>

      <main id="adventure">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="age-pill"><span aria-hidden="true">✦</span> {t.age}</p>
            {cloudLearner && (
              <a className={`active-learner-chip ${syncStatus}`} href="/family" title="Return to the grown-up dashboard">
                <span aria-hidden="true">☁</span>
                <strong>{cloudLearner.displayName}</strong>
                <small>{syncStatus === "synced" ? "progress synced" : syncStatus === "syncing" ? "syncing…" : "saved here · sync pending"}</small>
              </a>
            )}
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={startQuest}>
                {t.start} <span aria-hidden="true">→</span>
              </button>
              <button className={`sound-button ${isSpeaking ? "is-speaking" : ""}`} type="button" onClick={() => speak(t.helloBn, "bn-BD", "/audio/hello-bn.ogg")} disabled={!soundEnabled}>
                <span className="sound-icon" aria-hidden="true">♪</span>
                <span><small>{t.hearHello}</small><strong>{t.helloBn}</strong></span>
              </button>
              <Link className="outline-button" href="/explore">
                {language === "en" ? "Explore Bangladesh" : "বাংলাদেশ ঘুরে দেখো"} <span aria-hidden="true">🗺️</span>
              </Link>
            </div>
            <div className="hero-mini-stats" aria-label="What is inside">
              <span><strong>108</strong> {language === "en" ? "guided sessions" : "শেখার সেশন"}</span>
              <span><strong>6</strong> {language === "en" ? "levels" : "দক্ষতার ধাপ"}</span>
              <span><strong>2</strong> {language === "en" ? "languages" : "ভাষা"}</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Illustrated Bangladesh river quest map">
            <img src="/hero-quest-map.png" alt="A colourful illustrated river map with a friendly tiger and Bangladesh landmarks" />
            <div className="tiger-note">
              <span aria-hidden="true">🐯</span>
              <p><strong>{language === "en" ? "Hi, I’m Bagh!" : "হাই, আমি বাঘ!"}</strong>{language === "en" ? " Let’s follow the river." : " চলো নদীর পথে যাই।"}</p>
            </div>
            <div className="floating-word word-one">নদী <small>river</small></div>
            <div className="floating-word word-two">বাঘ <small>tiger</small></div>
          </div>
        </section>

        <section className="quest-bar" aria-labelledby="quest-title">
          <div>
            <span className="compass" aria-hidden="true">⌖</span>
            <div><h2 id="quest-title">{t.mapTitle}</h2><p>{t.mapText}</p></div>
          </div>
          <ol className="quest-stops">
            <li className={completedLessons > 0 ? "done" : "current"}><span>1</span>{language === "en" ? "Lesson harbour" : "পাঠের ঘাট"}</li>
            <li className={completed.includes("river-story") ? "done" : ""}><span>2</span>{language === "en" ? "Story bend" : "গল্পের বাঁক"}</li>
            <li className={completed.includes("match-game") ? "done" : ""}><span>3</span>{language === "en" ? "Culture meadow" : "সংস্কৃতির মাঠ"}</li>
          </ol>
          <div className="star-counter" aria-live="polite"><span aria-hidden="true">★</span><strong>{stars}</strong> {t.stars}</div>
        </section>

        <section className="section curriculum-section" id="curriculum">
          <div className="curriculum-heading">
            <div className="section-heading">
              <p className="section-number">{t.curriculumKicker}</p>
              <h2>{t.curriculumTitle}</h2>
              <p>{t.curriculumIntro}</p>
            </div>
            <div className="curriculum-progress-card" aria-label={`${completedSessions} of ${lessons.length * 6} guided sessions complete`}>
              <span className="curriculum-progress-number">{completedSessions}<small>/{lessons.length * 6}</small></span>
              <div>
                <strong>{language === "en" ? "Guided sessions complete" : "শেখার সেশন শেষ"}</strong>
                <div className="curriculum-progress-track"><span style={{ width: `${Math.round((completedSessions / (lessons.length * 6)) * 100)}%` }} /></div>
                <small>{completedLessons} {language === "en" ? "modules mastered" : "টি মডিউল আয়ত্ত"}</small>
              </div>
            </div>
          </div>

          <div className="level-guide">
            <div>
              <span aria-hidden="true">⌁</span>
              <p>{t.levelGuide}</p>
            </div>
            <button type="button" className="outline-button level-check-button" onClick={() => {
              playCue("tap");
              setModal({ type: "placement" });
            }}>
              {t.findLevel} <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="level-picker" role="group" aria-label={language === "en" ? "Choose a proficiency level" : "দক্ষতার ধাপ বেছে নাও"}>
            <button
              type="button"
              className={selectedLevel === "all" ? "level-tab active all-levels" : "level-tab all-levels"}
              aria-pressed={selectedLevel === "all"}
              onClick={() => { playCue("tap"); setSelectedLevel("all"); }}
            >
              <strong>{t.allLevels}</strong>
              <small>{lessons.length} {t.lessonCount}</small>
            </button>
            {levelBands.map((level) => (
              <button
                type="button"
                key={level.id}
                className={`level-tab ${level.tone} ${selectedLevel === level.id ? "active" : ""}`}
                aria-pressed={selectedLevel === level.id}
                onClick={() => { playCue("tap"); setSelectedLevel(level.id); }}
              >
                <span>{level.code}</span>
                <strong>{level.title}</strong>
                <small lang="bn">{level.titleBn}</small>
              </button>
            ))}
          </div>

          {selectedLevel !== "all" && (() => {
            const level = levelBands.find((item) => item.id === selectedLevel);
            if (!level) return null;
            return (
              <div className={`selected-level-banner ${level.tone}`}>
                <div className="selected-level-code">{level.code}</div>
                <div>
                  <p>{t.pathway} · {level.pathway}</p>
                  <h3>{level.title} <span lang="bn">· {level.titleBn}</span></h3>
                  <p>{level.descriptor}</p>
                </div>
                <span>{filteredLessons.length} {t.lessonCount}</span>
              </div>
            );
          })()}

          <div className="lesson-grid" id="lesson-list">
            {filteredLessons.map((lesson) => {
              const level = levelBands.find((item) => item.id === lesson.level)!;
              const isComplete = completed.includes(`lesson-${lesson.id}`);
              const lessonSessions = completed.filter((item) => item.startsWith(`session-${lesson.id}-`)).length;
              return (
                <article className={`lesson-card ${level.tone} ${isComplete ? "is-complete" : ""}`} key={lesson.id}>
                  <div className="lesson-card-meta">
                    <span className="lesson-level-badge">{level.code}</span>
                    <span>{language === "en" ? "Module" : "মডিউল"} {lesson.number}</span>
                    <span>6 × {lesson.duration}</span>
                  </div>
                  <h3>{lesson.title}</h3>
                  <p className="lesson-title-bn" lang="bn">{lesson.titleBn}</p>
                  <p className="lesson-summary">{lesson.summary}</p>
                  <div className="lesson-can-do">
                    <span aria-hidden="true">✓</span>
                    <p><strong>{t.canDo}</strong>{lesson.canDo}</p>
                  </div>
                  <ul className="lesson-focus-list">
                    {lesson.objectives.slice(0, 2).map((objective) => <li key={objective}>{objective}</li>)}
                  </ul>
                  <div className="lesson-session-preview" aria-label={`${lessonSessions} of 6 sessions complete`}>
                    <div>{[["listening", "L"], ["reading", "R"], ["speaking", "S"], ["writing", "W"], ["culture", "V"], ["mastery", "M"]].map(([skill, label]) => <span key={skill} className={completed.includes(`session-${lesson.id}-${skill}`) ? "complete" : ""}>{label}</span>)}</div>
                    <small>{lessonSessions}/6 {language === "en" ? "sessions" : "সেশন"}</small>
                  </div>
                  <div className="lesson-video-preview">
                    <span className="video-play-mark" aria-hidden="true">▶</span>
                    <p><small>YouTube · {lesson.video.duration}</small><strong>{lesson.video.title}</strong></p>
                  </div>
                  <button className={isComplete ? "lesson-open-button complete" : "lesson-open-button"} type="button" onClick={() => openLesson(lesson.id)}>
                    <span>{isComplete ? t.completedLesson : lessonSessions > 0 ? t.continueLesson : t.fullLesson}</span>
                    <span aria-hidden="true">{isComplete ? "★" : "→"}</span>
                  </button>
                </article>
              );
            })}
          </div>

          <div className="curriculum-source-note">
            <span aria-hidden="true">i</span>
            <p>{t.sourceNote} <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions" target="_blank" rel="noreferrer">{language === "en" ? "Read the CEFR level framework" : "CEFR ধাপের কাঠামো দেখো"}</a> · <a href="https://www.unesco.org/en/articles/international-mother-language-day-why-multilingual-education-key-intergenerational-learning" target="_blank" rel="noreferrer">{language === "en" ? "UNESCO on intergenerational language learning" : "প্রজন্মের ভাষা শেখা নিয়ে UNESCO"}</a></p>
          </div>
        </section>

        <section className="section words-section" id="words">
          <div className="section-heading">
            <p className="section-number">Stop 01 · শব্দের ঘাট</p>
            <h2>{t.wordsTitle}</h2>
            <p>{t.wordsIntro}</p>
          </div>
          <div className="word-grid">
            {words.map((word, index) => (
              <article className={`word-card ${word.tone}`} key={word.id}>
                <div className="word-card-top"><span>0{index + 1}</span><span className="word-symbol" aria-hidden="true">{word.emoji}</span></div>
                <p className="bangla-word" lang="bn">{word.bn}</p>
                <p className="pronunciation">/{word.transliteration}/</p>
                <p className="english-word">{word.en}</p>
                <div className="word-card-actions">
                  <button type="button" onClick={() => speak(word.bn, "bn-BD", `/audio/word-${word.id}-bn.ogg`)} aria-label={`${t.listen}: ${word.bn}`} disabled={!soundEnabled}>
                    <span aria-hidden="true">♪</span> {t.listen}
                  </button>
                  <button type="button" onClick={() => { stopNarration(); playCue("tap"); setModal({ type: "word", id: word.id }); }} aria-label={`${t.openWord}: ${word.bn}`}>
                    <span aria-hidden="true">＋</span>
                  </button>
                </div>
                {completed.includes(`word-${word.id}`) && <span className="earned-badge" aria-label="Completed">★</span>}
              </article>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image-wrap">
            <img src="/river-story.png" alt="Two children travelling by boat through a colourful Bangladeshi river village" />
            <div className="paper-label">এক দেশে… <small>Once upon a river…</small></div>
          </div>
          <div className="story-copy">
            <p className="section-number">Stop 02 · {t.storyKicker}</p>
            <h2>{t.storyTitle}</h2>
            <p>{t.storyIntro}</p>
            <ul className="story-features" aria-label="Story features">
              <li><span aria-hidden="true">♪</span>{language === "en" ? "Bangla audio" : "বাংলা অডিও"}</li>
              <li><span aria-hidden="true">Aa</span>{language === "en" ? "Two languages" : "দুই ভাষা"}</li>
              <li><span aria-hidden="true">★</span>{language === "en" ? "One quick quiz" : "একটি ছোট প্রশ্ন"}</li>
            </ul>
            <button className="primary-button coral" type="button" onClick={() => { stopNarration(); playCue("tap"); setStoryPage(0); setQuizResult(null); setModal({ type: "story" }); }}>
              {t.readStory} <span aria-hidden="true">→</span>
            </button>
            <p className="time-note">{t.storyTime}</p>
          </div>
        </section>

        <section className="section culture-section" id="culture">
          <div className="culture-heading-row">
            <div className="section-heading">
              <p className="section-number">Stop 03 · সংস্কৃতির পোস্টকার্ড</p>
              <h2>{t.cultureTitle}</h2>
              <p>{t.cultureIntro}</p>
            </div>
            <div className="passport-stamp" aria-hidden="true"><span>বাংলাদেশ</span><strong>EXPLORE</strong><small>21 · 02</small></div>
          </div>
          <div className="culture-layout">
            <div className="collage-wrap"><img src="/postcard-collage.png" alt="A cut-paper collage of a rickshaw, mangroves, a Bengal tiger and folk instruments" /></div>
            <div className="place-list">
              {places.map((place) => (
                <button className="place-card" type="button" key={place.id} onClick={() => { stopNarration(); playCue("tap"); setModal({ type: "place", id: place.id }); }}>
                  <span className="place-number">{place.number}</span>
                  <span><strong>{language === "en" ? place.title : place.titleBn}</strong><small>{language === "en" ? place.tag : place.tagBn}</small></span>
                  <span className="postcard-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="game-section" id="game">
          <div className="game-intro">
            <p className="section-number light">Stop 04 · {t.gameKicker}</p>
            <h2>{t.gameTitle}</h2>
            <p>{t.gameIntro}</p>
            <div className="game-progress" aria-label={`${matchedPairs.length} of 4 pairs matched`}>
              {[0, 1, 2, 3].map((step) => <span className={matchedPairs.length > step ? "filled" : ""} key={step} />)}
            </div>
          </div>
          <div className="match-board">
            <div className="match-column">
              <h3>{t.english}</h3>
              {pairs.map((pair) => (
                <button
                  type="button"
                  key={pair.id}
                  disabled={matchedPairs.includes(pair.id)}
                  className={`${selectedEnglish === pair.id ? "selected" : ""} ${matchedPairs.includes(pair.id) ? "matched" : ""}`}
                  onClick={() => { playCue("tap"); setSelectedEnglish(pair.id); setGameMessage(t.chooseEnglish); }}
                >
                  {pair.en}<span aria-hidden="true">{matchedPairs.includes(pair.id) ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <div className="match-river" aria-hidden="true"><span>〰</span><span>〰</span><span>〰</span><span>〰</span></div>
            <div className="match-column bangla-column">
              <h3>{t.bangla}</h3>
              {rightOrder.map((pair) => (
                <button
                  type="button"
                  key={pair.id}
                  disabled={matchedPairs.includes(pair.id)}
                  className={matchedPairs.includes(pair.id) ? "matched" : ""}
                  onClick={() => matchBangla(pair.id)}
                  lang="bn"
                >
                  {pair.bn}<span aria-hidden="true">{matchedPairs.includes(pair.id) ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <p className="game-message" aria-live="polite">{gameMessage}</p>
            <button className="reset-game" type="button" onClick={resetGame}>{t.reset}</button>
          </div>
        </section>

        <section className="safety-section">
          <div className="safety-art" aria-hidden="true"><span>☂</span><i>★</i><i>•</i></div>
          <div><p className="section-number">For families · পরিবারের জন্য</p><h2>{t.safeTitle}</h2><p>{t.safeText}</p></div>
          <button type="button" className="outline-button" onClick={() => setModal({ type: "grownups" })}>{t.grownups} <span aria-hidden="true">→</span></button>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">বা</span><span><strong>Bangla</strong><small>Adventures</small></span></a>
        <div><strong>{t.sourceTitle}</strong><p>{t.sourceText}</p></div>
        <div className="footer-links"><Link href="/explore">{language === "en" ? "Explore Bangladesh" : "বাংলাদেশ ঘুরে দেখো"}</Link><Link href="/alphabet">{language === "en" ? "The Bangla alphabet" : "বর্ণমালা"}</Link><Link href="/phrasebook">{language === "en" ? "First phrases" : "বাক্যের ঝুলি"}</Link><Link href="/numbers">{language === "en" ? "Numbers & counting" : "সংখ্যা ও গোনা"}</Link><Link href="/calendar">{language === "en" ? "Days & seasons" : "দিন ও ঋতু"}</Link><Link href="/grammar">{language === "en" ? "How Bangla works" : "ব্যাকরণ"}</Link><Link href="/stories">{language === "en" ? "Story time" : "গল্পের সময়"}</Link><Link href="/practice">{language === "en" ? "Word practice" : "শব্দ অনুশীলন"}</Link><Link href="/certificate">{language === "en" ? "Make a certificate" : "সনদ তৈরি"}</Link><a href="https://whc.unesco.org/en/statesparties/bd" target="_blank" rel="noreferrer">UNESCO places</a><a href="https://www.unesco.org/en/days/mother-language" target="_blank" rel="noreferrer">Mother Language Day</a><button type="button" onClick={() => setModal({ type: "grownups" })}>{t.privacy}</button></div>
      </footer>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { stopNarration(); setModal(null); } }}>
          <section
            className={`modal-card ${modal.type === "story" ? "story-modal" : ""} ${modal.type === "lesson" ? "lesson-modal" : ""} ${modal.type === "placement" ? "placement-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={modal.type === "word" ? "Word lesson" : modal.type === "story" ? "River story" : modal.type === "place" ? "Culture postcard" : modal.type === "lesson" ? "Full curriculum lesson" : modal.type === "placement" ? "Starting level guide" : "Grown-ups information"}
          >
            <button className="modal-close" type="button" onClick={() => { stopNarration(); setModal(null); }} aria-label={t.close}>×</button>

            {activeLesson && activeLevel && (
              <LessonExperience
                lesson={activeLesson}
                level={activeLevel}
                language={language}
                completed={completed}
                soundEnabled={soundEnabled}
                isSpeaking={isSpeaking}
                onSpeak={speak}
                onStopAudio={stopNarration}
                onAward={award}
                onCue={playCue}
                onClose={() => { stopNarration(); setModal(null); }}
              />
            )}

            {legacyExperienceEnabled() && activeLesson && activeLevel && (
              <div className="lesson-shell">
                <header className={`lesson-modal-hero ${activeLevel.tone}`}>
                  <div className="lesson-modal-meta">
                    <span>{activeLevel.code}</span>
                    <span>{language === "en" ? "Lesson" : "পাঠ"} {activeLesson.number} / {lessons.length}</span>
                    <span>◷ {activeLesson.duration}</span>
                  </div>
                  <div className="lesson-modal-title-row">
                    <div>
                      <p>{activeLevel.title} · <span lang="bn">{activeLevel.titleBn}</span></p>
                      <h2>{activeLesson.title}</h2>
                      <p className="lesson-modal-title-bn" lang="bn">{activeLesson.titleBn}</p>
                    </div>
                    {completed.includes(`lesson-${activeLesson.id}`) && <span className="lesson-complete-seal">★<small>{t.completedLesson}</small></span>}
                  </div>
                  <div className="lesson-step-progress" aria-hidden="true">
                    {lessonSteps.map((step, index) => (
                      <span key={step} className={lessonSteps.indexOf(lessonStep) >= index ? "filled" : ""} />
                    ))}
                  </div>
                </header>

                <nav className="lesson-step-tabs" aria-label={language === "en" ? "Lesson sections" : "পাঠের অংশ"}>
                  {lessonSteps.map((step, index) => (
                    <button
                      type="button"
                      key={step}
                      className={lessonStep === step ? "active" : ""}
                      aria-current={lessonStep === step ? "step" : undefined}
                      onClick={() => { stopNarration(); playCue("tap"); setLessonStep(step); }}
                    >
                      <span>{index + 1}</span>{lessonStepLabels[step]}
                    </button>
                  ))}
                </nav>

                <div className="lesson-pane">
                  {lessonStep === "start" && (
                    <div className="lesson-start-pane">
                      <p className="lesson-lead">{activeLesson.summary}</p>
                      <div className="lesson-can-do large">
                        <span aria-hidden="true">✓</span>
                        <p><strong>{t.canDo}</strong>{activeLesson.canDo}</p>
                      </div>
                      <div className="lesson-start-grid">
                        <section>
                          <p className="modal-kicker">{t.objectives}</p>
                          <ol className="objective-list">
                            {activeLesson.objectives.map((objective, index) => <li key={objective}><span>{index + 1}</span>{objective}</li>)}
                          </ol>
                        </section>
                        <section className="lesson-route-card">
                          <p className="modal-kicker">{language === "en" ? "Today’s route" : "আজকের পথ"}</p>
                          <ul>
                            <li><span>01</span><strong>{t.lessonLearn}</strong><small>{language === "en" ? "words, patterns and culture" : "শব্দ, বাক্য ও সংস্কৃতি"}</small></li>
                            <li><span>02</span><strong>{t.lessonPractice}</strong><small>{language === "en" ? "three guided activities" : "তিনটি ধাপে ধাপে কাজ"}</small></li>
                            <li><span>03</span><strong>{t.lessonWatch}</strong><small>{language === "en" ? "one video + a playlist" : "একটি ভিডিও + প্লেলিস্ট"}</small></li>
                            <li><span>04</span><strong>{t.lessonCheck}</strong><small>{language === "en" ? "two-question check" : "দুটি প্রশ্নের যাচাই"}</small></li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  )}

                  {lessonStep === "learn" && (
                    <div className="lesson-learn-pane">
                      <div className="lesson-pane-heading">
                        <p className="modal-kicker">{t.wordsPatterns}</p>
                        <h3>{language === "en" ? "Say it, see it, use it" : "বলো, দেখো, কাজে লাগাও"}</h3>
                      </div>
                      <div className="lesson-vocab-grid">
                        {activeLesson.vocabulary.map((word, index) => (
                          <article className="lesson-vocab-card" key={`${word.bn}-${word.en}`}>
                            <button type="button" className="vocab-listen" onClick={() => speak(word.bn, "bn-BD", `/audio/lesson-${activeLesson.id}-word-${index + 1}.ogg`)} aria-label={`${t.listen}: ${word.bn}`} disabled={!soundEnabled}><span aria-hidden="true">♪</span></button>
                            <strong lang="bn">{word.bn}</strong>
                            <span>/{word.transliteration}/</span>
                            <small>{word.en}</small>
                          </article>
                        ))}
                      </div>
                      <div className="pattern-grid">
                        {activeLesson.patterns.map((pattern, index) => (
                          <article className="pattern-card" key={pattern.bn}>
                            <span>{language === "en" ? "Pattern" : "বাক্য"} {index + 1}</span>
                            <button type="button" onClick={() => speak(pattern.bn, "bn-BD", `/audio/lesson-${activeLesson.id}-pattern-${index + 1}.ogg`)} disabled={!soundEnabled} aria-label={`${t.listen}: ${pattern.bn}`}>♪</button>
                            <strong lang="bn">{pattern.bn}</strong>
                            <em>/{pattern.transliteration}/</em>
                            <p>{pattern.en}</p>
                          </article>
                        ))}
                      </div>
                      <div className="lesson-pane-heading compact">
                        <p className="modal-kicker">{t.teachingNotes}</p>
                      </div>
                      <div className="teaching-grid">
                        {activeLesson.teaching.map((item) => <article key={item.title}><h4>{item.title}</h4><p>{item.body}</p></article>)}
                      </div>
                      <aside className="culture-note">
                        <span aria-hidden="true">✦</span>
                        <div>
                          <p className="modal-kicker">Culture window · সংস্কৃতির জানালা</p>
                          <h4>{activeLesson.culture.title}</h4>
                          <p>{activeLesson.culture.body}</p>
                          {activeLesson.culture.source && <a href={activeLesson.culture.source} target="_blank" rel="noreferrer">{activeLesson.culture.sourceLabel || "Read the source"} ↗</a>}
                        </div>
                      </aside>
                    </div>
                  )}

                  {lessonStep === "practice" && (
                    <div className="lesson-practice-pane">
                      <div className="lesson-pane-heading">
                        <p className="modal-kicker">{t.guidedPractice}</p>
                        <h3>{language === "en" ? "Move from rehearsal to a real message" : "অনুশীলন থেকে নিজের কথায় এগিয়ে যাও"}</h3>
                        <p>{language === "en" ? "Do these in order. Speaking, drawing, pointing or typing all count as a response." : "ক্রম ধরে করো। বলা, আঁকা, দেখানো বা টাইপ করা—সবই উত্তর হতে পারে।"}</p>
                      </div>
                      <div className="practice-grid">
                        {activeLesson.practice.map((activity, index) => (
                          <article key={activity.title}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <h4>{activity.title}</h4>
                            <p>{activity.instruction}</p>
                            <div className="practice-check"><span aria-hidden="true">□</span>{language === "en" ? "Try it before moving on" : "এগোনোর আগে চেষ্টা করো"}</div>
                          </article>
                        ))}
                      </div>
                      <aside className="family-mission">
                        <div aria-hidden="true">⌂</div>
                        <div><p className="modal-kicker">{t.familyMission}</p><h4>{language === "en" ? "Take Bangla beyond the screen" : "স্ক্রিনের বাইরেও বাংলা"}</h4><p>{activeLesson.familyMission}</p></div>
                      </aside>
                    </div>
                  )}

                  {lessonStep === "watch" && (
                    <div className="lesson-watch-pane">
                      <div className="lesson-pane-heading">
                        <p className="modal-kicker">{t.videoResource}</p>
                        <h3>{activeLesson.video.title}</h3>
                        <p>{activeLesson.video.reason}</p>
                      </div>
                      <div className="video-resource-meta">
                        <span>YouTube</span><strong>{activeLesson.video.channel}</strong><span>{activeLesson.video.duration}</span>
                        <a href={`https://www.youtube.com/watch?v=${activeLesson.video.id}`} target="_blank" rel="noreferrer">{language === "en" ? "Open on YouTube" : "YouTube-এ খুলি"} ↗</a>
                      </div>
                      {videoLoaded ? (
                        <div className="lesson-video-frame">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${activeLesson.video.id}?rel=0`}
                            title={activeLesson.video.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="video-gate">
                          <div className="video-gate-art" aria-hidden="true"><span>▶</span><i>নদী · গল্প · বাংলা</i></div>
                          <div>
                            <h4>{language === "en" ? "Ready when you are" : "তুমি তৈরি হলে শুরু"}</h4>
                            <p>{t.videoPrivacy}</p>
                            <button type="button" className="primary-button coral" onClick={() => { playCue("tap"); setVideoLoaded(true); }}>{t.loadVideo} <span aria-hidden="true">▶</span></button>
                          </div>
                        </div>
                      )}
                      <a className="playlist-card" href={`https://www.youtube.com/playlist?list=${activeLesson.playlist.id}`} target="_blank" rel="noreferrer">
                        <span className="playlist-icon" aria-hidden="true">☷</span>
                        <span><small>{t.openPlaylist}</small><strong>{activeLesson.playlist.title}</strong><em>{activeLesson.playlist.channel} · YouTube</em></span>
                        <span aria-hidden="true">↗</span>
                      </a>
                      <p className="external-resource-note">{language === "en" ? "External videos are selected for learning relevance, but YouTube may show its own recommendations. A grown-up should supervise younger learners." : "শেখার উপযোগিতা দেখে বাইরের ভিডিও বাছাই করা হয়েছে, তবে YouTube নিজস্ব পরামর্শ দেখাতে পারে। ছোটদের সঙ্গে বড় কেউ থাকুন।"}</p>
                    </div>
                  )}

                  {lessonStep === "check" && (
                    <div className="lesson-check-pane">
                      <div className="lesson-pane-heading">
                        <p className="modal-kicker">{t.knowledgeCheck}</p>
                        <h3>{language === "en" ? "Two quick questions, then your stars" : "দুটি ছোট প্রশ্ন, তারপর তোমার তারা"}</h3>
                        <p>{language === "en" ? "There is no timer. Change an answer and try again whenever you need." : "কোনো সময়সীমা নেই। দরকার হলে উত্তর বদলে আবার চেষ্টা করো।"}</p>
                      </div>
                      <div className="lesson-quiz-list">
                        {activeLesson.quiz.map((question, questionIndex) => {
                          const selectedAnswer = lessonQuizAnswers[questionIndex];
                          const isCorrect = selectedAnswer === question.answer;
                          return (
                            <fieldset className="lesson-quiz-question" key={question.question}>
                              <legend><span>{questionIndex + 1}</span>{question.question}</legend>
                              <div className="lesson-quiz-options">
                                {question.options.map((option, optionIndex) => (
                                  <button
                                    type="button"
                                    key={option}
                                    className={`${selectedAnswer === optionIndex ? "selected" : ""} ${lessonQuizSubmitted && selectedAnswer === optionIndex ? (isCorrect ? "correct" : "wrong") : ""}`}
                                    aria-pressed={selectedAnswer === optionIndex}
                                    onClick={() => {
                                      playCue("tap");
                                      setLessonQuizAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
                                      setLessonQuizSubmitted(false);
                                    }}
                                  >
                                    <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                                  </button>
                                ))}
                              </div>
                              {lessonQuizSubmitted && selectedAnswer !== undefined && <p className={isCorrect ? "answer-explanation correct" : "answer-explanation wrong"}><strong>{isCorrect ? "✓" : "↻"}</strong>{question.explanation}</p>}
                            </fieldset>
                          );
                        })}
                      </div>
                      {lessonQuizSubmitted && (
                        <p className={`lesson-quiz-message ${activeLesson.quiz.every((question, index) => lessonQuizAnswers[index] === question.answer) ? "success" : "retry"}`} role="status">
                          {activeLesson.quiz.some((_, index) => lessonQuizAnswers[index] === undefined)
                            ? t.chooseEveryAnswer
                            : activeLesson.quiz.every((question, index) => lessonQuizAnswers[index] === question.answer)
                              ? t.allCorrect
                              : t.tryLessonCheck}
                        </p>
                      )}
                      <button className="primary-button lesson-check-button" type="button" onClick={submitLessonQuiz}>{t.checkAnswers} <span aria-hidden="true">✓</span></button>
                    </div>
                  )}
                </div>

                <div className="lesson-modal-footer">
                  <button type="button" onClick={() => moveLessonStep(-1)} disabled={lessonStep === "start"}>← {t.previousStep}</button>
                  <span>{lessonSteps.indexOf(lessonStep) + 1} / {lessonSteps.length}</span>
                  {lessonStep === "check" ? (
                    <button className="primary-button" type="button" onClick={() => { stopNarration(); setModal(null); }}>{t.close} <span aria-hidden="true">×</span></button>
                  ) : (
                    <button className="primary-button" type="button" onClick={() => moveLessonStep(1)}>{t.nextStep} <span aria-hidden="true">→</span></button>
                  )}
                </div>
              </div>
            )}

            {modal.type === "placement" && (
              <FourSkillDiagnostic
                soundEnabled={soundEnabled}
                onSpeak={speak}
                onCue={playCue}
                onClose={() => setModal(null)}
                onChoose={(level) => {
                  setSelectedLevel(level);
                  setModal(null);
                  window.setTimeout(() => document.querySelector("#lesson-list")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
                }}
              />
            )}

            {legacyExperienceEnabled() && modal.type === "placement" && (
              <div className="placement-content">
                <p className="modal-kicker">Quick level guide · শুরুর ধাপ</p>
                <h2>{t.placementTitle}</h2>
                <p className="placement-lead">{t.placementIntro}</p>
                <div className="placement-statements">
                  {placementStatements.map((statement, index) => (
                    <fieldset key={statement.en}>
                      <legend><span>{index + 1}</span>{language === "en" ? statement.en : statement.bn}</legend>
                      <div>
                        <button
                          type="button"
                          className={placementAnswers[index] === true ? "selected yes" : ""}
                          aria-pressed={placementAnswers[index] === true}
                          onClick={() => { playCue("tap"); setPlacementAnswers((current) => current.map((answer, itemIndex) => itemIndex === index ? true : answer)); setPlacementSubmitted(false); }}
                        >✓ {t.yesUsually}</button>
                        <button
                          type="button"
                          className={placementAnswers[index] === false ? "selected no" : ""}
                          aria-pressed={placementAnswers[index] === false}
                          onClick={() => { playCue("tap"); setPlacementAnswers((current) => current.map((answer, itemIndex) => itemIndex === index ? false : answer)); setPlacementSubmitted(false); }}
                        >○ {t.notYet}</button>
                      </div>
                    </fieldset>
                  ))}
                </div>
                {placementSubmitted && placementAnswers.some((answer) => answer === null) && <p className="placement-error" role="alert">{t.placementIncomplete}</p>}
                {placementSubmitted && placementAnswers.every((answer) => answer !== null) && (
                  <div className={`placement-result ${placementSuggestion.tone}`}>
                    <div><small>{t.suggestedLevel}</small><strong>{placementSuggestion.code}</strong></div>
                    <div><h3>{placementSuggestion.title} <span lang="bn">· {placementSuggestion.titleBn}</span></h3><p>{placementSuggestion.descriptor}</p><em>{placementSuggestion.pathway}</em></div>
                  </div>
                )}
                <p className="placement-note">{t.levelNote}</p>
                <div className="placement-actions">
                  <button type="button" className="outline-button" onClick={() => setModal(null)}>{t.close}</button>
                  {placementSubmitted && placementAnswers.every((answer) => answer !== null)
                    ? <button type="button" className="primary-button" onClick={choosePlacementLevel}>{t.startHere} <span aria-hidden="true">→</span></button>
                    : <button type="button" className="primary-button" onClick={submitPlacement}>{t.seeSuggestion} <span aria-hidden="true">→</span></button>}
                </div>
              </div>
            )}

            {activeWord && (
              <div className="word-modal-content">
                <p className="modal-kicker">Bangla word card · বাংলা শব্দ</p>
                <div className={`modal-word-orb ${activeWord.tone}`}><span lang="bn">{activeWord.bn}</span><small>/{activeWord.transliteration}/</small></div>
                <h2>{activeWord.en}</h2>
                <div className="example-box"><p lang="bn">{activeWord.exampleBn}</p><p>{activeWord.exampleEn}</p></div>
                <div className="modal-actions">
                  <button className={`sound-button compact ${isSpeaking ? "is-speaking" : ""}`} type="button" onClick={() => speak(`${activeWord.bn}। ${activeWord.exampleBn}`, "bn-BD", `/audio/word-${activeWord.id}-example-bn.ogg`)} disabled={!soundEnabled}><span className="sound-icon" aria-hidden="true">♪</span>{t.sayIt}</button>
                  <button className="primary-button" type="button" onClick={() => award(`word-${activeWord.id}`)} disabled={completed.includes(`word-${activeWord.id}`)}>{completed.includes(`word-${activeWord.id}`) ? t.practised : t.practice}</button>
                </div>
              </div>
            )}

            {modal.type === "story" && (
              <div className="story-reader">
                <div className="story-reader-art"><img src="/river-story.png" alt="Maya and Rafi travelling on the river" /><span>{storyPage + 1} / {storyPages.length + 1}</span></div>
                <div className="story-reader-copy">
                  <p className="modal-kicker">{t.storyKicker}</p>
                  <h2>{t.storyTitle}</h2>
                  {storyPage < storyPages.length ? (
                    <>
                      <p className="story-en">{storyPages[storyPage].en}</p>
                      <p className="story-bn" lang="bn">{storyPages[storyPage].bn}</p>
                      <div className="narration-controls" aria-label={language === "en" ? "Story narration" : "গল্প শোনার নিয়ন্ত্রণ"}>
                        <button className={`listen-line ${isSpeaking ? "is-speaking" : ""}`} type="button" onClick={() => speak(storyPages[storyPage].en, "en-AU", `/audio/story-${storyPage + 1}-en.ogg`)} disabled={!soundEnabled}><span aria-hidden="true">♪</span> {t.listenEnglish}</button>
                        <button className={`listen-line ${isSpeaking ? "is-speaking" : ""}`} type="button" onClick={() => speak(storyPages[storyPage].bn, "bn-BD", `/audio/story-${storyPage + 1}-bn.ogg`)} disabled={!soundEnabled}><span aria-hidden="true">♪</span> {t.listenBangla}</button>
                      </div>
                      <span className="story-word-chip">{storyPages[storyPage].word}</span>
                    </>
                  ) : (
                    <div className="story-quiz">
                      <p className="section-number">{t.quiz}</p>
                      <h3>{t.quizQuestion}</h3>
                      <div className="quiz-options">
                        <button type="button" onClick={() => answerQuiz("boat")}>নৌকা <small>boat</small></button>
                        <button type="button" onClick={() => answerQuiz("tiger")}>বাঘ <small>tiger</small></button>
                        <button type="button" onClick={() => answerQuiz("flower")}>ফুল <small>flower</small></button>
                      </div>
                      {quizResult && <p className={`quiz-result ${quizResult}`} aria-live="polite">{quizResult === "correct" ? t.correct : t.notQuite}</p>}
                    </div>
                  )}
                  <div className="reader-nav">
                    <button type="button" onClick={() => { stopNarration(); playCue("tap"); setStoryPage((page) => Math.max(0, page - 1)); }} disabled={storyPage === 0}>← {t.back}</button>
                    {storyPage < storyPages.length ? <button className="primary-button" type="button" onClick={() => { stopNarration(); playCue("tap"); setStoryPage((page) => page + 1); }}>{t.next} →</button> : <button className="primary-button" type="button" onClick={() => { stopNarration(); setModal(null); }}>{t.finish}</button>}
                  </div>
                </div>
              </div>
            )}

            {activePlace && (
              <div className="place-modal-content">
                <p className="modal-kicker">Passport stop {activePlace.number}</p>
                <span className="place-modal-stamp" aria-hidden="true">বাংলাদেশ<br /><strong>VISITED</strong></span>
                <h2>{language === "en" ? activePlace.title : activePlace.titleBn}</h2>
                <p className="place-tag">{language === "en" ? activePlace.tag : activePlace.tagBn}</p>
                <p className="place-fact">{language === "en" ? activePlace.fact : activePlace.factBn}</p>
                <button
                  className={`listen-line place-listen ${isSpeaking ? "is-speaking" : ""}`}
                  type="button"
                  disabled={!soundEnabled}
                  onClick={() => speak(
                    language === "en" ? `${activePlace.title}. ${activePlace.fact}` : `${activePlace.titleBn}। ${activePlace.factBn}`,
                    language === "en" ? "en-AU" : "bn-BD",
                    `/audio/place-${activePlace.id}-${language}.ogg`,
                  )}
                >
                  <span aria-hidden="true">♪</span> {language === "en" ? t.listenEnglish : t.listenBangla}
                </button>
                <div className="wonder-prompt"><span aria-hidden="true">✦</span><p>{language === "en" ? activePlace.prompt : activePlace.promptBn}</p></div>
                <button className="primary-button" type="button" onClick={() => { award(`place-${activePlace.id}`); stopNarration(); setModal(null); }}>{completed.includes(`place-${activePlace.id}`) ? t.close : language === "en" ? "Collect passport stamp" : "পাসপোর্টের ছাপ নিই"}</button>
              </div>
            )}

            {modal.type === "grownups" && (
              <div className="grownups-content">
                <p className="modal-kicker">Parents, carers & educators</p>
                <h2>{t.progress}</h2>
                <div className="progress-card">
                  <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
                  <div><strong>{stars} ★</strong><p>{completed.length} {t.activities}</p></div>
                </div>
                <div className="privacy-card"><span aria-hidden="true">☂</span><div><h3>{t.privacy}</h3><p>{cloudLearner ? `${cloudLearner.displayName}'s completed session IDs are synced to the signed-in grown-up profile. Optional microphone rehearsal is never uploaded; YouTube still connects only after an explicit load.` : t.privacyText}</p></div></div>
                <ul className="grownups-list">
                  <li>{language === "en" ? "Eighteen modules contain 108 guided listening, reading, speaking, writing, culture and mastery sessions; level is based on demonstrated language use, not age." : "১৮টি মডিউলে শোনা, পড়া, বলা, লেখা, সংস্কৃতি ও যাচাইয়ের ১০৮টি সেশন আছে; ধাপ বয়স নয়, ভাষা ব্যবহারের দক্ষতাভিত্তিক।"}</li>
                  <li>{language === "en" ? "The four-skill starting guide reports a profile—not a certificate—and directs weaker skills to extra review." : "চার দক্ষতার শুরুর নির্দেশিকা একটি প্রোফাইল দেয়—সনদ নয়—এবং যেসব দক্ষতায় অনুশীলন দরকার সেখানে ফিরিয়ে দেয়।"}</li>
                  <li>{language === "en" ? "Bundled audio is replayable without scores or timers. Optional self-recording stays in the tab; third-party YouTube is click-to-load." : "অডিও স্কোর বা সময়ের চাপ ছাড়া বারবার শোনা যায়। নিজের ঐচ্ছিক রেকর্ডিং ট্যাবেই থাকে; YouTube কেবল ক্লিক করলে লোড হয়।"}</li>
                  <li>{language === "en" ? "Independent Bangla, cultural, child-development, accessibility, video and legal approval remains visible in the Content Studio." : "স্বাধীন বাংলা, সংস্কৃতি, শিশু-শিক্ষা, অ্যাক্সেসিবিলিটি, ভিডিও ও আইনি অনুমোদনের অবস্থা Content Studio-তে দেখা যায়।"}</li>
                </ul>
                <div className="grownup-tool-links"><a href="/family">Open learner dashboard →</a><a href="/studio">Open Content Studio →</a><Link href="/worksheets">Print lesson worksheets →</Link><Link href="/resources">More ways to learn Bangla →</Link><a href="/safety">Read safety & accessibility →</a></div>
                <button className="text-button danger" type="button" onClick={resetProgress}>{t.resetProgress}</button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
