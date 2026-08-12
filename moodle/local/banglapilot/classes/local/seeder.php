<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

namespace local_banglapilot\local;

use context_course;
use context_module;
use core_course_category;
use RuntimeException;
use stdClass;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/course/modlib.php');
require_once($CFG->dirroot . '/lib/questionlib.php');
require_once($CFG->libdir . '/enrollib.php');

/**
 * Creates and verifies the source-controlled hidden pilot course.
 *
 * This class has no publishing path. Applying the seed always forces the
 * controlled category and course back to hidden.
 *
 * @package    local_banglapilot
 * @copyright  2026 Bangla Adventures project team
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class seeder {
    /** Stable Moodle category identifier. */
    private const CATEGORY_IDNUMBER = 'bangla-adventures-drafts';

    /** Prefix used by all source-controlled course-module ID numbers. */
    private const ACTIVITY_ID_PREFIX = 'banglapilot-';

    /** @var array<string, mixed> Controlled release manifest. */
    private array $manifest;

    /** @var array<string, mixed> Bilingual draft lesson content. */
    private array $content;

    /** @var string Moodle GIFT question bank source. */
    private string $gift;

    /** @var string Hash covering manifest, content and GIFT inputs. */
    private string $contenthash;

    /** @var string Hash covering the GIFT question bank. */
    private string $questionhash;

    /**
     * Load and validate packaged source data.
     */
    public function __construct() {
        $datadir = dirname(__DIR__, 2) . '/data';
        $manifestjson = $this->read_file($datadir . '/content-manifest.json');
        $contentjson = $this->read_file($datadir . '/lesson-content.json');
        $this->gift = $this->read_file($datadir . '/questions.gift');

        $this->manifest = json_decode($manifestjson, true, 512, JSON_THROW_ON_ERROR);
        $this->content = json_decode($contentjson, true, 512, JSON_THROW_ON_ERROR);
        $this->contenthash = hash('sha256', $manifestjson . "\0" . $contentjson . "\0" . $this->gift);
        $this->questionhash = hash('sha256', $this->gift);

        $this->assert_data_contract();
    }

    /**
     * Create or refresh the hidden pilot and return a verification report.
     *
     * @return array<string, mixed>
     */
    public function apply(): array {
        global $DB, $PAGE;

        $transaction = $DB->start_delegated_transaction();

        $category = $this->ensure_hidden_category();
        $course = $this->ensure_hidden_course($category);
        $PAGE->set_course($course);
        $PAGE->set_context(context_course::instance($course->id));

        $this->disable_open_enrolment($course);
        $this->ensure_sections($course);

        foreach ($this->manifest['modules'] as $manifestmodule) {
            $contentmodule = $this->content_module($manifestmodule['id']);
            $this->ensure_book($course, $manifestmodule, $contentmodule);
            $this->ensure_quiz($course, $manifestmodule, $contentmodule);
            $this->ensure_response_activity($course, $manifestmodule, $contentmodule);
        }

        rebuild_course_cache($course->id, true);
        $transaction->allow_commit();

        set_config('seedhash', $this->contenthash, 'local_banglapilot');
        set_config('questionhash', $this->questionhash, 'local_banglapilot');
        set_config('courseid', (string) $course->id, 'local_banglapilot');

        return $this->check();
    }

    /**
     * Verify the installed course without changing it.
     *
     * @return array<string, mixed>
     */
    public function check(): array {
        $report = $this->build_report();
        $expectedchapters = array_sum(array_map(
            static fn(array $module): int => count($module['chapters']),
            $this->content['modules'],
        ));

        $expected = [
            'categoryHidden' => true,
            'courseHidden' => true,
            'sectionCount' => 3,
            'activityCount' => 9,
            'bookCount' => 3,
            'quizCount' => 3,
            'assignmentCount' => 2,
            'forumCount' => 1,
            'chapterCount' => $expectedchapters,
            'questionCount' => 9,
            'quizSlotCount' => 9,
            'contentHash' => $this->contenthash,
        ];

        foreach ($expected as $field => $value) {
            if (($report[$field] ?? null) !== $value) {
                throw new RuntimeException(sprintf(
                    'Pilot drift detected for %s: expected %s, found %s.',
                    $field,
                    json_encode($value),
                    json_encode($report[$field] ?? null),
                ));
            }
        }

        return $report;
    }

    /**
     * Read a required data file.
     *
     * @param string $path Absolute file path.
     * @return string
     */
    private function read_file(string $path): string {
        $value = file_get_contents($path);
        if ($value === false || trim($value) === '') {
            throw new RuntimeException('Missing or empty pilot data file: ' . $path);
        }
        return $value;
    }

    /**
     * Check the data relationship before Moodle is changed.
     */
    private function assert_data_contract(): void {
        if (($this->manifest['schemaVersion'] ?? null) !== 1 || ($this->content['schemaVersion'] ?? null) !== 1) {
            throw new RuntimeException('Unsupported pilot data schema.');
        }
        if (($this->manifest['courseId'] ?? null) !== ($this->content['courseId'] ?? null)) {
            throw new RuntimeException('Manifest and lesson content course IDs do not match.');
        }
        if (!empty($this->content['externalMedia'])) {
            throw new RuntimeException('The first pilot package cannot contain external media.');
        }
        if (count($this->manifest['modules'] ?? []) !== 3 || count($this->content['modules'] ?? []) !== 3) {
            throw new RuntimeException('The controlled first pilot must contain exactly three modules.');
        }

        $manifestids = array_column($this->manifest['modules'], 'id');
        $contentids = array_column($this->content['modules'], 'id');
        if ($manifestids !== $contentids) {
            throw new RuntimeException('Manifest and lesson module order must match exactly.');
        }

        foreach ($this->content['modules'] as $module) {
            if (count($module['chapters'] ?? []) < 5 || count($module['response']['rubric'] ?? []) !== 3) {
                throw new RuntimeException('Each pilot module needs at least five chapters and three rubric criteria.');
            }
        }

        foreach (['BA-P01', 'BA-P02', 'BA-P03'] as $prefix) {
            if (substr_count($this->gift, '::' . $prefix . '-') !== 3) {
                throw new RuntimeException('The GIFT source must contain exactly three questions for ' . $prefix . '.');
            }
        }
    }

    /**
     * Ensure a hidden category reserved for controlled drafts.
     *
     * @return core_course_category
     */
    private function ensure_hidden_category(): core_course_category {
        global $DB;

        $record = $DB->get_record('course_categories', ['idnumber' => self::CATEGORY_IDNUMBER]);
        if ($record) {
            $category = core_course_category::get($record->id, MUST_EXIST, true);
            $category->update([
                'name' => 'Bangla Adventures — controlled drafts',
                'visible' => 0,
            ]);
            return core_course_category::get($record->id, MUST_EXIST, true);
        }

        return core_course_category::create([
            'name' => 'Bangla Adventures — controlled drafts',
            'idnumber' => self::CATEGORY_IDNUMBER,
            'visible' => 0,
            'description' => 'Hidden working area. Human release gates must pass before any course is shown to learners.',
            'descriptionformat' => FORMAT_HTML,
        ]);
    }

    /**
     * Ensure the one controlled course exists and remains hidden.
     *
     * @param core_course_category $category Draft category.
     * @return stdClass
     */
    private function ensure_hidden_course(core_course_category $category): stdClass {
        global $DB;

        $summary = $this->course_summary();
        $data = (object) [
            'category' => $category->id,
            'fullname' => $this->manifest['courseTitle'],
            'shortname' => 'Bangla culture pilot — DRAFT',
            'idnumber' => $this->manifest['courseId'],
            'summary' => $summary,
            'summaryformat' => FORMAT_HTML,
            'format' => 'topics',
            'numsections' => 3,
            'visible' => 0,
            'newsitems' => 0,
            'showgrades' => 1,
            'enablecompletion' => 1,
            'showcompletionconditions' => 1,
            'groupmode' => 0,
            'groupmodeforce' => 0,
            'defaultgroupingid' => 0,
        ];

        $course = $DB->get_record('course', ['idnumber' => $this->manifest['courseId']]);
        if ($course) {
            $data->id = $course->id;
            update_course($data);
            return get_course($course->id);
        }

        return create_course($data);
    }

    /**
     * Disable guest and self enrolment if an administrator added either.
     *
     * @param stdClass $course Controlled course.
     */
    private function disable_open_enrolment(stdClass $course): void {
        foreach (enrol_get_instances($course->id, false) as $instance) {
            if (!in_array($instance->enrol, ['guest', 'self'], true)) {
                continue;
            }
            $plugin = enrol_get_plugin($instance->enrol);
            if ($plugin) {
                $plugin->update_status($instance, ENROL_INSTANCE_DISABLED);
            }
        }
    }

    /**
     * Create and label the three controlled topic sections.
     *
     * @param stdClass $course Controlled course.
     */
    private function ensure_sections(stdClass $course): void {
        global $DB;

        course_create_sections_if_missing($course, [0, 1, 2, 3]);
        $general = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 0], '*', MUST_EXIST);
        course_update_section($course, $general, [
            'summary' => $this->draft_notice_html()
                . '<p><strong>Adult workflow:</strong> review the source manifest, complete all release gates, '
                . 'then conduct teacher acceptance and a consented child pilot. This plugin cannot publish the course.</p>',
            'summaryformat' => FORMAT_HTML,
            'visible' => 1,
        ]);

        foreach ($this->manifest['modules'] as $module) {
            $section = $DB->get_record(
                'course_sections',
                ['course' => $course->id, 'section' => $module['sequence']],
                '*',
                MUST_EXIST,
            );
            course_update_section($course, $section, [
                'name' => $module['title']['en'] . ' / ' . $module['title']['bn'],
                'summary' => $this->draft_notice_html()
                    . '<p><strong>Learning outcome:</strong> ' . s($module['learnerOutcome']) . '</p>',
                'summaryformat' => FORMAT_HTML,
                'visible' => 1,
            ]);
        }
    }

    /**
     * Create or refresh one Moodle Book and its controlled chapters.
     *
     * @param stdClass $course Controlled course.
     * @param array<string, mixed> $manifestmodule Manifest module.
     * @param array<string, mixed> $contentmodule Lesson module.
     */
    private function ensure_book(stdClass $course, array $manifestmodule, array $contentmodule): void {
        global $DB;

        $build = $this->build_item($manifestmodule, 'book');
        $idnumber = $this->activity_idnumber($manifestmodule, 'book');
        $cm = $this->controlled_cm($course->id, $idnumber, 'book');
        $name = 'DRAFT — ' . $build['name'] . ': ' . $manifestmodule['title']['en'];
        $intro = $this->draft_notice_html()
            . '<p>' . s($build['purpose']) . '</p>'
            . '<p><strong>Reading support:</strong> ' . s($contentmodule['supportBand']) . '</p>';

        if (!$cm) {
            $data = $this->base_module_data($course, $manifestmodule['sequence'], 'book', $name, $idnumber, $intro);
            $data->numbering = 1;
            $data->navstyle = 1;
            $data->customtitles = 0;
            $created = add_moduleinfo($data, $course);
            $cm = get_coursemodule_from_id('book', $created->coursemodule, $course->id, false, MUST_EXIST);
        }

        $this->assert_cm_section($cm, $course, $manifestmodule['sequence']);
        $book = $DB->get_record('book', ['id' => $cm->instance], '*', MUST_EXIST);
        $DB->update_record('book', (object) [
            'id' => $book->id,
            'name' => $name,
            'intro' => $intro,
            'introformat' => FORMAT_HTML,
            'numbering' => 1,
            'navstyle' => 1,
            'customtitles' => 0,
            'timemodified' => time(),
        ]);
        $this->show_controlled_cm($cm);

        $expectedimports = [];
        foreach ($contentmodule['chapters'] as $index => $chapter) {
            $importsrc = 'local_banglapilot:' . $manifestmodule['id'] . ':' . $chapter['id'];
            $expectedimports[] = $importsrc;
            $record = $DB->get_record('book_chapters', ['bookid' => $book->id, 'importsrc' => $importsrc]);
            $chapterdata = (object) [
                'bookid' => $book->id,
                'pagenum' => $index + 1,
                'subchapter' => 0,
                'title' => $chapter['title']['en'] . ' / ' . $chapter['title']['bn'],
                'content' => $this->render_chapter($chapter),
                'contentformat' => FORMAT_HTML,
                'hidden' => 0,
                'timemodified' => time(),
                'importsrc' => $importsrc,
            ];
            if ($record) {
                $chapterdata->id = $record->id;
                $DB->update_record('book_chapters', $chapterdata);
            } else {
                $chapterdata->timecreated = time();
                $DB->insert_record('book_chapters', $chapterdata);
            }
        }

        foreach ($DB->get_records('book_chapters', ['bookid' => $book->id]) as $chapter) {
            if (str_starts_with($chapter->importsrc, 'local_banglapilot:')
                    && !in_array($chapter->importsrc, $expectedimports, true)) {
                $DB->delete_records('book_chapters', ['id' => $chapter->id]);
            }
        }
        $DB->set_field('book', 'revision', $book->revision + 1, ['id' => $book->id]);
    }

    /**
     * Create or refresh a Moodle Quiz, import its GIFT questions and attach them.
     *
     * @param stdClass $course Controlled course.
     * @param array<string, mixed> $manifestmodule Manifest module.
     * @param array<string, mixed> $contentmodule Lesson module.
     */
    private function ensure_quiz(stdClass $course, array $manifestmodule, array $contentmodule): void {
        global $DB;

        $build = $this->build_item($manifestmodule, 'quiz');
        $idnumber = $this->activity_idnumber($manifestmodule, 'quiz');
        $cm = $this->controlled_cm($course->id, $idnumber, 'quiz');
        $name = 'DRAFT — ' . $build['name'] . ': ' . $manifestmodule['title']['en'];
        $intro = $this->draft_notice_html()
            . '<p>' . s($build['purpose']) . '</p>'
            . '<p>Two formative attempts are allowed. Answer choices are shuffled and feedback appears after submission.</p>';

        if (!$cm) {
            $data = $this->base_module_data($course, $manifestmodule['sequence'], 'quiz', $name, $idnumber, $intro);
            foreach ($this->quiz_defaults() as $field => $value) {
                $data->{$field} = $value;
            }
            $created = add_moduleinfo($data, $course);
            $cm = get_coursemodule_from_id('quiz', $created->coursemodule, $course->id, false, MUST_EXIST);
        }

        $this->assert_cm_section($cm, $course, $manifestmodule['sequence']);
        $quiz = $DB->get_record('quiz', ['id' => $cm->instance], '*', MUST_EXIST);
        $DB->update_record('quiz', (object) [
            'id' => $quiz->id,
            'name' => $name,
            'intro' => $intro,
            'introformat' => FORMAT_HTML,
            'attempts' => 2,
            'grademethod' => 1,
            'questionsperpage' => 1,
            'shuffleanswers' => 1,
            'grade' => 3,
            'preferredbehaviour' => 'deferredfeedback',
            'timemodified' => time(),
        ]);
        $this->show_controlled_cm($cm);
        $this->ensure_quiz_questions($course, $cm, $quiz, $contentmodule['questionPrefix']);
    }

    /**
     * Create the private Assignment or moderated Forum for a module.
     *
     * @param stdClass $course Controlled course.
     * @param array<string, mixed> $manifestmodule Manifest module.
     * @param array<string, mixed> $contentmodule Lesson module.
     */
    private function ensure_response_activity(stdClass $course, array $manifestmodule, array $contentmodule): void {
        $mode = $contentmodule['response']['mode'];
        if ($mode === 'assignment') {
            $this->ensure_assignment($course, $manifestmodule, $contentmodule);
            return;
        }
        if ($mode === 'forum') {
            $this->ensure_forum($course, $manifestmodule, $contentmodule);
            return;
        }
        throw new RuntimeException('Unsupported response mode: ' . $mode);
    }

    /**
     * Create or refresh a private Moodle Assignment.
     *
     * @param stdClass $course Controlled course.
     * @param array<string, mixed> $manifestmodule Manifest module.
     * @param array<string, mixed> $contentmodule Lesson module.
     */
    private function ensure_assignment(stdClass $course, array $manifestmodule, array $contentmodule): void {
        global $DB;

        $build = $this->build_item($manifestmodule, 'assignment');
        $idnumber = $this->activity_idnumber($manifestmodule, 'response');
        $cm = $this->controlled_cm($course->id, $idnumber, 'assign');
        $name = 'DRAFT — ' . $build['name'] . ': ' . $manifestmodule['title']['en'];
        $intro = $this->render_response($contentmodule['response']);

        if (!$cm) {
            $data = $this->base_module_data($course, $manifestmodule['sequence'], 'assign', $name, $idnumber, $intro);
            foreach ($this->assignment_defaults() as $field => $value) {
                $data->{$field} = $value;
            }
            $created = add_moduleinfo($data, $course);
            $cm = get_coursemodule_from_id('assign', $created->coursemodule, $course->id, false, MUST_EXIST);
        }

        $this->assert_cm_section($cm, $course, $manifestmodule['sequence']);
        $assignment = $DB->get_record('assign', ['id' => $cm->instance], '*', MUST_EXIST);
        $DB->update_record('assign', (object) [
            'id' => $assignment->id,
            'name' => $name,
            'intro' => $intro,
            'introformat' => FORMAT_HTML,
            'grade' => 6,
            'timemodified' => time(),
        ]);
        $this->show_controlled_cm($cm);
    }

    /**
     * Create or refresh the teacher-moderated Q&A Forum.
     *
     * @param stdClass $course Controlled course.
     * @param array<string, mixed> $manifestmodule Manifest module.
     * @param array<string, mixed> $contentmodule Lesson module.
     */
    private function ensure_forum(stdClass $course, array $manifestmodule, array $contentmodule): void {
        global $DB;

        $build = $this->build_item($manifestmodule, 'forum');
        $idnumber = $this->activity_idnumber($manifestmodule, 'response');
        $cm = $this->controlled_cm($course->id, $idnumber, 'forum');
        $name = 'DRAFT — ' . $build['name'] . ': ' . $manifestmodule['title']['en'];
        $intro = $this->render_response($contentmodule['response']);

        if (!$cm) {
            $data = $this->base_module_data($course, $manifestmodule['sequence'], 'forum', $name, $idnumber, $intro);
            foreach ($this->forum_defaults() as $field => $value) {
                $data->{$field} = $value;
            }
            $created = add_moduleinfo($data, $course);
            $cm = get_coursemodule_from_id('forum', $created->coursemodule, $course->id, false, MUST_EXIST);
        }

        $this->assert_cm_section($cm, $course, $manifestmodule['sequence']);
        $forum = $DB->get_record('forum', ['id' => $cm->instance], '*', MUST_EXIST);
        $DB->update_record('forum', (object) [
            'id' => $forum->id,
            'name' => $name,
            'intro' => $intro,
            'introformat' => FORMAT_HTML,
            'type' => 'qanda',
            'assessed' => 0,
            'grade_forum' => 0,
            'maxattachments' => 0,
            'forcesubscribe' => 0,
            'timemodified' => time(),
        ]);
        $this->show_controlled_cm($cm);
    }

    /**
     * Import one module's questions into its private quiz bank and add slots.
     *
     * @param stdClass $course Controlled course.
     * @param stdClass $cm Quiz course module.
     * @param stdClass $quiz Quiz instance.
     * @param string $prefix Stable question prefix.
     */
    private function ensure_quiz_questions(stdClass $course, stdClass $cm, stdClass $quiz, string $prefix): void {
        global $CFG;

        $context = context_module::instance($cm->id);
        $category = question_get_default_category($context->id, true);
        if (!$category) {
            throw new RuntimeException('Could not create the private quiz question category.');
        }

        $questions = $this->questions_for_prefix($category->id, $prefix);
        $storedhash = get_config('local_banglapilot', 'questionhash');
        if ($questions && $storedhash !== false && !hash_equals((string) $storedhash, $this->questionhash)) {
            throw new RuntimeException(
                'The GIFT source changed after import. Review attempts and migrate questions explicitly; silent replacement is blocked.',
            );
        }

        if (!$questions) {
            require_once($CFG->dirroot . '/question/format.php');
            require_once($CFG->dirroot . '/question/format/gift/format.php');

            $directory = make_temp_directory('local_banglapilot');
            $temporary = tempnam($directory, strtolower($prefix) . '-');
            if ($temporary === false || file_put_contents($temporary, $this->gift_chunk($prefix)) === false) {
                throw new RuntimeException('Could not prepare the temporary GIFT import.');
            }

            try {
                $format = new \qformat_gift();
                $format->setCategory($category);
                $format->setContexts([$context]);
                $format->setCourse($course);
                $format->setFilename($temporary);
                $format->setRealfilename($prefix . '.gift');
                $format->setMatchgrades('error');
                $format->setCatfromfile(false);
                $format->setContextfromfile(false);
                $format->setStoponerror(true);
                $format->set_display_progress(false);
                if (!$format->importpreprocess() || !$format->importprocess() || !$format->importpostprocess()) {
                    throw new RuntimeException('Moodle rejected the ' . $prefix . ' GIFT import.');
                }
            } finally {
                @unlink($temporary);
            }
            $questions = $this->questions_for_prefix($category->id, $prefix);
        }

        $expectednames = [$prefix . '-Q01', $prefix . '-Q02', $prefix . '-Q03'];
        if (array_keys($questions) !== $expectednames) {
            throw new RuntimeException('Question bank drift for ' . $prefix . '.');
        }

        require_once($CFG->dirroot . '/mod/quiz/locallib.php');
        foreach ($questions as $question) {
            quiz_add_quiz_question($question->id, $quiz);
        }
    }

    /**
     * Return the latest named questions in one category.
     *
     * @param int $categoryid Question category ID.
     * @param string $prefix Question-name prefix.
     * @return array<string, stdClass>
     */
    private function questions_for_prefix(int $categoryid, string $prefix): array {
        global $DB;

        $sql = "SELECT q.id, q.name, qv.version
                  FROM {question} q
                  JOIN {question_versions} qv ON qv.questionid = q.id
                  JOIN {question_bank_entries} qbe ON qbe.id = qv.questionbankentryid
                 WHERE qbe.questioncategoryid = :categoryid
                   AND q.name LIKE :nameprefix
              ORDER BY q.name ASC, qv.version DESC";
        $records = $DB->get_records_sql($sql, [
            'categoryid' => $categoryid,
            'nameprefix' => $prefix . '-Q%',
        ]);
        $questions = [];
        foreach ($records as $record) {
            if (!isset($questions[$record->name])) {
                $questions[$record->name] = $record;
            }
        }
        ksort($questions);
        return $questions;
    }

    /**
     * Extract one category from the combined GIFT source.
     *
     * @param string $prefix Stable question prefix.
     * @return string
     */
    private function gift_chunk(string $prefix): string {
        $parts = preg_split('/^\$CATEGORY:/m', $this->gift);
        foreach ($parts as $part) {
            if (!str_contains($part, '::' . $prefix . '-')) {
                continue;
            }
            $firstnewline = strpos($part, "\n");
            $chunk = $firstnewline === false ? '' : substr($part, $firstnewline + 1);
            if (substr_count($chunk, '::' . $prefix . '-') !== 3) {
                break;
            }
            return "// DRAFT QUESTION BANK — NOT APPROVED FOR LEARNER RELEASE.\n\n" . trim($chunk) . "\n";
        }
        throw new RuntimeException('Could not extract the GIFT category for ' . $prefix . '.');
    }

    /**
     * Return common activity data accepted by Moodle's add_moduleinfo API.
     *
     * @param stdClass $course Controlled course.
     * @param int $section Section number.
     * @param string $modulename Core module name.
     * @param string $name Activity name.
     * @param string $idnumber Stable course-module ID number.
     * @param string $intro Activity introduction.
     * @return stdClass
     */
    private function base_module_data(
        stdClass $course,
        int $section,
        string $modulename,
        string $name,
        string $idnumber,
        string $intro,
    ): stdClass {
        global $DB;

        $module = $DB->get_record('modules', ['name' => $modulename], '*', MUST_EXIST);
        return (object) [
            'course' => $course->id,
            'section' => $section,
            'module' => $module->id,
            'modulename' => $modulename,
            'name' => $name,
            'cmidnumber' => $idnumber,
            'intro' => $intro,
            'introformat' => FORMAT_HTML,
            'showdescription' => 0,
            'visible' => 1,
            'visibleoncoursepage' => 1,
            'groupmode' => 0,
            'groupingid' => 0,
            'completion' => COMPLETION_DISABLED,
        ];
    }

    /**
     * Safe default quiz form fields.
     *
     * @return array<string, int|string>
     */
    private function quiz_defaults(): array {
        $defaults = [
            'timeopen' => 0,
            'timeclose' => 0,
            'timelimit' => 0,
            'overduehandling' => 'autosubmit',
            'graceperiod' => 0,
            'preferredbehaviour' => 'deferredfeedback',
            'attempts' => 2,
            'attemptonlast' => 0,
            'grademethod' => 1,
            'decimalpoints' => 0,
            'questiondecimalpoints' => -1,
            'questionsperpage' => 1,
            'shuffleanswers' => 1,
            'grade' => 3,
            'sumgrades' => 0,
            'quizpassword' => '',
            'subnet' => '',
            'browsersecurity' => '',
            'delay1' => 0,
            'delay2' => 0,
            'showuserpicture' => 0,
            'showblocks' => 0,
            'navmethod' => 'free',
        ];

        foreach (['attempt', 'correctness', 'maxmarks', 'marks', 'specificfeedback', 'generalfeedback', 'rightanswer'] as $field) {
            $defaults[$field . 'during'] = $field === 'attempt' ? 1 : 0;
            $defaults[$field . 'immediately'] = 1;
            $defaults[$field . 'open'] = 1;
            $defaults[$field . 'closed'] = 1;
        }
        foreach (['during', 'immediately', 'open', 'closed'] as $time) {
            $defaults['overallfeedback' . $time] = 0;
        }
        return $defaults;
    }

    /**
     * Safe default assignment form fields, including one private online/file submission.
     *
     * @return array<string, int|string>
     */
    private function assignment_defaults(): array {
        return [
            'alwaysshowdescription' => 1,
            'submissiondrafts' => 1,
            'requiresubmissionstatement' => 0,
            'sendnotifications' => 0,
            'sendstudentnotifications' => 1,
            'sendlatenotifications' => 0,
            'duedate' => 0,
            'allowsubmissionsfromdate' => 0,
            'grade' => 6,
            'cutoffdate' => 0,
            'gradingduedate' => 0,
            'teamsubmission' => 0,
            'requireallteammemberssubmit' => 0,
            'teamsubmissiongroupingid' => 0,
            'blindmarking' => 0,
            'attemptreopenmethod' => 'untilpass',
            'maxattempts' => 1,
            'markingworkflow' => 0,
            'markingallocation' => 0,
            'activityformat' => FORMAT_HTML,
            'timelimit' => 0,
            'submissionattachments' => 0,
            'assignsubmission_onlinetext_enabled' => 1,
            'assignsubmission_onlinetext_wordlimit_enabled' => 1,
            'assignsubmission_onlinetext_wordlimit' => 500,
            'assignsubmission_file_enabled' => 1,
            'assignsubmission_file_maxfiles' => 1,
            'assignsubmission_file_maxsizebytes' => 0,
            'assignsubmission_file_filetypes' => '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.m4a,.wav',
            'assignfeedback_comments_enabled' => 1,
            'assignfeedback_comments_commentinline' => 0,
        ];
    }

    /**
     * Safe default forum fields.
     *
     * @return array<string, int|string>
     */
    private function forum_defaults(): array {
        return [
            'type' => 'qanda',
            'duedate' => 0,
            'cutoffdate' => 0,
            'assessed' => 0,
            'scale' => 0,
            'grade_forum' => 0,
            'maxbytes' => 0,
            'maxattachments' => 0,
            'forcesubscribe' => 0,
            'trackingtype' => 1,
            'rsstype' => 0,
            'rssarticles' => 0,
            'warnafter' => 0,
            'blockafter' => 0,
            'blockperiod' => 0,
            'completiondiscussions' => 0,
            'completionreplies' => 0,
            'completionposts' => 0,
            'displaywordcount' => 0,
            'lockdiscussionafter' => 0,
        ];
    }

    /**
     * Find one controlled course module and verify its core type.
     *
     * @param int $courseid Course ID.
     * @param string $idnumber Stable module ID number.
     * @param string $expectedmodule Expected core module name.
     * @return stdClass|null
     */
    private function controlled_cm(int $courseid, string $idnumber, string $expectedmodule): ?stdClass {
        global $DB;

        $sql = "SELECT cm.*, m.name AS modulename
                  FROM {course_modules} cm
                  JOIN {modules} m ON m.id = cm.module
                 WHERE cm.course = :courseid AND cm.idnumber = :idnumber";
        $cm = $DB->get_record_sql($sql, ['courseid' => $courseid, 'idnumber' => $idnumber]);
        if (!$cm) {
            return null;
        }
        if ($cm->modulename !== $expectedmodule) {
            throw new RuntimeException('Controlled activity ' . $idnumber . ' has the wrong Moodle type.');
        }
        return $cm;
    }

    /**
     * Verify an existing module was not manually moved to another section.
     *
     * @param stdClass $cm Course module.
     * @param stdClass $course Controlled course.
     * @param int $sectionnumber Expected section number.
     */
    private function assert_cm_section(stdClass $cm, stdClass $course, int $sectionnumber): void {
        global $DB;

        $sectionid = $DB->get_field(
            'course_sections',
            'id',
            ['course' => $course->id, 'section' => $sectionnumber],
            MUST_EXIST,
        );
        if ((int) $cm->section !== (int) $sectionid) {
            throw new RuntimeException('Controlled activity ' . $cm->idnumber . ' was moved; restore its section before seeding.');
        }
    }

    /**
     * Keep controlled activities visible inside the still-hidden course.
     *
     * @param stdClass $cm Course module.
     */
    private function show_controlled_cm(stdClass $cm): void {
        global $DB;

        $DB->update_record('course_modules', (object) [
            'id' => $cm->id,
            'visible' => 1,
            'visibleold' => 1,
            'visibleoncoursepage' => 1,
        ]);
    }

    /**
     * Return a manifest activity specification by type.
     *
     * @param array<string, mixed> $module Manifest module.
     * @param string $type Manifest activity type.
     * @return array<string, mixed>
     */
    private function build_item(array $module, string $type): array {
        foreach ($module['moodleBuild'] as $item) {
            if ($item['type'] === $type) {
                return $item;
            }
        }
        throw new RuntimeException('Missing ' . $type . ' build item for ' . $module['id'] . '.');
    }

    /**
     * Find content belonging to one manifest module.
     *
     * @param string $moduleid Manifest module ID.
     * @return array<string, mixed>
     */
    private function content_module(string $moduleid): array {
        foreach ($this->content['modules'] as $module) {
            if ($module['id'] === $moduleid) {
                return $module;
            }
        }
        throw new RuntimeException('Missing lesson content for ' . $moduleid . '.');
    }

    /**
     * Build a stable activity ID number.
     *
     * @param array<string, mixed> $module Manifest module.
     * @param string $suffix Activity suffix.
     * @return string
     */
    private function activity_idnumber(array $module, string $suffix): string {
        return self::ACTIVITY_ID_PREFIX . sprintf('p%02d-', $module['sequence']) . $suffix;
    }

    /**
     * Render the draft warning in both supported languages.
     *
     * @return string
     */
    private function draft_notice_html(): string {
        return '<div role="note" class="alert alert-warning">'
            . '<p lang="en"><strong>DRAFT — NOT APPROVED FOR LEARNERS.</strong> '
            . s($this->content['draftNotice']['en']) . '</p>'
            . '<p lang="bn"><strong>খসড়া — শিক্ষার্থীদের জন্য অনুমোদিত নয়।</strong> '
            . s($this->content['draftNotice']['bn']) . '</p>'
            . '</div>';
    }

    /**
     * Render a bilingual Book chapter.
     *
     * @param array<string, mixed> $chapter Chapter data.
     * @return string
     */
    private function render_chapter(array $chapter): string {
        $html = $this->draft_notice_html();
        foreach ($chapter['blocks'] as $block) {
            if ($block['type'] === 'paragraph') {
                $html .= $this->bilingual_paragraph($block['en'], $block['bn']);
            } else if ($block['type'] === 'prompt') {
                $html .= '<section><h3>Try it / চেষ্টা করো</h3>'
                    . $this->bilingual_paragraph($block['en'], $block['bn']) . '</section>';
            } else if ($block['type'] === 'list') {
                $html .= '<ul>';
                foreach ($block['items'] as $item) {
                    $html .= '<li><span lang="en">' . s($item['en']) . '</span><br>'
                        . '<span lang="bn">' . s($item['bn']) . '</span></li>';
                }
                $html .= '</ul>';
            } else if ($block['type'] === 'vocabulary') {
                $html .= '<table class="generaltable"><caption>Key vocabulary / মূল শব্দ</caption>'
                    . '<thead><tr><th scope="col">Word / শব্দ</th><th scope="col">Meaning / অর্থ</th></tr></thead><tbody>';
                foreach ($block['items'] as $item) {
                    $html .= '<tr><th scope="row"><span lang="en">' . s($item['term']['en']) . '</span><br>'
                        . '<span lang="bn">' . s($item['term']['bn']) . '</span></th>'
                        . '<td><span lang="en">' . s($item['meaning']['en']) . '</span><br>'
                        . '<span lang="bn">' . s($item['meaning']['bn']) . '</span></td></tr>';
                }
                $html .= '</tbody></table>';
            } else {
                throw new RuntimeException('Unsupported lesson block type: ' . $block['type']);
            }
        }
        return $html;
    }

    /**
     * Render the private response instructions and draft rubric.
     *
     * @param array<string, mixed> $response Response data.
     * @return string
     */
    private function render_response(array $response): string {
        $html = $this->draft_notice_html()
            . '<h3>Task / কাজ</h3>'
            . $this->bilingual_paragraph($response['instructions']['en'], $response['instructions']['bn'])
            . '<h3>Privacy boundary / গোপনীয়তার সীমা</h3>'
            . $this->bilingual_paragraph($response['privacy']['en'], $response['privacy']['bn'])
            . '<table class="generaltable"><caption>Draft success criteria / খসড়া সফলতার মানদণ্ড</caption>'
            . '<thead><tr><th scope="col">Criterion / মানদণ্ড</th>'
            . '<th scope="col">Developing / উন্নয়নশীল</th><th scope="col">Meeting / অর্জিত</th></tr></thead><tbody>';
        foreach ($response['rubric'] as $row) {
            $html .= '<tr><th scope="row">' . $this->bilingual_inline($row['criterion']) . '</th>'
                . '<td>' . $this->bilingual_inline($row['developing']) . '</td>'
                . '<td>' . $this->bilingual_inline($row['meeting']) . '</td></tr>';
        }
        return $html . '</tbody></table>';
    }

    /**
     * Render two language paragraphs.
     *
     * @param string $english English text.
     * @param string $bangla Bangla text.
     * @return string
     */
    private function bilingual_paragraph(string $english, string $bangla): string {
        return '<p lang="en">' . s($english) . '</p><p lang="bn">' . s($bangla) . '</p>';
    }

    /**
     * Render a compact bilingual value.
     *
     * @param array<string, string> $value Bilingual value.
     * @return string
     */
    private function bilingual_inline(array $value): string {
        return '<span lang="en">' . s($value['en']) . '</span><br><span lang="bn">' . s($value['bn']) . '</span>';
    }

    /**
     * Render the controlled course summary.
     *
     * @return string
     */
    private function course_summary(): string {
        return $this->draft_notice_html()
            . '<p><strong>Audience:</strong> ' . s($this->manifest['audience']) . '</p>'
            . '<p><strong>Level model:</strong> ' . s($this->manifest['levelModel']) . '</p>'
            . '<p><strong>Release blockers:</strong> ' . $this->release_blocker_count()
            . ' human review gates remain without complete evidence.</p>'
            . '<p>No YouTube media, synthetic lesson audio or textbook scan is included in this seed.</p>';
    }

    /**
     * Count incomplete human release gates.
     *
     * @return int
     */
    private function release_blocker_count(): int {
        $count = 0;
        foreach ($this->manifest['modules'] as $module) {
            foreach ($module['gates'] as $gate) {
                $approved = ($gate['status'] ?? null) === 'approved'
                    && !empty($gate['reviewer'])
                    && !empty($gate['reviewedAt'])
                    && !empty($gate['evidence']);
                if (!$approved) {
                    $count++;
                }
            }
        }
        return $count;
    }

    /**
     * Build the machine-readable installed-state report.
     *
     * @return array<string, mixed>
     */
    private function build_report(): array {
        global $DB;

        $category = $DB->get_record('course_categories', ['idnumber' => self::CATEGORY_IDNUMBER]);
        $course = $DB->get_record('course', ['idnumber' => $this->manifest['courseId']]);
        if (!$category || !$course) {
            throw new RuntimeException('The pilot has not been seeded. Run with --apply first.');
        }

        $sql = "SELECT cm.id, cm.instance, cm.idnumber, m.name AS modulename
                  FROM {course_modules} cm
                  JOIN {modules} m ON m.id = cm.module
                 WHERE cm.course = :courseid
                   AND cm.idnumber LIKE :idprefix
              ORDER BY cm.idnumber";
        $activities = $DB->get_records_sql($sql, [
            'courseid' => $course->id,
            'idprefix' => self::ACTIVITY_ID_PREFIX . '%',
        ]);
        $counts = array_count_values(array_map(static fn(stdClass $cm): string => $cm->modulename, $activities));

        $bookids = array_map(
            static fn(stdClass $cm): int => (int) $cm->instance,
            array_filter($activities, static fn(stdClass $cm): bool => $cm->modulename === 'book'),
        );
        $chaptercount = 0;
        foreach ($bookids as $bookid) {
            $chaptercount += $DB->count_records('book_chapters', ['bookid' => $bookid]);
        }

        $quizids = array_map(
            static fn(stdClass $cm): int => (int) $cm->instance,
            array_filter($activities, static fn(stdClass $cm): bool => $cm->modulename === 'quiz'),
        );
        $quizslotcount = 0;
        foreach ($quizids as $quizid) {
            $quizslotcount += $DB->count_records('quiz_slots', ['quizid' => $quizid]);
        }

        $questionnames = [];
        foreach ($activities as $cm) {
            if ($cm->modulename !== 'quiz') {
                continue;
            }
            $context = context_module::instance($cm->id);
            $categoryrecord = question_get_default_category($context->id, false);
            if (!$categoryrecord) {
                continue;
            }
            foreach (['BA-P01', 'BA-P02', 'BA-P03'] as $prefix) {
                foreach ($this->questions_for_prefix($categoryrecord->id, $prefix) as $name => $unused) {
                    $questionnames[$name] = true;
                }
            }
        }

        return [
            'courseId' => (int) $course->id,
            'courseUrl' => (new \moodle_url('/course/view.php', ['id' => $course->id]))->out(false),
            'categoryHidden' => (int) $category->visible === 0,
            'courseHidden' => (int) $course->visible === 0,
            'sectionCount' => $DB->count_records_select('course_sections', 'course = :courseid AND section > 0', [
                'courseid' => $course->id,
            ]),
            'activityCount' => count($activities),
            'bookCount' => $counts['book'] ?? 0,
            'quizCount' => $counts['quiz'] ?? 0,
            'assignmentCount' => $counts['assign'] ?? 0,
            'forumCount' => $counts['forum'] ?? 0,
            'chapterCount' => $chaptercount,
            'questionCount' => count($questionnames),
            'quizSlotCount' => $quizslotcount,
            'releaseReady' => (bool) $this->manifest['releaseReady'],
            'releaseBlockers' => $this->release_blocker_count(),
            'contentHash' => (string) get_config('local_banglapilot', 'seedhash'),
            'expectedContentHash' => $this->contenthash,
        ];
    }
}
