import type { Bilingual } from "./explore-content";

/**
 * Original first-phrases content for young heritage learners, written for
 * this platform in Bangladesh-standard Bangla (পানি, not জল) to match the
 * curriculum. Both common greetings are included so every family sees
 * themselves. Like all language content, this goes through the Content
 * Studio's Bangla-language review gate before public launch.
 */

export type Phrase = {
  bn: string;
  transliteration: string;
  en: string;
  note?: Bilingual;
};

export type PhraseCategory = {
  id: string;
  icon: string;
  title: Bilingual;
  phrases: Phrase[];
};

export const phraseCategories: PhraseCategory[] = [
  {
    id: "greetings",
    icon: "👋",
    title: { en: "Saying hello", bn: "শুভেচ্ছা জানানো" },
    phrases: [
      { bn: "আসসালামু আলাইকুম", transliteration: "assalamu alaikum", en: "peace be upon you", note: { en: "A common greeting in many Bangladeshi families.", bn: "অনেক বাংলাদেশি পরিবারের প্রচলিত অভিবাদন।" } },
      { bn: "নমস্কার", transliteration: "nomoshkar", en: "greetings", note: { en: "Another common greeting; both are good to know.", bn: "আরেকটি প্রচলিত অভিবাদন; দুটোই জানা ভালো।" } },
      { bn: "কেমন আছো?", transliteration: "kêmon achho?", en: "how are you?" },
      { bn: "ভালো আছি", transliteration: "bhalo achhi", en: "I am well" },
      { bn: "তোমার নাম কী?", transliteration: "tomar nam ki?", en: "what is your name?" },
      { bn: "আমার নাম মায়া", transliteration: "amar nam Maya", en: "my name is Maya" },
      { bn: "শুভ সকাল", transliteration: "shubho shokal", en: "good morning" },
      { bn: "শুভ রাত্রি", transliteration: "shubho ratri", en: "good night" },
      { bn: "দেখা হবে!", transliteration: "dêkha hobe!", en: "see you!" },
    ],
  },
  {
    id: "politeness",
    icon: "🌸",
    title: { en: "Kind words", bn: "ভদ্রতার কথা" },
    phrases: [
      { bn: "ধন্যবাদ", transliteration: "dhonnobad", en: "thank you" },
      { bn: "দয়া করে", transliteration: "doya kore", en: "please" },
      { bn: "দুঃখিত", transliteration: "dukkhito", en: "sorry" },
      { bn: "ঠিক আছে", transliteration: "thik achhe", en: "okay / all right" },
      { bn: "হ্যাঁ", transliteration: "hyã", en: "yes" },
      { bn: "না", transliteration: "na", en: "no" },
      { bn: "স্বাগতম", transliteration: "shagotom", en: "welcome" },
    ],
  },
  {
    id: "family",
    icon: "🏠",
    title: { en: "Family love", bn: "পরিবারের ভালোবাসা" },
    phrases: [
      { bn: "আমি তোমাকে ভালোবাসি", transliteration: "ami tomake bhalobashi", en: "I love you" },
      { bn: "এটা আমার পরিবার", transliteration: "eta amar poribar", en: "this is my family" },
      { bn: "মা, দেখো!", transliteration: "ma, dêkho!", en: "mum, look!" },
      { bn: "বাবা, শোনো", transliteration: "baba, shono", en: "dad, listen" },
      { bn: "আমরা একসাথে খাই", transliteration: "amra êkshathe khai", en: "we eat together" },
      { bn: "নানুবাড়ি যাব", transliteration: "nanubari jabo", en: "we will visit grandma's house" },
    ],
  },
  {
    id: "feelings",
    icon: "💛",
    title: { en: "How I feel", bn: "আমার অনুভূতি" },
    phrases: [
      { bn: "আমি খুশি", transliteration: "ami khushi", en: "I am happy" },
      { bn: "আমার মন খারাপ", transliteration: "amar mon kharap", en: "I feel sad" },
      { bn: "আমি ক্লান্ত", transliteration: "ami klanto", en: "I am tired" },
      { bn: "দারুণ!", transliteration: "darun!", en: "great!" },
      { bn: "আমার ভালো লাগছে", transliteration: "amar bhalo lagchhe", en: "I like this" },
      { bn: "চমৎকার!", transliteration: "chomotkar!", en: "wonderful!" },
    ],
  },
  {
    id: "play",
    icon: "🪁",
    title: { en: "Learning & playing", bn: "শেখা ও খেলা" },
    phrases: [
      { bn: "চলো খেলি", transliteration: "cholo kheli", en: "let's play" },
      { bn: "এটা কী?", transliteration: "eta ki?", en: "what is this?" },
      { bn: "আমি জানি না", transliteration: "ami jani na", en: "I don't know" },
      { bn: "আবার বলো", transliteration: "abar bolo", en: "say it again" },
      { bn: "আস্তে বলো", transliteration: "aste bolo", en: "speak slowly" },
      { bn: "আমি চেষ্টা করব", transliteration: "ami cheshta korbo", en: "I will try" },
      { bn: "সাহায্য করো", transliteration: "shahajjo koro", en: "help me" },
    ],
  },
  {
    id: "food",
    icon: "🍚",
    title: { en: "At the table", bn: "খাবার টেবিলে" },
    phrases: [
      { bn: "আমার খিদে পেয়েছে", transliteration: "amar khide peyechhe", en: "I am hungry" },
      { bn: "পানি দাও, দয়া করে", transliteration: "pani dao, doya kore", en: "water please" },
      { bn: "খুব মজা!", transliteration: "khub moja!", en: "so tasty!" },
      { bn: "আর একটু দাও", transliteration: "ar ektu dao", en: "a little more, please" },
      { bn: "আমার পেট ভরে গেছে", transliteration: "amar pet bhore gechhe", en: "I am full" },
      { bn: "খাবার তৈরি?", transliteration: "khabar toiri?", en: "is the food ready?" },
    ],
  },
];
