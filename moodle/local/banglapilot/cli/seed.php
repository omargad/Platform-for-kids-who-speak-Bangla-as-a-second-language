<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../../../config.php');
require_once($CFG->libdir . '/clilib.php');

$help = <<<'HELP'
Install or verify the source-controlled Bangla culture pilot.

The plugin has no publish command. Applying the seed always leaves its
category and course hidden.

Options:
  --apply      Create or refresh the hidden draft course.
  --check      Verify the installed course without changing it.
  --json       Print the complete machine-readable report.
  -h, --help   Show this help.

Examples:
  php public/local/banglapilot/cli/seed.php --apply
  php public/local/banglapilot/cli/seed.php --check --json
HELP;

[$options, $unrecognised] = cli_get_params([
    'apply' => false,
    'check' => false,
    'json' => false,
    'help' => false,
], [
    'h' => 'help',
]);

if ($unrecognised) {
    cli_error('Unknown option(s): ' . implode(', ', $unrecognised) . "\n\n" . $help);
}
if ($options['help']) {
    cli_writeln($help);
    exit(0);
}
if ((bool) $options['apply'] === (bool) $options['check']) {
    cli_error("Choose exactly one of --apply or --check.\n\n" . $help);
}

try {
    \core\session\manager::set_user(get_admin());
    $seeder = new \local_banglapilot\local\seeder();
    $report = $options['apply'] ? $seeder->apply() : $seeder->check();

    if ($options['json']) {
        cli_writeln(json_encode(
            $report,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
        ));
    } else {
        cli_writeln(sprintf(
            'Pilot verified: hidden course %d, %d sections, %d activities, %d chapters, %d questions, %d blockers.',
            $report['courseId'],
            $report['sectionCount'],
            $report['activityCount'],
            $report['chapterCount'],
            $report['questionCount'],
            $report['releaseBlockers'],
        ));
    }
} catch (Throwable $error) {
    cli_error('Bangla pilot seed failed: ' . $error->getMessage());
}
