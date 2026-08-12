# Bangla culture pilot seeder

This Moodle 5.2 local plugin installs one source-controlled, hidden draft
course. It creates three sections, three Books, three Quizzes, two private
Assignments, one teacher-moderated Forum and nine bilingual draft questions.

The plugin is deliberately unable to publish a course. Every apply run forces
both its course category and course to remain hidden. The 27 release gates in
`data/content-manifest.json` remain the authority for human approval.

From the Moodle root after installing the plugin:

```bash
php admin/cli/upgrade.php --non-interactive
php public/local/banglapilot/cli/seed.php --apply
php public/local/banglapilot/cli/seed.php --check --json
```

Running `--apply` again is idempotent. Source-controlled chapters are updated
in place and activities are found by stable Moodle ID numbers. Existing quiz
questions are never silently replaced after their question-bank hash has been
recorded; a changed GIFT bank requires an explicit editorial migration.

Copyright 2026 Bangla Adventures project team. PHP code is licensed under the
GNU GPL v3 or later. Lesson text is an original, unapproved educational draft;
NCTB books are cited as review evidence and are not copied into this package.
