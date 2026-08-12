#!/usr/bin/env bash

set -Eeuo pipefail
IFS=$'\n\t'
umask 027

readonly MOODLE_ROOT="/var/www/moodle"
readonly MOODLE_DATA="/var/lib/moodledata"
readonly PLUGIN_TARGET="$MOODLE_ROOT/public/local/banglapilot"
readonly BACKUP_ROOT="/var/backups/banglapilot-plugin"
readonly REQUIRED_TAG="v5.2.2"

mode=""
archive=""
checksum_file=""
temporary=""

usage() {
    cat <<'USAGE'
Validate or install the source-controlled hidden-course plugin.

Usage:
  ./install-pilot-plugin.sh --check-package /path/to/local_banglapilot.zip [--sha256-file FILE]
  sudo ./install-pilot-plugin.sh --install /path/to/local_banglapilot.zip [--sha256-file FILE]

The package must contain one top-level banglapilot directory. Installation
runs Moodle's upgrade, applies the seed twice to prove repeatability, and then
performs a read-only check. It cannot publish the course.
USAGE
}

die() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

log() {
    printf '[banglapilot-plugin] %s\n' "$*"
}

cleanup() {
    [[ -z "$temporary" || ! -d "$temporary" ]] || rm -rf -- "$temporary"
}

trap cleanup EXIT

parse_args() {
    if [[ $# -eq 1 && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
        usage
        exit 0
    fi
    (($# == 2 || $# == 4)) || {
        usage >&2
        exit 1
    }

    case "$1" in
        --check-package) mode="check" ;;
        --install) mode="install" ;;
        *) die "expected --check-package or --install" ;;
    esac
    archive="$2"
    if (($# == 4)); then
        [[ "$3" == "--sha256-file" ]] || die "expected --sha256-file as the third argument"
        checksum_file="$4"
    fi

    [[ -f "$archive" && ! -L "$archive" ]] || die "plugin archive is missing or is a symbolic link: $archive"
    archive="$(realpath -- "$archive")"
    if [[ -n "$checksum_file" ]]; then
        [[ -f "$checksum_file" && ! -L "$checksum_file" ]] || die "checksum file is missing or is a symbolic link"
        checksum_file="$(realpath -- "$checksum_file")"
    fi
}

verify_checksum() {
    [[ -n "$checksum_file" ]] || return 0

    local line expected filename actual
    IFS= read -r line <"$checksum_file" || die "could not read checksum file"
    [[ "$line" =~ ^([0-9a-fA-F]{64})[[:space:]][[:space:]]?\*?([^/[:space:]]+)$ ]] || \
        die "checksum file must contain one SHA-256 digest and archive filename"
    expected="${BASH_REMATCH[1],,}"
    filename="${BASH_REMATCH[2]}"
    [[ "$filename" == "$(basename -- "$archive")" ]] || die "checksum filename does not match the archive"
    actual="$(sha256sum -- "$archive" | cut -d' ' -f1)"
    [[ "$actual" == "$expected" ]] || die "plugin archive checksum does not match"
}

validate_archive() {
    local compressed_size entry_count duplicate_count extracted_size
    local -a entries=()

    compressed_size="$(stat -c '%s' "$archive")"
    ((compressed_size > 0 && compressed_size <= 5242880)) || die "plugin archive must be between 1 byte and 5 MiB"
    mapfile -t entries < <(unzip -Z1 "$archive")
    entry_count="${#entries[@]}"
    ((entry_count > 0 && entry_count <= 100)) || die "plugin archive must contain between 1 and 100 entries"
    duplicate_count="$(printf '%s\n' "${entries[@]}" | sort | uniq -d | wc -l)"
    ((duplicate_count == 0)) || die "plugin archive contains duplicate paths"

    local entry
    for entry in "${entries[@]}"; do
        [[ "$entry" == banglapilot || "$entry" == banglapilot/* ]] || die "archive entry is outside banglapilot/: $entry"
        [[ "$entry" != /* && "$entry" != *\\* ]] || die "archive entry has an unsafe path: $entry"
        [[ ! "$entry" =~ (^|/)\.\.(/|$) ]] || die "archive entry contains path traversal: $entry"
        [[ "$entry" != *$'\r'* && "$entry" != *$'\t'* ]] || die "archive entry contains control characters"
        [[ "$entry" != */.git/* && "$entry" != */.env* && "$entry" != */__MACOSX/* ]] || \
            die "archive contains repository metadata or a secret-like file: $entry"
    done

    temporary="$(mktemp -d)"
    unzip -q "$archive" -d "$temporary"
    [[ -d "$temporary/banglapilot" && ! -L "$temporary/banglapilot" ]] || die "archive root is invalid"
    [[ -z "$(find "$temporary" -type l -print -quit)" ]] || die "plugin archive cannot contain symbolic links"
    [[ -z "$(find "$temporary" ! -type d ! -type f -print -quit)" ]] || die "plugin archive contains a special file"
    extracted_size="$(du -sb "$temporary/banglapilot" | cut -f1)"
    ((extracted_size <= 20971520)) || die "extracted plugin is larger than 20 MiB"

    local required
    for required in \
        version.php \
        classes/local/seeder.php \
        classes/privacy/provider.php \
        cli/seed.php \
        data/content-manifest.json \
        data/lesson-content.json \
        data/questions.gift; do
        [[ -f "$temporary/banglapilot/$required" ]] || die "plugin package is missing $required"
    done

    grep -Eq "\\\$plugin->component[[:space:]]*=[[:space:]]*'local_banglapilot'" \
        "$temporary/banglapilot/version.php" || die "package has the wrong Moodle component"
    while IFS= read -r -d '' entry; do
        php -l "$entry" >/dev/null || die "PHP syntax validation failed: ${entry#"$temporary/"}"
    done < <(find "$temporary/banglapilot" -type f -name '*.php' -print0)
    php -r 'foreach (array_slice($argv, 1) as $file) { json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR); }' \
        "$temporary/banglapilot/data/content-manifest.json" \
        "$temporary/banglapilot/data/lesson-content.json" || die "plugin JSON validation failed"

    log "package valid: ${entry_count} archive entries, ${compressed_size} compressed bytes"
    log "archive SHA-256: $(sha256sum -- "$archive" | cut -d' ' -f1)"
}

assert_moodle_host() {
    [[ ${EUID} -eq 0 ]] || die "--install must run as root"
    [[ -d "$MOODLE_ROOT/.git" && -f "$MOODLE_ROOT/config.php" ]] || \
        die "an installed official Moodle checkout is required at $MOODLE_ROOT"
    [[ -f "$MOODLE_ROOT/admin/cli/upgrade.php" && -d "$MOODLE_ROOT/public/local" ]] || \
        die "the Moodle 5.2 application layout is incomplete"
    local current expected
    current="$(git -C "$MOODLE_ROOT" rev-parse HEAD)"
    expected="$(git -C "$MOODLE_ROOT" rev-parse "${REQUIRED_TAG}^{commit}")"
    [[ "$current" == "$expected" ]] || die "Moodle is not pinned to $REQUIRED_TAG"
    [[ ! -L "$PLUGIN_TARGET" ]] || die "$PLUGIN_TARGET must not be a symbolic link"
}

install_plugin() {
    assert_moodle_host

    local timestamp backup_directory staged report
    timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
    backup_directory="$BACKUP_ROOT/$timestamp"
    staged="$(mktemp -d "$MOODLE_ROOT/public/local/.banglapilot-stage.XXXXXX")"
    cp -a "$temporary/banglapilot/." "$staged/"
    chown -R root:root "$staged"
    find "$staged" -type d -exec chmod 0755 {} +
    find "$staged" -type f -exec chmod 0644 {} +

    if [[ -d "$PLUGIN_TARGET" ]]; then
        install -d -o root -g root -m 0700 "$backup_directory"
        mv -- "$PLUGIN_TARGET" "$backup_directory/banglapilot"
        log "previous plugin backed up to $backup_directory/banglapilot"
    fi
    mv -- "$staged" "$PLUGIN_TARGET"

    runuser -u www-data -- /usr/bin/php "$MOODLE_ROOT/admin/cli/upgrade.php" --non-interactive
    runuser -u www-data -- /usr/bin/php "$PLUGIN_TARGET/cli/seed.php" --apply
    runuser -u www-data -- /usr/bin/php "$PLUGIN_TARGET/cli/seed.php" --apply
    report="$(runuser -u www-data -- /usr/bin/php "$PLUGIN_TARGET/cli/seed.php" --check --json)"
    php -r '$report = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR); exit(($report["courseHidden"] ?? false) && ($report["releaseReady"] ?? true) === false ? 0 : 1);' \
        <<<"$report" || die "the installed seed report did not preserve the hidden draft boundary"

    local report_file
    report_file="$(mktemp)"
    printf '%s\n' "$report" >"$report_file"
    install -o root -g www-data -m 0640 "$report_file" \
        "$MOODLE_DATA/local_banglapilot-seed-report.json"
    rm -f -- "$report_file"
    log "hidden pilot installed and repeatability check passed"
    log "report: $MOODLE_DATA/local_banglapilot-seed-report.json"
    log "no learners were enrolled and no course was published"
}

main() {
    parse_args "$@"
    verify_checksum
    validate_archive
    [[ "$mode" == "check" ]] || install_plugin
}

main "$@"
