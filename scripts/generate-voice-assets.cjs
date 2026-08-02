#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- text2wav is a CommonJS-only build tool. */

const { spawnSync } = require("node:child_process");
const { access, mkdir, readFile, unlink, writeFile } = require("node:fs/promises");
const path = require("node:path");
const text2wav = require("text2wav");

const outputDirectory = path.resolve(__dirname, "../public/audio");
const force = process.argv.includes("--force");

const assets = [
  { file: "hello-bn", text: "হ্যালো, বন্ধু!", language: "bn" },
  { file: "word-river-bn", text: "নদী", language: "bn" },
  { file: "word-river-example-bn", text: "নদী। নদী বয়ে যায়।", language: "bn" },
  { file: "word-boat-bn", text: "নৌকা", language: "bn" },
  { file: "word-boat-example-bn", text: "নৌকা। নৌকা জলে চলে।", language: "bn" },
  { file: "word-tiger-bn", text: "বাঘ", language: "bn" },
  { file: "word-tiger-example-bn", text: "বাঘ। বাঘ বনে থাকে।", language: "bn" },
  { file: "word-friend-bn", text: "বন্ধু", language: "bn" },
  { file: "word-friend-example-bn", text: "বন্ধু। তুমি আমার বন্ধু।", language: "bn" },
  {
    file: "story-1-en",
    text: "Maya stood beside a wide river. A little boat rocked near the bank.",
    language: "en",
  },
  {
    file: "story-1-bn",
    text: "মায়া একটি চওড়া নদীর পাশে দাঁড়াল। তীরে একটি ছোট নৌকা দুলছিল।",
    language: "bn",
  },
  {
    file: "story-2-en",
    text: "Come aboard, called Rafi. Together, the new friends followed the moonlight.",
    language: "en",
  },
  {
    file: "story-2-bn",
    text: "নৌকায় এসো! রাফি ডাকল। নতুন দুই বন্ধু চাঁদের আলো ধরে এগিয়ে গেল।",
    language: "bn",
  },
  {
    file: "story-3-en",
    text: "Across the water came a gentle song. Maya smiled and sang the last line in Bangla.",
    language: "en",
  },
  {
    file: "story-3-bn",
    text: "জলের ওপার থেকে মিষ্টি গান ভেসে এল। মায়া হেসে শেষ লাইনটি বাংলায় গাইল।",
    language: "bn",
  },
  {
    file: "place-sundarbans-en",
    text: "The Sundarbans. This immense tidal mangrove forest stretches across river channels and mudflats. It is home to remarkable wildlife, including the Royal Bengal tiger.",
    language: "en",
  },
  {
    file: "place-sundarbans-bn",
    text: "সুন্দরবন। জোয়ার-ভাটার নদী আর কাদামাটির চরজুড়ে বিস্তৃত এই বিশাল ম্যানগ্রোভ বন। রয়েল বেঙ্গল টাইগারসহ অনেক প্রাণীর আবাস এটি।",
    language: "bn",
  },
  {
    file: "place-bagerhat-en",
    text: "Historic Bagerhat. Bagerhat grew as a medieval city in the fourteen hundreds. Its many brick mosques show clever building traditions shaped by the green delta landscape.",
    language: "en",
  },
  {
    file: "place-bagerhat-bn",
    text: "ঐতিহাসিক বাগেরহাট। চৌদ্দশ শতকে বাগেরহাট মধ্যযুগের একটি শহর হিসেবে গড়ে ওঠে। এখানকার ইটের মসজিদগুলো বদ্বীপ অঞ্চলের চমৎকার নির্মাণকৌশল দেখায়।",
    language: "bn",
  },
  {
    file: "place-paharpur-en",
    text: "Paharpur Vihara. The ruins at Paharpur are the remains of a vast Buddhist monastery and centre of learning that influenced architecture far beyond Bangladesh.",
    language: "en",
  },
  {
    file: "place-paharpur-bn",
    text: "পাহাড়পুর বিহার। পাহাড়পুরের ধ্বংসাবশেষ এক বিশাল বৌদ্ধ বিহার ও শিক্ষাকেন্দ্রের স্মৃতি। এর স্থাপত্য বাংলাদেশের বাইরেও প্রভাব ফেলেছিল।",
    language: "bn",
  },
  { file: "diagnostic-listen-1", text: "হ্যালো! আমার নাম মায়া।", language: "bn" },
  { file: "diagnostic-listen-2", text: "প্রথমে সোজা যান। নদীর আগে বাঁ দিকে যান। বাজারটি স্কুলের পাশে।", language: "bn" },
  { file: "diagnostic-listen-3", text: "ভাষা পরিচয়ের গুরুত্বপূর্ণ অংশ হতে পারে, তবে সবার অভিজ্ঞতা এক নয় এবং দক্ষতাই পরিচয়ের একমাত্র মাপকাঠি নয়।", language: "bn" },
];

async function appendCurriculumAssets() {
  const curriculumPath = path.resolve(__dirname, "../app/curriculum.ts");
  const curriculumSource = await readFile(curriculumPath, "utf8");
  const lessonSections = curriculumSource.split(/\n  \{\n    id:\s*/).slice(1);

  for (const section of lessonSections) {
    if (!section.includes("vocabulary:")) continue;
    const id = section.match(/^"([^"]+)"/)?.[1];
    const vocabularyBlock = section.match(/vocabulary:\s*\[([\s\S]*?)\n\s*\],\n\s*patterns:/)?.[1];
    const patternBlock = section.match(/patterns:\s*\[([\s\S]*?)\n\s*\],\n\s*teaching:/)?.[1];
    if (!id || !vocabularyBlock || !patternBlock) {
      throw new Error("Could not read a curriculum lesson for audio generation.");
    }

    [...vocabularyBlock.matchAll(/\{ bn: "([^"]+)"/g)].forEach((match, index) => {
      assets.push({ file: `lesson-${id}-word-${index + 1}`, text: match[1], language: "bn" });
    });
    [...patternBlock.matchAll(/\{ bn: "([^"]+)"/g)].forEach((match, index) => {
      assets.push({ file: `lesson-${id}-pattern-${index + 1}`, text: match[1], language: "bn" });
    });
  }
}

async function appendExtendedLessonAssets() {
  const contentPath = path.resolve(__dirname, "../app/learning-content.ts");
  const contentSource = await readFile(contentPath, "utf8");
  const lessonSections = contentSource.split(/\n  \{\n    lessonId:\s*/).slice(1);

  for (const section of lessonSections) {
    const id = section.match(/^"([^"]+)"/)?.[1];
    const dialogueBlock = section.match(/dialogue:\s*\[([\s\S]*?)\n\s*\],\n\s*listening:/)?.[1];
    const readingText = section.match(/reading:\s*\{[\s\S]*?bn:\s*"([^"]+)"/)?.[1];
    if (!id || !dialogueBlock || !readingText) {
      throw new Error("Could not read an extended lesson for audio generation.");
    }
    const dialogue = [...dialogueBlock.matchAll(/bn:\s*"([^"]+)"/g)].map((match) => match[1]).join(" ");
    assets.push({ file: `lesson-${id}-dialogue`, text: dialogue, language: "bn" });
    assets.push({ file: `lesson-${id}-reading`, text: readingText, language: "bn" });
  }
}

async function generate() {
  await appendCurriculumAssets();
  await appendExtendedLessonAssets();
  await mkdir(outputDirectory, { recursive: true });

  for (const asset of assets) {
    const isBangla = asset.language === "bn";
    const wav = await text2wav(asset.text, {
      voice: isBangla ? "bn+f3" : "en-gb+f3",
      amplitude: 92,
      speed: isBangla ? 132 : 150,
      pitch: isBangla ? 58 : 55,
      wordGap: isBangla ? 4 : 2,
    });
    const temporaryWav = path.join(outputDirectory, `${asset.file}.tmp.wav`);
    const destination = path.join(outputDirectory, `${asset.file}.ogg`);
    if (!force) {
      try {
        await access(destination);
        continue;
      } catch {
        // Generate only assets that are not already bundled.
      }
    }
    await writeFile(temporaryWav, wav);

    const conversion = spawnSync(
      "ffmpeg",
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        temporaryWav,
        "-af",
        "highpass=f=85,lowpass=f=9000,volume=0.86",
        "-ac",
        "1",
        "-ar",
        "24000",
        "-c:a",
        "libopus",
        "-b:a",
        "32k",
        "-vbr",
        "on",
        "-application",
        "voip",
        destination,
      ],
      { stdio: "inherit" },
    );

    await unlink(temporaryWav);
    if (conversion.status !== 0) {
      throw new Error(`ffmpeg failed while generating ${asset.file}.ogg`);
    }
    process.stdout.write(`generated ${asset.file}.ogg\n`);
  }
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
