#!/usr/bin/env bash

set -Eeuo pipefail
IFS=$'\n\t'

readonly MOODLE_ROOT="/var/www/moodle"
readonly MOODLE_DATA="/var/lib/moodledata"
readonly REQUIRED_TAG="MOODLE_5022"

hostname=""
failures=0
warnings=0

usage() {
    printf 'Usage: %s --hostname learn.example.org\n' "${0##*/}"
}

pass() {
    printf 'PASS  %s\n' "$*"
}

fail() {
    printf 'FAIL  %s\n' "$*" >&2
    ((failures += 1))
}

warn() {
    printf 'WARN  %s\n' "$*" >&2
    ((warnings += 1))
}

check_command() {
    local description="$1"
    shift
    if "$@" >/dev/null 2>&1; then
        pass "$description"
    else
        fail "$description"
    fi
}

parse_args() {
    if [[ $# -eq 1 && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
        usage
        exit 0
    fi
    [[ $# -eq 2 && "$1" == "--hostname" ]] || {
        usage >&2
        exit 1
    }
    hostname="$2"
    [[ "$hostname" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ && "$hostname" == *.* ]] || {
        printf 'Invalid hostname\n' >&2
        exit 1
    }
}

check_php() {
    local version required_extensions extension
    version="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;' 2>/dev/null || true)"
    [[ "$version" == "8.3" ]] && pass "PHP 8.3" || fail "PHP 8.3 (found ${version:-none})"

    required_extensions=(
        ctype curl dom fileinfo filter gd hash iconv intl json mbstring
        mysqli openssl pcre simplexml sodium spl xml xmlreader zip zlib
    )
    for extension in "${required_extensions[@]}"; do
        if php -r "exit(extension_loaded('${extension}') ? 0 : 1);" 2>/dev/null; then
            pass "PHP extension: $extension"
        else
            fail "PHP extension: $extension"
        fi
    done
}

check_filesystem() {
    local config_mode data_mode current expected

    [[ -f "$MOODLE_ROOT/admin/cli/cfg.php" ]] && pass "Moodle CLI present" || fail "Moodle CLI present"
    [[ -f "$MOODLE_ROOT/config.php" ]] && pass "Moodle config present" || fail "Moodle config present"
    [[ -d "$MOODLE_ROOT/public" ]] && pass "Moodle public web root present" || fail "Moodle public web root present"
    [[ -d "$MOODLE_DATA" && ! -L "$MOODLE_DATA" ]] && pass "Moodle data directory is outside the web root" || \
        fail "Moodle data directory is outside the web root"

    if [[ -f "$MOODLE_ROOT/config.php" ]]; then
        config_mode="$(stat -c '%a' "$MOODLE_ROOT/config.php")"
        [[ "$config_mode" == "640" || "$config_mode" == "400" ]] && \
            pass "config.php permissions ($config_mode)" || fail "config.php permissions ($config_mode)"
    fi
    if [[ -d "$MOODLE_DATA" ]]; then
        data_mode="$(stat -c '%a' "$MOODLE_DATA")"
        (( (8#$data_mode & 7) == 0 )) && pass "moodledata is not accessible to other users" || \
            fail "moodledata is accessible to other users (mode $data_mode)"
    fi

    if [[ -d "$MOODLE_ROOT/.git" ]]; then
        current="$(git -C "$MOODLE_ROOT" rev-parse HEAD 2>/dev/null || true)"
        expected="$(git -C "$MOODLE_ROOT" rev-parse "${REQUIRED_TAG}^{commit}" 2>/dev/null || true)"
        [[ -n "$current" && "$current" == "$expected" ]] && pass "Moodle source pinned to $REQUIRED_TAG" || \
            fail "Moodle source pinned to $REQUIRED_TAG"
    else
        fail "official Moodle Git checkout present"
    fi
}

check_services() {
    check_command "Apache configuration" apache2ctl configtest
    check_command "Apache running" systemctl is-active --quiet apache2
    check_command "MariaDB running" systemctl is-active --quiet mariadb
    check_command "Moodle cron timer enabled" systemctl is-enabled --quiet moodle-cron.timer
    check_command "Moodle cron timer active" systemctl is-active --quiet moodle-cron.timer

    if mariadb --version 2>/dev/null | grep -Eq 'Distrib (10\.(1[1-9]|[2-9][0-9])|1[1-9]\.)'; then
        pass "MariaDB 10.11 or newer"
    else
        fail "MariaDB 10.11 or newer"
    fi
}

check_application() {
    if [[ -f "$MOODLE_ROOT/config.php" ]]; then
        check_command "Moodle configuration is readable by www-data" \
            runuser -u www-data -- /usr/bin/php "$MOODLE_ROOT/admin/cli/cfg.php" --name=release
    fi

    if curl --proto '=https' --tlsv1.2 --connect-timeout 10 --max-time 20 \
        --fail --silent --show-error --head \
        "https://${hostname}/login/index.php" >/dev/null; then
        pass "HTTPS endpoint and trusted certificate"
    else
        fail "HTTPS endpoint and trusted certificate"
    fi

    if curl --connect-timeout 10 --max-time 20 --silent --output /dev/null \
        --write-out '%{redirect_url}' "http://${hostname}/" | \
        grep -q "^https://${hostname}/"; then
        pass "HTTP redirects to HTTPS"
    else
        fail "HTTP redirects to HTTPS"
    fi
}

main() {
    parse_args "$@"
    check_php
    check_filesystem
    check_services
    check_application

    printf '\nHost verification: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
    ((failures == 0))
}

main "$@"
