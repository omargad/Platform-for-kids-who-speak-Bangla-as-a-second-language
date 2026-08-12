# Client requirements — meeting of 10 August 2026

Source: recorded client meeting with **Dr Tanjila Kanij** (project owner) and
**Faysal Alam** (technical contact), plus the supervisor meeting the same day.
This document restates every requirement raised, and maps each one to the
platform's current state.

## The re-scoped mission

> "This one is particularly focused on **the culture, the history, the
> literature** … I would **not** prefer language incorporated in this one."

The platform serves children (prep–year 12) at Australian community-run
Bangla schools. The schools' *language* curriculum is already structured; the
*culture/history/literature* strand is not — teachers pick a term topic (e.g.
festivals, movies) and students research and present. The platform is that
missing systematic resource.

## Requirement traceability

Status meanings: **implemented** means software exists; **partial** means it
cannot be accepted yet; **decision** requires the client/school; **blocked** is
a launch dependency. No row is marked done solely because the project builds.

| # | Requirement (client's words, condensed) | Current evidence | Status / next acceptance step |
|---|---|---|---|
| R1 | Content must come from **NCTB government textbooks** | Official pages, 143 download endpoints and representative PDFs were audited; topic/lesson mappings remain pending | **Partial:** educator confirms exact edition/page and interpretation for each published module |
| R2 | Focus on **culture, history, literature — not language** | 13 topic drafts exist, but 18 language lessons and related tools remain in the repository | **Partial:** Moodle pilot contains only three culture/history/literature modules; Moodle mode redirects the language/LMS surfaces |
| R3 | Customise for children who do not have Bangla as a first language; English first | Bilingual draft adaptations exist | **Partial:** English/Bangla, reading load, scaffolds and age suitability need named review and child testing |
| R4 | Bangla translation is desirable | Topic drafts provide EN/BN copy | **Partial:** Bangla spelling, register and translation are not professionally approved |
| R5 | Stories/poems must not be altered | Prototype literature pages exist and some copyright rules are encoded | **Blocked:** exact work/edition, public-domain or permission basis, faithful text and accessibility review required before publication |
| R6 | Copyright care; no unapproved copying or AI misuse | Source/audit policy exists; NCTB scans are not embedded as lessons | **Blocked:** rights review and a content provenance record are required per module/media item |
| R7 | Learners read information and take short quizzes teachers can see | The plugin seeds 15 bilingual Book chapters, three quizzes and nine draft questions | **Partial:** the hidden Moodle flow must be deployed and teacher-tested after content approval |
| R8 | Teacher access to create activities and see work | Custom prototype exists; Moodle provides the launch workflow | **Implemented in architecture, not deployed:** configure and permission-test Moodle teacher/editor/reviewer roles |
| R9 | Parent access, pending principal confirmation | A legacy family dashboard exists | **Decision:** no parent account in the first Moodle pilot unless the school confirms a clear need and privacy model |
| R10 | Responsive website, tablet first, not a mobile app | Responsive code exists | **Partial:** device/browser, keyboard, zoom/reflow and screen-reader validation still required |
| R11 | Soft pastel, simple child-appropriate design | Prototype styling exists | **Partial:** client/child observation and iterative usability changes required |
| R12 | Teacher announcements are desirable | Legacy prototype exists; Moodle announcements/forum can supply it | **Not configured:** test within the hidden pilot course |
| R13 | Refresh sources annually | NCTB audit pipeline and source catalogue exist | **Partial:** assign an owner, record edition/checksum/date and test the yearly update process without silently changing approved lessons |
| R14 | Low-cost/free-tier hosting; GitHub required | GitHub repository exists; the Moodle-first single-VM plan now includes guarded Ubuntu preparation, installation, TLS and host-verification tools using client credits and core open-source software | **Partial:** cloud/DNS credentials, actual production execution, backup restore and support ownership remain |
| R15 | Non-NCTB sources only with client approval | External providers are listings on `/resources`, not lesson evidence | **Policy implemented:** each future use still needs a recorded client decision |
| R16 | Working solution before week 12 for child feedback | Compile/test baseline and three-module Moodle pack exist | **Blocked:** Moodle deployment, 27 content gates, privacy/safeguarding, access testing and a consented pilot remain |

## Current content decisions

- `app/nctb-books.ts` records eight current Class 1–5 titles, eleven Bangla/
  English PDF variants, pre-primary records and conditional educator/teen/
  community sources. See `docs/NCTB_CONTENT_AUDIT.md` for exact limits.
- The repository now has direct official catalogue and government-hosted
  download links. Link availability does not establish educational approval,
  accessibility or permission to republish.
- `app/topics-content.ts` contains 13 bilingual topic prototypes. They are a
  review inventory, not 13 published lessons.
- `moodle/local/banglapilot/data/content-manifest.json` selects only Ekushey, Pohela Boishakh and
  folk tales for the first course. All 27 release gates are pending.
- No YouTube candidate, synthetic audio or NCTB scan enters the first pilot.

## Child-data decision for the Moodle pilot

- The legacy nickname/token design is not the launch system once Moodle mode is
  enabled.
- The school/client controls recruitment, parent/guardian consent and the
  minimum approved identity fields. Public self-registration and guest course
  access stay disabled.
- Separate test accounts must prove administrator, editor/reviewer, teacher and
  student boundaries before enrolment.
- Learner work remains private to the learner and authorised teaching staff;
  public forums/profiles are not part of the pilot.
- Privacy impact, retention/deletion, safeguarding contact, incident response
  and Australian child-privacy review remain launch blockers.

## Decisions and evidence needed next

1. Approve or change the three pilot topics, learner age/context and parent
   access decision.
2. Name the curriculum/Bangla, cultural/history, accessibility, privacy/
   safeguarding and technical owners.
3. Give each reviewer one manifest gate and require exact evidence, not a
   general “looks good” response.
4. Provide cloud and DNS access; build the hidden Moodle course and demonstrate
   teacher/student roles before children are invited.
5. Agree on the consented child-pilot size, recruitment route, observation
   method and feedback-to-revision record.
6. Approve production operations: HTTPS, email, monitoring, nightly off-VM
   backups, restore test, support and incident response.

The implementation and release sequence is in `docs/MOODLE_FIRST_MVP.md`.
