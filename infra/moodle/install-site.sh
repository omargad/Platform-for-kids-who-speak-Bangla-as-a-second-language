#!/usr/bin/env bash

set -Eeuo pipefail
IFS=$'\n\t'
umask 027

readonly MOODLE_ROOT="/var/www/moodle"
readonly MOODLE_DATA="/var/lib/moodledata"
readonly MOODLE_CONFIG="$MOODLE_ROOT/config.php"

mode=""
config_file=""
declare -A config=()

readonly -a REQUIRED_KEYS=(
    MOODLE_WWWROOT
    MOODLE_DB_NAME
    MOODLE_DB_USER
    MOODLE_DB_PASSWORD
    MOODLE_ADMIN_USER
    MOODLE_ADMIN_PASSWORD
    MOODLE_ADMIN_EMAIL
    MOODLE_SUPPORT_EMAIL
    MOODLE_NOREPLY_EMAIL
    MOODLE_SITE_NAME
    MOODLE_SITE_SHORTNAME
)

usage() {
    cat <<'USAGE'
Validate secrets or install the prepared Moodle site.

Usage:
  ./install-site.sh --check-config /path/to/site.env
  sudo ./install-site.sh --install /root/bangla-moodle.env

The install is intentionally one-shot. It refuses to overwrite config.php or
an existing Moodle installation. The secrets file must be root-owned mode 0600
when --install is used.
USAGE
}

die() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

log() {
    printf '[moodle-install] %s\n' "$*"
}

parse_args() {
    if [[ $# -eq 1 && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
        usage
        exit 0
    fi
    (($# == 2)) || {
        usage >&2
        exit 1
    }

    case "$1" in
        --check-config) mode="check" ;;
        --install) mode="install" ;;
        *) die "expected --check-config or --install" ;;
    esac
    config_file="$2"
}

is_allowed_key() {
    local candidate="$1" key
    for key in "${REQUIRED_KEYS[@]}"; do
        [[ "$candidate" == "$key" ]] && return 0
    done
    return 1
}

read_config() {
    [[ -f "$config_file" ]] || die "configuration file not found: $config_file"

    local line key value line_number=0
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_number += 1))
        line="${line%$'\r'}"
        [[ -z "$line" || "$line" == \#* ]] && continue
        [[ "$line" =~ ^([A-Z][A-Z0-9_]*)=(.*)$ ]] || \
            die "invalid configuration syntax on line $line_number"
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        is_allowed_key "$key" || die "unknown configuration key on line $line_number: $key"
        [[ -z "${config[$key]+present}" ]] || die "duplicate configuration key: $key"
        [[ -n "$value" ]] || die "$key cannot be empty"
        [[ "$value" != *$'\n'* && "$value" != *$'\r'* ]] || die "$key contains a newline"
        config[$key]="$value"
    done <"$config_file"

    for key in "${REQUIRED_KEYS[@]}"; do
        [[ -n "${config[$key]:-}" ]] || die "missing required configuration key: $key"
    done
}

validate_email() {
    local key="$1" value="${config[$1]}"
    [[ "$value" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$ ]] || \
        die "$key is not a valid email address"
}

validate_config() {
    local host="${config[MOODLE_WWWROOT]#https://}"

    [[ "${config[MOODLE_WWWROOT]}" =~ ^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]] || \
        die "MOODLE_WWWROOT must be an HTTPS origin without a path, query or fragment"
    [[ "$host" == *.* && "$host" != *..* ]] || die "MOODLE_WWWROOT must contain a valid DNS hostname"
    [[ ! "$host" =~ (^|\.)example\.(org|com|net)$ ]] || die "replace the example Moodle hostname"

    [[ "${config[MOODLE_DB_NAME]}" =~ ^[A-Za-z][A-Za-z0-9_]{0,63}$ ]] || \
        die "MOODLE_DB_NAME must be a safe MariaDB identifier"
    [[ "${config[MOODLE_DB_USER]}" =~ ^[A-Za-z][A-Za-z0-9_]{0,31}$ ]] || \
        die "MOODLE_DB_USER must be a safe MariaDB account name"
    [[ "${config[MOODLE_DB_PASSWORD]}" =~ ^[A-Za-z0-9._~!@%+=:-]{24,128}$ ]] || \
        die "MOODLE_DB_PASSWORD must be 24-128 characters from the documented safe set"
    [[ "${config[MOODLE_ADMIN_USER]}" =~ ^[a-z][a-z0-9._-]{2,99}$ ]] || \
        die "MOODLE_ADMIN_USER must be a lowercase Moodle username"
    [[ "${config[MOODLE_ADMIN_PASSWORD]}" =~ ^[A-Za-z0-9._~!@%+=:,?-]{16,128}$ ]] || \
        die "MOODLE_ADMIN_PASSWORD must be 16-128 characters from the documented safe set"
    [[ "${config[MOODLE_DB_PASSWORD]}" != *REPLACE* ]] || die "replace the database password placeholder"
    [[ "${config[MOODLE_ADMIN_PASSWORD]}" != *REPLACE* ]] || die "replace the administrator password placeholder"

    validate_email MOODLE_ADMIN_EMAIL
    validate_email MOODLE_SUPPORT_EMAIL
    validate_email MOODLE_NOREPLY_EMAIL

    [[ ${#config[MOODLE_SITE_NAME]} -le 254 ]] || die "MOODLE_SITE_NAME is too long"
    [[ ${#config[MOODLE_SITE_SHORTNAME]} -le 100 ]] || die "MOODLE_SITE_SHORTNAME is too long"
    [[ "${config[MOODLE_SITE_NAME]}" =~ ^[[:print:]]+$ ]] || die "MOODLE_SITE_NAME contains control characters"
    [[ "${config[MOODLE_SITE_SHORTNAME]}" =~ ^[[:print:]]+$ ]] || die "MOODLE_SITE_SHORTNAME contains control characters"
}

check_secret_file_permissions() {
    local owner mode_value
    owner="$(stat -c '%u' "$config_file")"
    mode_value="$(stat -c '%a' "$config_file")"
    [[ "$owner" == "0" ]] || die "the install configuration must be owned by root"
    [[ "$mode_value" == "600" || "$mode_value" == "400" ]] || \
        die "the install configuration must have mode 0600 or 0400"
}

create_database() {
    local db_name="${config[MOODLE_DB_NAME]}"
    local db_user="${config[MOODLE_DB_USER]}"
    local db_password="${config[MOODLE_DB_PASSWORD]}"

    mariadb --protocol=socket --batch <<SQL
CREATE DATABASE IF NOT EXISTS \`${db_name}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${db_user}'@'localhost' IDENTIFIED BY '${db_password}';
ALTER USER '${db_user}'@'localhost' IDENTIFIED BY '${db_password}';
GRANT ALL PRIVILEGES ON \`${db_name}\`.* TO '${db_user}'@'localhost';
FLUSH PRIVILEGES;
SQL
}

restore_code_permissions() {
    if [[ -d "$MOODLE_ROOT" ]]; then
        chown root:root "$MOODLE_ROOT"
        chmod 0755 "$MOODLE_ROOT"
    fi
    if [[ -f "$MOODLE_CONFIG" ]]; then
        chown root:www-data "$MOODLE_CONFIG"
        chmod 0640 "$MOODLE_CONFIG"
    fi
}

configure_site_defaults() {
    local cli="$MOODLE_ROOT/admin/cli/cfg.php"
    local settings=(
        "registerauth="
        "guestloginbutton=0"
        "forcelogin=1"
        "allowobjectembed=0"
        "enablewebservices=0"
        "enablecompletion=1"
        "passwordpolicy=1"
        "cookiesecure=1"
        "cookiehttponly=1"
    )
    local setting

    for setting in "${settings[@]}"; do
        runuser -u www-data -- /usr/bin/php "$cli" \
            "--name=${setting%%=*}" "--set=${setting#*=}"
    done
}

install_site() {
    [[ ${EUID} -eq 0 ]] || die "--install must run as root"
    check_secret_file_permissions
    [[ -f "$MOODLE_ROOT/admin/cli/install.php" ]] || \
        die "Moodle is not prepared at $MOODLE_ROOT; run bootstrap-ubuntu.sh first"
    [[ ! -e "$MOODLE_CONFIG" ]] || die "$MOODLE_CONFIG already exists; refusing a destructive reinstall"
    [[ -d "$MOODLE_DATA" && ! -L "$MOODLE_DATA" ]] || die "Moodle data directory is missing or unsafe"

    create_database

    chown root:www-data "$MOODLE_ROOT"
    chmod 0775 "$MOODLE_ROOT"
    trap restore_code_permissions EXIT

    runuser -u www-data -- /usr/bin/php "$MOODLE_ROOT/admin/cli/install.php" \
        --non-interactive \
        --agree-license \
        --lang=en \
        "--wwwroot=${config[MOODLE_WWWROOT]}" \
        "--dataroot=$MOODLE_DATA" \
        --dbtype=mariadb \
        --dbhost=localhost \
        "--dbname=${config[MOODLE_DB_NAME]}" \
        "--dbuser=${config[MOODLE_DB_USER]}" \
        "--dbpass=${config[MOODLE_DB_PASSWORD]}" \
        --prefix=mdl_ \
        "--fullname=${config[MOODLE_SITE_NAME]}" \
        "--shortname=${config[MOODLE_SITE_SHORTNAME]}" \
        "--adminuser=${config[MOODLE_ADMIN_USER]}" \
        "--adminpass=${config[MOODLE_ADMIN_PASSWORD]}" \
        "--adminemail=${config[MOODLE_ADMIN_EMAIL]}" \
        "--supportemail=${config[MOODLE_SUPPORT_EMAIL]}" \
        "--noreplyemail=${config[MOODLE_NOREPLY_EMAIL]}" \
        --chmod=0770

    restore_code_permissions
    chown -R www-data:www-data "$MOODLE_DATA"
    find "$MOODLE_DATA" -type d -exec chmod 0770 {} +
    find "$MOODLE_DATA" -type f -exec chmod 0660 {} +

    configure_site_defaults
    systemctl enable --now moodle-cron.timer
    systemctl start moodle-cron.service
    apache2ctl configtest

    log "Moodle installation complete; the Apache Moodle site remains disabled"
    log "next: run enable-tls.sh for ${config[MOODLE_WWWROOT]} after DNS resolves"
    log "keep the course hidden and do not enrol children before verify:moodle-release passes"
}

main() {
    parse_args "$@"
    read_config
    validate_config

    log "configuration is valid"
    log "site origin: ${config[MOODLE_WWWROOT]}"
    log "database: ${config[MOODLE_DB_NAME]} (local account ${config[MOODLE_DB_USER]})"
    log "secrets: set and redacted"

    [[ "$mode" == "check" ]] || install_site
}

main "$@"
