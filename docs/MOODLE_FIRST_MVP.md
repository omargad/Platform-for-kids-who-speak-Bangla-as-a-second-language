# Moodle-first MVP recovery plan

Decision date: 12 August 2026
Target: a working, low-cost child pilot before week 12

## Outcome

Use self-hosted Moodle as the learning-management system. Keep the Next.js
application only as a public, bilingual source-and-topic companion while it is
useful. Moodle becomes the system of record for users, roles, courses,
enrolment, announcements, assignments, quizzes, completion and grades.

This is cheaper and safer than finishing a second home-grown LMS. Moodle LMS is
open source; the project uses the client's existing cloud credits and domain,
one small VM and core Moodle activities. There is no paid plugin, SaaS LMS,
mobile app or LTI integration in the first pilot.

## Evidence from the repository audit

The baseline compiles and its automated checks pass: 74 unit tests, a successful
Next.js production build and no ESLint errors (seven warnings remain in legacy
screens). That proves code consistency, not educational validity or a complete
user journey.

The same repository currently contains these conflicting statements:

- the requirements document labels most work “Done”;
- `app/nctb-content.ts` marks every NCTB-to-lesson bridge
  `pending-educator-review`;
- the media guide says every YouTube item is an unverified candidate and the
  bundled audio is synthetic; and
- the client asked for culture, history and literature rather than a new
  language curriculum, but 18 CEFR-labelled language lessons still dominate
  much of the prototype.

The recovery work treats the pending evidence as authoritative.

## Launch-scope decision

| Surface | Decision | Reason |
| --- | --- | --- |
| `/books`, `/library` | Keep as reviewer/source companion | Strongest traceability work; official PDFs remain evidence, not child lessons |
| `/topics` | Keep as a visibly draft review surface | Bilingual adaptations exist, but require source, language, culture, age and child review |
| `/resources`, `/safety` | Keep after link/copy review | Useful adult-facing context; not an approved curriculum |
| Accounts, `/teach`, `/classroom`, `/family`, `/studio` | Move to Moodle; redirect in Moodle mode | Moodle already supplies roles, classes, activities, submissions, workflow and gradebook |
| `/learn`, language tools, worksheets, certificate | Exclude from the culture pilot | They do not match the client's re-scoped core and create avoidable review work |
| YouTube videos/playlists | Exclude until individually approved | All candidates remain unverified |
| Bundled audio | Exclude from pilot | Synthetic speech is not a reviewed pronunciation model |
| Poems/stories | Exclude unless exact rights and accessibility evidence exists | A title or public source link does not establish reuse permission |
| Extracted PDF text and images | Reviewer-only evidence | Scan quality, reading order and copyright make direct learner use unsuitable |

When `PLATFORM_MODE=moodle` is set, `next.config.ts` redirects the retired page
surfaces to `MOODLE_URL` and rewrites their API prefixes to a local `410 Gone`
response. Default `legacy` mode remains available for comparison and migration;
it is not the launch configuration.

## First pilot

The controlled manifest is
`moodle/local/banglapilot/data/content-manifest.json`:

1. **Ekushey** — history and commemoration;
2. **Pohela Boishakh** — culture and varied family traditions; and
3. **Folk tales** — literature, evidence and learner retelling.

Each has a Moodle Book with five substantive bilingual draft chapters, a
three-question bilingual quiz and one teacher-reviewed response. The third
activity is an Assignment except where a teacher-moderated forum is explicitly
suitable. The installable local plugin seeds all nine activities and imports
the nine draft GIFT items into private quiz question banks.

All 27 module gates start pending. This is intentional. `npm run
verify:moodle-release` fails until every gate has a named reviewer, date and
evidence. The code cannot appoint an educator, grant copyright permission,
obtain recording consent or conduct a child pilot.

## Level model

Do not label culture/history/literature modules A1–C2. CEFR may be referenced
later for a distinct language course, but it does not validate historical or
cultural depth. The pilot records:

- target age and school context;
- assumed English and Bangla reading support;
- text length and vocabulary load;
- whether the learner may listen, read, draw, speak or write;
- success criteria and a teacher rubric; and
- an easier and harder scaffold for the same topic.

## Cheapest credible architecture

| Component | Pilot choice |
| --- | --- |
| Host | One client-funded Linux VM, initially 2 vCPU / 4 GB RAM / 25+ GB encrypted disk |
| LMS | Moodle 5.2.2, pinned for deployment and patched within its supported line |
| Database | MariaDB 10.11 on the same VM for the small pilot |
| Public companion | Existing Next.js server on the same VM, with custom LMS mode disabled |
| TLS | Let's Encrypt through the selected reverse proxy/web server |
| Storage | Local encrypted disk; nightly database + `moodledata` + app-data backup to a separate bucket |
| Monitoring | External HTTPS check, Moodle system-status/cron checks and disk/backup alerts |

Moodle 5.2.2 requires PHP 8.3 and MariaDB 10.11, MySQL 8.4 or PostgreSQL 16.
Moodle 5.1+ also requires the web document root to point at Moodle's `public`
directory. The maintained installation instructions are linked in
`infra/moodle/README.md`.

## Moodle roles for the pilot

| Person | Moodle role | Boundary |
| --- | --- | --- |
| Platform owner | Manager or administrator | Server/site configuration; never a shared team login |
| Course editor | Editing teacher | Creates hidden draft activities and imports reviewed questions |
| Reviewer | Non-editing teacher or a narrowly configured reviewer role | Reviews content without site administration |
| Community-school teacher | Teacher | Enrols/teaches assigned cohort and views its work |
| Child learner | Student | Reads, attempts and submits only within the course |
| Parent/guardian | No account in the first pilot unless the school approves a defined need | Receives consent/privacy information outside the learner course |

## Migration order

1. Provision a private Moodle test site and create named adult accounts.
2. Package and install `local_banglapilot`; its CLI builds the hidden
   three-section course, imports questions and proves a repeat application has
   no drift.
3. Complete source mapping, language, cultural, age, rights, accessibility and
   media review in that order.
4. Run teacher-only acceptance testing and correct the course.
5. Complete privacy/safeguarding documents and recruit a small consented child
   pilot through the client/community school.
6. Record feedback, revise and approve the `childPilot` gates.
7. Run `npm run verify:moodle-release`; only a passing result may precede a
   learner deployment.
8. Set the companion app to Moodle mode, test redirects/retired APIs, DNS,
   HTTPS, backups, cron and restore.
9. Expand topics one at a time through the same manifest gate—not by bulk
   importing the remaining prototype.

## Definition of done for the child pilot

- Three approved modules are complete end to end on phone, tablet and desktop.
- Learner, teacher and reviewer permissions are tested with separate accounts.
- Quizzes write to the Moodle gradebook; assignments are private to the learner
  and authorised staff.
- Every published statement has an exact source decision and named educational
  approval.
- No unreviewed synthetic audio, YouTube media or textbook scan is presented as
  a lesson.
- Parent/guardian information, consent, safeguarding contact and data-retention
  rules are approved.
- Keyboard, screen-reader, zoom/reflow and browser/device checks are recorded.
- HTTPS, Moodle cron, monitoring, nightly backups and a restore exercise pass.
- The client observes the working course before children are enrolled.

## Explicitly not complete

The repository does not deploy Moodle to the client's account because cloud,
DNS and administrator access have not been supplied. It does not approve educational content or complete
legal, privacy, safeguarding, accessibility or child testing. Those are launch
dependencies with named human owners, not programming tasks that can be marked
done by a build.
