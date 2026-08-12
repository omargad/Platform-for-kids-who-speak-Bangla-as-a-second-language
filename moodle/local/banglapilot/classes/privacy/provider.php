<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

namespace local_banglapilot\privacy;

defined('MOODLE_INTERNAL') || die();

/**
 * Privacy declaration for a seeder which stores no personal data itself.
 *
 * @package    local_banglapilot
 * @copyright  2026 Bangla Adventures project team
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class provider implements \core_privacy\local\metadata\null_provider {
    /**
     * Return the language string which explains that this plugin stores no data.
     *
     * @return string
     */
    public static function get_reason(): string {
        return 'privacy:metadata';
    }
}
