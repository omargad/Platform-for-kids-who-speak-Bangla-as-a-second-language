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

| # | Requirement (client's words, condensed) | Status | Where |
|---|---|---|---|
| R1 | Content must come from **NCTB government textbooks** ("published textbook by a government body would be the reliable source") | ✅ Done | `/library` catalog + every `/topics` reading cites its NCTB book |
| R2 | Focus on **culture, history, literature — not language** | ✅ Done | `/topics` (13 readings in 3 themes) is the lead experience; language tools demoted to an "optional extension" corner on `/learn` |
| R3 | **Not presented as in the textbook** — customised for kids who don't have Bangla as first language, English-first interface | ✅ Done | All topic text originally written for heritage learners; English is the default UI language |
| R4 | **Bangla translation** good to have (parents may prefer Bangla) | ✅ Done | Every page has the EN/BN toggle |
| R5 | **Stories/poems presented as-is** ("we cannot change a story, we cannot change the poem") | ✅ Done | `/poems` presents public-domain verse verbatim (Tagore, Kusumkumari Das, folk rhymes) with author credits; Nazrul (in copyright until 2036) is cited, never reproduced |
| R6 | **Copyright care** — no verbatim copying, no breaching AI training rules | ✅ Policy | All platform text is original; sources are cited, never reproduced |
| R7 | Students **read info, then do short quizzes** they can show teachers | ✅ Done (v1) | Each topic ends in a 3-question quiz with a "show your teacher" result screen (device-local) |
| R8 | **Teacher access level** — teachers set up quizzes/activities and see student work | ✅ Done | `/teach`: create classes with join codes, author quizzes/activities (optionally tied to a topic), open/close them, see graded submissions per student. `/classroom`: students join with a first name + code (no email/password), do the work, scores go to the teacher |
| R9 | **Parent access** (client leans yes, principal to confirm) | ✅ Partial | Grown-up accounts + family dashboard already track progress per child |
| R10 | **Responsive website** (tablets first), not a mobile app | ✅ Done | Responsive layouts across the site |
| R11 | **Soft pastel, simplistic design**; research kids' info platforms | ✅ Ongoing | New pages use soft pastel panels; client offered to review designs with the kids |
| R12 | **Announcements by teachers** — good to have, not core | ✅ Done | Teachers post/remove class announcements on `/teach`; students see them at the top of `/classroom` |
| R13 | **Yearly source refresh** — "every year we should be able to change the sources" | ✅ Done | `/teach` → "Textbook knowledge sources": update each book's official download link (or add/hide books) with no code change; the public `/library` reflects it instantly via `/api/library` |
| R14 | **Low-cost / free-tier hosting**; GitHub mandatory | ✅ Done | SQLite + Node single container, no paid services; repo on GitHub |
| R15 | Other sources (BRAC, universities…) **only with client approval** | ✅ Policy | They stay on `/resources` as external listings; `/library` states the approval rule |
| R16 | Working solution **before week 12** so kids can test it | ✅ On track | Platform is deployable now (see `docs/DEPLOYMENT.md`) |

## Key content decisions

- **NCTB books catalogued** (`app/library-content.ts`): Amar Bangla Boi (1–5),
  Bangladesh and Global Studies (3–5 and 6–10, English versions), History of
  Bangladesh and World Civilization (9–10, English version), the secondary
  Bangla readers (Charupath / Saptabarna / Sahitya Kanika / Anandapath),
  Arts and Crafts (Charu O Karukola), and Language and Culture of Minority
  Ethnic Groups — the book the client picked during the meeting.
  Books whose exact current edition should be double-checked with the school
  carry a visible "confirm" chip.
- **nctb.gov.bd cannot be fetched from this dev environment** (network
  egress rules), so book cards link to the official portal home rather than
  deep PDF URLs, which NCTB also reshuffles between years. The team should
  verify deep links from a normal connection and can then store per-book URLs
  in `app/library-content.ts`.
- **13 classroom topics** shipped (`app/topics-content.ts`): Ekushey/Language
  Movement, Liberation War 1971, Ancient Bengal, National symbols; Pohela
  Boishakh, Festivals of many faiths, Nobanno & pitha, Rivers & everyday
  life, Hill & plains communities; Tagore, Nazrul, Thakurmar Jhuli folk
  tales, Nakshi kantha/Jamdani/rickshaw art. Every topic carries EN+BN text,
  fun facts, NCTB citations and a quiz.

## How the classroom keeps children safe (for the privacy review)

- A student account is a **first name or nickname + a random device token**
  linked to one class. No email, no password, no birthday, no surname.
- Students never see each other's scores; teachers see their own class only.
- Quiz answer keys never leave the server — grading is server-side and the
  student feed strips the `answer` field (covered by an integration test).
- Join and submit endpoints are rate-limited; a class can be deleted by its
  teacher at any time, which cascades away all of its students and submissions.

## Remaining items for the week-3 client meeting (decisions, not code)

1. Confirm with the principal: parent access (R9), the "confirm" library
   entries, and the topic list priorities for the term plan.
2. Team reads the actual NCTB books (client: "six of you pick different
   things") and verifies each topic's facts against them. The ingestion
   pipeline is ready: run `npm run fetch:nctb` from a Codespace/laptop (the
   dev sandbox cannot reach nctb.gov.bd — verified: the egress proxy blocks
   it), drop any hand-downloaded PDFs into `content-sources/pdf/`, and the
   script extracts their text into `content-sources/text/` for commit. See
   `content-sources/README.md`. Add per-book deep links via the `/teach`
   source editor at the same time.
3. Client demo of the teacher/classroom flow; gather kid feedback via the
   school (the client offered to organise this).
4. Deployment to the client's hosting once credentials arrive (runbook ready).
