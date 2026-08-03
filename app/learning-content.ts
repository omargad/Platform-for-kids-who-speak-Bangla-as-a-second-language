import type { CurriculumLevel } from "./curriculum";

export type LearningSkill = "listening" | "reading" | "speaking" | "writing" | "culture" | "mastery";

export type DialogueLine = {
  speaker: string;
  bn: string;
  transliteration: string;
  en: string;
};

export type QuickCheck = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type LessonExtension = {
  lessonId: string;
  level: CurriculumLevel;
  dialogue: DialogueLine[];
  listening: {
    focus: string;
    check: QuickCheck;
  };
  reading: {
    title: string;
    bn: string;
    en: string;
    check: QuickCheck;
  };
  speaking: {
    mission: string;
    roleA: string;
    roleB: string;
    pronunciation: string;
    success: string[];
  };
  writing: {
    mission: string;
    starters: string[];
    modelBn: string;
    modelEn: string;
    stretch: string;
  };
  watch: {
    before: string;
    during: string;
    after: string;
    segment: string;
  };
};

const content: LessonExtension[] = [
  {
    lessonId: "hello-me",
    level: "pre-a1",
    dialogue: [
      { speaker: "মায়া", bn: "হ্যালো! তোমার নাম কী?", transliteration: "hyālo! tomar nam ki?", en: "Hello! What is your name?" },
      { speaker: "রাফি", bn: "আমার নাম রাফি। তোমার নাম কী?", transliteration: "amar nam Rafi. tomar nam ki?", en: "My name is Rafi. What is your name?" },
      { speaker: "মায়া", bn: "আমার নাম মায়া। তুমি কেমন আছ?", transliteration: "amar nam Maya. tumi kemon achho?", en: "My name is Maya. How are you?" },
      { speaker: "রাফি", bn: "আমি ভালো আছি, ধন্যবাদ।", transliteration: "ami bhalo achhi, dhonnobad", en: "I am well, thank you." },
    ],
    listening: {
      focus: "Listen once for the two names. Listen again for the polite ending.",
      check: { prompt: "What is the boy’s name?", options: ["Bagh", "Rafi", "Maya"], answer: 1, explanation: "He says আমার নাম রাফি—my name is Rafi." },
    },
    reading: {
      title: "A new friend · নতুন বন্ধু",
      bn: "মায়া নদীর ধারে যায়। সেখানে রাফি আছে। মায়া বলে, ‘হ্যালো!’ রাফি বলে, ‘আমি ভালো আছি।’ তারা নতুন বন্ধু।",
      en: "Maya goes to the riverbank. Rafi is there. Maya says hello. Rafi says he is well. They are new friends.",
      check: { prompt: "Where do Maya and Rafi meet?", options: ["At the riverbank", "At school", "At a market"], answer: 0, explanation: "নদীর ধারে means ‘at the riverbank’." },
    },
    speaking: {
      mission: "Perform the four-line meeting, then swap in your own name.",
      roleA: "Greet, ask তোমার নাম কী?, then ask তুমি কেমন আছ?",
      roleB: "Say your name, ask the other person’s name, and answer politely.",
      pronunciation: "Keep আমি as two beats: আ-মি. In ভালো, let the ভ sound stay soft and voiced.",
      success: ["I used a greeting", "I said my name", "I finished politely"],
    },
    writing: {
      mission: "Make a two-line Bangla name card. Copying or tracing is welcome.",
      starters: ["আমার নাম ___.", "আমি ভালো আছি।"],
      modelBn: "আমার নাম মায়া। আমি ভালো আছি।",
      modelEn: "My name is Maya. I am well.",
      stretch: "Add the greeting your family uses most.",
    },
    watch: { before: "Predict which greeting you will hear first.", during: "Raise one finger each time you hear a greeting.", after: "Repeat one greeting and compare its rhythm with your own version.", segment: "Watch 0:00–1:31" },
  },
  {
    lessonId: "my-family",
    level: "pre-a1",
    dialogue: [
      { speaker: "রাফি", bn: "ইনি কে?", transliteration: "ini ke?", en: "Who is this?" },
      { speaker: "মায়া", bn: "ইনি আমার মা।", transliteration: "ini amar ma", en: "This is my mother." },
      { speaker: "রাফি", bn: "আর এ কে?", transliteration: "ar e ke?", en: "And who is this?" },
      { speaker: "মায়া", bn: "এ আমার ভাই।", transliteration: "e amar bhai", en: "This is my brother." },
    ],
    listening: { focus: "Listen for মা and ভাই. Point to an adult or child picture when you hear each introduction.", check: { prompt: "Who is introduced first?", options: ["Maya’s sister", "Maya’s mother", "Maya’s brother"], answer: 1, explanation: "ইনি আমার মা means ‘This is my mother’." } },
    reading: {
      title: "Maya’s picture · মায়ার ছবি",
      bn: "এটি মায়ার আঁকা ছবি। ছবিতে তার মা, বাবা আর ভাই আছে। মায়া ছবিটি রাফিকে দেখায়। রাফি বলে, ‘সুন্দর!’",
      en: "This is Maya’s drawing. Her mother, father and brother are in it. Maya shows the picture to Rafi. Rafi says it is beautiful.",
      check: { prompt: "What does Maya show Rafi?", options: ["A family drawing", "A red boat", "A school book"], answer: 0, explanation: "আঁকা ছবি is a drawing." },
    },
    speaking: { mission: "Introduce two real, chosen, community or imaginary family members.", roleA: "Ask ইনি কে? or এ কে?", roleB: "Answer ইনি/এ আমার ___. Add a name if you want.", pronunciation: "ভাই begins with a voiced ভ sound; touch your throat and feel it vibrate.", success: ["I asked who someone is", "I used আমার", "I respected private family choices"] },
    writing: { mission: "Label a safe family or character map with two Bangla sentences.", starters: ["ইনি আমার ___.", "এ আমার ___."], modelBn: "ইনি আমার নানি। এ আমার বোন।", modelEn: "This is my maternal grandmother. This is my sister.", stretch: "Add one kinship word your household uses." },
    watch: { before: "Choose two family words you expect to hear.", during: "Touch the matching picture whenever a family word is spoken.", after: "Teach one word to a trusted adult.", segment: "Watch 0:00–2:17" },
  },
  {
    lessonId: "numbers-colours",
    level: "pre-a1",
    dialogue: [
      { speaker: "মায়া", bn: "কয়টি ফুল আছে?", transliteration: "koyti phul achhe?", en: "How many flowers are there?" },
      { speaker: "রাফি", bn: "তিনটি ফুল আছে।", transliteration: "tinti phul achhe", en: "There are three flowers." },
      { speaker: "মায়া", bn: "ফুলগুলো কী রঙের?", transliteration: "phulgulo ki ronger?", en: "What colour are the flowers?" },
      { speaker: "রাফি", bn: "ফুলগুলো লাল।", transliteration: "phulgulo lal", en: "The flowers are red." },
    ],
    listening: { focus: "Listen for one number and one colour. Do not look at the transcript on the first play.", check: { prompt: "How many red flowers are there?", options: ["One", "Two", "Three"], answer: 2, explanation: "তিনটি means three items." } },
    reading: { title: "Bagh’s little flag · বাঘের ছোট পতাকা", bn: "বাঘ একটি পতাকা আঁকে। পতাকাটি সবুজ। মাঝখানে একটি লাল বৃত্ত আছে। পাশে তিনটি নীল ফুল আছে।", en: "Bagh draws a flag. It is green, with one red circle in the middle. Three blue flowers sit beside it.", check: { prompt: "What colour is the circle?", options: ["Blue", "Green", "Red"], answer: 2, explanation: "লাল means red." } },
    speaking: { mission: "Describe three small collections of objects using a number and colour.", roleA: "Ask কয়টি? or কী রঙের?", roleB: "Answer with number + টি and a colour.", pronunciation: "Keep the vowel in নীল long and clear; লাল has a broad আ sound.", success: ["I counted carefully", "I named a colour", "My words matched the objects"] },
    writing: { mission: "Draw and label two number-colour pictures.", starters: ["একটি ___", "তিনটি ___ ফুল"], modelBn: "একটি নীল নৌকা। তিনটি লাল ফুল।", modelEn: "One blue boat. Three red flowers.", stretch: "Count from four to ten with an adult and add one new number." },
    watch: { before: "Put ten safe objects in front of you.", during: "Move one object for each number you hear.", after: "Count the objects without the video, then count backwards with help.", segment: "Watch 0:00–3:42" },
  },
  {
    lessonId: "letters-sounds",
    level: "a1",
    dialogue: [
      { speaker: "শিক্ষক", bn: "এটি কোন অক্ষর?", transliteration: "eti kon okkhor?", en: "Which letter is this?" },
      { speaker: "মায়া", bn: "এটি ম।", transliteration: "eti mô", en: "This is ম." },
      { speaker: "শিক্ষক", bn: "ম দিয়ে কোন শব্দ?", transliteration: "mô diye kon shobdo?", en: "Which word begins with ম?" },
      { speaker: "মায়া", bn: "ম দিয়ে মা।", transliteration: "mô diye ma", en: "ম as in মা." },
    ],
    listening: { focus: "Listen for the letter name and the example word. Trace the letter in the air as you hear it.", check: { prompt: "Which word is built from the target letter?", options: ["মা", "নাম", "বাংলা"], answer: 0, explanation: "ম দিয়ে মা means ‘ম as in মা’." } },
    reading: { title: "A sign for Maya · মায়ার নামফলক", bn: "মায়া নিজের নাম লেখে: মায়া। সে প্রথমে ম অক্ষরটি খোঁজে। তারপর আ-কার দেখে। শেষে সে মাত্রা টানে।", en: "Maya writes her name. First she finds the letter ম, then notices the vowel sign, and finally draws the roofline.", check: { prompt: "Which letter does Maya find first?", options: ["ক", "ম", "ব"], answer: 1, explanation: "The passage names ম first." } },
    speaking: { mission: "Be a sound detective: say a letter, its sound and one word that contains it.", roleA: "Show or name অ, আ, ক, ম, ন or ব.", roleB: "Say the sound and find it in a word.", pronunciation: "Separate the letter name from the word sound; then blend slowly rather than adding an English vowel.", success: ["I named a letter", "I connected sound and shape", "I blended without rushing"] },
    writing: { mission: "Use trace–copy–cover for three letters and two short words.", starters: ["ম  ম  ম", "মা", "নাম"], modelBn: "মা  নাম", modelEn: "mother · name", stretch: "Circle the মাত্রা and one vowel sign in your own writing." },
    watch: { before: "Choose one target letter and draw it large.", during: "Pause after each stroke and copy it with your finger first.", after: "Compare the shape—not neatness—and circle the clearest attempt.", segment: "Use the section for অ, আ, ক, ম, ন and ব" },
  },
  {
    lessonId: "food-please",
    level: "a1",
    dialogue: [
      { speaker: "অতিথি", bn: "পানি দিন, দয়া করে।", transliteration: "pani din, doya kore", en: "Please give me water." },
      { speaker: "আপা", bn: "এই নাও। আর কী চাও?", transliteration: "ei nao. ar ki chao?", en: "Here you are. What else would you like?" },
      { speaker: "অতিথি", bn: "আমার ডাল ভালো লাগে।", transliteration: "amar dal bhalo lage", en: "I like lentils." },
      { speaker: "আপা", bn: "ডাল আর ভাত নাও।", transliteration: "dal ar bhat nao", en: "Have lentils and rice." },
    ],
    listening: { focus: "Listen for the polite request and the food preference.", check: { prompt: "What does the guest ask for first?", options: ["Mango", "Water", "Rice"], answer: 1, explanation: "পানি দিন, দয়া করে is a polite request for water." } },
    reading: { title: "A small picnic · ছোট পিকনিক", bn: "মায়া আর রাফি পিকনিকে যায়। মায়ার আম ভালো লাগে। রাফির ভাত আর ডাল ভালো লাগে। তারা পানি চায় এবং সবাইকে ধন্যবাদ বলে।", en: "Maya and Rafi go on a picnic. Maya likes mango. Rafi likes rice and lentils. They ask for water and thank everyone.", check: { prompt: "Which food does Maya like?", options: ["Mango", "Fish", "Rice"], answer: 0, explanation: "মায়ার আম ভালো লাগে means Maya likes mango." } },
    speaking: { mission: "Run a two-minute café using picture cards, including one preference and two polite requests.", roleA: "Welcome the guest and ask আর কী চাও?", roleB: "Request an item with দিন, দয়া করে and say what you like.", pronunciation: "In মাছ, finish with a soft aspirated ছ sound; do not turn it into English ‘sh’. Sensible variation is welcome.", success: ["I made a respectful request", "I expressed a true preference", "I thanked the host"] },
    writing: { mission: "Create a tiny menu and order from it in two sentences.", starters: ["আমার ___ ভালো লাগে।", "___ দিন, দয়া করে।"], modelBn: "আমার আম ভালো লাগে। পানি দিন, দয়া করে।", modelEn: "I like mango. Please give me water.", stretch: "Add a truthful food you do not like or have not tried yet." },
    watch: { before: "Name three foods you expect to see.", during: "Make a tally each time a target food or colour appears.", after: "Say one preference using আমার ___ ভালো লাগে।", segment: "Use 0:00–4:00 first; continue only if useful" },
  },
  {
    lessonId: "my-day",
    level: "a1",
    dialogue: [
      { speaker: "রাফি", bn: "সকালে তুমি কী করো?", transliteration: "shokale tumi ki koro?", en: "What do you do in the morning?" },
      { speaker: "মায়া", bn: "সকালে আমি উঠি আর খাই।", transliteration: "shokale ami uthi ar khai", en: "In the morning I get up and eat." },
      { speaker: "রাফি", bn: "বিকেলে কী করো?", transliteration: "bikele ki koro?", en: "What do you do in the afternoon?" },
      { speaker: "মায়া", bn: "বিকেলে আমি খেলি। তারপর পড়ি।", transliteration: "bikele ami kheli. tarpor pori", en: "I play in the afternoon. Then I study." },
    ],
    listening: { focus: "Listen for the time words সকালে and বিকেলে and put two action cards in order.", check: { prompt: "What does Maya do after she plays?", options: ["She sleeps", "She studies", "She eats"], answer: 1, explanation: "তারপর পড়ি means ‘then I study/read’." } },
    reading: { title: "Rafi’s Saturday · রাফির শনিবার", bn: "শনিবার সকালে রাফি দেরিতে ওঠে। সে পরিবারের সঙ্গে খায়। দুপুরে সে বাংলা পড়ে। বিকেলে বন্ধুর সঙ্গে খেলে। রাতে সে গান শোনে এবং ঘুমায়।", en: "On Saturday Rafi gets up late, eats with family, studies Bangla at noon, plays with a friend in the afternoon, then listens to music and sleeps at night.", check: { prompt: "When does Rafi study Bangla?", options: ["In the morning", "At noon", "At night"], answer: 1, explanation: "দুপুরে means at noon." } },
    speaking: { mission: "Tell a truthful four-part day using time cards and তারপর.", roleA: "Ask a routine question for morning or afternoon.", roleB: "Answer, sequence one more action, then ask back.", pronunciation: "Keep the ending -ি audible in উঠি, খাই, পড়ি, খেলি and যাই; it helps mark the ‘I’ form.", success: ["I used a time word", "I linked actions with তারপর", "I asked a partner a question"] },
    writing: { mission: "Write a four-box routine with one short sentence in each box.", starters: ["সকালে আমি ___.", "তারপর আমি ___.", "বিকেলে আমি ___.", "রাতে আমি ___."], modelBn: "সকালে আমি উঠি। তারপর আমি খাই। বিকেলে আমি খেলি। রাতে আমি ঘুমাই।", modelEn: "I get up in the morning, then eat, play in the afternoon and sleep at night.", stretch: "Add প্রথমে and one clock time if you know it." },
    watch: { before: "Draw four time-of-day boxes.", during: "Place each action you recognise into a box.", after: "Retell the sequence without replaying the video.", segment: "Watch the first routine sequence; pause after each action" },
  },
  {
    lessonId: "school-home",
    level: "a2",
    dialogue: [
      { speaker: "মায়া", bn: "আজ স্কুলে কী শিখলে?", transliteration: "aj skule ki shikhle?", en: "What did you learn at school today?" },
      { speaker: "রাফি", bn: "আমি নদী নিয়ে পড়েছি।", transliteration: "ami nodi niye porechhi", en: "I studied rivers." },
      { speaker: "মায়া", bn: "বাড়িতে বাংলা বলো?", transliteration: "barite Bangla bolo?", en: "Do you speak Bangla at home?" },
      { speaker: "রাফি", bn: "হ্যাঁ, নানির সঙ্গে বলি।", transliteration: "hya, nanir shonge boli", en: "Yes, I speak it with my grandmother." },
    ],
    listening: { focus: "Listen for two places and the people or activities connected to them.", check: { prompt: "Who speaks Bangla with Rafi at home?", options: ["His teacher", "His grandmother", "His friend"], answer: 1, explanation: "নানির সঙ্গে means ‘with his maternal grandmother’." } },
    reading: { title: "Two language places · ভাষার দুই জায়গা", bn: "স্কুলে লীনা ইংরেজিতে পড়ে এবং বন্ধুদের সঙ্গে কথা বলে। বাড়িতে সে বাবা-মায়ের সঙ্গে বাংলা শোনে। কখনো উত্তর ইংরেজিতে দেয়, কিন্তু বাংলা শব্দও যোগ করে। দুই ভাষাই তার শেখার অংশ।", en: "At school Lina reads and talks with friends in English. At home she hears Bangla with her parents. Sometimes she answers in English but adds Bangla words. Both languages belong in her learning.", check: { prompt: "How does Lina sometimes answer?", options: ["Only in Bangla", "In English with some Bangla", "She never answers"], answer: 1, explanation: "The passage describes a flexible bilingual response." } },
    speaking: { mission: "Compare where, when and with whom you use different languages; fictional examples are allowed.", roleA: "Ask কোথায়?, কখন? or কার সঙ্গে?", roleB: "Answer with a place, time or person and one follow-up detail.", pronunciation: "Practise the contrast between কোথায় (where) and কখন (when); stretch the vowel in কোথায়.", success: ["I named a language setting", "I gave one detail", "I did not pressure anyone to disclose private information"] },
    writing: { mission: "Build a safe two-column language map for school and home/community.", starters: ["স্কুলে আমি ___.", "বাড়িতে আমি ___.", "___-এর সঙ্গে আমি বাংলা বলি।"], modelBn: "স্কুলে আমি ইংরেজি পড়ি। বাড়িতে আমি বাংলা শুনি। নানির সঙ্গে আমি বাংলা বলি।", modelEn: "I study in English at school, hear Bangla at home and speak Bangla with my grandmother.", stretch: "Add কিন্তু or আবার to show a contrast." },
    watch: { before: "List the settings where you might hear Bangla.", during: "Note one phrase for school and one for home.", after: "Compare the speaker’s language map with your own or a fictional learner’s.", segment: "Watch one short conversation segment" },
  },
  {
    lessonId: "directions",
    level: "a2",
    dialogue: [
      { speaker: "ভ্রমণকারী", bn: "বাজারটা কোথায়?", transliteration: "bazarta kothay?", en: "Where is the market?" },
      { speaker: "দোকানি", bn: "সোজা যান। তারপর বাঁ দিকে যান।", transliteration: "shoja jan. tarpor ba dike jan", en: "Go straight. Then turn left." },
      { speaker: "ভ্রমণকারী", bn: "নদীর আগে না পরে?", transliteration: "nodir age na pore?", en: "Before or after the river?" },
      { speaker: "দোকানি", bn: "নদীর আগে, স্কুলের পাশে।", transliteration: "nodir age, skuler pashe", en: "Before the river, beside the school." },
    ],
    listening: { focus: "Follow the route with a finger. Listen for straight, left and beside.", check: { prompt: "Where is the market?", options: ["After the river", "Beside the school", "Behind the house"], answer: 1, explanation: "স্কুলের পাশে means beside the school." } },
    reading: { title: "The missing bookshop · হারানো বইয়ের দোকান", bn: "মায়া বইয়ের দোকান খুঁজছে। সে প্রথমে সোজা যায়। মসজিদের পরে ডান দিকে ঘোরে। দোকানটি বড় গাছের সামনে এবং বাজারের পাশে।", en: "Maya is looking for a bookshop. She goes straight, turns right after the mosque, and finds it in front of a large tree beside the market.", check: { prompt: "When does Maya turn right?", options: ["After the mosque", "Before the river", "At the school"], answer: 0, explanation: "মসজিদের পরে means after the mosque." } },
    speaking: { mission: "Guide a partner across a simple map with at least three direction phrases.", roleA: "Ask for a place and repeat one direction to confirm it.", roleB: "Give a safe, clear route using সোজা, দিকে and পাশে.", pronunciation: "In কোথায়, keep the final -য় as a glide rather than a separate hard consonant.", success: ["I asked where", "I gave three route clues", "My partner reached the target"] },
    writing: { mission: "Write directions from the boat stop to one map landmark.", starters: ["প্রথমে সোজা যান।", "তারপর ___ দিকে যান।", "___-এর পাশে।"], modelBn: "প্রথমে সোজা যান। তারপর বাঁ দিকে যান। বাজারটি স্কুলের পাশে।", modelEn: "Go straight first, then left. The market is beside the school.", stretch: "Add আগে or পরে to remove ambiguity." },
    watch: { before: "Sketch a three-landmark map.", during: "Move a counter whenever you hear a direction.", after: "Give the same route without the video, then reverse it.", segment: "Use the directions/conversation segment" },
  },
  {
    lessonId: "six-seasons",
    level: "a2",
    dialogue: [
      { speaker: "মায়া", bn: "তোমার প্রিয় ঋতু কোনটি?", transliteration: "tomar priyo ritu konti?", en: "Which is your favourite season?" },
      { speaker: "রাফি", bn: "আমার বর্ষা ভালো লাগে।", transliteration: "amar borsha bhalo lage", en: "I like the monsoon." },
      { speaker: "মায়া", bn: "কেন?", transliteration: "keno?", en: "Why?" },
      { speaker: "রাফি", bn: "কারণ বৃষ্টি হয় আর নদী ভরে।", transliteration: "karon brishti hoy ar nodi bhore", en: "Because it rains and the river fills." },
    ],
    listening: { focus: "Listen for the season, then the two reasons that follow কারণ.", check: { prompt: "Why does Rafi like the monsoon?", options: ["It is cold", "It rains and rivers fill", "Mangoes are always ripe"], answer: 1, explanation: "কারণ introduces his reason: rain falls and the river fills." } },
    reading: { title: "A year of changes · বদলের বছর", bn: "বাংলাদেশে ছয় ঋতুর কথা বলা হয়। গ্রীষ্মে গরম পড়ে এবং ফল পাকে। বর্ষায় অনেক বৃষ্টি হয়। শরতে আকাশ পরিষ্কার হতে পারে। ঋতুর অভিজ্ঞতা অঞ্চল ও বছরের সঙ্গে বদলায়।", en: "Bangladesh is often described through six seasons. Summer brings heat and ripening fruit; monsoon brings rain; autumn can bring clear skies. Experiences vary by place and year.", check: { prompt: "What important caution does the passage add?", options: ["Every place feels identical", "Seasons never change", "Experience varies by place and year"], answer: 2, explanation: "The passage avoids treating every region or year as identical." } },
    speaking: { mission: "Choose a season, describe two signs and give a personal reason.", roleA: "Ask প্রিয় ঋতু কোনটি? and কেন?", roleB: "Answer with a season, কারণ and two observed details.", pronunciation: "Break ঋতু into two light beats. In বৃষ্টি, keep the consonant cluster compact without adding a strong extra vowel.", success: ["I named a season", "I used কারণ", "I separated observation from generalisation"] },
    writing: { mission: "Create a four-sentence seasonal postcard.", starters: ["এখন ___ ঋতু।", "আকাশ ___.", "___ হয়।", "আমার ___ ভালো লাগে, কারণ ___."], modelBn: "এখন বর্ষা ঋতু। আকাশ মেঘলা। বৃষ্টি হয়। আমার বর্ষা ভালো লাগে, কারণ নদী ভরে।", modelEn: "It is monsoon. The sky is cloudy and it rains. I like monsoon because rivers fill.", stretch: "Compare the season with weather where you live." },
    watch: { before: "Make six season cards or a six-part wheel.", during: "Add one image or weather word to each season.", after: "Choose which claims need checking for a particular region or year.", segment: "Watch one complete six-season explanation" },
  },
  {
    lessonId: "river-journey",
    level: "b1",
    dialogue: [
      { speaker: "মায়া", bn: "গতকাল কোথায় গিয়েছিলে?", transliteration: "gotokal kothay giyechhile?", en: "Where did you go yesterday?" },
      { speaker: "রাফি", bn: "আমি নৌকায় করে গ্রামে গিয়েছিলাম।", transliteration: "ami noukay kore grame giyechhilam", en: "I went to the village by boat." },
      { speaker: "মায়া", bn: "পথে কী দেখেছিলে?", transliteration: "pothe ki dekhechhile?", en: "What did you see on the way?" },
      { speaker: "রাফি", bn: "প্রথমে জেলেদের দেখলাম, পরে বৃষ্টি নামল।", transliteration: "prothome jeleder dekhlam, pore brishti namlo", en: "First I saw fishers; later rain began." },
    ],
    listening: { focus: "Build a three-event timeline while listening; notice the past-time markers.", check: { prompt: "What happened after Rafi saw the fishers?", options: ["The boat stopped", "Rain began", "He reached school"], answer: 1, explanation: "পরে বৃষ্টি নামল means later the rain began." } },
    reading: { title: "The late ferry · দেরি করা ফেরি", bn: "সকাল আটটায় আমাদের ফেরি ছাড়ার কথা ছিল। কিন্তু ঘন কুয়াশার জন্য আমরা অপেক্ষা করলাম। কুয়াশা কমলে মাঝি ধীরে নৌকা চালালেন। পথে সূর্য উঠল, আর নদীর দুই পাড় স্পষ্ট হলো। দেরি হলেও যাত্রাটি শান্ত ও সুন্দর ছিল।", en: "The ferry was due at eight, but thick fog delayed it. When visibility improved, the boatman moved slowly. The sun rose and both banks became clear. Despite the delay, the journey was calm and beautiful.", check: { prompt: "Why was the ferry late?", options: ["Heavy traffic", "Thick fog", "A broken bridge"], answer: 1, explanation: "ঘন কুয়াশার জন্য gives the cause: thick fog." } },
    speaking: { mission: "Tell a 60-second journey with a beginning, complication, response and ending.", roleA: "Ask when, where, what happened next and how it felt.", roleB: "Narrate in order and use কারণ/কিন্তু to connect cause and contrast.", pronunciation: "Keep the past ending -ছিলাম as a connected rhythm rather than four equally stressed syllables.", success: ["My events were in order", "I explained a cause", "I included a feeling or evaluation"] },
    writing: { mission: "Draft a five-part travel log.", starters: ["গতকাল আমি ___.", "প্রথমে ___.", "হঠাৎ ___.", "তাই ___.", "শেষে ___."], modelBn: "গতকাল আমি নদীপথে গিয়েছিলাম। প্রথমে আকাশ পরিষ্কার ছিল। হঠাৎ বৃষ্টি নামল। তাই আমরা ছাউনি দিলাম। শেষে নিরাপদে পৌঁছালাম।", modelEn: "Yesterday I travelled by river. The sky was clear, then rain began, so we put up a cover and arrived safely.", stretch: "Add one sensory detail and one reflection." },
    watch: { before: "Predict three things a river traveller might notice.", during: "Record the sequence and one cause-and-effect link.", after: "Retell the journey from another person’s point of view.", segment: "Watch one 3–5 minute journey segment" },
  },
  {
    lessonId: "sundarbans-voices",
    level: "b1",
    dialogue: [
      { speaker: "গাইড", bn: "সুন্দরবন কেন বিশেষ?", transliteration: "Sundorbon keno bishesh?", en: "Why is the Sundarbans special?" },
      { speaker: "মায়া", bn: "এটি বড় একটি ম্যানগ্রোভ বন।", transliteration: "eti boro ekti mangrove bon", en: "It is a large mangrove forest." },
      { speaker: "গাইড", bn: "মানুষ কীভাবে এর ওপর নির্ভর করে?", transliteration: "manush kibhabe er upor nirbhor kore?", en: "How do people depend on it?" },
      { speaker: "মায়া", bn: "অনেকে মাছ, মধু ও নদীপথের সঙ্গে যুক্ত।", transliteration: "oneke machh, modhu o nodipother shonge jukto", en: "Many are connected with fishing, honey and river routes." },
    ],
    listening: { focus: "Separate statements about the ecosystem from statements about people’s livelihoods.", check: { prompt: "Which livelihoods are mentioned?", options: ["Mining and skiing", "Fishing and honey collection", "Only tourism"], answer: 1, explanation: "The dialogue mentions মাছ and মধু." } },
    reading: { title: "One forest, many voices · এক বন, অনেক কণ্ঠ", bn: "সুন্দরবন জোয়ার-ভাটার ম্যানগ্রোভ বন। লবণাক্ত পানি, নদী ও কাদামাটির চর এর পরিবেশ গড়ে তোলে। বাঘ, হরিণ, পাখি ও জলজ প্রাণী এখানে থাকে। একই সঙ্গে বনসংলগ্ন মানুষের জীবিকা ও নিরাপত্তাও গুরুত্বপূর্ণ। সংরক্ষণ নিয়ে কথা বললে মানুষ ও প্রকৃতি—দুই দিকই শুনতে হয়।", en: "The Sundarbans is a tidal mangrove shaped by saltwater, rivers and mudflats. It supports diverse wildlife and nearby livelihoods. Conservation discussions need to consider both ecosystems and people’s safety and work.", check: { prompt: "What balanced approach does the passage recommend?", options: ["Discuss only tigers", "Listen to both people and nature", "Ignore livelihoods"], answer: 1, explanation: "The final sentence explicitly holds both perspectives together." } },
    speaking: { mission: "Give a balanced two-minute explanation using one ecosystem fact, one livelihood fact and one conservation question.", roleA: "Interview as a young reporter and ask for evidence.", roleB: "Answer as a guide, separating verified facts from uncertainty.", pronunciation: "Practise the consonant sequence in সুন্দরবন slowly, then connect it at natural speed.", success: ["I included two perspectives", "I attributed a verified fact", "I asked rather than assumed"] },
    writing: { mission: "Write an evidence-based visitor card.", starters: ["সুন্দরবন হলো ___.", "এখানে ___.", "অনেক মানুষ ___.", "দায়িত্বশীল দর্শনার্থী ___."], modelBn: "সুন্দরবন একটি জোয়ার-ভাটার ম্যানগ্রোভ বন। এখানে সমৃদ্ধ জীববৈচিত্র্য আছে। অনেক মানুষের জীবন নদী ও বনের সঙ্গে যুক্ত। দায়িত্বশীল দর্শনার্থী নির্দেশনা মানে।", modelEn: "The Sundarbans is a tidal mangrove with rich biodiversity and river-connected livelihoods. Responsible visitors follow local guidance.", stretch: "Add a source credit and one unanswered question." },
    watch: { before: "Write one question about wildlife and one about local people.", during: "Label each claim fact, opinion or unanswered.", after: "Check one claim against the linked UNESCO source.", segment: "Watch 0:00–5:00, then select one later section" },
  },
  {
    lessonId: "friendship-help",
    level: "b1",
    dialogue: [
      { speaker: "রাফি", bn: "তুমি চিন্তিত দেখাচ্ছ। কী হয়েছে?", transliteration: "tumi chintito dekhachchho. ki hoyechhe?", en: "You look worried. What happened?" },
      { speaker: "মায়া", bn: "আমার বইটি খুঁজে পাচ্ছি না।", transliteration: "amar boiti khuje pachchhi na", en: "I cannot find my book." },
      { speaker: "রাফি", bn: "আমি তোমাকে খুঁজতে সাহায্য করব।", transliteration: "ami tomake khujte shahajjo korbo", en: "I will help you look." },
      { speaker: "মায়া", bn: "ধন্যবাদ। আমরা একসঙ্গে খুঁজি।", transliteration: "dhonnobad. amra ekshonge khuji", en: "Thank you. Let us look together." },
    ],
    listening: { focus: "Identify the problem, the offer of help and the agreed next action.", check: { prompt: "What will the friends do together?", options: ["Look for the book", "Buy a boat", "Go home"], answer: 0, explanation: "আমরা একসঙ্গে খুঁজি means ‘let us look together’." } },
    reading: { title: "The team poster · দলের পোস্টার", bn: "দলের পোস্টার শেষ হয়নি বলে সারা হতাশ ছিল। ইমন প্রথমে তার কথা শুনল। তারপর কাজগুলো ছোট ভাগে ভাগ করল। একজন ছবি আঁকল, একজন তথ্য যাচাই করল, আর সারা শিরোনাম লিখল। সাহায্য মানে সব কাজ করে দেওয়া নয়; একসঙ্গে পথ খুঁজে দেওয়া।", en: "Sara felt upset because the team poster was unfinished. Imon listened, divided the work, and helped everyone take a role. Helping did not mean doing everything for her; it meant finding a way together.", check: { prompt: "What kind of help worked best?", options: ["Doing all Sara’s work", "Dividing work and collaborating", "Ignoring the deadline"], answer: 1, explanation: "The team shared responsibility and worked together." } },
    speaking: { mission: "Role-play noticing a problem, listening, offering two choices and agreeing on one.", roleA: "Describe a safe fictional problem and say how you feel.", roleB: "Acknowledge the feeling, offer help and check whether the idea is welcome.", pronunciation: "In সাহায্য, slow down the middle consonants before saying the whole word naturally.", success: ["I listened before solving", "I offered help respectfully", "We agreed on a next step"] },
    writing: { mission: "Write a supportive four-message exchange.", starters: ["কী হয়েছে?", "আমি ___ পাচ্ছি না।", "আমি তোমাকে ___ সাহায্য করব।", "আমরা একসঙ্গে ___."], modelBn: "কী হয়েছে? আমি প্রশ্নটি বুঝতে পারছি না। আমি তোমাকে পড়তে সাহায্য করব। আমরা একসঙ্গে চেষ্টা করি।", modelEn: "What happened? I do not understand the question. I will help you read it. Let us try together.", stretch: "Add a respectful boundary: কখন একজন বড় মানুষের সাহায্য দরকার?" },
    watch: { before: "Predict one helpful and one unhelpful response.", during: "Pause when a character’s feeling or decision changes.", after: "Rewrite one line to make the help more respectful.", segment: "Choose one complete friendship story" },
  },
  {
    lessonId: "language-movement",
    level: "b2",
    dialogue: [
      { speaker: "শিক্ষার্থী", bn: "একুশে ফেব্রুয়ারি কেন স্মরণ করা হয়?", transliteration: "ekushe February keno shoron kora hoy?", en: "Why is 21 February remembered?" },
      { speaker: "গবেষক", bn: "১৯৫২ সালে বাংলা ভাষার স্বীকৃতির দাবিতে মানুষ আন্দোলন করেছিল।", transliteration: "1952 shale Bangla bhashar shikritir dabite manush andolon korechhilo", en: "In 1952 people protested for recognition of Bangla." },
      { speaker: "শিক্ষার্থী", bn: "দিনটি এখন বিশ্বজুড়ে কীভাবে পালিত হয়?", transliteration: "dinti ekhon bishwojure kibhabe palito hoy?", en: "How is the day now observed worldwide?" },
      { speaker: "গবেষক", bn: "এটি ভাষাগত বৈচিত্র্য ও মাতৃভাষার অধিকার নিয়ে ভাবার দিন।", transliteration: "eti bhashagoto boichitro o matribhashar odhikar niye bhabar din", en: "It is a day to consider linguistic diversity and mother-language rights." },
    ],
    listening: { focus: "Note one historical cause and one present-day significance; do not merge them.", check: { prompt: "Which two layers does the dialogue connect?", options: ["A local history and global language rights", "A recipe and a festival", "Only one person’s biography"], answer: 0, explanation: "It moves from the 1952 movement to present international observance." } },
    reading: { title: "From Dhaka to an international day · ঢাকা থেকে আন্তর্জাতিক দিবস", bn: "১৯৫২ সালের ভাষা আন্দোলন তৎকালীন পূর্ব বাংলার রাজনৈতিক ও সাংস্কৃতিক ইতিহাসের একটি গুরুত্বপূর্ণ অধ্যায়। ২১ ফেব্রুয়ারিতে নিহত ভাষা আন্দোলনকারীদের স্মরণে শহীদ মিনারে ফুল দেওয়ার প্রথা গড়ে ওঠে। পরে ইউনেস্কো ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে। ইতিহাসটি ব্যাখ্যা করতে হলে প্রতিবাদ, রাষ্ট্রভাষার দাবি, স্মৃতি এবং বিশ্বব্যাপী ভাষাগত বৈচিত্র্য—প্রতিটি স্তর আলাদা করে দেখা দরকার।", en: "The 1952 Language Movement is a major chapter in the political and cultural history of then East Bengal. Memorial practices developed around 21 February, and UNESCO later proclaimed International Mother Language Day. A careful account distinguishes protest, the state-language demand, remembrance and today’s global focus on linguistic diversity.", check: { prompt: "Why should the historical layers be separated?", options: ["To make the story shorter", "To avoid confusing events, memory and later global recognition", "Because sources are unnecessary"], answer: 1, explanation: "Accurate chronology prevents later meanings being projected backwards." } },
    speaking: { mission: "Give a two-minute explanation that distinguishes what happened, how it is remembered and why it matters now.", roleA: "Ask for dates, actors, evidence and present significance.", roleB: "Answer with cautious wording and name the source of one claim.", pronunciation: "Practise the rhythm of আন্তর্জাতিক মাতৃভাষা দিবস in three chunks before joining it.", success: ["My chronology was clear", "I separated evidence from interpretation", "I connected history with language diversity"] },
    writing: { mission: "Draft a museum label for younger bilingual visitors.", starters: ["১৯৫২ সালে ___.", "২১ ফেব্রুয়ারি ___.", "পরে ইউনেস্কো ___.", "আজ দিনটি ___."], modelBn: "১৯৫২ সালে বাংলা ভাষার স্বীকৃতির দাবিতে আন্দোলন হয়। ২১ ফেব্রুয়ারি শহীদদের স্মরণ করা হয়। পরে ইউনেস্কো দিনটিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করে। আজ এটি ভাষাগত বৈচিত্র্য নিয়ে ভাবার দিন।", modelEn: "The label links the 1952 movement and memorialisation with UNESCO’s later international designation and today’s focus on language diversity.", stretch: "Add one primary or authoritative source and one sentence about what the short label cannot cover." },
    watch: { before: "Build a blank timeline with 1952, 1999 and today.", during: "Place each claim on the timeline and note who is speaking.", after: "Verify two claims against UNESCO or another authoritative source.", segment: "Watch the full 9:52 commentary in two parts" },
  },
  {
    lessonId: "heritage-comparison",
    level: "b2",
    dialogue: [
      { speaker: "মায়া", bn: "সুন্দরবন আর পাহাড়পুরের একটি সাদৃশ্য কী?", transliteration: "Sundorbon ar Paharpurer ekti shadrishyo ki?", en: "What is one similarity between the Sundarbans and Paharpur?" },
      { speaker: "রাফি", bn: "দুটিই বিশ্ব ঐতিহ্য স্থান।", transliteration: "dutii bishwo oitijjho sthan", en: "Both are World Heritage sites." },
      { speaker: "মায়া", bn: "প্রধান পার্থক্য কী?", transliteration: "prodhan parthokko ki?", en: "What is the main difference?" },
      { speaker: "রাফি", bn: "একটি প্রাকৃতিক বন, অন্যটি প্রাচীন সাংস্কৃতিক স্থাপনা।", transliteration: "ekti prakritik bon, onnoti prachin sangskritik sthapona", en: "One is a natural forest; the other is an ancient cultural site." },
    ],
    listening: { focus: "Listen for the shared category and the comparison criterion.", check: { prompt: "Which criterion distinguishes the two sites?", options: ["Natural and cultural heritage", "Ticket colour", "Distance from Australia"], answer: 0, explanation: "The dialogue compares the kind of heritage value." } },
    reading: { title: "Three sites, one fair table · তিন স্থান, একটি ন্যায্য ছক", bn: "সুন্দরবন প্রাকৃতিক বৈচিত্র্যের জন্য স্বীকৃত। বাগেরহাটের মসজিদনগর মধ্যযুগীয় নগর ও স্থাপত্যের প্রমাণ বহন করে। পাহাড়পুরের বিহার একটি গুরুত্বপূর্ণ বৌদ্ধ শিক্ষাকেন্দ্রের ধ্বংসাবশেষ। তিনটিই মূল্যবান, কিন্তু একই কারণে নয়। ন্যায্য তুলনায় অবস্থান, সময়কাল, মূল মূল্য, ঝুঁকি এবং দর্শনার্থীর দায়িত্ব—একই মানদণ্ডে তথ্য সাজাতে হয়।", en: "The Sundarbans is recognised for natural values, Bagerhat for evidence of a medieval city and architecture, and Paharpur for the remains of an influential Buddhist centre. A fair comparison uses the same criteria across all three.", check: { prompt: "What makes a comparison fair?", options: ["Using the same criteria", "Ranking sites by personal taste", "Repeating one fact"], answer: 0, explanation: "Shared criteria let similarities and differences carry meaning." } },
    speaking: { mission: "Present a 90-second comparison using one similarity, two differences and a conclusion.", roleA: "Ask which evidence supports each comparison.", roleB: "Use দুটির মধ্যে and অন্যদিকে to keep the structure explicit.", pronunciation: "Break বিশ্ব ঐতিহ্য into two phrases; avoid rushing the joined consonants in ঐতিহ্য.", success: ["I compared like with like", "I used evidence", "I avoided declaring one site ‘best’"] },
    writing: { mission: "Complete a five-criterion comparison and turn it into one analytical paragraph.", starters: ["দুটির মধ্যে একটি সাদৃশ্য হলো ___.", "অন্যদিকে, প্রধান পার্থক্য হলো ___.", "এই তুলনা দেখায় যে ___."], modelBn: "সুন্দরবন ও পাহাড়পুর—দুটিই বিশ্ব ঐতিহ্য স্থান। অন্যদিকে, সুন্দরবন প্রাকৃতিক এবং পাহাড়পুর সাংস্কৃতিক ঐতিহ্য। এই তুলনা দেখায় যে স্বীকৃতির কারণ আলাদা হতে পারে।", modelEn: "Both are World Heritage sites, but one is recognised for natural values and one for cultural evidence; the designation can rest on different kinds of significance.", stretch: "Add a limitation: which comparison criterion needs more research?" },
    watch: { before: "Choose five criteria before watching.", during: "Only record information that fits a criterion; flag unsupported claims.", after: "Improve the video’s overview with one verified UNESCO fact per site.", segment: "Watch 0:00–2:20, then verify rather than replay" },
  },
  {
    lessonId: "living-arts",
    level: "b2",
    dialogue: [
      { speaker: "দর্শক", bn: "এই নকশাটি কে তৈরি করেছেন?", transliteration: "ei nokshati ke toiri korechhen?", en: "Who created this design?" },
      { speaker: "কারিগর", bn: "আমাদের তাঁতিরা প্রজন্ম ধরে এই বয়নশিল্প চর্চা করেন।", transliteration: "amader tatira projonmo dhore ei boyonshilpo chorcha koren", en: "Our weavers have practised this craft across generations." },
      { speaker: "দর্শক", bn: "ঐতিহ্যটি কি বদলাচ্ছে?", transliteration: "oitijjhoti ki bodlachchhe?", en: "Is the tradition changing?" },
      { speaker: "কারিগর", bn: "হ্যাঁ, নকশা ও বাজার বদলায়, কিন্তু দক্ষতা এখনও গুরুত্বপূর্ণ।", transliteration: "hya, noksha o bajar bodlay, kintu dokkhota ekhono guruttopurno", en: "Yes. Designs and markets change, but the skill remains important." },
    ],
    listening: { focus: "Listen for who makes the work, what changes and what continues.", check: { prompt: "What continues to matter?", options: ["The artisans’ skill", "One fixed market", "No new designs"], answer: 0, explanation: "The speaker says the skill remains important even as designs and markets change." } },
    reading: { title: "A living loom · জীবন্ত তাঁত", bn: "তাঁতের শাড়ি শুধু একটি বস্তু নয়; এর সঙ্গে সুতা প্রস্তুত, নকশা ভাবা, বয়ন, বিক্রি এবং ব্যবহার জড়িত। জ্ঞান পরিবার, কর্মশালা ও সম্প্রদায়ের মধ্যে শেখানো হতে পারে। নতুন রং বা বাজার এলে ঐতিহ্য বদলায়, কিন্তু কারিগরের শ্রম ও সিদ্ধান্ত অদৃশ্য করা যায় না। কোনো নকশা দেখলে তার নির্মাতা, উৎস ও অনুমতির প্রশ্নও করা দরকার।", en: "A handloom sari connects material preparation, design, weaving, sale and use. Knowledge may pass through families, workshops and communities. Traditions can adapt, while the maker’s labour, choices, credit and consent remain central.", check: { prompt: "Which responsible question does the passage emphasise?", options: ["Who made it and how should they be credited?", "Which pattern is objectively prettiest?", "How can the maker be removed?"], answer: 0, explanation: "Responsible cultural learning keeps makers, origin and permission visible." } },
    speaking: { mission: "Explain one making process, one continuity and one change without claiming more than your source shows.", roleA: "Ask who makes it, how, what changes and who benefits.", roleB: "Describe steps and explicitly mark what is verified or uncertain.", pronunciation: "Practise বয়ন and নকশা separately, then place them in a full sentence with even pacing.", success: ["I credited makers", "I sequenced a process", "I discussed continuity and change"] },
    writing: { mission: "Create an ethical exhibition label for one living art.", starters: ["প্রথমে ___.", "এরপর ___.", "কারিগরেরা ___.", "ঐতিহ্যটি বদলাচ্ছে, কিন্তু ___."], modelBn: "প্রথমে সুতা প্রস্তুত করা হয়। এরপর নকশা অনুযায়ী বয়ন করা হয়। কারিগরেরা দক্ষতা ও সময় দেন। ঐতিহ্যটি বদলাচ্ছে, কিন্তু নির্মাতার স্বীকৃতি জরুরি।", modelEn: "The label sequences preparation and weaving, credits artisan skill and explains that change does not remove the need for recognition.", stretch: "Add the source, date and one consent question for displaying an image." },
    watch: { before: "Write four questions: maker, materials, process and change.", during: "Note what the video shows versus what the narrator claims.", after: "Find the maker or community credit; if absent, mark that as a limitation.", segment: "Watch 0:00–2:06, pausing on process details" },
  },
  {
    lessonId: "two-homes",
    level: "c1-c2",
    dialogue: [
      { speaker: "আরিবা", bn: "বাংলা কম বললে কি আমার পরিচয় কমে যায়?", transliteration: "Bangla kom bolle ki amar porichoy kome jay?", en: "Does speaking less Bangla reduce my identity?" },
      { speaker: "সায়ন", bn: "আমার মনে হয় ভাষা গুরুত্বপূর্ণ, তবে পরিচয়ের একমাত্র মাপকাঠি নয়।", transliteration: "amar mone hoy bhasha guruttopurno, tobe porichoyer ekmatro mapkathi noy", en: "Language matters, but it is not the only measure of identity." },
      { speaker: "আরিবা", bn: "তাহলে শেখার ইচ্ছাকে কীভাবে দেখা উচিত?", transliteration: "tahole shekhar ichchhake kibhabe dekha uchit?", en: "How should the wish to learn be understood?" },
      { speaker: "সায়ন", bn: "এক অর্থে তা শিকড়ের খোঁজ; অন্য দিক থেকে এটি নতুন সম্পর্ক গড়া।", transliteration: "ek orthe ta shikorer khoj; onno dik theke eti notun shomporko gora", en: "It can be a search for roots and also the building of new relationships." },
    ],
    listening: { focus: "Map each speaker’s claim, qualification and point of common ground.", check: { prompt: "What position does Sayan take?", options: ["Language is irrelevant", "Language matters but is not the only identity measure", "Only birthplace matters"], answer: 1, explanation: "His claim is explicitly qualified with তবে—however." } },
    reading: { title: "Not a test of belonging · অন্তর্ভুক্তির পরীক্ষা নয়", bn: "প্রবাসী পরিবারের শিশুদের ভাষা-অভিজ্ঞতা এক নয়। কেউ বাড়িতে বাংলা শুনেও ইংরেজিতে উত্তর দেয়; কেউ কিশোর বয়সে শেখা শুরু করে; কেউ অন্য কোনো পারিবারিক ভাষার সঙ্গে বাংলা যোগ করে। ভাষা শেখার আগ্রহকে ‘খাঁটি’ পরিচয়ের পরীক্ষা বানালে লজ্জা ও বর্জন তৈরি হতে পারে। বরং দক্ষতার বর্তমান স্তরকে স্বীকার করে নতুন অংশগ্রহণের সুযোগ তৈরি করা যায়।", en: "Diaspora children have varied language histories. Some understand more than they speak; some begin later; some add Bangla alongside other family languages. Turning proficiency into an authenticity test can create shame and exclusion. Recognising the current starting point can instead open new participation.", check: { prompt: "What harm can an authenticity test cause?", options: ["More accurate assessment", "Shame and exclusion", "Faster pronunciation"], answer: 1, explanation: "The passage explicitly names shame and exclusion." } },
    speaking: { mission: "Mediate a respectful discussion between ‘language is essential’ and ‘identity is broader than language’.", roleA: "Present one view with a personal or hypothetical reason.", roleB: "Summarise it fairly, add the second view and propose common ground.", pronunciation: "Chunk দৃষ্টিভঙ্গি and অন্তর্ভুক্তি by meaningful syllable groups before using them in argument.", success: ["I represented both views fairly", "I qualified generalisations", "I proposed a shared action"] },
    writing: { mission: "Write a 150-word bilingual reflection or a structured 8-sentence response.", starters: ["এক অর্থে ___.", "তবে অন্য দিক থেকে ___.", "সবার অভিজ্ঞতা এক নয়; বরং ___.", "আমার প্রস্তাব হলো ___."], modelBn: "এক অর্থে ভাষা শিকড়ের সঙ্গে সম্পর্ক গড়ে। তবে অন্য দিক থেকে পরিচয় শুধু ভাষায় সীমাবদ্ধ নয়। সবার অভিজ্ঞতা এক নয়; বরং শেখার পথ ভিন্ন। আমার প্রস্তাব হলো দক্ষতার পরীক্ষা নয়, অংশগ্রহণের সুযোগ বাড়ানো।", modelEn: "Language can connect people with roots, yet identity is not limited to proficiency. Learning histories differ, so the goal should be wider participation rather than an authenticity test.", stretch: "Add a counterargument, a concession and one practical family or school action." },
    watch: { before: "Write your tentative claim and one possible challenge to it.", during: "Track evidence, framing and whose voices are absent.", after: "Revise your claim with one qualification and one question for further research.", segment: "Watch 0:00–4:30 and 4:31–9:52 separately" },
  },
  {
    lessonId: "poetry-place",
    level: "c1-c2",
    dialogue: [
      { speaker: "মায়া", bn: "কবিতায় নদীটি কি শুধু একটি নদী?", transliteration: "kobitay noditi ki shudhu ekti nodi?", en: "Is the river in the poem only a river?" },
      { speaker: "রাফি", bn: "আমার পাঠে নদীটি স্মৃতি ও ফিরে আসার রূপক।", transliteration: "amar pathe noditi smriti o phire ashar rupok", en: "In my reading it is a metaphor for memory and return." },
      { speaker: "মায়া", bn: "কোন প্রমাণ তোমার ব্যাখ্যাকে সমর্থন করে?", transliteration: "kon proman tomar byakhyake shomorthon kore?", en: "What evidence supports your interpretation?" },
      { speaker: "রাফি", bn: "ফিরে যাওয়ার ক্রিয়াটি বারবার এসেছে এবং শেষ চিত্রকল্পটি ঘরের।", transliteration: "phire jawar kriyati barbar eshechhe ebong shesh chitrokolpoti ghorer", en: "The act of returning repeats, and the final image is of home." },
    ],
    listening: { focus: "Listen once for mood and repeated sound, then again for the evidence behind the interpretation.", check: { prompt: "What supports Rafi’s reading?", options: ["Repetition and a final image of home", "The poem’s font", "The video title alone"], answer: 0, explanation: "He points to two textual features, not only a personal feeling." } },
    reading: { title: "Image, sound, interpretation · চিত্রকল্প, ধ্বনি, ব্যাখ্যা", bn: "কবিতার একটি নদী বাস্তব ভূদৃশ্যও হতে পারে, আবার স্মৃতি, সময় বা বিচ্ছেদের রূপকও হতে পারে। ব্যাখ্যার স্বাধীনতা মানে প্রমাণ ছাড়া যেকোনো দাবি নয়। পুনরাবৃত্ত শব্দ, বাক্যের গতি, চিত্রকল্পের পরিবর্তন এবং বক্তার অবস্থান—এসব লক্ষ করে একাধিক সম্ভাব্য পাঠ তৈরি করা যায়। অনুবাদে কোনো একটি অর্থ স্পষ্ট হলে অন্য অনুষঙ্গ দুর্বলও হতে পারে; তাই অনুবাদকের সিদ্ধান্ত ব্যাখ্যা করা জরুরি।", en: "A poetic river may be both landscape and metaphor. Interpretive freedom is not evidence-free: repetition, pace, imagery and speaker position support possible readings. Translation can strengthen one meaning while weakening another, so choices should be explained.", check: { prompt: "Which approach makes an interpretation defensible?", options: ["Evidence from form and language", "Only the reader’s certainty", "A fully literal translation"], answer: 0, explanation: "The passage asks readers to connect interpretations with observable features." } },
    speaking: { mission: "Deliver a short interpretation with two pieces of evidence and acknowledge another plausible reading.", roleA: "Present an interpretation of one image or repeated sound.", roleB: "Ask for evidence and offer a different reading without dismissing the first.", pronunciation: "Practise চিত্রকল্প and পুনরাবৃত্তি in chunks; clarity matters more than speed during analysis.", success: ["I made an arguable claim", "I cited two features", "I allowed another plausible reading"] },
    writing: { mission: "Create four original bilingual lines and a translator’s note.", starters: ["এই চিত্রকল্পটি বোঝায় যে ___.", "___ শব্দটির পুনরাবৃত্তি ___ প্রভাব তৈরি করে।", "অনুবাদে আমি ___ বেছে নিয়েছি, কারণ ___."], modelBn: "নদী ডাকে দূর ঘর থেকে / বৃষ্টি লেখে কাঁচের গায় / পথটি ফিরে আসে মনে / নাম না-জানা আলোর ছায়।", modelEn: "The river calls from a distant home; rain writes on glass; the path returns in memory; unnamed light leaves a shadow.", stretch: "Explain one sound, image or rhythm you could not carry across exactly." },
    watch: { before: "Close your eyes and list expected images from the title only.", during: "Mark repeated sounds, pacing changes and gestures in the recitation.", after: "Compare performance meaning with meaning on the page; cite one precise moment.", segment: "Listen once without subtitles, then replay selected moments" },
  },
  {
    lessonId: "research-exhibition",
    level: "c1-c2",
    dialogue: [
      { speaker: "সম্পাদক", bn: "তোমার গবেষণা প্রশ্নটি কী?", transliteration: "tomar gobeshona proshnoti ki?", en: "What is your research question?" },
      { speaker: "গবেষক", bn: "তাঁতশিল্পের জ্ঞান কীভাবে প্রজন্মের মধ্যে ছড়ায়?", transliteration: "tantoshilper gyan kibhabe projonmer moddhe chhoray?", en: "How does weaving knowledge pass between generations?" },
      { speaker: "সম্পাদক", bn: "উৎসগুলো নির্ভরযোগ্য বলে মনে হয় কেন?", transliteration: "utsgulo nirbhorjoggo bole mone hoy keno?", en: "Why do the sources appear reliable?" },
      { speaker: "গবেষক", bn: "লেখক, তারিখ ও প্রমাণ স্পষ্ট, তবে একটি স্থানীয় কণ্ঠ এখনও অনুপস্থিত।", transliteration: "lekhok, tarikh o proman sposhto, tobe ekti sthaniyo kontho ekhono onuposthit", en: "The author, date and evidence are clear, but a local voice is still missing." },
    ],
    listening: { focus: "Identify the research question, the reliability test and the limitation.", check: { prompt: "What limitation remains?", options: ["No title", "A local voice is missing", "Too many dates"], answer: 1, explanation: "The researcher names the missing perspective directly." } },
    reading: { title: "A claim under review · পর্যালোচনায় একটি দাবি", bn: "একটি ওয়েবসাইট দাবি করল যে একটি নকশা ‘হাজার বছর ধরে অপরিবর্তিত’। লেখক বা উৎসের নাম ছিল না। সরকারি ও জাদুঘরভিত্তিক দুটি উৎসে নকশাটির দীর্ঘ ইতিহাসের কথা থাকলেও পরিবর্তন ও নতুন বাজারের প্রভাবও উল্লেখ ছিল। একজন কারিগরের সাক্ষাৎকার আরও একটি দৃষ্টিভঙ্গি দিল, কিন্তু তা পুরো সম্প্রদায়ের মত নয়। তাই প্রদর্শনীর ভাষা বদলে লেখা হলো: ‘নকশাটির দীর্ঘ ইতিহাস আছে এবং সময়ের সঙ্গে এর ব্যবহার ও রূপ বদলেছে।’", en: "An unattributed website claimed a design was unchanged for a thousand years. Two institutional sources described long history but also change; one artisan interview added a valuable but non-universal perspective. The exhibit therefore revised the claim to acknowledge history and adaptation.", check: { prompt: "Why was the original claim revised?", options: ["It was absolute and unsupported", "It was too short", "Interviews are always final proof"], answer: 0, explanation: "Triangulation showed both continuity and change and exposed missing attribution." } },
    speaking: { mission: "Defend a project in three minutes: question, sources, finding, limitation and next step.", roleA: "Act as reviewer and ask how the evidence supports the claim.", roleB: "Answer precisely, acknowledge uncertainty and revise one overstatement.", pronunciation: "Slow complex academic terms—নির্ভরযোগ্য, সীমাবদ্ধতা, উপস্থাপনা—then restore natural sentence rhythm.", success: ["My question was focused", "I explained source choice", "I named a limitation and next step"] },
    writing: { mission: "Build a publication-ready exhibit card for younger bilingual learners.", starters: ["আমাদের প্রশ্ন: ___.", "প্রমাণ দেখায় যে ___.", "তবে সীমাবদ্ধতা হলো ___.", "আরও জানতে আমরা ___."], modelBn: "আমাদের প্রশ্ন: তাঁতের জ্ঞান কীভাবে শেখানো হয়? প্রমাণ দেখায় যে পরিবার, কর্মশালা ও সম্প্রদায় গুরুত্বপূর্ণ। তবে সব অঞ্চলের কণ্ঠ আমাদের উৎসে নেই। আরও জানতে আমরা অনুমতি নিয়ে স্থানীয় কারিগরের মতামত নেব।", modelEn: "Our question asks how weaving knowledge is taught. Sources point to families, workshops and communities, but regional voices are incomplete. With consent, the next step is local artisan review.", stretch: "Add a 100-word English scaffold, five audio keywords, citations and an uncertainty note." },
    watch: { before: "Write the broad claim you expect and five audit criteria.", during: "Pause each major claim; record evidence, source and omitted perspective.", after: "Produce a 60-second correction or extension with citations.", segment: "Watch in three 5-minute sections; audit between sections" },
  },
];

export const lessonExtensions = Object.fromEntries(
  content.map((item) => [item.lessonId, item]),
) as Record<string, LessonExtension>;

export const lessonSessionSkills: LearningSkill[] = [
  "listening",
  "reading",
  "speaking",
  "writing",
  "culture",
  "mastery",
];

