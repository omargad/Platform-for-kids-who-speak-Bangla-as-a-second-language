# Bangla Adventures

**Platform for kids who speak Bangla as a second language** — a bilingual, interactive learning platform for children aged 6–12 who live outside Bangladesh and use Bangla as a second or heritage language. Built for the ICT30018 project with client iBrella.

The experience combines three visual ideas: a warm river storybook, a postcard-style culture passport, and a Bangladesh quest map.

## What is built

### Learner site (no account needed)
- English/Bangla interface switch
- 18 complete lessons across six child- and heritage-adapted proficiency bands: Pre-A1, A1, A2, B1, B2, and C1–C2 extension — 108 guided sessions covering listening, reading, speaking, writing, culture and mastery
- A four-skill starting-level guide based on learner "can do" statements rather than age
- Every lesson includes objectives, six vocabulary items, two language patterns, teaching blocks, cultural context, guided activities, a family mission, knowledge checks, one YouTube video and one curated playlist
- 180+ pronunciation clips (device voices preferred, bundled audio fallback works offline)
- A three-page bilingual river story with comprehension questions
- Culture postcards for Bangladesh's three UNESCO World Heritage properties
- English-to-Bangla matching game
- Stars, lesson completion and device-local progress saving
- Installable PWA with offline support (service worker + manifest)
- Responsive layouts, keyboard focus states, Escape-to-close dialogs and reduced-motion support

### Grown-up workspace (email + password account)
- **/grown-ups** — sign in or create a grown-up account (parents, carers, educators)
- **/family** — learner profiles (display name only — no child emails or birthdays), lesson assignments and six-skill progress tracking synced to the server
- **/studio** — content studio: curriculum drafts, educator/community review tracking, human pronunciation audio uploads with speaker consent records, and YouTube video suitability checks
- **/account** — change password (ends other sessions), sign out everywhere, regenerate recovery codes, download a full JSON export of the family's data, or permanently delete the account and everything it owns
- **Recovery codes** — eight one-time codes issued at sign-up (there is no email reset); "Forgot your password?" on the sign-in page resets the password with a code and signs out all devices
- **/safety** — plain-language safety, privacy and accessibility record
- Learner profiles can be individually removed from the family dashboard, deleting their progress and assignments
- Sign-in, sign-up and account endpoints are rate-limited in-app

## Architecture

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Hand-crafted CSS design system (`app/globals.css`) + Tailwind PostCSS pipeline |
| Database | SQLite via better-sqlite3 + Drizzle ORM (schema bootstraps automatically on first run) |
| Media storage | Local filesystem (`.data/media`), swappable for S3/GCS/R2 (`lib/storage.ts`) |
| Auth | Self-contained email + password (scrypt hashing, httpOnly session cookies) — `lib/auth.ts` |
| Tests | Node.js built-in test runner (`tests/`) |

The learner experience is deliberately local-first: children never sign in, and their stars/progress live in the browser. The server database only stores what a signed-in grown-up chooses to create.

## Run locally

Requirements: Node.js 20.9 or newer (22 recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

Environment variables (all optional, see `.env.example`):

- `DATABASE_PATH` — SQLite file location (default `.data/bangla-adventures.db`)
- `MEDIA_ROOT` — uploaded pronunciation audio directory (default `.data/media`)
- `PORT` — server port (default 3000)

### Docker

```bash
docker build -t bangla-adventures .
docker run -p 3000:3000 -v bangla_data:/app/.data bangla-adventures
```

### Deploying to the client's cloud

The app runs on any VM or container service (AWS Lightsail/EC2/ECS, Azure App Service, Google Cloud Run with a persistent volume, Oracle Cloud). It needs: Node 22 (or the Docker image), one persistent disk for `.data/` (database + uploaded audio), and a reverse proxy (nginx/Caddy) terminating HTTPS on the client's domain. See `docs/DEPLOYMENT.md` for a step-by-step guide.

## Quality checks

```bash
npm run lint             # ESLint (next/core-web-vitals + TypeScript)
npm test                 # curriculum integrity, audio coverage, crypto, rate limiter
npm run build            # type-checks and produces the production bundle
npm run test:integration # full HTTP flow against the built server (run after build)
```

## Main source files

- `app/page.tsx` — learner site: content, bilingual state, lessons, story, game, progress and dialogs
- `app/curriculum.ts` — all six proficiency bands and the complete 18-lesson curriculum
- `app/learning-content.ts` — dialogues, four-skill sessions and quick checks for every lesson
- `app/components/LessonExperience.tsx` — guided six-session lesson player
- `app/components/FourSkillDiagnostic.tsx` — starting-level guide
- `app/family/` + `app/studio/` — grown-up dashboard and content studio
- `lib/auth.ts`, `lib/password.ts` — account and session handling
- `db/schema.ts`, `db/bootstrap.ts` — Drizzle schema and idempotent SQLite bootstrap
- `docs/PROJECT_PACK.md` — research, requirements, architecture, safety, roadmap and review plan
- `docs/DEPLOYMENT.md` — cloud deployment runbook

## Privacy model

Children are never asked to sign in and the learner site collects no personal data; stars and completed activities stay in the browser. YouTube receives a connection only after a learner chooses to load a video. Grown-up accounts store an email, a display name and a scrypt-hashed password. Learner profiles hold a display name, an optional broad age band and a general language list — no child contact details, birthdays, schools, locations or photos. Uploaded pronunciation audio requires an adult speaker credit and recorded consent confirmation before it can be approved.

## Before public launch

This is a complete, review-ready platform, not yet an officially validated language assessment service. Before broad public launch the team should complete: Bangladeshi community and educator content review (trackable in the Content Studio), child usability testing with consent, professional Bangla language and audio review, a privacy impact assessment, a WCAG 2.2 AA audit, security testing, and legal review of applicable child-privacy requirements (Australian Privacy Act / OAIC Children's Online Privacy Code, COPPA if targeting the US).
