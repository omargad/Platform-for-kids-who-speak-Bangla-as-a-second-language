#!/usr/bin/env bash

set -Eeuo pipefail
IFS=$'\n\t'
umask 027

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly MOODLE_TAG="MOODLE_5022"
readonly MOODLE_REPOSITORY="https://github.com/moodle/moodle.git"
readonly MOODLE_ROOT="/var/www/moodle"
readonly MOODLE_DATA="/var/lib/moodledata"
readonly SUPPORTED_OS="ubuntu"
readonly SUPPORTED_VERSION="24.04"

mode="plan"
moodle_hostname=""

usage() {
    cat <<'USAGE'
Prepare an Ubuntu 24.04 host for the pinned Moodle pilot.

Usage:
  sudo ./bootstrap-ubuntu.sh --apply --hostname learn.example.org
  ./bootstrap-ubuntu.sh --plan --hostname learn.example.org

Options:
  --apply              Install packages and configure the host. Requires root.
  --plan               Validate input and print the planned changes (default).
  --hostname HOST      Moodle DNS hostname without a scheme or path.
  -h, --help           Show this help.

This script prepares the host only. It does not create a database, handle
credentials, request a TLS certificate or publish a Moodle course.
USAGE
}

die() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

log() {
    printf '[moodle-bootstrap] %s\n' "$*"
}

validate_hostname() {
    local value="$1"

    [[ ${#value} -le 253 ]] || die "hostname is longer than 253 characters"
    [[ "$value" == *.* ]] || die "hostname must be a fully qualified DNS name"
    [[ "$value" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]] || \
        die "hostname may contain only lowercase letters, digits, dots and hyphens"
    [[ "$value" != *..* ]] || die "hostname contains an empty DNS label"

    local label
    while IFS= read -r label; do
        [[ ${#label} -le 63 ]] || die "hostname contains a label longer than 63 characters"
        [[ "$label" != -* && "$label" != *- ]] || \
            die "hostname labels cannot begin or end with a hyphen"
    done < <(tr '.' '\n' <<<"$value")
}

print_plan() {
    cat <<PLAN
Moodle host preparation plan
  Operating system: Ubuntu ${SUPPORTED_VERSION} LTS
  Hostname:         ${moodle_hostname}
  Moodle source:    ${MOODLE_REPOSITORY} tag ${MOODLE_TAG}
  Moodle code:      ${MOODLE_ROOT} (root-owned, web-server read-only)
  Moodle data:      ${MOODLE_DATA} (www-data-owned, outside web root)
  Web root:         ${MOODLE_ROOT}/public
  Database:         local MariaDB; database/user created in the separate install step
  Scheduled tasks: systemd timer files installed but not enabled before site install
  TLS:              deliberately deferred until DNS and certificate validation

No credentials are accepted or written by this bootstrap.
PLAN
}

parse_args() {
    while (($#)); do
        case "$1" in
            --apply)
                mode="apply"
                shift
                ;;
            --plan)
                mode="plan"
                shift
                ;;
            --hostname)
                (($# >= 2)) || die "--hostname requires a value"
                moodle_hostname="$2"
                shift 2
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                die "unknown option: $1"
                ;;
        esac
    done

    [[ -n "$moodle_hostname" ]] || die "--hostname is required"
    validate_hostname "$moodle_hostname"
}

assert_supported_host() {
    [[ ${EUID} -eq 0 ]] || die "--apply must run as root"
    [[ -r /etc/os-release ]] || die "cannot identify the operating system"

    # shellcheck disable=SC1091
    source /etc/os-release
    [[ "${ID:-}" == "$SUPPORTED_OS" ]] || die "only Ubuntu is supported"
    [[ "${VERSION_ID:-}" == "$SUPPORTED_VERSION" ]] || \
        die "Ubuntu ${SUPPORTED_VERSION} is required; found ${VERSION_ID:-unknown}"
    [[ ! -L "$MOODLE_ROOT" ]] || die "$MOODLE_ROOT must not be a symbolic link"
    [[ ! -L "$MOODLE_DATA" ]] || die "$MOODLE_DATA must not be a symbolic link"
}

install_packages() {
    local packages=(
        apache2
        ca-certificates
        certbot
        git
        libapache2-mod-php
        mariadb-client
        mariadb-server
        php
        php-cli
        php-curl
        php-gd
        php-intl
        php-mbstring
        php-mysql
        php-opcache
        php-soap
        php-xml
        php-zip
        python3-certbot-apache
        unattended-upgrades
        unzip
    )

    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install --yes --no-install-recommends "${packages[@]}"
    systemctl enable --now apache2 mariadb apt-daily.timer apt-daily-upgrade.timer
}

install_moodle_source() {
    if [[ ! -e "$MOODLE_ROOT" ]]; then
        git clone --branch "$MOODLE_TAG" --depth 1 "$MOODLE_REPOSITORY" "$MOODLE_ROOT"
    elif [[ -d "$MOODLE_ROOT/.git" ]]; then
        local origin current expected
        origin="$(git -C "$MOODLE_ROOT" remote get-url origin)"
        [[ "$origin" == "$MOODLE_REPOSITORY" ]] || \
            die "$MOODLE_ROOT has an unexpected Git origin: $origin"
        [[ -z "$(git -C "$MOODLE_ROOT" status --porcelain)" ]] || \
            die "$MOODLE_ROOT contains uncommitted changes"
        git -C "$MOODLE_ROOT" fetch --depth 1 origin "refs/tags/${MOODLE_TAG}:refs/tags/${MOODLE_TAG}"
        current="$(git -C "$MOODLE_ROOT" rev-parse HEAD)"
        expected="$(git -C "$MOODLE_ROOT" rev-parse "${MOODLE_TAG}^{commit}")"
        [[ "$current" == "$expected" ]] || \
            die "$MOODLE_ROOT is not at pinned tag $MOODLE_TAG; refusing to overwrite it"
    else
        die "$MOODLE_ROOT exists but is not an official Moodle Git checkout"
    fi

    chown -R root:root "$MOODLE_ROOT"
    chmod -R u+rwX,go+rX,go-w "$MOODLE_ROOT"
    if [[ -f "$MOODLE_ROOT/config.php" ]]; then
        chown root:www-data "$MOODLE_ROOT/config.php"
        chmod 0640 "$MOODLE_ROOT/config.php"
    fi

    install -d -o www-data -g www-data -m 0770 "$MOODLE_DATA"
}

write_php_settings() {
    local sapi target temporary

    temporary="$(mktemp)"
    cat >"$temporary" <<'PHPINI'
memory_limit = 256M
max_input_vars = 5000
upload_max_filesize = 50M
post_max_size = 52M
opcache.enable = 1
zend.exception_ignore_args = On
session.cookie_httponly = 1
session.cookie_samesite = Lax
PHPINI

    for sapi in apache2 cli; do
        target="/etc/php/8.3/${sapi}/conf.d/99-moodle.ini"
        [[ -d "$(dirname -- "$target")" ]] || die "PHP 8.3 ${sapi} configuration directory is missing"
        install -o root -g root -m 0644 "$temporary" "$target"
    done
    rm -f -- "$temporary"
}

write_service_configuration() {
    local apache_source apache_target temporary

    apache_source="$SCRIPT_DIR/apache-moodle.conf.example"
    apache_target="/etc/apache2/sites-available/moodle.conf"
    [[ -f "$apache_source" ]] || die "missing Apache template: $apache_source"

    temporary="$(mktemp)"
    sed "s/learn\.example\.org/${moodle_hostname}/g" "$apache_source" >"$temporary"
    install -o root -g root -m 0644 "$temporary" "$apache_target"
    install -o root -g root -m 0644 "$SCRIPT_DIR/moodle-cron.service" /etc/systemd/system/moodle-cron.service
    install -o root -g root -m 0644 "$SCRIPT_DIR/moodle-cron.timer" /etc/systemd/system/moodle-cron.timer

    a2enmod headers ssl
    a2dissite moodle.conf >/dev/null 2>&1 || true
    apache2ctl configtest
    systemctl daemon-reload
    systemctl reload apache2
    rm -f -- "$temporary"
}

verify_runtime() {
    local required_extensions=(
        ctype curl dom fileinfo filter gd hash iconv intl json mbstring
        mysqli openssl pcre simplexml sodium spl xml xmlreader zip zlib
    )
    local extension missing=0

    [[ "$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')" == "8.3" ]] || \
        die "PHP 8.3 is required"

    for extension in "${required_extensions[@]}"; do
        if ! php -r "exit(extension_loaded('${extension}') ? 0 : 1);"; then
            printf 'Missing required PHP extension: %s\n' "$extension" >&2
            missing=1
        fi
    done
    ((missing == 0)) || die "one or more Moodle-required PHP extensions are missing"

    mariadb --version
    apache2ctl configtest
}

main() {
    parse_args "$@"
    print_plan

    if [[ "$mode" == "plan" ]]; then
        log "plan complete; no host changes were made"
        return
    fi

    assert_supported_host
    install_packages
    install_moodle_source
    write_php_settings
    write_service_configuration
    verify_runtime

    log "host preparation complete"
    log "next: copy site.env.example to a root-owned mode-0600 file"
    log "then validate and run install-site.sh, followed by enable-tls.sh"
    log "the Moodle Apache site remains disabled; do not enrol children yet"
}

main "$@"
