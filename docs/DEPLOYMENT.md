# Deployment runbook

The launch architecture is Moodle-first. Use
[`infra/moodle/README.md`](../infra/moodle/README.md) for the single-VM Moodle
5.2.2 deployment and [`docs/MOODLE_FIRST_MVP.md`](MOODLE_FIRST_MVP.md) for the
course/content acceptance gates.

## Production shape

- `learn.<client-domain>` — Moodle; users, roles, enrolment, quizzes,
  assignments, completion and grades;
- `www.<client-domain>` — this Next.js public companion; NCTB source catalogue
  and approved bilingual topics only; and
- one client-funded Linux VM for the small pilot, with MariaDB and encrypted
  persistent storage. Backups must be encrypted and copied off the VM.

The VM and domain cannot be provisioned until the client supplies cloud and DNS
access. The repository now includes guarded Ubuntu preparation, installation,
TLS activation and host-verification tools under `infra/moodle/`; no script
contains or generates production credentials. A GitHub Codespace is not
production hosting.

## Companion application

Build with Node.js 22:

```bash
npm ci
npm run lint
npm test
npm run verify:moodle-pilot
npm run verify:moodle-infra
npm run verify:moodle-release
npm run build
```

`verify:moodle-release` is expected to fail while the manifest contains pending
human-review gates. Do not bypass it for a child-facing deployment.

Production environment:

```dotenv
NODE_ENV=production
PORT=3000
DATABASE_PATH=/srv/bangla-companion/bangla-adventures.db
MEDIA_ROOT=/srv/bangla-companion/media
PLATFORM_MODE=moodle
MOODLE_URL=https://learn.example.org
NEXT_PUBLIC_MOODLE_URL=https://learn.example.org
```

Run one Next.js instance. In Moodle mode the legacy custom LMS and language
pages redirect to Moodle and their API prefixes return `410 Gone`. `/api/health`
and the public library response remain available.

## Required acceptance checks

1. The three Moodle course sections pass the manifest release check and are
   visible only to the approved pilot cohort.
2. Student, teacher, reviewer/editor and administrator test accounts prove role
   separation.
3. Moodle cron runs every minute with no failed-task backlog.
4. HTTPS, secure cookies, outbound mail and password recovery work.
5. The public companion's retired routes redirect to the correct Moodle host;
   retired APIs return `410`, not a working shadow LMS.
6. Phone/tablet/desktop, keyboard, screen-reader and zoom/reflow results are
   recorded.
7. Database, `moodledata`, Moodle config and companion data are backed up to
   separate storage and restored into a test environment.
8. Monitoring covers public HTTPS, Moodle system status/cron age, disk space and
   backup age.
9. Privacy, retention, safeguarding, incident response and child-pilot consent
   documents have named owners and client approval.

## Legacy-only application mode

`PLATFORM_MODE=legacy` leaves the original Next.js account, classroom, family,
studio, language lesson, worksheet and certificate prototypes reachable. This
is for comparison and migration testing only. It uses SQLite, filesystem media
and in-memory rate limiting, so it must remain one instance and is not the
recommended LMS deployment.
