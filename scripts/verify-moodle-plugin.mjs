import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const pluginRoot = path.join(repositoryRoot, "moodle", "local", "banglapilot");

export const requiredPluginFiles = [
  "README.md",
  "version.php",
  "lang/en/local_banglapilot.php",
  "classes/privacy/provider.php",
  "classes/local/seeder.php",
  "cli/seed.php",
  "data/content-manifest.json",
  "data/lesson-content.json",
  "data/questions.gift",
];

async function walk(directory, prefix = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    const stat = await fs.lstat(absolute);
    assert.equal(stat.isSymbolicLink(), false, `Moodle plugin packages cannot contain a symbolic link: ${relative}`);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
    else assert.fail(`Unsupported Moodle plugin filesystem entry: ${relative}`);
  }
  return files;
}

export async function verifyMoodlePlugin() {
  const files = await walk(pluginRoot);
  for (const required of requiredPluginFiles) {
    assert.ok(files.includes(required), `Moodle plugin is missing ${required}`);
    const source = await fs.readFile(path.join(pluginRoot, required), "utf8");
    assert.ok(source.trim().length > 0, `Moodle plugin file is empty: ${required}`);
  }

  const [version, seeder, cli, privacy, manifestSource, lessonSource, giftSource] = await Promise.all([
    fs.readFile(path.join(pluginRoot, "version.php"), "utf8"),
    fs.readFile(path.join(pluginRoot, "classes/local/seeder.php"), "utf8"),
    fs.readFile(path.join(pluginRoot, "cli/seed.php"), "utf8"),
    fs.readFile(path.join(pluginRoot, "classes/privacy/provider.php"), "utf8"),
    fs.readFile(path.join(pluginRoot, "data/content-manifest.json"), "utf8"),
    fs.readFile(path.join(pluginRoot, "data/lesson-content.json"), "utf8"),
    fs.readFile(path.join(pluginRoot, "data/questions.gift"), "utf8"),
  ]);

  assert.match(version, /\$plugin->component\s*=\s*'local_banglapilot'/);
  assert.match(version, /\$plugin->requires\s*=\s*2026042002/);
  assert.match(version, /MATURITY_ALPHA/);
  assert.match(privacy, /null_provider/);

  assert.match(cli, /'apply'\s*=>\s*false/);
  assert.match(cli, /'check'\s*=>\s*false/);
  assert.doesNotMatch(cli, /'publish'\s*=>/);
  assert.match(cli, /Choose exactly one of --apply or --check/);
  assert.match(seeder, /'visible'\s*=>\s*0/);
  assert.match(seeder, /disable_open_enrolment/);
  assert.match(seeder, /externalMedia/);
  assert.match(seeder, /contentHash/);
  assert.match(seeder, /silent replacement is blocked/);
  assert.doesNotMatch(seeder, /function\s+publish\s*\(/i);

  const manifest = JSON.parse(manifestSource);
  const lessonContent = JSON.parse(lessonSource);
  assert.equal(manifest.courseId, lessonContent.courseId);
  assert.equal(manifest.releaseReady, false);
  assert.deepEqual(lessonContent.externalMedia, []);
  assert.equal(lessonContent.modules.length, 3);
  assert.equal(lessonContent.modules.reduce((sum, module) => sum + module.chapters.length, 0), 15);
  assert.equal((giftSource.match(/::BA-P\d{2}-Q\d{2}::/g) ?? []).length, 9);

  return { files, chapterCount: 15, questionCount: 9 };
}

async function main() {
  const result = await verifyMoodlePlugin();
  console.log(`Moodle plugin package is valid: ${result.files.length} files, ${result.chapterCount} chapters, ${result.questionCount} questions.`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) await main();
