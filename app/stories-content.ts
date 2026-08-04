import type { Bilingual } from "./explore-content";

/**
 * Story library: two gentle retellings of classic Bengali folk tales (the
 * tales are traditional; every word of these retellings is original to
 * Bangla Adventures) and one original story about diaspora life. Softened
 * endings keep them kind for young children. Bangla-language review gate
 * applies before public launch.
 */

export type StoryPage = {
  bn: string;
  en: string;
};

export type Story = {
  id: string;
  emoji: string;
  title: Bilingual;
  kind: Bilingual; // e.g. folk tale / our story
  pages: StoryPage[];
  check: {
    prompt: Bilingual;
    options: Bilingual[];
    answer: number;
  };
  moral: Bilingual;
};

export const stories: Story[] = [
  {
    id: "tuntuni",
    emoji: "🐦",
    title: { en: "The Tailorbird and the Cat", bn: "টুনটুনি ও বিড়াল" },
    kind: { en: "A Bengali folk tale, retold", bn: "বাংলার লোককথা, নতুন করে বলা" },
    pages: [
      {
        bn: "এক বেগুন গাছে ছোট্ট টুনটুনি পাখির বাসা। উঠোনের বিড়াল রোজ এসে বলে, “টুনটুনি, তুমি কেমন আছো?” টুনটুনি ভয়ে ভয়ে বলে, “ভালো আছি, রানি মা!”",
        en: "In a little brinjal plant lived a tiny tailorbird. Every day the courtyard cat came by and asked, 'Tailorbird, how are you?' The tailorbird would answer nervously, 'I am well, Queen Mother!'",
      },
      {
        bn: "বিড়াল খুশি হয়ে গর্ব করে ঘুরে বেড়ায়। কিন্তু টুনটুনির ছানারা বড় হচ্ছিল। একদিন ছানাদের ডানা শক্ত হলো। টুনটুনি বলল, “আজ আর ভয় নেই!”",
        en: "The cat would purr with pride and strut away. But the tailorbird's chicks were growing. One day their wings grew strong. The tailorbird said, 'Today, no more fear!'",
      },
      {
        bn: "পরদিন বিড়াল এসে বলল, “টুনটুনি, কেমন আছো?” টুনটুনি হেসে বলল, “ভালো আছি, তবে আর তোমাকে রানি মা ডাকব না!” বলেই ছানাদের নিয়ে ফুড়ুৎ করে উড়ে গেল। বিড়াল অবাক হয়ে দেখল — বুদ্ধি থাকলে ছোট্ট পাখিও নিরাপদ থাকে।",
        en: "The next day the cat came and asked, 'Tailorbird, how are you?' The tailorbird laughed: 'I am well — but I shall not call you Queen Mother any more!' And whoosh — off she flew with her chicks. The cat blinked in surprise: with a little cleverness, even the smallest bird stays safe.",
      },
    ],
    check: {
      prompt: { en: "Why did the tailorbird call the cat 'Queen Mother' at first?", bn: "টুনটুনি প্রথমে বিড়ালকে ‘রানি মা’ ডাকত কেন?" },
      options: [
        { en: "The cat was really a queen", bn: "বিড়াল সত্যিই রানি ছিল" },
        { en: "To stay safe until her chicks could fly", bn: "ছানারা উড়তে শেখা পর্যন্ত নিরাপদ থাকতে" },
        { en: "She forgot the cat's name", bn: "বিড়ালের নাম ভুলে গিয়েছিল" },
      ],
      answer: 1,
    },
    moral: { en: "Quick thinking protects the small.", bn: "বুদ্ধিই ছোটদের রক্ষা করে।" },
  },
  {
    id: "fox-crocodile",
    emoji: "🦊",
    title: { en: "The Fox and the Crocodile's Farm", bn: "শিয়াল ও কুমিরের চাষ" },
    kind: { en: "A Bengali folk tale, retold", bn: "বাংলার লোককথা, নতুন করে বলা" },
    pages: [
      {
        bn: "শিয়াল আর কুমির মিলে চাষ করবে ঠিক করল। প্রথম বছর তারা আলু লাগাল। শিয়াল বলল, “বন্ধু, তুমি উপরের ভাগ নাও, আমি নিচের ভাগ নেব।”",
        en: "A fox and a crocodile decided to farm together. The first year they planted potatoes. The fox said, 'Friend, you take the top half of the plants, I will take the bottom half.'",
      },
      {
        bn: "ফসল উঠল। উপরে শুধু পাতা, নিচে গোল গোল আলু! কুমির পাতার বোঝা নিয়ে ভাবল, “পরের বার নিচের ভাগ নেব।” পরের বছর তারা ধান লাগাল। এবার কুমির নিল নিচের ভাগ — আর পেল শুধু শিকড়!",
        en: "Harvest came. On top, only leaves; underneath, round fat potatoes! Carrying his bundle of leaves, the crocodile thought, 'Next time I'll take the bottom.' The next year they planted rice. The crocodile took the bottom half — and got only roots!",
      },
      {
        bn: "কুমির বুঝল, শিয়াল গাছ চেনে, সে চেনে না। সে হেসে বলল, “বন্ধু, আমাকে গাছের কথা শেখাও!” শিয়াল শেখাল, আর পরের বছর দুজনে ভাগ করল সমান সমান। সেই থেকে তারা সত্যিকারের বন্ধু।",
        en: "The crocodile realised the fox knew plants and he did not. He laughed: 'Friend, teach me about plants!' The fox taught him, and the next year they shared everything equally. From then on, they were true friends.",
      },
    ],
    check: {
      prompt: { en: "What did the crocodile decide to do at the end?", bn: "শেষে কুমির কী করল?" },
      options: [
        { en: "Stop farming forever", bn: "চিরদিনের জন্য চাষ ছেড়ে দিল" },
        { en: "Learn about plants and share equally", bn: "গাছ চিনতে শিখল আর সমান ভাগ করল" },
        { en: "Take both halves next year", bn: "পরের বছর দুই ভাগই নিল" },
      ],
      answer: 1,
    },
    moral: { en: "Learning beats losing — ask and grow.", bn: "না জানলে শেখো — জিজ্ঞেস করলেই এগোনো যায়।" },
  },
  {
    id: "mayas-friend",
    emoji: "🌏",
    title: { en: "Maya's Two Words", bn: "মায়ার দুটি শব্দ" },
    kind: { en: "Our own story", bn: "আমাদের নিজের গল্প" },
    pages: [
      {
        bn: "নতুন দেশে মায়ার নতুন স্কুল। সবাই ইংরেজিতে কথা বলে। টিফিনের সময় মায়া চুপ করে বসে ভাবে, “নানুবাড়ির আমগাছটা এখন কত বড় হলো?”",
        en: "In the new country, Maya had a new school. Everyone spoke English. At lunchtime Maya sat quietly and wondered, 'How tall has the mango tree at grandma's house grown by now?'",
      },
      {
        bn: "পাশে এসে বসল সোফি। মায়ার টিফিনবাক্স দেখে বলল, “ওটা কী?” মায়া বলল, “পিঠা। আমার মা বানিয়েছে।” সোফি এক কামড় খেয়ে চোখ বড় করে বলল, “Wow!” মায়া হেসে শেখাল, “বাংলায় বলে — খুব মজা!”",
        en: "Sophie came and sat beside her. Looking at Maya's lunchbox she asked, 'What is that?' 'Pitha,' said Maya. 'My mum made it.' Sophie took one bite, her eyes went wide: 'Wow!' Maya laughed and taught her: 'In Bangla we say — khub moja!'",
      },
      {
        bn: "পরদিন সোফি দৌড়ে এসে বলল, “খুব মজা! ধন্যবাদ!” — দুটি বাংলা শব্দ, একদম ঠিকঠাক। মায়ার মনে হলো, নানুবাড়ির আমগাছটা যেন এই স্কুলের মাঠেও একটু ছায়া দিল। দুই ভাষা জানা মানে দুটি বাড়ি থাকা।",
        en: "The next day Sophie ran up and said, 'Khub moja! Dhonnobad!' — two Bangla words, perfectly said. Maya felt as if grandma's mango tree had stretched a little shade over this playground too. Knowing two languages means having two homes.",
      },
    ],
    check: {
      prompt: { en: "What did Maya teach Sophie?", bn: "মায়া সোফিকে কী শেখাল?" },
      options: [
        { en: "How to climb a mango tree", bn: "আমগাছে চড়া" },
        { en: "Two Bangla words", bn: "দুটি বাংলা শব্দ" },
        { en: "How to make pitha", bn: "পিঠা বানানো" },
      ],
      answer: 1,
    },
    moral: { en: "Sharing your language makes friends — and two homes.", bn: "নিজের ভাষা ভাগ করলেই বন্ধু হয় — আর হয় দুটি বাড়ি।" },
  },
];
