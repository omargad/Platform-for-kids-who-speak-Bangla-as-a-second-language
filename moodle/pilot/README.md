# Moodle pilot course pack

This directory is the controlled hand-off from the custom prototype to Moodle.
It contains three candidate modules, not a claim that the curriculum is ready
for children.

## What is included

- `content-manifest.json` — the source anchors, Moodle activity plan and nine
  mandatory review gates for each module;
- `questions.gift` — nine bilingual draft questions in Moodle's native GIFT
  import format; and
- `npm run verify:moodle-pilot` — structural and traceability validation.

The first pilot deliberately uses three sections only:

1. Ekushey and the Language Movement (history);
2. Pohela Boishakh (culture); and
3. folk tales and retelling (literature).

CEFR A1–C2 labels are not used. CEFR describes language proficiency; these
modules teach culture, history and literature. The pilot uses one stated age
range, explicit reading support and activity-level scaffolding instead.

## Build the course in Moodle

1. Create one hidden course named **Bangladesh Culture, History and Literature
   — Pilot**.
2. Set course visibility to hidden and disable guest access and self-enrolment.
3. Create one section per manifest module in `sequence` order.
4. Use only the core resource/activity types listed in `moodleBuild`. Do not
   install paid plugins for the pilot.
5. In **Question bank → Import**, choose **GIFT format** and upload
   `questions.gift`. Keep the quiz hidden until its module gates are approved.
6. Set quizzes to shuffle answer choices, allow one practice re-attempt and
   show feedback only after submission.
7. Use Moodle Assignment for private learner work and Moodle's gradebook for
   teacher feedback. Do not recreate submissions in the Next.js application.
8. Do not add a YouTube embed, playlist, synthetic voice or textbook image.
   Media may enter only through the `mediaSafety`, `copyrightPermissions` and
   `accessibility` gates.

Moodle documents the [GIFT import format](https://docs.moodle.org/502/en/GIFT_format)
and provides Book, Quiz, Assignment, Forum and H5P in the normal course
workflow. H5P is optional after the basic pilot works; it is not a launch
dependency.

## Review and release

Every gate record has four fields:

- `status`: `pending`, `in-review` or `approved`;
- `reviewer`: the accountable person's name;
- `reviewedAt`: an ISO date; and
- `evidence`: a decision note, page reference or linked review record.

An `approved` status without all three evidence fields is invalid. Run:

```bash
npm run verify:moodle-pilot
npm run verify:moodle-release
```

The first command validates a draft and reports blockers. The second is the
deployment gate and must fail until every requirement has named, dated
evidence. After approval, set each module's `publicationStatus` and the
course-level `courseStatus` to `approved`, then set `releaseReady` to `true`.

## Child-pilot boundary

- The school/client recruits participants and obtains parent/guardian consent.
- Moodle accounts are created or imported by an administrator; public
  self-registration stays disabled.
- Teachers see only learners in their course. Learners do not receive editing
  rights and do not publish work publicly.
- The pilot records only the minimum identity data the school approves.
- A staff member records observed usability issues and the revision made in the
  `childPilot` evidence field before release expands beyond the test group.
