# Moodle pilot course

The source-controlled Moodle 5.2 local plugin is in
`local/banglapilot`. It installs one hidden draft course and deliberately has
no publication command.

## What the seed creates

- three culture/history/literature sections: Ekushey, Pohela Boishakh and folk
  tales;
- three Moodle Books with 15 bilingual chapters and explicit support prompts;
- three Moodle Quizzes with nine bilingual GIFT questions;
- two private Assignments and one teacher-moderated Forum; and
- draft warnings plus 27 evidence-backed human release gates.

No YouTube item, playlist, synthetic voice, textbook scan or child account is
included. The lesson text is a substantial original/adapted draft, not an
educator approval or permission to publish NCTB material.

## Validate and package

From the repository root:

```bash
npm run verify:moodle-pilot
npm run verify:moodle-plugin
npm run moodle:package
```

The package command writes ignored deployment artifacts to
`dist/local_banglapilot.zip` and `dist/local_banglapilot.zip.sha256`. The ZIP
has the Moodle-required top-level `banglapilot/` directory.

## Install on the prepared host

Copy the ZIP, its checksum and `infra/moodle/install-pilot-plugin.sh` to the
private Moodle VM. Validate before changing the host, then install:

```bash
./install-pilot-plugin.sh \
  --check-package /path/to/local_banglapilot.zip \
  --sha256-file /path/to/local_banglapilot.zip.sha256

sudo ./install-pilot-plugin.sh \
  --install /path/to/local_banglapilot.zip \
  --sha256-file /path/to/local_banglapilot.zip.sha256
```

Installation backs up an existing plugin, runs Moodle upgrade, applies the
seed twice and performs a read-only drift check. The repeatability check must
report three hidden sections, nine activities, 15 chapters, nine questions and
27 remaining release blockers.

An administrator can repeat the read-only check from Moodle's application
root:

```bash
sudo -u www-data php public/local/banglapilot/cli/seed.php --check --json
```

## Review and release boundary

`local/banglapilot/data/content-manifest.json` is the review authority. Every
gate record requires a valid status and, for approval, a named reviewer, ISO
date and evidence. Repository validation is:

```bash
npm run verify:moodle-pilot   # draft structure passes and reports blockers
npm run verify:moodle-release # intentionally fails until every gate passes
```

Even after the manifest passes, course publication remains a separate human
administrator action following teacher acceptance, accessibility review,
privacy/safeguarding approval and a consented child pilot. The plugin never
changes course or category visibility to public.

Moodle documents the [GIFT import format](https://docs.moodle.org/502/en/GIFT_format).
The plugin uses only Moodle-core Book, Quiz, Assignment and Forum activities;
there is no paid plugin dependency.

## Child-data boundary

- Public self-registration and guest access stay disabled.
- The school/client recruits participants and obtains parent/guardian consent.
- Learners receive Moodle's Student role only after adult acceptance testing.
- Teachers see work only for authorised cohorts; learner submissions are not
  copied into the Next.js companion.
- The school approves minimum identity fields, retention, deletion,
  safeguarding contacts and incident response before accounts are created.
