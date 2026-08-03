#!/usr/bin/env node
/**
 * Verify every lesson's YouTube video and playlist against YouTube's public
 * oEmbed endpoint (no API key required). For each ID it reports whether the
 * resource resolves and prints the real title YouTube returns, so a reviewer
 * can confirm the linked media actually exists and matches the lesson intent.
 *
 *   node scripts/verify-media.mjs           # human-readable report
 *   node scripts/verify-media.mjs --json    # machine-readable JSON
 *
 * Exit code is non-zero if any video or playlist fails to resolve, so this can
 * gate a release step. Run it from a network that can reach youtube.com —
 * some sandboxes and CI runners block it.
 */
import { lessons } from "../app/curriculum.ts";

const asJson = process.argv.includes("--json");
const OEMBED = "https://www.youtube.com/oembed";

function videoUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}
function playlistUrl(id) {
  return `https://www.youtube.com/playlist?list=${id}`;
}

async function resolve(kind, id, pageUrl) {
  const url = `${OEMBED}?url=${encodeURIComponent(pageUrl)}&format=json`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (response.status === 200) {
      const data = await response.json().catch(() => ({}));
      return { kind, id, ok: true, status: 200, title: data.title ?? "", author: data.author_name ?? "" };
    }
    // 401/404 = not embeddable / removed / private.
    return { kind, id, ok: false, status: response.status, title: "", author: "" };
  } catch (error) {
    return { kind, id, ok: false, status: 0, title: "", author: "", error: String(error?.message ?? error) };
  }
}

// De-duplicate: playlists are shared across lessons.
const videoTargets = new Map();
const playlistTargets = new Map();
for (const lesson of lessons) {
  if (!videoTargets.has(lesson.video.id)) {
    videoTargets.set(lesson.video.id, { intendedTitle: lesson.video.title, lessons: [] });
  }
  videoTargets.get(lesson.video.id).lessons.push(lesson.id);
  if (!playlistTargets.has(lesson.playlist.id)) {
    playlistTargets.set(lesson.playlist.id, { intendedTitle: lesson.playlist.title, lessons: [] });
  }
  playlistTargets.get(lesson.playlist.id).lessons.push(lesson.id);
}

const videoResults = await Promise.all(
  [...videoTargets.entries()].map(async ([id, meta]) => ({
    ...(await resolve("video", id, videoUrl(id))),
    intendedTitle: meta.intendedTitle,
    lessons: meta.lessons,
  })),
);
const playlistResults = await Promise.all(
  [...playlistTargets.entries()].map(async ([id, meta]) => ({
    ...(await resolve("playlist", id, playlistUrl(id))),
    intendedTitle: meta.intendedTitle,
    lessons: meta.lessons,
  })),
);

const deadVideos = videoResults.filter((r) => !r.ok);
const deadPlaylists = playlistResults.filter((r) => !r.ok);

if (asJson) {
  console.log(JSON.stringify({ videos: videoResults, playlists: playlistResults }, null, 2));
} else {
  const line = (r) =>
    `${r.ok ? "OK  " : `FAIL(${r.status})`}  ${r.id}  ${r.ok ? `→ ${r.title}` : `| intended: ${r.intendedTitle}`}  [${r.lessons.join(", ")}]`;
  console.log("Videos");
  for (const r of videoResults) console.log("  " + line(r));
  console.log("\nPlaylists");
  for (const r of playlistResults) console.log("  " + line(r));
  console.log(
    `\nSummary: ${videoResults.length - deadVideos.length}/${videoResults.length} videos and ${playlistResults.length - deadPlaylists.length}/${playlistResults.length} playlists resolve.`,
  );
  if (deadVideos.length || deadPlaylists.length) {
    console.log(
      "Action: replace failing IDs in app/curriculum.ts, then record the check in the Content Studio video gate.",
    );
    if (deadVideos.concat(deadPlaylists).every((r) => r.status === 0 || r.status === 403)) {
      console.log(
        "Every item failed with status 0/403 — the network or proxy blocked youtube.com here. Rerun where it is reachable; this is NOT proof the media is dead.",
      );
    }
  }
}

process.exit(deadVideos.length || deadPlaylists.length ? 1 : 0);
