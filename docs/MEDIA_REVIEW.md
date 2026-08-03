# Lesson media review (videos & audio)

Every lesson ships with media already wired in:

- **One YouTube video** per lesson — rendered click-to-load through
  `youtube-nocookie.com` with before/during/after teaching notes, and never
  contacted until a learner presses play.
- **One curated playlist** per lesson (four shared playlists across the 18
  lessons), linked out to YouTube.
- **Per-lesson pronunciation audio** for every slot (dialogue, reading, two
  patterns, six words). A bundled synthetic Bangla clip is the offline-safe
  fallback; a named, consented human recording replaces it once uploaded and
  approved in the Content Studio.

## Why the video/playlist IDs need a human check

The current YouTube IDs come from the original prototype. They have **not** been
independently confirmed to resolve to real, relevant, child-appropriate videos.
Treat them as candidates, not verified content, until a reviewer signs off.

## Step 1 — automated existence check

From a network that can reach `youtube.com`:

```bash
npm run verify:media          # human-readable report
npm run verify:media -- --json > media-report.json
```

For each video and playlist it calls YouTube's public oEmbed endpoint (no API
key) and prints whether the ID resolves plus the **real title YouTube returns**,
so you can compare it against the intended title. It exits non-zero if anything
fails, so it can gate a release step.

> If every item fails with status `0` or `403`, your network/proxy blocked
> YouTube — rerun elsewhere. That is not evidence the media is missing. (This
> repo's CI sandbox blocks YouTube, which is why `verify:media` is a manual
> step, not part of `npm test`.)

## Step 2 — replace what fails or doesn't fit

Edit `app/curriculum.ts`:

- Video IDs live on each lesson's `video: { id, title, channel, duration, reason }`.
- Playlists are the shared `beginnerPlaylist` / `conversationPlaylist` /
  `storyPlaylist` / `coursePlaylist` constants near the top of the file.

Pick replacements that are age-appropriate, ideally captioned, and on stable
channels. Update `title`, `channel` and `duration` to match reality.

## Step 3 — record the human decision

In the **Content Studio → Video checks** tab, for each lesson set availability,
captions status and child-suitability, and note the exact segment. This is the
per-lesson video gate; approval requires a named adult reviewer, and the
platform never claims a video is verified on its own.

## Human audio (optional upgrade)

Synthetic fallback audio already exists for every slot and is covered by tests.
To add real voices: **Content Studio → Human audio**, upload a recording with a
speaker credit and recorded consent, review it, then approve. Approved audio
becomes the learner playback source for that slot automatically, with the
synthetic clip retained as fallback.
