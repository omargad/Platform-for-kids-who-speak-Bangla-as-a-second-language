// Classroom topics — the core of the platform after the 10 Aug 2026 client
// meeting: kid-friendly readings about Bangladesh's culture, history and
// literature, each traced back to the NCTB government textbook that covers it.
// Text here is written originally for heritage learners (English-first with a
// Bangla translation); it summarises publicly known facts and never copies
// textbook prose. Stories and poems are only referenced, never altered.

export type Bilingual = { en: string; bn: string };

export type TopicTheme = {
  id: string;
  icon: string;
  title: Bilingual;
  note: Bilingual;
};

export type TopicSection = {
  heading: Bilingual;
  body: Bilingual;
};

export type TopicQuizQuestion = {
  question: Bilingual;
  options: Bilingual[];
  answer: number;
};

export type Topic = {
  id: string;
  theme: string;
  emoji: string;
  title: Bilingual;
  tagline: Bilingual;
  minutes: number;
  sections: TopicSection[];
  funFacts: Bilingual[];
  quiz: TopicQuizQuestion[];
  // Which NCTB textbook(s) cover this topic — shown as the trusted source.
  sources: Array<{ bookId: string; note: Bilingual }>;
};

export const topicThemes: TopicTheme[] = [
  {
    id: "history",
    icon: "🏛️",
    title: { en: "History & the national story", bn: "ইতিহাস ও জাতীয় গল্প" },
    note: {
      en: "How Bangladesh became Bangladesh — told gently, the way the textbooks tell it.",
      bn: "বাংলাদেশ কীভাবে বাংলাদেশ হলো — পাঠ্যবইয়ের মতো করে, নরমভাবে বলা।",
    },
  },
  {
    id: "culture",
    icon: "🎉",
    title: { en: "Culture & celebrations", bn: "সংস্কৃতি ও উদযাপন" },
    note: {
      en: "Festivals, food, rivers and everyday life that make Bangladesh feel like Bangladesh.",
      bn: "উৎসব, খাবার, নদী আর দৈনন্দিন জীবন — যা বাংলাদেশকে বাংলাদেশ করে তোলে।",
    },
  },
  {
    id: "literature",
    icon: "📚",
    title: { en: "Literature & arts", bn: "সাহিত্য ও শিল্পকলা" },
    note: {
      en: "The poets, tales and crafts every Bengali child grows up hearing about.",
      bn: "যে কবি, গল্প আর কারুশিল্পের কথা শুনে প্রতিটি বাঙালি শিশু বড় হয়।",
    },
  },
];

export const topics: Topic[] = [
  // ---------------------------------------------------------------- history
  {
    id: "amar-ekushey",
    theme: "history",
    emoji: "🌸",
    title: { en: "Ekushey — the day a language was defended", bn: "একুশে — ভাষা রক্ষার দিন" },
    tagline: {
      en: "Why 21 February is International Mother Language Day for the whole world.",
      bn: "কেন ২১ ফেব্রুয়ারি সারা পৃথিবীর আন্তর্জাতিক মাতৃভাষা দিবস।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "A language worth standing up for", bn: "যে ভাষার জন্য দাঁড়াতে হয়" },
        body: {
          en: "In 1952, Bangladesh was called East Pakistan, and the government far away decided that Urdu would be the only state language — even though most people here spoke Bangla. Students in Dhaka said no. On 21 February 1952 they marched for the right to speak their mother language, and some of them — remembered as the language martyrs — lost their lives.",
          bn: "১৯৫২ সালে বাংলাদেশের নাম ছিল পূর্ব পাকিস্তান। দূরের সরকার ঠিক করল, রাষ্ট্রভাষা হবে শুধু উর্দু — যদিও এখানকার বেশির ভাগ মানুষ বাংলায় কথা বলত। ঢাকার ছাত্ররা বলল, না। ১৯৫২ সালের ২১ ফেব্রুয়ারি তারা মাতৃভাষার অধিকারের জন্য মিছিল করল, আর কয়েকজন — যাঁদের আমরা ভাষা শহিদ বলি — প্রাণ দিলেন।",
        },
      },
      {
        heading: { en: "From Dhaka to the whole world", bn: "ঢাকা থেকে সারা বিশ্বে" },
        body: {
          en: "Every year, people walk barefoot at dawn to the Shaheed Minar monument with flowers, singing 'Amar bhaiyer rokte rangano Ekushey February'. In 1999, UNESCO made 21 February International Mother Language Day, so now the whole world honours every mother language on Bangladesh's special day.",
          bn: "প্রতি বছর ভোরে মানুষ খালি পায়ে ফুল হাতে শহিদ মিনারে যায়, গায় ‘আমার ভাইয়ের রক্তে রাঙানো একুশে ফেব্রুয়ারি’। ১৯৯৯ সালে ইউনেসকো ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে — এখন বাংলাদেশের এই বিশেষ দিনে সারা পৃথিবী নিজের নিজের মাতৃভাষাকে সম্মান জানায়।",
        },
      },
    ],
    funFacts: [
      {
        en: "The Shaheed Minar means 'Martyr Monument' — there are little Shaheed Minars in towns all over Bangladesh, and even in other countries.",
        bn: "শহিদ মিনার মানে ‘শহিদদের স্মৃতিস্তম্ভ’ — বাংলাদেশের শহরে শহরে, এমনকি বিদেশেও ছোট ছোট শহিদ মিনার আছে।",
      },
      {
        en: "Ekushey is also a giant book fair: the month-long Ekushey Boi Mela in Dhaka celebrates Bangla books.",
        bn: "একুশে মানে বিশাল বইমেলাও: ঢাকার মাসব্যাপী একুশে বইমেলা বাংলা বইয়ের উৎসব।",
      },
      {
        en: "You speak at least one mother language too — Ekushey celebrates yours as well!",
        bn: "তোমারও অন্তত একটি মাতৃভাষা আছে — একুশে তোমার ভাষাকেও উদযাপন করে!",
      },
    ],
    quiz: [
      {
        question: { en: "What happened on 21 February 1952?", bn: "১৯৫২ সালের ২১ ফেব্রুয়ারি কী হয়েছিল?" },
        options: [
          { en: "Students marched for the right to speak Bangla", bn: "ছাত্ররা বাংলা বলার অধিকারের জন্য মিছিল করে" },
          { en: "Bangladesh won a cricket match", bn: "বাংলাদেশ ক্রিকেটে জেতে" },
          { en: "A new king was crowned", bn: "নতুন রাজার অভিষেক হয়" },
        ],
        answer: 0,
      },
      {
        question: { en: "Where do people bring flowers at dawn on Ekushey?", bn: "একুশের ভোরে মানুষ কোথায় ফুল দেয়?" },
        options: [
          { en: "The Shaheed Minar", bn: "শহিদ মিনারে" },
          { en: "The cricket stadium", bn: "ক্রিকেট স্টেডিয়ামে" },
          { en: "The airport", bn: "বিমানবন্দরে" },
        ],
        answer: 0,
      },
      {
        question: { en: "What did UNESCO name 21 February?", bn: "ইউনেসকো ২১ ফেব্রুয়ারিকে কী নাম দিয়েছে?" },
        options: [
          { en: "International Mother Language Day", bn: "আন্তর্জাতিক মাতৃভাষা দিবস" },
          { en: "World Book Day", bn: "বিশ্ব বই দিবস" },
          { en: "International Music Day", bn: "আন্তর্জাতিক সংগীত দিবস" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "The Language Movement chapter", bn: "ভাষা আন্দোলন অধ্যায়" } },
      { bookId: "history-9-10", note: { en: "Language Movement, in depth for older students", bn: "বড়দের জন্য বিস্তারিত: ভাষা আন্দোলন" } },
    ],
  },
  {
    id: "liberation-1971",
    theme: "history",
    emoji: "🎗️",
    title: { en: "1971 — how Bangladesh was born", bn: "১৯৭১ — বাংলাদেশের জন্ম" },
    tagline: {
      en: "Nine brave months, from 26 March to the victory of 16 December.",
      bn: "২৬ মার্চ থেকে ১৬ ডিসেম্বরের বিজয় — সাহসী নয়টি মাস।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "The fight for freedom", bn: "মুক্তির লড়াই" },
        body: {
          en: "In 1971 the people of East Pakistan decided they would be free. Independence was declared in March, and ordinary people — farmers, teachers, students — became freedom fighters, the muktijoddha. The struggle is called the Muktijuddho, the Liberation War, and it lasted nine months.",
          bn: "১৯৭১ সালে পূর্ব পাকিস্তানের মানুষ ঠিক করল, তারা স্বাধীন হবে। মার্চে স্বাধীনতা ঘোষণা হলো, আর সাধারণ মানুষ — কৃষক, শিক্ষক, ছাত্র — হয়ে উঠল মুক্তিযোদ্ধা। এই সংগ্রামের নাম মুক্তিযুদ্ধ, চলেছিল নয় মাস।",
        },
      },
      {
        heading: { en: "Victory Day", bn: "বিজয় দিবস" },
        body: {
          en: "On 16 December 1971 the war ended in victory and Bangladesh took its place on the world map. That is why 26 March is Independence Day and 16 December is Bijoy Dibosh — Victory Day — when the red and green flag flies from every rooftop and children sing 'Amar Shonar Bangla', the national anthem.",
          bn: "১৯৭১ সালের ১৬ ডিসেম্বর যুদ্ধ শেষ হলো বিজয়ে, বিশ্বের মানচিত্রে জায়গা করে নিল বাংলাদেশ। তাই ২৬ মার্চ স্বাধীনতা দিবস আর ১৬ ডিসেম্বর বিজয় দিবস — সেদিন প্রতিটি ছাদে লাল-সবুজ পতাকা ওড়ে, শিশুরা গায় জাতীয় সংগীত ‘আমার সোনার বাংলা’।",
        },
      },
    ],
    funFacts: [
      {
        en: "The green of the flag stands for Bangladesh's fields; the red circle is the rising sun and the sacrifice of 1971.",
        bn: "পতাকার সবুজ বাংলাদেশের মাঠ-প্রান্তর; লাল বৃত্ত উদীয়মান সূর্য আর একাত্তরের আত্মত্যাগ।",
      },
      {
        en: "The national anthem was written by Rabindranath Tagore — the same poet you'll meet in the literature topics.",
        bn: "জাতীয় সংগীত লিখেছেন রবীন্দ্রনাথ ঠাকুর — সাহিত্যের পাতায় তাঁর সঙ্গে আবার দেখা হবে।",
      },
      {
        en: "The National Martyrs' Memorial at Savar has seven pairs of triangular walls, remembering seven stages of the freedom struggle.",
        bn: "সাভারের জাতীয় স্মৃতিসৌধে সাত জোড়া ত্রিভুজ দেয়াল — স্বাধীনতা সংগ্রামের সাতটি ধাপের স্মরণে।",
      },
    ],
    quiz: [
      {
        question: { en: "What are the freedom fighters of 1971 called?", bn: "১৯৭১-এর স্বাধীনতা যোদ্ধাদের কী বলা হয়?" },
        options: [
          { en: "Muktijoddha", bn: "মুক্তিযোদ্ধা" },
          { en: "Nabab", bn: "নবাব" },
          { en: "Majhi", bn: "মাঝি" },
        ],
        answer: 0,
      },
      {
        question: { en: "When is Victory Day?", bn: "বিজয় দিবস কবে?" },
        options: [
          { en: "16 December", bn: "১৬ ডিসেম্বর" },
          { en: "1 January", bn: "১ জানুয়ারি" },
          { en: "21 February", bn: "২১ ফেব্রুয়ারি" },
        ],
        answer: 0,
      },
      {
        question: { en: "What do the flag's colours show?", bn: "পতাকার রং কী বোঝায়?" },
        options: [
          { en: "Green fields and a red rising sun", bn: "সবুজ মাঠ আর লাল উদীয়মান সূর্য" },
          { en: "The sea and the mountains", bn: "সমুদ্র আর পাহাড়" },
          { en: "Night and day", bn: "রাত আর দিন" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "History of the Liberation War chapters", bn: "মুক্তিযুদ্ধের ইতিহাস অধ্যায়" } },
      { bookId: "history-9-10", note: { en: "The Liberation War, in depth", bn: "বিস্তারিত: মুক্তিযুদ্ধ" } },
    ],
  },
  {
    id: "ancient-bengal",
    theme: "history",
    emoji: "🏺",
    title: { en: "Ancient Bengal — cities older than legends", bn: "প্রাচীন বাংলা — কিংবদন্তিরও আগের নগর" },
    tagline: {
      en: "Mahasthangarh, Paharpur and the traders who sailed from golden Bengal.",
      bn: "মহাস্থানগড়, পাহাড়পুর আর সোনার বাংলার সওদাগরেরা।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "Digging up old Bengal", bn: "মাটির নিচের পুরোনো বাংলা" },
        body: {
          en: "Long before planes and phones, Bengal had busy cities. Mahasthangarh, in Bogura, is one of the oldest city sites in Bangladesh — people lived there more than two thousand years ago. Archaeologists still find coins, beads and walls hiding under its mounds.",
          bn: "উড়োজাহাজ আর ফোনের বহু আগে বাংলায় ছিল ব্যস্ত নগর। বগুড়ার মহাস্থানগড় বাংলাদেশের প্রাচীনতম নগর-নিদর্শনগুলোর একটি — দুই হাজার বছরেরও আগে সেখানে মানুষ বাস করত। প্রত্নতাত্ত্বিকেরা আজও সেখানকার ঢিবির নিচে মুদ্রা, পুঁতি আর দেয়াল খুঁজে পান।",
        },
      },
      {
        heading: { en: "The grand monastery", bn: "মহাবিহারের গল্প" },
        body: {
          en: "At Paharpur stands the Somapura Mahavihara, a huge Buddhist monastery built over a thousand years ago, where students travelled from far away to learn. It is so special that UNESCO lists it as a World Heritage Site — a treasure the whole world promises to protect.",
          bn: "পাহাড়পুরে আছে সোমপুর মহাবিহার — হাজার বছরেরও আগে গড়া বিশাল বৌদ্ধ বিহার, যেখানে দূরদূরান্ত থেকে শিক্ষার্থীরা পড়তে আসত। এটি এতই বিশেষ যে ইউনেসকো একে বিশ্ব ঐতিহ্য স্থান ঘোষণা করেছে — যে সম্পদ রক্ষার প্রতিশ্রুতি সারা পৃথিবীর।",
        },
      },
    ],
    funFacts: [
      {
        en: "Fine muslin cloth from Bengal was once so famous that traders carried it across the ancient world.",
        bn: "বাংলার মসলিন এত বিখ্যাত ছিল যে সওদাগরেরা তা প্রাচীন পৃথিবীর নানা প্রান্তে নিয়ে যেত।",
      },
      {
        en: "Wari-Bateshwar, another ancient site, may have been a river-port trading with places thousands of kilometres away.",
        bn: "আরেক প্রাচীন নিদর্শন উয়ারী-বটেশ্বর সম্ভবত ছিল নদীবন্দর — হাজার হাজার কিলোমিটার দূরের সঙ্গে বাণিজ্য চলত।",
      },
      {
        en: "The Sixty Dome Mosque in Bagerhat is a third UNESCO World Heritage property in Bangladesh — count its domes if you visit!",
        bn: "বাগেরহাটের ষাট গম্বুজ মসজিদ বাংলাদেশের আরেকটি ইউনেসকো বিশ্ব ঐতিহ্য — গেলে গম্বুজ গুনে দেখো!",
      },
    ],
    quiz: [
      {
        question: { en: "Which ancient city site is in Bogura?", bn: "বগুড়ায় কোন প্রাচীন নগর-নিদর্শন?" },
        options: [
          { en: "Mahasthangarh", bn: "মহাস্থানগড়" },
          { en: "Cox's Bazar", bn: "কক্সবাজার" },
          { en: "Sylhet", bn: "সিলেট" },
        ],
        answer: 0,
      },
      {
        question: { en: "What was the Somapura Mahavihara?", bn: "সোমপুর মহাবিহার কী ছিল?" },
        options: [
          { en: "A huge Buddhist monastery and place of learning", bn: "বিশাল বৌদ্ধ বিহার ও শিক্ষাকেন্দ্র" },
          { en: "A football stadium", bn: "ফুটবল স্টেডিয়াম" },
          { en: "A railway station", bn: "রেলস্টেশন" },
        ],
        answer: 0,
      },
      {
        question: { en: "Who lists Paharpur as a World Heritage Site?", bn: "পাহাড়পুরকে বিশ্ব ঐতিহ্য ঘোষণা করেছে কে?" },
        options: [
          { en: "UNESCO", bn: "ইউনেসকো" },
          { en: "FIFA", bn: "ফিফা" },
          { en: "NASA", bn: "নাসা" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "history-9-10", note: { en: "Ancient Bengal chapters", bn: "প্রাচীন বাংলা অধ্যায়" } },
      { bookId: "bgs-secondary", note: { en: "Heritage of Bangladesh", bn: "বাংলাদেশের ঐতিহ্য" } },
    ],
  },
  {
    id: "national-symbols",
    theme: "history",
    emoji: "🌺",
    title: { en: "Symbols of Bangladesh", bn: "বাংলাদেশের প্রতীক" },
    tagline: {
      en: "The shapla, the doyel, the tiger and the song a whole country shares.",
      bn: "শাপলা, দোয়েল, বাঘ আর সারা দেশের এক গান।",
    },
    minutes: 3,
    sections: [
      {
        heading: { en: "A country in pictures", bn: "ছবিতে একটি দেশ" },
        body: {
          en: "Countries choose symbols the way families choose photos for the wall. Bangladesh's national flower is the shapla, the white water lily that floats on ponds and beels. The national bird is the doyel (magpie-robin), the national animal is the Royal Bengal Tiger of the Sundarbans, and the national fruit is the jackfruit — kathal — the biggest tree fruit in the world.",
          bn: "পরিবার যেমন দেয়ালের জন্য ছবি বেছে নেয়, দেশও তেমনি প্রতীক বেছে নেয়। বাংলাদেশের জাতীয় ফুল শাপলা — পুকুরে-বিলে ভেসে থাকা সাদা জলপদ্ম। জাতীয় পাখি দোয়েল, জাতীয় পশু সুন্দরবনের রয়্যাল বেঙ্গল টাইগার, আর জাতীয় ফল কাঁঠাল — পৃথিবীর সবচেয়ে বড় গাছের ফল।",
        },
      },
      {
        heading: { en: "One song, millions of voices", bn: "এক গান, লাখো কণ্ঠ" },
        body: {
          en: "The national anthem, 'Amar Shonar Bangla' ('My Golden Bengal'), was written by Rabindranath Tagore. When it plays, people stand tall and still — in school assemblies in Dhaka and at Bangla school in Australia too.",
          bn: "জাতীয় সংগীত ‘আমার সোনার বাংলা’ লিখেছেন রবীন্দ্রনাথ ঠাকুর। গানটি বাজলে সবাই সোজা হয়ে দাঁড়ায় — ঢাকার স্কুল অ্যাসেম্বলিতে, অস্ট্রেলিয়ার বাংলা স্কুলেও।",
        },
      },
    ],
    funFacts: [
      { en: "The shapla appears on Bangladesh's money and its national emblem.", bn: "শাপলা আছে বাংলাদেশের টাকায় আর জাতীয় প্রতীকে।" },
      { en: "The Sundarbans, home of the tiger, is the largest mangrove forest on Earth.", bn: "বাঘের বাড়ি সুন্দরবন পৃথিবীর সবচেয়ে বড় ম্যানগ্রোভ বন।" },
      { en: "A jackfruit can weigh more than a six-year-old child!", bn: "একটি কাঁঠালের ওজন ছয় বছরের শিশুর চেয়েও বেশি হতে পারে!" },
    ],
    quiz: [
      {
        question: { en: "What is the national flower of Bangladesh?", bn: "বাংলাদেশের জাতীয় ফুল কী?" },
        options: [
          { en: "Shapla — the water lily", bn: "শাপলা" },
          { en: "Rose", bn: "গোলাপ" },
          { en: "Sunflower", bn: "সূর্যমুখী" },
        ],
        answer: 0,
      },
      {
        question: { en: "Which animal is the national animal?", bn: "জাতীয় পশু কোনটি?" },
        options: [
          { en: "Royal Bengal Tiger", bn: "রয়্যাল বেঙ্গল টাইগার" },
          { en: "Elephant", bn: "হাতি" },
          { en: "Kangaroo", bn: "ক্যাঙারু" },
        ],
        answer: 0,
      },
      {
        question: { en: "Who wrote 'Amar Shonar Bangla'?", bn: "‘আমার সোনার বাংলা’ কে লিখেছেন?" },
        options: [
          { en: "Rabindranath Tagore", bn: "রবীন্দ্রনাথ ঠাকুর" },
          { en: "Kazi Nazrul Islam", bn: "কাজী নজরুল ইসলাম" },
          { en: "Jasimuddin", bn: "জসীমউদ্দীন" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "Our Bangladesh chapters", bn: "আমাদের বাংলাদেশ অধ্যায়" } },
    ],
  },

  {
    id: "british-rule",
    theme: "history",
    emoji: "🚂",
    title: { en: "British rule — and the road to 1947", bn: "ব্রিটিশ শাসন — এবং ১৯৪৭-এর পথ" },
    tagline: {
      en: "Two hundred years of colonial rule, the people who resisted, and how Bengal was divided.",
      bn: "দুই শতকের ঔপনিবেশিক শাসন, প্রতিরোধের মানুষেরা, আর বাংলার ভাগ।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "How a trading company became a ruler", bn: "বাণিজ্য কোম্পানি যেভাবে শাসক হলো" },
        body: {
          en: "In 1757, at the Battle of Palashi (Plassey), the young Nawab of Bengal, Siraj ud-Daulah, was defeated after being betrayed by people he trusted. The British East India Company — a trading company! — took control, and later the British Crown ruled directly. Colonial rule brought railways, tea gardens and new schools, but also heavy taxes, terrible famines and hardship for farmers, like those forced to grow indigo instead of food.",
          bn: "১৭৫৭ সালে পলাশীর যুদ্ধে বিশ্বাসঘাতকতার শিকার হয়ে হেরে যান বাংলার তরুণ নবাব সিরাজউদ্দৌলা। ক্ষমতা নেয় ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানি — একটি বাণিজ্য কোম্পানি! — পরে সরাসরি ব্রিটিশ রাজ। ঔপনিবেশিক শাসনে রেলগাড়ি, চা-বাগান আর নতুন স্কুল এসেছিল, কিন্তু সঙ্গে এসেছিল ভারী খাজনা, ভয়াবহ দুর্ভিক্ষ, আর নীল চাষে বাধ্য কৃষকদের মতো মানুষের কষ্ট।",
        },
      },
      {
        heading: { en: "Resistance, and a land divided", bn: "প্রতিরোধ, তারপর দেশভাগ" },
        body: {
          en: "People fought back in many ways: Titumir built his famous bamboo fort, sepoys rose up in 1857, and later generations marched, wrote and organised for freedom. In 1947 British rule ended and the land was divided — Bengal's east became part of a new country called Pakistan. But the new rulers were far away too… which is where the Language Movement story begins.",
          bn: "মানুষ নানা ভাবে রুখে দাঁড়িয়েছে: তিতুমীর গড়েছিলেন বিখ্যাত বাঁশের কেল্লা, ১৮৫৭ সালে সিপাহিরা বিদ্রোহ করে, পরের প্রজন্মরা মিছিলে-লেখায়-সংগঠনে স্বাধীনতার লড়াই চালায়। ১৯৪৭ সালে ব্রিটিশ শাসন শেষ হয়, দেশ ভাগ হয় — বাংলার পূর্ব অংশ হয় নতুন দেশ পাকিস্তানের অংশ। কিন্তু নতুন শাসকরাও ছিল বহু দূরে… আর সেখান থেকেই শুরু ভাষা আন্দোলনের গল্প।",
        },
      },
    ],
    funFacts: [
      { en: "Before colonial rule, Bengal was one of the richest regions on Earth — its muslin and silk were world-famous.", bn: "ঔপনিবেশিক শাসনের আগে বাংলা ছিল পৃথিবীর সবচেয়ে সমৃদ্ধ অঞ্চলগুলোর একটি — মসলিন আর রেশমের খ্যাতি ছিল বিশ্বজোড়া।" },
      { en: "Titumir's bamboo fort (basher kella) is still a symbol of standing up to injustice.", bn: "তিতুমীরের বাঁশের কেল্লা আজও অন্যায়ের বিরুদ্ধে দাঁড়ানোর প্রতীক।" },
      { en: "The railways the British built to move goods now carry millions of Eid travellers home every year.", bn: "পণ্য টানতে বানানো সেই রেলপথেই এখন প্রতি বছর লাখ লাখ মানুষ ঈদে বাড়ি ফেরে।" },
    ],
    quiz: [
      {
        question: { en: "What happened at Palashi in 1757?", bn: "১৭৫৭ সালে পলাশীতে কী হয়েছিল?" },
        options: [
          { en: "Nawab Siraj ud-Daulah was defeated and Company rule began", bn: "নবাব সিরাজউদ্দৌলা পরাজিত হন, কোম্পানির শাসন শুরু হয়" },
          { en: "Bangladesh became independent", bn: "বাংলাদেশ স্বাধীন হয়" },
          { en: "The first railway opened", bn: "প্রথম রেলপথ খোলে" },
        ],
        answer: 0,
      },
      {
        question: { en: "Who built the famous bamboo fort?", bn: "বিখ্যাত বাঁশের কেল্লা কে গড়েছিলেন?" },
        options: [
          { en: "Titumir", bn: "তিতুমীর" },
          { en: "Rabindranath Tagore", bn: "রবীন্দ্রনাথ ঠাকুর" },
          { en: "The East India Company", bn: "ইস্ট ইন্ডিয়া কোম্পানি" },
        ],
        answer: 0,
      },
      {
        question: { en: "What happened in 1947?", bn: "১৯৪৭ সালে কী হয়?" },
        options: [
          { en: "British rule ended and Bengal was divided", bn: "ব্রিটিশ শাসন শেষ হয়, বাংলা ভাগ হয়" },
          { en: "The Liberation War began", bn: "মুক্তিযুদ্ধ শুরু হয়" },
          { en: "UNESCO was founded in Dhaka", bn: "ঢাকায় ইউনেসকো প্রতিষ্ঠিত হয়" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "The 'British Rule' chapter", bn: "‘ব্রিটিশ শাসন’ অধ্যায়" } },
      { bookId: "history-9-10", note: { en: "Colonial period and the road to 1947, in depth", bn: "বিস্তারিত: ঔপনিবেশিক আমল ও ১৯৪৭-এর পথ" } },
    ],
  },

  // ---------------------------------------------------------------- culture
  {
    id: "pohela-boishakh",
    theme: "culture",
    emoji: "🎨",
    title: { en: "Pohela Boishakh — the Bengali New Year", bn: "পহেলা বৈশাখ — বাংলা নববর্ষ" },
    tagline: {
      en: "Red-and-white clothes, giant masks and 'Shubho Noboborsho!' in April.",
      bn: "লাল-সাদা পোশাক, বিশাল মুখোশ আর এপ্রিলে ‘শুভ নববর্ষ!’",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "A new year in April?", bn: "এপ্রিলে নতুন বছর?" },
        body: {
          en: "The Bengali calendar starts its year with the month of Boishakh, in the middle of April. On Pohela Boishakh (the first of Boishakh) people wear red and white, greet each other with 'Shubho Noboborsho' — happy new year — and eat festive food; a famous choice in Dhaka is panta bhat (soaked rice) with fried hilsa fish.",
          bn: "বাংলা পঞ্জিকার বছর শুরু হয় বৈশাখ মাসে, এপ্রিলের মাঝামাঝি। পহেলা বৈশাখে মানুষ লাল-সাদা পোশাক পরে, ‘শুভ নববর্ষ’ বলে শুভেচ্ছা জানায়, উৎসবের খাবার খায় — ঢাকায় বিখ্যাত পান্তা ভাত আর ইলিশ ভাজা।",
        },
      },
      {
        heading: { en: "The parade of masks", bn: "মুখোশের শোভাযাত্রা" },
        body: {
          en: "In Dhaka, students of the Faculty of Fine Arts lead the Mongol Shobhajatra, a joyful procession with giant colourful masks and animal figures wishing everyone a good year. UNESCO recognises this parade as intangible cultural heritage of humanity. Shops open fresh account books called halkhata, and fairs — Boishakhi mela — fill with toys, sweets and nagordola rides.",
          bn: "ঢাকায় চারুকলার শিক্ষার্থীদের নেতৃত্বে হয় মঙ্গল শোভাযাত্রা — বিশাল রঙিন মুখোশ আর পশুপাখির প্রতিকৃতি নিয়ে আনন্দ মিছিল, সবার জন্য শুভ বছরের কামনা। ইউনেসকো এই শোভাযাত্রাকে মানবতার অপরিমেয় সাংস্কৃতিক ঐতিহ্যের স্বীকৃতি দিয়েছে। দোকানে খোলে নতুন হিসাবের খাতা ‘হালখাতা’, আর বৈশাখী মেলায় থাকে খেলনা, মিষ্টি আর নাগরদোলা।",
        },
      },
    ],
    funFacts: [
      { en: "'Esho he Boishakh' — a Tagore song — is sung at dawn under a banyan tree in Dhaka's Ramna park.", bn: "ভোরে ঢাকার রমনার বটমূলে গাওয়া হয় রবীন্দ্রনাথের গান ‘এসো হে বৈশাখ’।" },
      { en: "Bengali communities in Australia hold Boishakhi melas too — you may have been to one!", bn: "অস্ট্রেলিয়ার বাঙালিরাও বৈশাখী মেলা করে — হয়তো তুমিও গিয়েছ!" },
      { en: "The Bengali year count is different from the English one — Boishakh 1433 began in April 2026.", bn: "বাংলা সনের হিসাব ইংরেজি বছরের চেয়ে আলাদা — ১৪৩৩ বঙ্গাব্দ শুরু হয়েছে ২০২৬-এর এপ্রিলে।" },
    ],
    quiz: [
      {
        question: { en: "Which month begins the Bengali year?", bn: "বাংলা বছরের প্রথম মাস কোনটি?" },
        options: [
          { en: "Boishakh", bn: "বৈশাখ" },
          { en: "Poush", bn: "পৌষ" },
          { en: "Srabon", bn: "শ্রাবণ" },
        ],
        answer: 0,
      },
      {
        question: { en: "What is the Mongol Shobhajatra?", bn: "মঙ্গল শোভাযাত্রা কী?" },
        options: [
          { en: "A new-year procession with giant masks", bn: "বিশাল মুখোশ নিয়ে নববর্ষের শোভাযাত্রা" },
          { en: "A type of boat race", bn: "এক ধরনের নৌকাবাইচ" },
          { en: "A cricket tournament", bn: "ক্রিকেট টুর্নামেন্ট" },
        ],
        answer: 0,
      },
      {
        question: { en: "How do you wish someone a happy Bengali new year?", bn: "বাংলা নববর্ষের শুভেচ্ছা কী বলে জানায়?" },
        options: [
          { en: "Shubho Noboborsho", bn: "শুভ নববর্ষ" },
          { en: "Shubho Jonmodin", bn: "শুভ জন্মদিন" },
          { en: "Khoda hafez", bn: "খোদা হাফেজ" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "Festivals and culture chapters", bn: "উৎসব ও সংস্কৃতি অধ্যায়" } },
      { bookId: "arts-crafts", note: { en: "Festive arts and the Shobhajatra", bn: "উৎসবের শিল্প ও শোভাযাত্রা" } },
    ],
  },
  {
    id: "festivals-of-many-faiths",
    theme: "culture",
    emoji: "🕌",
    title: { en: "Festivals of many faiths", bn: "নানা ধর্মের উৎসব" },
    tagline: {
      en: "Eid, Durga Puja, Buddha Purnima and Boro Din — one country, many celebrations.",
      bn: "ঈদ, দুর্গাপূজা, বুদ্ধপূর্ণিমা আর বড়দিন — এক দেশ, নানা উদযাপন।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "Eid — the biggest days of the year", bn: "ঈদ — বছরের সবচেয়ে বড় দিন" },
        body: {
          en: "For most families in Bangladesh, the two Eids are the happiest days of the year. Eid-ul-Fitr comes after the fasting month of Ramadan: new clothes, morning prayers, salami (gift money!) and bowls of sweet shemai. Eid-ul-Azha remembers sacrifice and sharing — families share meat with neighbours and people in need. Cities empty as millions travel home to their villages.",
          bn: "বাংলাদেশের বেশির ভাগ পরিবারের কাছে দুই ঈদ বছরের সবচেয়ে আনন্দের দিন। রোজার মাস রমজানের পরে আসে ঈদুল ফিতর: নতুন জামা, সকালের নামাজ, সালামি, আর মিষ্টি সেমাই। ঈদুল আজহা ত্যাগ আর ভাগ করে নেওয়ার শিক্ষা দেয় — পরিবারগুলো প্রতিবেশী ও অভাবী মানুষের সঙ্গে মাংস ভাগ করে। ঈদে লাখ লাখ মানুষ গ্রামের বাড়ি যায়, শহর ফাঁকা হয়ে যায়।",
        },
      },
      {
        heading: { en: "Celebrating side by side", bn: "পাশাপাশি উদযাপন" },
        body: {
          en: "Bangladesh's neighbours celebrate together. Durga Puja fills Hindu mandaps with drums and dance for five days each autumn. Buddhists celebrate Buddha Purnima, and Christians light up Boro Din — Christmas. A saying children learn is 'dhormo jar jar, utshob shobar' — religion is each person's own, but festivals belong to everyone.",
          bn: "বাংলাদেশে প্রতিবেশীরা একসঙ্গে উৎসব করে। শরতে পাঁচ দিন ধরে দুর্গাপূজায় মণ্ডপ ভরে ওঠে ঢাক আর নাচে। বৌদ্ধরা উদযাপন করে বুদ্ধপূর্ণিমা, খ্রিষ্টানরা আলো জ্বালায় বড়দিনে। শিশুরা শেখে — ‘ধর্ম যার যার, উৎসব সবার’।",
        },
      },
    ],
    funFacts: [
      { en: "On chand raat — the night before Eid — children look for the new moon in the sky.", bn: "চাঁদরাতে শিশুরা আকাশে নতুন চাঁদ খোঁজে।" },
      { en: "Mehndi (henna) patterns on hands are an Eid favourite for kids.", bn: "ঈদে হাতে মেহেদির নকশা শিশুদের খুব প্রিয়।" },
      { en: "During Durga Puja, drummers called dhakis play the huge dhak drum you can hear streets away.", bn: "দুর্গাপূজায় ঢাকিরা বাজায় বিশাল ঢাক — কয়েক গলি দূর থেকেও শোনা যায়।" },
    ],
    quiz: [
      {
        question: { en: "Which festival follows the month of Ramadan?", bn: "রমজান মাসের পরে কোন উৎসব?" },
        options: [
          { en: "Eid-ul-Fitr", bn: "ঈদুল ফিতর" },
          { en: "Durga Puja", bn: "দুর্গাপূজা" },
          { en: "Pohela Boishakh", bn: "পহেলা বৈশাখ" },
        ],
        answer: 0,
      },
      {
        question: { en: "What does 'dhormo jar jar, utshob shobar' mean?", bn: "‘ধর্ম যার যার, উৎসব সবার’ মানে কী?" },
        options: [
          { en: "Religion is one's own; festivals are for everyone", bn: "ধর্ম নিজের, কিন্তু উৎসব সবার" },
          { en: "Every festival needs fireworks", bn: "সব উৎসবে আতশবাজি লাগে" },
          { en: "Only one festival a year", bn: "বছরে একটাই উৎসব" },
        ],
        answer: 0,
      },
      {
        question: { en: "What sweet dish is famous on Eid mornings?", bn: "ঈদের সকালে কোন মিষ্টি খাবার বিখ্যাত?" },
        options: [
          { en: "Shemai", bn: "সেমাই" },
          { en: "Panta bhat", bn: "পান্তা ভাত" },
          { en: "Khichuri", bn: "খিচুড়ি" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "Living together: festivals of Bangladesh", bn: "মিলেমিশে থাকা: বাংলাদেশের উৎসব" } },
      { bookId: "bgs-secondary", note: { en: "Society and culture chapters", bn: "সমাজ ও সংস্কৃতি অধ্যায়" } },
    ],
  },
  {
    id: "nobanno-and-pitha",
    theme: "culture",
    emoji: "🌾",
    title: { en: "Nobanno & pitha season", bn: "নবান্ন ও পিঠার মৌসুম" },
    tagline: {
      en: "When the rice harvest comes home, the whole village smells of sweet cakes.",
      bn: "ধান ঘরে উঠলে সারা গ্রামে ভাসে পিঠার গন্ধ।",
    },
    minutes: 3,
    sections: [
      {
        heading: { en: "The festival of new rice", bn: "নতুন চালের উৎসব" },
        body: {
          en: "Nobanno means 'new food'. In the month of Ogrohayon, when golden rice is harvested, villages celebrate with fairs, songs and dishes cooked from the brand-new rice. It is one of Bengal's oldest festivals — a thank-you to the land itself.",
          bn: "নবান্ন মানে ‘নতুন অন্ন’। অগ্রহায়ণ মাসে সোনালি ধান কাটা হলে গ্রামে গ্রামে মেলা, গান আর নতুন চালের রান্নায় উৎসব হয়। এটি বাংলার প্রাচীনতম উৎসবগুলোর একটি — মাটির প্রতি কৃতজ্ঞতা।",
        },
      },
      {
        heading: { en: "Pitha, pitha everywhere", bn: "পিঠা আর পিঠা" },
        body: {
          en: "Winter is pitha season. Pitha are rice-flour cakes — steamed bhapa pitha with jaggery inside, crescent-shaped puli, lacy patishapta rolled around sweet coconut, and chitoi dipped in date-palm syrup called khejur gur. Grandmothers are usually the champions of pitha-making.",
          bn: "শীত মানেই পিঠার মৌসুম। চালের গুঁড়ার এই পিঠাদের কেউ ভাপে সেদ্ধ — গুড়ে ভরা ভাপা পিঠা, চাঁদের মতো পুলি, নারকেল-মোড়ানো পাটিসাপটা, আর খেজুর গুড়ে ডোবানো চিতই। পিঠা বানানোয় সেরা সাধারণত দাদি-নানিরাই।",
        },
      },
    ],
    funFacts: [
      { en: "Khejur gur (date-palm jaggery) is collected drop by drop from date-palm trees on cold winter mornings.", bn: "শীতের ভোরে খেজুর গাছ থেকে ফোঁটায় ফোঁটায় সংগ্রহ হয় খেজুরের রস ও গুড়।" },
      { en: "There are said to be over a hundred kinds of pitha across Bangladesh.", bn: "বাংলাদেশে নাকি একশোরও বেশি রকমের পিঠা আছে।" },
      { en: "Dhaka holds a yearly Pitha Utshob — a whole festival just for pitha!", bn: "ঢাকায় প্রতি বছর হয় পিঠা উৎসব — শুধু পিঠারই মেলা!" },
    ],
    quiz: [
      {
        question: { en: "What does 'Nobanno' celebrate?", bn: "নবান্ন কীসের উদযাপন?" },
        options: [
          { en: "The new rice harvest", bn: "নতুন ধান ঘরে তোলা" },
          { en: "The new school year", bn: "নতুন স্কুলবছর" },
          { en: "A cricket victory", bn: "ক্রিকেট জয়" },
        ],
        answer: 0,
      },
      {
        question: { en: "What are pitha made from?", bn: "পিঠা মূলত কী দিয়ে তৈরি?" },
        options: [
          { en: "Rice flour", bn: "চালের গুঁড়া" },
          { en: "Potatoes", bn: "আলু" },
          { en: "Chocolate", bn: "চকলেট" },
        ],
        answer: 0,
      },
      {
        question: { en: "Which sweet syrup comes from date-palm trees?", bn: "খেজুর গাছ থেকে কোন মিষ্টি জিনিস আসে?" },
        options: [
          { en: "Khejur gur", bn: "খেজুর গুড়" },
          { en: "Honey", bn: "মধু" },
          { en: "Maple syrup", bn: "ম্যাপল সিরাপ" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "Seasons and rural life chapters", bn: "ঋতু ও গ্রামীণ জীবন অধ্যায়" } },
      { bookId: "amar-bangla-boi", note: { en: "Poems and readings about harvest time", bn: "নবান্ন নিয়ে ছড়া ও পাঠ" } },
    ],
  },
  {
    id: "rivers-everyday-life",
    theme: "culture",
    emoji: "🛶",
    title: { en: "Rivers & everyday life", bn: "নদী ও দৈনন্দিন জীবন" },
    tagline: {
      en: "Why Bangladesh is called the land of rivers — and what a day there feels like.",
      bn: "বাংলাদেশকে কেন নদীমাতৃক দেশ বলে — আর সেখানকার একটি দিন কেমন।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "The land of rivers", bn: "নদীমাতৃক দেশ" },
        body: {
          en: "Bangladesh is laced with hundreds of rivers — the mighty Padma, the Meghna and the Jamuna are the three great ones. Rivers water the rice fields, carry boats full of jute and vegetables, and give the country its nickname: nodimatrik desh, the riverine land. Boats of every kind — from tiny dinghies to big launches — are as normal there as buses are in Australia.",
          bn: "বাংলাদেশ জুড়ে শত শত নদী — পদ্মা, মেঘনা আর যমুনা তিন প্রধান। নদী ধানখেতে পানি দেয়, পাট-সবজি বোঝাই নৌকা বয়ে নেয়, আর দেশটির ডাকনাম দিয়েছে — নদীমাতৃক দেশ। ছোট ডিঙি থেকে বড় লঞ্চ — নৌকা সেখানে ততটাই স্বাভাবিক, যতটা অস্ট্রেলিয়ায় বাস।",
        },
      },
      {
        heading: { en: "A day in the bazaar", bn: "বাজারের একটি দিন" },
        body: {
          en: "Everyday life hums: rickshaws with hand-painted art jingle through streets, the bazaar smells of mangoes and fresh fish, tea stalls serve tiny cups of milky cha, and in the evening families gather for rice, dal and stories. In the village, kids play ha-du-du (kabaddi, the national game) and fly kites from rooftops.",
          bn: "দৈনন্দিন জীবন সরগরম: হাতে আঁকা ছবিওয়ালা রিকশার টুংটাং, বাজারে আম আর তাজা মাছের গন্ধ, টং দোকানে ছোট কাপে দুধ-চা, আর সন্ধ্যায় ভাত-ডাল ঘিরে পরিবারের গল্প। গ্রামে শিশুরা খেলে হা-ডু-ডু (জাতীয় খেলা কাবাডি), ছাদ থেকে ওড়ায় ঘুড়ি।",
        },
      },
    ],
    funFacts: [
      { en: "The Padma is what the Ganges is called after it enters Bangladesh.", bn: "গঙ্গা বাংলাদেশে ঢুকে নাম নেয় পদ্মা।" },
      { en: "Nouka baich — traditional boat races with long slim boats and drummers — draw huge riverbank crowds.", bn: "নৌকাবাইচে লম্বা সরু নৌকা আর ঢোলের তালে নদীর পাড়ে ভিড় জমে যায়।" },
      { en: "The Padma Bridge, opened in 2022, is one of the longest bridges in South Asia.", bn: "২০২২ সালে খোলা পদ্মা সেতু দক্ষিণ এশিয়ার দীর্ঘতম সেতুগুলোর একটি।" },
    ],
    quiz: [
      {
        question: { en: "Which three great rivers meet in Bangladesh?", bn: "বাংলাদেশের তিন প্রধান নদী কোনগুলো?" },
        options: [
          { en: "Padma, Meghna and Jamuna", bn: "পদ্মা, মেঘনা ও যমুনা" },
          { en: "Nile, Amazon and Murray", bn: "নীল, আমাজন ও মারে" },
          { en: "Thames, Seine and Rhine", bn: "টেমস, সেন ও রাইন" },
        ],
        answer: 0,
      },
      {
        question: { en: "What is Bangladesh's national game?", bn: "বাংলাদেশের জাতীয় খেলা কী?" },
        options: [
          { en: "Ha-du-du (kabaddi)", bn: "হা-ডু-ডু (কাবাডি)" },
          { en: "Cricket", bn: "ক্রিকেট" },
          { en: "Soccer", bn: "ফুটবল" },
        ],
        answer: 0,
      },
      {
        question: { en: "Why is Bangladesh called 'nodimatrik desh'?", bn: "বাংলাদেশকে কেন ‘নদীমাতৃক দেশ’ বলা হয়?" },
        options: [
          { en: "Because rivers shape its land and life", bn: "নদীই এর ভূমি ও জীবন গড়ে বলে" },
          { en: "Because it has many mountains", bn: "অনেক পাহাড় আছে বলে" },
          { en: "Because it is a desert", bn: "মরুভূমি বলে" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "Rivers of Bangladesh chapters", bn: "বাংলাদেশের নদ-নদী অধ্যায়" } },
      { bookId: "amar-bangla-boi", note: { en: "The rivers lesson the client showed in our meeting", bn: "ক্লায়েন্ট মিটিংয়ে দেখানো নদী বিষয়ক পাঠ" } },
    ],
  },

  {
    id: "climate-and-disasters",
    theme: "culture",
    emoji: "🌧️",
    title: { en: "Monsoon, floods & the bravest volunteers", bn: "বর্ষা, বন্যা আর সাহসী স্বেচ্ছাসেবকেরা" },
    tagline: {
      en: "How Bangladesh lives with water — and became a world teacher in facing disasters.",
      bn: "পানির সঙ্গে বাংলাদেশের বসবাস — আর দুর্যোগ মোকাবিলায় বিশ্বের শিক্ষক হয়ে ওঠা।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "A land shaped by water", bn: "পানিতে গড়া দেশ" },
        body: {
          en: "Bangladesh sits on the world's largest river delta, and the monsoon season (borsha) pours life onto its fields — rice, jute and fish all depend on it. But the same water can turn dangerous: floods spread across the low land, and cyclones spin in from the Bay of Bengal. Living wisely with water is part of being Bangladeshi.",
          bn: "বাংলাদেশ পৃথিবীর বৃহত্তম ব-দ্বীপে দাঁড়িয়ে, আর বর্ষা তার মাঠে ঢেলে দেয় প্রাণ — ধান, পাট, মাছ সবই এর ওপর নির্ভর করে। কিন্তু সেই পানিই কখনো বিপজ্জনক: নিচু জমিতে বন্যা ছড়ায়, বঙ্গোপসাগর থেকে ধেয়ে আসে ঘূর্ণিঝড়। পানির সঙ্গে বুদ্ধি করে বাঁচাটাই বাংলাদেশি জীবনের অংশ।",
        },
      },
      {
        heading: { en: "The country that learned to be ready", bn: "প্রস্তুত থাকতে শেখা দেশ" },
        body: {
          en: "Bangladesh answered with preparation the whole world studies: tens of thousands of trained volunteers carry warnings to every village, families move to strong cyclone shelters, and schools practise drills. In flood-prone wetlands, farmers even grow vegetables on floating gardens that rise with the water. Fewer lives are lost every decade — a quiet national victory.",
          bn: "বাংলাদেশ জবাব দিয়েছে এমন প্রস্তুতিতে, যা আজ সারা বিশ্ব শেখে: হাজার হাজার প্রশিক্ষিত স্বেচ্ছাসেবক গ্রামে গ্রামে সতর্কবার্তা পৌঁছে দেন, পরিবারগুলো আশ্রয় নেয় মজবুত সাইক্লোন শেল্টারে, স্কুলে হয় মহড়া। বন্যাপ্রবণ জলাভূমিতে কৃষকরা পানির সঙ্গে ভেসে থাকা ধাপ-বাগানে সবজি ফলান। প্রতি দশকে প্রাণহানি কমছে — এ এক নীরব জাতীয় বিজয়।",
        },
      },
    ],
    funFacts: [
      { en: "The Cyclone Preparedness Programme's volunteers — many of them women — warn villages with flags, megaphones and door-knocks.", bn: "ঘূর্ণিঝড় প্রস্তুতি কর্মসূচির স্বেচ্ছাসেবকেরা — অনেকেই নারী — পতাকা, মাইক আর দরজায় কড়া নেড়ে গ্রাম সতর্ক করেন।" },
      { en: "Floating gardens (dhap) are an old Bengali invention now studied as a climate solution.", bn: "ভাসমান ধাপ-বাগান বাংলার পুরোনো উদ্ভাবন — এখন জলবায়ু-সমাধান হিসেবে গবেষণা হয়।" },
      { en: "Many cyclone shelters double as schools on ordinary days.", bn: "অনেক সাইক্লোন শেল্টার সাধারণ দিনে স্কুল হিসেবে চলে।" },
    ],
    quiz: [
      {
        question: { en: "What does the monsoon (borsha) bring to Bangladesh?", bn: "বর্ষা বাংলাদেশে কী নিয়ে আসে?" },
        options: [
          { en: "Life-giving rain for rice, jute and fish", bn: "ধান-পাট-মাছের জন্য প্রাণ জাগানো বৃষ্টি" },
          { en: "Snow", bn: "তুষার" },
          { en: "Sandstorms", bn: "বালুঝড়" },
        ],
        answer: 0,
      },
      {
        question: { en: "Where do families go when a big cyclone is coming?", bn: "বড় ঘূর্ণিঝড় এলে পরিবারগুলো কোথায় যায়?" },
        options: [
          { en: "Cyclone shelters", bn: "সাইক্লোন শেল্টারে" },
          { en: "The beach", bn: "সৈকতে" },
          { en: "Boats on the river", bn: "নদীর নৌকায়" },
        ],
        answer: 0,
      },
      {
        question: { en: "What are dhap?", bn: "ধাপ কী?" },
        options: [
          { en: "Floating gardens that rise with flood water", bn: "বন্যার পানির সঙ্গে ভেসে থাকা বাগান" },
          { en: "A kind of drum", bn: "এক রকম ঢোল" },
          { en: "Mountain caves", bn: "পাহাড়ের গুহা" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "bgs-primary", note: { en: "The 'Climate and disaster' chapter", bn: "‘জলবায়ু ও দুর্যোগ’ অধ্যায়" } },
      { bookId: "bgs-secondary", note: { en: "Geography and environment chapters", bn: "ভূগোল ও পরিবেশ অধ্যায়" } },
    ],
  },

  // ------------------------------------------------------------- literature
  {
    id: "rabindranath-tagore",
    theme: "literature",
    emoji: "🪶",
    title: { en: "Rabindranath Tagore", bn: "রবীন্দ্রনাথ ঠাকুর" },
    tagline: {
      en: "The poet whose songs became two national anthems.",
      bn: "যাঁর গান হয়ে উঠেছে দুটি দেশের জাতীয় সংগীত।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "Bishwokobi — the world poet", bn: "বিশ্বকবি" },
        body: {
          en: "Rabindranath Tagore (1861–1941) wrote poems, songs, stories, plays and novels in Bangla. In 1913 he became the first person from Asia to win the Nobel Prize in Literature, for his book of poems 'Gitanjali'. Bengalis call him Bishwokobi — the world poet.",
          bn: "রবীন্দ্রনাথ ঠাকুর (১৮৬১–১৯৪১) বাংলায় লিখেছেন কবিতা, গান, গল্প, নাটক, উপন্যাস। ১৯১৩ সালে ‘গীতাঞ্জলি’র জন্য এশিয়ার প্রথম মানুষ হিসেবে সাহিত্যে নোবেল পুরস্কার পান। বাঙালিরা তাঁকে ডাকে বিশ্বকবি।",
        },
      },
      {
        heading: { en: "Songs you already know", bn: "যে গান তুমি এমনিই জানো" },
        body: {
          en: "His thousands of songs are called Rabindra Sangeet. One of them, 'Amar Shonar Bangla', is Bangladesh's national anthem — and another of his songs is India's! Children still read his poems, like the ones in 'Sahaj Path', and act his plays at school functions. His birthday, Pochishe Boishakh, is celebrated with songs every year.",
          bn: "তাঁর হাজারো গানের নাম রবীন্দ্রসংগীত। একটি — ‘আমার সোনার বাংলা’ — বাংলাদেশের জাতীয় সংগীত, আরেকটি ভারতের! শিশুরা আজও তাঁর ছড়া-কবিতা পড়ে, স্কুলের অনুষ্ঠানে তাঁর নাটক করে। প্রতি বছর পঁচিশে বৈশাখে গানে গানে তাঁর জন্মদিন পালিত হয়।",
        },
      },
    ],
    funFacts: [
      { en: "Tagore wrote his first poem as a young child and published seriously from his teens.", bn: "শিশু বয়সেই রবীন্দ্রনাথ প্রথম কবিতা লেখেন, কিশোর বয়স থেকে ছাপা শুরু।" },
      { en: "He founded a school under the open sky at Santiniketan, where classes met beneath trees.", bn: "শান্তিনিকেতনে খোলা আকাশের নিচে গাছতলায় ক্লাস বসিয়ে তিনি স্কুল গড়েছিলেন।" },
      { en: "Both Bangladesh's and India's national anthems are his songs — a world first.", bn: "বাংলাদেশ ও ভারতের জাতীয় সংগীত দুটোই তাঁর গান — পৃথিবীতে এমনটি আর নেই।" },
    ],
    quiz: [
      {
        question: { en: "What prize did Tagore win in 1913?", bn: "১৯১৩ সালে রবীন্দ্রনাথ কী পুরস্কার পান?" },
        options: [
          { en: "The Nobel Prize in Literature", bn: "সাহিত্যে নোবেল পুরস্কার" },
          { en: "An Olympic medal", bn: "অলিম্পিক পদক" },
          { en: "The World Cup", bn: "বিশ্বকাপ" },
        ],
        answer: 0,
      },
      {
        question: { en: "What are Tagore's songs called?", bn: "রবীন্দ্রনাথের গানকে কী বলে?" },
        options: [
          { en: "Rabindra Sangeet", bn: "রবীন্দ্রসংগীত" },
          { en: "Nazrul Geeti", bn: "নজরুলগীতি" },
          { en: "Baul songs", bn: "বাউল গান" },
        ],
        answer: 0,
      },
      {
        question: { en: "Which book earned him the Nobel Prize?", bn: "কোন বইয়ের জন্য তিনি নোবেল পান?" },
        options: [
          { en: "Gitanjali", bn: "গীতাঞ্জলি" },
          { en: "Thakurmar Jhuli", bn: "ঠাকুরমার ঝুলি" },
          { en: "Sahaj Path", bn: "সহজ পাঠ" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "literature-secondary", note: { en: "Tagore poems and prose appear across the Bangla readers", bn: "বাংলা পাঠ্যবই জুড়ে রবীন্দ্রনাথের কবিতা ও গদ্য" } },
      { bookId: "amar-bangla-boi", note: { en: "His rhymes for young readers", bn: "ছোটদের জন্য তাঁর ছড়া" } },
    ],
  },
  {
    id: "kazi-nazrul-islam",
    theme: "literature",
    emoji: "🔥",
    title: { en: "Kazi Nazrul Islam — the rebel poet", bn: "কাজী নজরুল ইসলাম — বিদ্রোহী কবি" },
    tagline: {
      en: "The national poet of Bangladesh, who wrote like a storm and sang like a flute.",
      bn: "বাংলাদেশের জাতীয় কবি — ঝড়ের মতো লেখা, বাঁশির মতো গান।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "The rebel poet", bn: "বিদ্রোহী কবি" },
        body: {
          en: "Kazi Nazrul Islam (1899–1976) is Bangladesh's jatiyo kobi — national poet. He grew up poor, worked in a bakery as a boy, and later became famous for thundering poems against injustice. His most celebrated poem, 'Bidrohi' (The Rebel), gave him his nickname: Bidrohi Kobi, the rebel poet.",
          bn: "কাজী নজরুল ইসলাম (১৮৯৯–১৯৭৬) বাংলাদেশের জাতীয় কবি। দরিদ্র ঘরে বড় হয়েছেন, ছেলেবেলায় রুটির দোকানে কাজ করেছেন, পরে অন্যায়ের বিরুদ্ধে বজ্রকণ্ঠ কবিতায় বিখ্যাত হন। তাঁর সবচেয়ে বিখ্যাত কবিতা ‘বিদ্রোহী’ তাঁকে ডাকনাম দিয়েছে — বিদ্রোহী কবি।",
        },
      },
      {
        heading: { en: "Songs for everyone", bn: "সবার জন্য গান" },
        body: {
          en: "Nazrul wrote about three thousand songs — Nazrul Geeti — from playful children's rhymes like 'Lichu Chor' (The Lychee Thief) to songs of equality between all people and faiths. Bangladesh brought him to Dhaka with honour after independence, and his songs still open school events today.",
          bn: "নজরুল প্রায় তিন হাজার গান লিখেছেন — নজরুলগীতি — ‘লিচু চোর’-এর মতো মজার ছড়া থেকে সব মানুষ ও ধর্মের সমতার গান পর্যন্ত। স্বাধীনতার পর বাংলাদেশ তাঁকে সম্মানে ঢাকায় নিয়ে আসে; আজও স্কুলের অনুষ্ঠান শুরু হয় তাঁর গানে।",
        },
      },
    ],
    funFacts: [
      { en: "'Lichu Chor', his poem about a boy raiding a lychee orchard, still makes kids giggle a century later.", bn: "লিচু বাগানে হানা দেওয়া ছেলের ছড়া ‘লিচু চোর’ একশো বছর পরেও শিশুদের হাসায়।" },
      { en: "He played the flute so well as a boy that people called him Dukhu Mia's magic.", bn: "ছেলেবেলায় চমৎকার বাঁশি বাজাতেন — ডাকনাম ছিল দুখু মিয়া।" },
      { en: "Nazrul is buried beside Dhaka University's mosque, as he wished in one of his songs.", bn: "নিজের গানের ইচ্ছা অনুযায়ী নজরুল শুয়ে আছেন ঢাকা বিশ্ববিদ্যালয়ের মসজিদের পাশে।" },
    ],
    quiz: [
      {
        question: { en: "What is Kazi Nazrul Islam's title in Bangladesh?", bn: "বাংলাদেশে কাজী নজরুল ইসলামের পরিচয় কী?" },
        options: [
          { en: "National poet", bn: "জাতীয় কবি" },
          { en: "First president", bn: "প্রথম রাষ্ট্রপতি" },
          { en: "Famous cricketer", bn: "বিখ্যাত ক্রিকেটার" },
        ],
        answer: 0,
      },
      {
        question: { en: "Which poem gave him the name 'rebel poet'?", bn: "কোন কবিতা তাঁকে ‘বিদ্রোহী কবি’ নাম দেয়?" },
        options: [
          { en: "Bidrohi", bn: "বিদ্রোহী" },
          { en: "Gitanjali", bn: "গীতাঞ্জলি" },
          { en: "Sonar Tori", bn: "সোনার তরী" },
        ],
        answer: 0,
      },
      {
        question: { en: "What is 'Lichu Chor' about?", bn: "‘লিচু চোর’ কী নিয়ে লেখা?" },
        options: [
          { en: "A boy sneaking into a lychee orchard", bn: "লিচু বাগানে হানা দেওয়া এক ছেলে" },
          { en: "A river journey", bn: "নদীযাত্রা" },
          { en: "A cricket match", bn: "ক্রিকেট খেলা" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "literature-secondary", note: { en: "Nazrul's poems in the Bangla readers", bn: "বাংলা পাঠ্যবইয়ে নজরুলের কবিতা" } },
      { bookId: "amar-bangla-boi", note: { en: "'Lichu Chor' and other rhymes", bn: "‘লিচু চোর’সহ নানা ছড়া" } },
    ],
  },
  {
    id: "folk-tales",
    theme: "literature",
    emoji: "🧚",
    title: { en: "Thakurmar Jhuli — grandmother's sack of tales", bn: "ঠাকুরমার ঝুলি — রূপকথার ঝুলি" },
    tagline: {
      en: "Rakkhosh ogres, clever princes and the fairy tales of Bengal.",
      bn: "রাক্ষস, চতুর রাজপুত্র আর বাংলার রূপকথা।",
    },
    minutes: 3,
    sections: [
      {
        heading: { en: "A sack full of stories", bn: "গল্পে ভরা ঝুলি" },
        body: {
          en: "Over a hundred years ago, Dakshinaranjan Mitra Majumder travelled through Bengal's villages listening to grandmothers tell fairy tales — rupkotha — and collected them in a famous book called 'Thakurmar Jhuli' (Grandmother's Sack). Inside live the prince brothers Lalkamal and Nilkamal, scary rakkhosh ogres, the tiny bird-hero Byangoma, and kingdoms across seven seas and thirteen rivers.",
          bn: "একশো বছরেরও আগে দক্ষিণারঞ্জন মিত্র মজুমদার বাংলার গ্রামে গ্রামে ঘুরে দাদি-নানিদের মুখের রূপকথা শুনে সংগ্রহ করেন বিখ্যাত বই ‘ঠাকুরমার ঝুলি’তে। সেখানে আছে লালকমল-নীলকমল, ভয়ংকর রাক্ষস, ব্যাঙ্গমা-ব্যাঙ্গমি, আর সাত সমুদ্র তেরো নদীর পারের রাজ্য।",
        },
      },
      {
        heading: { en: "Why folk tales matter", bn: "রূপকথা কেন জরুরি" },
        body: {
          en: "Folk tales are how a culture whispers its values to children: be brave, be kind, be clever. Because these are literature, they are always told as they are — the platform never rewrites them, just as your Bangla school presents poems and stories unchanged. Ask a grandparent to tell you one — most know these tales by heart.",
          bn: "রূপকথার মধ্য দিয়েই সংস্কৃতি শিশুদের কানে কানে শেখায় — সাহসী হও, দয়ালু হও, বুদ্ধিমান হও। এগুলো সাহিত্য, তাই যেমন আছে তেমনই বলা হয় — বাংলা স্কুল যেমন কবিতা-গল্প অবিকল পড়ায়, এই প্ল্যাটফর্মও কখনো বদলায় না। দাদা-দাদি বা নানা-নানিকে একটি বলতে বোলো — বেশির ভাগেরই এসব গল্প মুখস্থ।",
        },
      },
    ],
    funFacts: [
      { en: "Rabindranath Tagore himself wrote the introduction to 'Thakurmar Jhuli'.", bn: "‘ঠাকুরমার ঝুলি’র ভূমিকা লিখেছিলেন স্বয়ং রবীন্দ্রনাথ ঠাকুর।" },
      { en: "'Sat shomudro tero nodi' — across seven seas and thirteen rivers — is the Bengali way of saying 'far, far away'.", bn: "‘সাত সমুদ্র তেরো নদীর পারে’ মানেই বাংলায় ‘অনেক অনেক দূরে’।" },
      { en: "These tales are now cartoons and animations that kids in Bangladesh watch today.", bn: "এই রূপকথাগুলো এখন কার্টুন-অ্যানিমেশন হয়ে বাংলাদেশের শিশুদের কাছে হাজির।" },
    ],
    quiz: [
      {
        question: { en: "What does 'Thakurmar Jhuli' mean?", bn: "‘ঠাকুরমার ঝুলি’ মানে কী?" },
        options: [
          { en: "Grandmother's sack (of stories)", bn: "ঠাকুরমার (গল্পের) ঝুলি" },
          { en: "The king's palace", bn: "রাজার প্রাসাদ" },
          { en: "A boat race", bn: "নৌকাবাইচ" },
        ],
        answer: 0,
      },
      {
        question: { en: "What is a 'rakkhosh'?", bn: "রূপকথায় ‘রাক্ষস’ কী?" },
        options: [
          { en: "A scary ogre from the fairy tales", bn: "রূপকথার ভয়ংকর দৈত্য" },
          { en: "A kind of sweet", bn: "এক রকম মিষ্টি" },
          { en: "A river boat", bn: "নদীর নৌকা" },
        ],
        answer: 0,
      },
      {
        question: { en: "Why does the platform never change stories and poems?", bn: "প্ল্যাটফর্ম কেন গল্প-কবিতা বদলায় না?" },
        options: [
          { en: "Literature must be shared exactly as it was written", bn: "সাহিত্য যেমন লেখা তেমনই পড়তে হয়" },
          { en: "Changing them is too much typing", bn: "বদলাতে অনেক টাইপ করতে হয়" },
          { en: "Stories are secret", bn: "গল্প গোপন জিনিস" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "amar-bangla-boi", note: { en: "Folk rhymes and tales for younger classes", bn: "ছোটদের জন্য লোকছড়া ও গল্প" } },
      { bookId: "literature-secondary", note: { en: "Folk literature selections", bn: "লোকসাহিত্যের নির্বাচিত পাঠ" } },
    ],
  },
  {
    id: "crafts-of-bengal",
    theme: "literature",
    emoji: "🧵",
    title: { en: "Nakshi kantha, Jamdani & rickshaw art", bn: "নকশি কাঁথা, জামদানি ও রিকশাচিত্র" },
    tagline: {
      en: "Crafts where every stitch and brushstroke tells a story.",
      bn: "যে শিল্পে প্রতিটি ফোঁড় আর তুলির টানে গল্প লুকানো।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "Stories stitched in cloth", bn: "কাপড়ে সেলাই করা গল্প" },
        body: {
          en: "A nakshi kantha is an embroidered quilt made from old saris, stitched with scenes of village life — peacocks, boats, harvests. Poet Jasimuddin's famous verse tale 'Nakshi Kanthar Math' is named after it. Jamdani, a fine hand-woven sari fabric with floating patterns, is so extraordinary that UNESCO recognises the art of weaving it as intangible cultural heritage of humanity.",
          bn: "নকশি কাঁথা পুরোনো শাড়ি দিয়ে বানানো নকশা-তোলা কাঁথা — তাতে সেলাই করা থাকে গ্রামের জীবন: ময়ূর, নৌকা, ফসল। কবি জসীমউদ্দীনের বিখ্যাত কাব্য ‘নকশী কাঁথার মাঠ’-এর নামও এ থেকেই। আর জামদানি — ভেসে থাকা নকশার সূক্ষ্ম হাতে-বোনা শাড়ি — এতই অসাধারণ যে ইউনেসকো এর বয়নশিল্পকে মানবতার অপরিমেয় সাংস্কৃতিক ঐতিহ্যের স্বীকৃতি দিয়েছে।",
        },
      },
      {
        heading: { en: "Galleries on three wheels", bn: "তিন চাকার চিত্রশালা" },
        body: {
          en: "Bangladesh's rickshaws are rolling art galleries — painted with movie stars, peacocks, flowers and dream cities in blazing colours. In 2023 UNESCO recognised rickshaw painting of Dhaka as intangible heritage too. Potters shape clay toys and shokher hari (painted pots), and weavers' looms click in villages like a country-wide heartbeat.",
          bn: "বাংলাদেশের রিকশা যেন চলমান চিত্রশালা — জ্বলজ্বলে রঙে আঁকা নায়ক-নায়িকা, ময়ূর, ফুল, স্বপ্নের শহর। ২০২৩ সালে ইউনেসকো ঢাকার রিকশাচিত্রকেও অপরিমেয় ঐতিহ্যের স্বীকৃতি দিয়েছে। কুমোরেরা গড়ে মাটির খেলনা আর শখের হাঁড়ি, গ্রামে গ্রামে তাঁতের খটখট শব্দ যেন দেশের হৃৎস্পন্দন।",
        },
      },
    ],
    funFacts: [
      { en: "A fine Jamdani sari can take weavers weeks — or months — to finish by hand.", bn: "একটি সূক্ষ্ম জামদানি বুনতে তাঁতির লাগে সপ্তাহ, কখনো মাস।" },
      { en: "Nakshi kantha stitching turns worn-out saris into warm heirlooms — recycling, a century early.", bn: "নকশি কাঁথা পুরোনো শাড়িকে বানায় উষ্ণ পারিবারিক সম্পদ — একশো বছর আগের রিসাইক্লিং!" },
      { en: "No two hand-painted rickshaws are exactly alike.", bn: "হাতে আঁকা দুটি রিকশা কখনো হুবহু এক রকম হয় না।" },
    ],
    quiz: [
      {
        question: { en: "What is a nakshi kantha made from?", bn: "নকশি কাঁথা কী দিয়ে তৈরি?" },
        options: [
          { en: "Old saris, embroidered with scenes", bn: "পুরোনো শাড়ি, নকশা সেলাই করা" },
          { en: "Plastic sheets", bn: "প্লাস্টিকের পাত" },
          { en: "Palm leaves", bn: "তালপাতা" },
        ],
        answer: 0,
      },
      {
        question: { en: "Which woven fabric's art is UNESCO-recognised heritage?", bn: "কোন বয়নশিল্প ইউনেসকো-স্বীকৃত ঐতিহ্য?" },
        options: [
          { en: "Jamdani", bn: "জামদানি" },
          { en: "Denim", bn: "ডেনিম" },
          { en: "Wool", bn: "উল" },
        ],
        answer: 0,
      },
      {
        question: { en: "What are Dhaka's rickshaws famous for?", bn: "ঢাকার রিকশা কীসের জন্য বিখ্যাত?" },
        options: [
          { en: "Bright hand-painted art", bn: "উজ্জ্বল হাতে আঁকা ছবি" },
          { en: "Going faster than cars", bn: "গাড়ির চেয়ে জোরে চলা" },
          { en: "Flying", bn: "উড়তে পারা" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "arts-crafts", note: { en: "Folk arts and crafts chapters", bn: "লোকশিল্প ও কারুশিল্প অধ্যায়" } },
      { bookId: "bgs-secondary", note: { en: "Culture and heritage chapters", bn: "সংস্কৃতি ও ঐতিহ্য অধ্যায়" } },
    ],
  },
  {
    id: "ethnic-communities",
    theme: "culture",
    emoji: "⛰️",
    title: { en: "The hill and plains communities", bn: "পাহাড় ও সমতলের জনগোষ্ঠী" },
    tagline: {
      en: "Chakma, Marma, Garo, Santal — many peoples, one Bangladesh.",
      bn: "চাকমা, মারমা, গারো, সাঁওতাল — নানা জাতি, এক বাংলাদেশ।",
    },
    minutes: 4,
    sections: [
      {
        heading: { en: "Many languages, many songs", bn: "নানা ভাষা, নানা গান" },
        body: {
          en: "Alongside Bengalis, Bangladesh is home to dozens of smaller ethnic communities with their own languages, dress and festivals. The Chakma and Marma live mostly in the Chittagong Hill Tracts, the Garo in the north, and the Santal in the north-west. Their weaving, bamboo dance and songs are part of the country's shared treasure.",
          bn: "বাঙালিদের পাশাপাশি বাংলাদেশে আছে নিজস্ব ভাষা, পোশাক আর উৎসবসহ বহু ক্ষুদ্র নৃগোষ্ঠী। চাকমা ও মারমারা মূলত পার্বত্য চট্টগ্রামে, গারোরা উত্তরে, সাঁওতালরা উত্তর-পশ্চিমে। তাঁদের বুনন, বাঁশনৃত্য আর গান দেশের সবার সম্পদ।",
        },
      },
      {
        heading: { en: "Boisabi — new year in the hills", bn: "বৈসাবি — পাহাড়ের নববর্ষ" },
        body: {
          en: "In mid-April, while Bengalis welcome Pohela Boishakh, the hill communities celebrate their own new-year festivals — Boisuk, Sangrai and Biju, together called Boisabi. Marma youths hold a joyful water festival, splashing water to wash away the old year. Learning about these neighbours is part of the NCTB curriculum, and respecting them is part of being Bangladeshi.",
          bn: "এপ্রিলের মাঝামাঝি বাঙালিরা যখন পহেলা বৈশাখে মাতে, পাহাড়ের জনগোষ্ঠীরা উদযাপন করে নিজেদের নববর্ষ — বৈসুক, সাংগ্রাই আর বিজু, একসঙ্গে বৈসাবি। মারমা তরুণেরা জলকেলিতে পুরোনো বছর ধুয়ে দেয়। এই প্রতিবেশীদের জানা এনসিটিবি পাঠ্যক্রমেরই অংশ, আর তাঁদের সম্মান করা বাংলাদেশি হওয়ারই অংশ।",
        },
      },
    ],
    funFacts: [
      { en: "The Garo community traditionally passes the family name from mother to child.", bn: "গারো সমাজে পারিবারিক পরিচয় চলে মায়ের ধারায়।" },
      { en: "Sangrai's water festival is cousins with water new-years across South-East Asia.", bn: "সাংগ্রাইয়ের জলকেলি দক্ষিণ-পূর্ব এশিয়ার জল-নববর্ষগুলোরই আত্মীয়।" },
      { en: "Pilgrims and travellers love the hill districts of Rangamati, Khagrachhari and Bandarban for their lakes and clouds.", bn: "হ্রদ আর মেঘের জন্য রাঙামাটি, খাগড়াছড়ি ও বান্দরবান সবার প্রিয়।" },
    ],
    quiz: [
      {
        question: { en: "Where do the Chakma and Marma mostly live?", bn: "চাকমা ও মারমারা মূলত কোথায় থাকেন?" },
        options: [
          { en: "The Chittagong Hill Tracts", bn: "পার্বত্য চট্টগ্রামে" },
          { en: "The Sundarbans", bn: "সুন্দরবনে" },
          { en: "Cox's Bazar beach", bn: "কক্সবাজার সৈকতে" },
        ],
        answer: 0,
      },
      {
        question: { en: "What is Boisabi?", bn: "বৈসাবি কী?" },
        options: [
          { en: "The hill communities' new-year festivals", bn: "পাহাড়ি জনগোষ্ঠীর নববর্ষ উৎসব" },
          { en: "A kind of fish curry", bn: "এক রকম মাছের তরকারি" },
          { en: "A cricket cup", bn: "ক্রিকেট কাপ" },
        ],
        answer: 0,
      },
      {
        question: { en: "What happens at the Sangrai water festival?", bn: "সাংগ্রাই জলোৎসবে কী হয়?" },
        options: [
          { en: "People splash water to wash away the old year", bn: "জল ছিটিয়ে পুরোনো বছর ধুয়ে দেওয়া হয়" },
          { en: "Everyone stays indoors", bn: "সবাই ঘরে থাকে" },
          { en: "Boats are burned", bn: "নৌকা পোড়ানো হয়" },
        ],
        answer: 0,
      },
    ],
    sources: [
      { bookId: "ethnic-culture", note: { en: "The dedicated NCTB book on these communities", bn: "এই জনগোষ্ঠীদের নিয়ে এনসিটিবির আলাদা বই" } },
      { bookId: "bgs-secondary", note: { en: "Diversity of Bangladesh chapters", bn: "বাংলাদেশের বৈচিত্র্য অধ্যায়" } },
    ],
  },
];

export function topicsByTheme(themeId: string): Topic[] {
  return topics.filter((topic) => topic.theme === themeId);
}
