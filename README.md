# Bangla Adventures

A bilingual platform for Bangladeshi-heritage children outside Bangladesh,
focused on **culture, history and literature**. This is an ICT Project B
capstone with clients Dr Tanjila Kanij and Faysal Alam.

## Current product decision

The pilot is now **Moodle-first**.

- Moodle owns accounts, roles, enrolment, classes, announcements, quizzes,
  assignments, completion and grades.
- This Next.js application remains a public bilingual companion for NCTB source
  discovery and reviewed topic experiences.
- The custom account/classroom/studio code remains in `legacy` mode for
  comparison and migration. It is not the recommended launch LMS.
- The first course is only three candidate modules. Nothing is bulk-published
  from the 18 language lessons or 13 topic drafts.

See [`docs/MOODLE_FIRST_MVP.md`](docs/MOODLE_FIRST_MVP.md) for the audit,
architecture and acceptance criteria.

## Honest delivery status

| Area | Status |
| --- | --- |
| Official NCTB catalogue and PDF audit | Source records implemented; a verified PDF is not an approved adaptation |
| Bilingual topic prototypes | Implemented as drafts; educational/community review remains |
| Moodle pilot pack | Three-module manifest and nine-question GIFT bank implemented |
| Automated publication control | Draft validation passes; release validation intentionally fails while 27 gates are pending |
| Custom learner/teacher/family LMS | Frozen for launch; redirected/retired when Moodle mode is enabled |
| Human Bangla audio | Not complete |
| YouTube/media verification | Not complete; media excluded from the first pilot |
| Curriculum, accessibility and child review | Not complete |
| Privacy, safeguarding and legal approval | Not complete |
| Cloud/domain deployment and operations | Reproducible host/install/TLS verification tools implemented; actual deployment still requires client credentials and named owners |

A successful build proves that the software compiles. It does not approve
Bangla, historical claims, copyright, age suitability, accessibility or child
safety.

## Client-aligned scope

The 10 August 2026 client meeting re-scoped the core away from a new language
course. Community Bangla schools already teach language; the missing resource
is a systematic, English-first culture/history/literature strand with optional
Bangla translation and trustworthy NCTB evidence.

The pilot therefore does **not** use CEFR A1–C2 labels. CEFR can describe a
future language pathway, but it does not measure cultural or historical depth.
The course instead states target age/context, reading support, activity
scaffolds, outcomes and teacher success criteria.

## First Moodle pilot

`moodle/pilot/` contains:

1. Ekushey and the Language Movement;
2. Pohela Boishakh; and
3. folk tales and retelling.

Each candidate module has official NCTB source anchors, a small Moodle-core
activity plan and nine mandatory gates: source mapping, Bangla, English
adaptation, cultural/historical accuracy, age suitability, rights, access,
media safety and a consented child pilot.

```bash
npm run verify:moodle-pilot   # validates a draft and reports blockers
npm run verify:moodle-release # must fail until all review evidence is approved
```

The question bank is `moodle/pilot/questions.gift`, importable through Moodle's
native GIFT importer after review.

## Public companion surfaces

| Route | Pilot role |
| --- | --- |
| `/topics` | Draft bilingual topic review experience |
| `/books` | Audited NCTB Book Bridge and precise source metadata |
| `/library` | Adult-facing textbook catalogue |
| `/resources` | External research register; not approved curriculum |
| `/safety` | Current safety/accessibility statements for review |

The remaining learner language tools and custom LMS pages are legacy surfaces.
When the production deployment sets `PLATFORM_MODE=moodle`, they redirect to
Moodle and their data APIs return `410 Gone`.

## Technology

| Layer | Choice |
| --- | --- |
| Public companion | Next.js 16, React 19, TypeScript |
| Pilot LMS | Self-hosted Moodle 5.2.2 |
| Moodle database | MariaDB 10.11 on the first single VM |
| Legacy prototype storage | SQLite + local filesystem, one instance only |
| Deployment | One client-funded VM initially; HTTPS, off-VM backup and monitoring required |

Moodle core is used before optional plugins. The first pilot has no paid LMS,
paid plugin, mobile app or LTI dependency.

## Run the companion locally or in Codespaces

Use Node.js 22.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. A Codespace is a development environment, not a
production host for children or persistent Moodle data.

To test the Moodle hand-off locally, provide a local or HTTPS Moodle URL:

```dotenv
PLATFORM_MODE=moodle
MOODLE_URL=http://localhost:8080
NEXT_PUBLIC_MOODLE_URL=http://localhost:8080
```

Production accepts HTTPS only. See `.env.example`.

## Quality checks

```bash
npm run lint
npm test
npm run verify:moodle-pilot
npm run verify:moodle-infra
npm run build
npm run test:integration
npm run test:e2e
```

Additional audits:

```bash
npm run verify:media  # candidate YouTube IDs; run where YouTube is reachable
npm run verify:links  # external resource register
npm run fetch:nctb    # controlled NCTB ingestion; PDFs themselves are not lessons
```

CI validates the draft manifest. A future deployment workflow must call
`verify:moodle-release`; it is intentionally not treated as passing while human
review is incomplete.

## Source and content boundaries

- `app/nctb-books.ts` records current official source metadata and direct
  government-hosted downloads.
- `app/nctb-content.ts` is an explicit review queue. Its lesson bridges remain
  `pending-educator-review`.
- `content-sources/` contains audit/extraction evidence, not learner-ready copy.
- Original accessible HTML must be written and reviewed for the diaspora
  audience; textbook scans are never embedded as the lesson interface.
- Stories, poems, images, recordings and video require exact rights, consent,
  attribution, accessibility and suitability evidence.

## Deployment

The lowest-cost production-shaped option is one small client-funded Linux VM:
Moodle 5.2.2 + PHP 8.3 + MariaDB 10.11, with the companion app on the same VM.
The Moodle web root must be its `public` directory, cron must run every minute,
and backups must leave the VM and be restored in a drill.

Use [`infra/moodle/README.md`](infra/moodle/README.md). Deployment cannot be
completed until the client supplies cloud and DNS access plus platform,
support, safeguarding/privacy and curriculum owners.

## Key documents

- `docs/MOODLE_FIRST_MVP.md` — recovery decision, scope and definition of done
- `moodle/pilot/README.md` — course authoring and release workflow
- `docs/NCTB_CONTENT_AUDIT.md` — PDF/source audit and its limits
- `docs/CLIENT_REQUIREMENTS_2026-08-10.md` — requirement traceability
- `docs/MEDIA_REVIEW.md` — unverified-video and human-audio process
- `infra/moodle/README.md` — cheapest credible deployment runbook
