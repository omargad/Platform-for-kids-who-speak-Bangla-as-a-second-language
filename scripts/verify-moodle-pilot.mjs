import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REQUIRED_GATES = [
  "sourceMapping",
  "banglaLanguage",
  "englishAdaptation",
  "culturalHistoricalAccuracy",
  "ageSuitability",
  "copyrightPermissions",
  "accessibility",
  "mediaSafety",
  "childPilot",
];

const ALLOWED_GATE_STATUSES = new Set(["pending", "in-review", "approved"]);
const ALLOWED_MOODLE_TYPES = new Set(["assignment", "book", "forum", "page", "quiz"]);

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  return isNonEmpty(value) && !Number.isNaN(Date.parse(value));
}

function gateIsReleaseApproved(gate) {
  return gate?.status === "approved"
    && isNonEmpty(gate.reviewer)
    && isIsoDate(gate.reviewedAt)
    && isNonEmpty(gate.evidence);
}

export function validatePilot({ manifest, topicsSource, booksSource, giftSource }) {
  const errors = [];
  const blockers = [];

  if (manifest?.schemaVersion !== 1) errors.push("schemaVersion must be 1.");
  if (!isNonEmpty(manifest?.courseId)) errors.push("courseId is required.");
  if (!Array.isArray(manifest?.modules) || manifest.modules.length !== 3) {
    errors.push("The first pilot must contain exactly three modules.");
  }
  if (JSON.stringify(manifest?.requiredGates) !== JSON.stringify(REQUIRED_GATES)) {
    errors.push("requiredGates must match the controlled release-gate list and order.");
  }

  const ids = new Set();
  const sequences = new Set();
  for (const [index, module] of (manifest?.modules ?? []).entries()) {
    const location = `modules[${index}]`;
    if (!isNonEmpty(module.id)) errors.push(`${location}.id is required.`);
    if (ids.has(module.id)) errors.push(`${location}.id is duplicated: ${module.id}.`);
    ids.add(module.id);
    if (!Number.isInteger(module.sequence) || module.sequence < 1) errors.push(`${location}.sequence must be a positive integer.`);
    if (sequences.has(module.sequence)) errors.push(`${location}.sequence is duplicated: ${module.sequence}.`);
    sequences.add(module.sequence);

    if (!isNonEmpty(module.appTopicId) || !topicsSource.includes(`id: "${module.appTopicId}"`)) {
      errors.push(`${location}.appTopicId does not match an app/topics-content.ts topic.`);
    }
    if (!isNonEmpty(module.title?.en) || !isNonEmpty(module.title?.bn)) errors.push(`${location}.title must be bilingual.`);
    if (!isNonEmpty(module.learnerOutcome)) errors.push(`${location}.learnerOutcome is required.`);
    if (!Array.isArray(module.moodleBuild) || module.moodleBuild.length < 2) errors.push(`${location}.moodleBuild needs at least two core activities/resources.`);
    for (const [buildIndex, item] of (module.moodleBuild ?? []).entries()) {
      if (!ALLOWED_MOODLE_TYPES.has(item.type)) errors.push(`${location}.moodleBuild[${buildIndex}] uses a non-core or unsupported type.`);
      if (!isNonEmpty(item.name) || !isNonEmpty(item.purpose)) errors.push(`${location}.moodleBuild[${buildIndex}] needs a name and purpose.`);
    }

    if (!Array.isArray(module.sources) || module.sources.length === 0) errors.push(`${location}.sources must not be empty.`);
    for (const [sourceIndex, source] of (module.sources ?? []).entries()) {
      const sourceLocation = `${location}.sources[${sourceIndex}]`;
      if (!isNonEmpty(source.sourceId) || !booksSource.includes(`id: "${source.sourceId}"`)) {
        errors.push(`${sourceLocation}.sourceId does not match app/nctb-books.ts.`);
      }
      try {
        const officialPage = new URL(source.officialPage);
        if (officialPage.protocol !== "https:" || officialPage.hostname !== "nctb.gov.bd") {
          errors.push(`${sourceLocation}.officialPage must be an HTTPS nctb.gov.bd URL.`);
        }
      } catch {
        errors.push(`${sourceLocation}.officialPage is not a valid URL.`);
      }
      if (!isNonEmpty(source.evidenceAnchor)) errors.push(`${sourceLocation}.evidenceAnchor is required.`);
    }

    const gateNames = Object.keys(module.gates ?? {});
    if (JSON.stringify(gateNames) !== JSON.stringify(REQUIRED_GATES)) {
      errors.push(`${location}.gates must match the controlled release-gate list and order.`);
    }
    for (const gateName of REQUIRED_GATES) {
      const gate = module.gates?.[gateName];
      if (!gate || !ALLOWED_GATE_STATUSES.has(gate.status)) {
        errors.push(`${location}.gates.${gateName} has an invalid status.`);
        continue;
      }
      if (gate.status === "approved" && !gateIsReleaseApproved(gate)) {
        errors.push(`${location}.gates.${gateName} cannot be approved without reviewer, date and evidence.`);
      }
      if (!gateIsReleaseApproved(gate)) blockers.push(`${module.id}: ${gateName}`);
    }

    const moduleReady = REQUIRED_GATES.every((gateName) => gateIsReleaseApproved(module.gates?.[gateName]));
    if (moduleReady && module.publicationStatus !== "approved") {
      errors.push(`${location}.publicationStatus must be approved when every gate is approved.`);
    }
    if (!moduleReady && module.publicationStatus === "approved") {
      errors.push(`${location}.publicationStatus cannot be approved while a gate is blocked.`);
    }
  }

  const questionNames = [...giftSource.matchAll(/::(BA-P\d{2}-Q\d{2})::/g)].map((match) => match[1]);
  if (questionNames.length !== 9) errors.push(`questions.gift must contain exactly nine named pilot questions; found ${questionNames.length}.`);
  if (new Set(questionNames).size !== questionNames.length) errors.push("questions.gift contains duplicate question names.");
  const categoryCount = (giftSource.match(/^\$CATEGORY:/gm) ?? []).length;
  if (categoryCount !== 3) errors.push(`questions.gift must contain three categories; found ${categoryCount}.`);
  if (!giftSource.includes("DRAFT QUESTION BANK")) errors.push("questions.gift must keep the draft-release warning.");

  const computedReleaseReady = errors.length === 0 && blockers.length === 0;
  if (manifest?.releaseReady !== computedReleaseReady) {
    errors.push(`releaseReady must be ${computedReleaseReady}; it is derived from evidence-backed gate approvals.`);
  }
  if (computedReleaseReady && manifest?.courseStatus !== "approved") errors.push("courseStatus must be approved when releaseReady is true.");
  if (!computedReleaseReady && manifest?.courseStatus === "approved") errors.push("courseStatus cannot be approved while release blockers remain.");

  return { errors, blockers, computedReleaseReady, questionCount: questionNames.length };
}

async function loadPilot() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const [manifestJson, topicsSource, booksSource, giftSource] = await Promise.all([
    fs.readFile(path.join(repositoryRoot, "moodle/pilot/content-manifest.json"), "utf8"),
    fs.readFile(path.join(repositoryRoot, "app/topics-content.ts"), "utf8"),
    fs.readFile(path.join(repositoryRoot, "app/nctb-books.ts"), "utf8"),
    fs.readFile(path.join(repositoryRoot, "moodle/pilot/questions.gift"), "utf8"),
  ]);
  return { manifest: JSON.parse(manifestJson), topicsSource, booksSource, giftSource };
}

async function main() {
  const result = validatePilot(await loadPilot());
  if (result.errors.length) {
    console.error("Moodle pilot validation failed:");
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Moodle pilot structure is valid: 3 modules, ${result.questionCount} questions.`);
  if (result.computedReleaseReady) {
    console.log("Every release gate has named, dated evidence. The pilot is release-ready.");
    return;
  }

  console.log(`Release remains blocked by ${result.blockers.length} review gates (expected while the pilot is a draft).`);
  if (process.argv.includes("--release")) {
    console.error("Release check failed: approve every gate with reviewer, date and evidence before deployment to children.");
    process.exitCode = 1;
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) await main();
