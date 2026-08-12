#!/usr/bin/env bash

set -Eeuo pipefail
IFS=$'\n\t'

readonly MOODLE_ROOT="/var/www/moodle"

hostname=""
email=""
site_enabled=0
certificate_ready=0

usage() {
    cat <<'USAGE'
Enable the prepared Moodle Apache site and obtain a Let's Encrypt certificate.

Usage:
  sudo ./enable-tls.sh --hostname learn.example.org --email platform-owner@example.org

DNS must already resolve to this VM, and inbound TCP ports 80 and 443 must be
open. If certificate issuance fails, this script disables the Moodle site again.
USAGE
}

die() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

rollback() {
    if ((site_enabled == 1 && certificate_ready == 0)); then
        printf 'Certificate setup failed; disabling the Moodle virtual host.\n' >&2
        a2dissite moodle.conf >/dev/null 2>&1 || true
        a2ensite 000-default.conf >/dev/null 2>&1 || true
        apache2ctl configtest >/dev/null 2>&1 && systemctl reload apache2 || true
    fi
}

trap rollback EXIT

parse_args() {
    while (($#)); do
        case "$1" in
            --hostname)
                (($# >= 2)) || die "--hostname requires a value"
                hostname="$2"
                shift 2
                ;;
            --email)
                (($# >= 2)) || die "--email requires a value"
                email="$2"
                shift 2
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *) die "unknown option: $1" ;;
        esac
    done

    [[ "$hostname" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ && "$hostname" == *.* ]] || \
        die "provide a lowercase fully qualified DNS hostname"
    [[ "$email" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$ ]] || \
        die "provide a valid certificate contact email"
}

main() {
    local configured_origin configured_server_name

    parse_args "$@"
    [[ ${EUID} -eq 0 ]] || die "this script must run as root"
    [[ -f "$MOODLE_ROOT/config.php" ]] || die "Moodle is not installed"
    [[ -f /etc/apache2/sites-available/moodle.conf ]] || die "the Moodle Apache configuration is missing"
    command -v certbot >/dev/null || die "certbot is not installed"
    getent ahosts "$hostname" >/dev/null || die "DNS does not resolve for $hostname"
    configured_server_name="$(awk '$1 == "ServerName" {print $2; exit}' /etc/apache2/sites-available/moodle.conf)"
    [[ "$configured_server_name" == "$hostname" ]] || \
        die "Apache is configured for ${configured_server_name:-no hostname}, not $hostname"
    configured_origin="$(runuser -u www-data -- /usr/bin/php "$MOODLE_ROOT/admin/cli/cfg.php" \
        --name=wwwroot --no-eol)"
    [[ "$configured_origin" == "https://${hostname}" ]] || \
        die "Moodle wwwroot is $configured_origin, not https://${hostname}"

    a2dissite 000-default.conf >/dev/null 2>&1 || true
    a2ensite moodle.conf
    site_enabled=1
    apache2ctl configtest
    systemctl reload apache2

    certbot --apache \
        --non-interactive \
        --agree-tos \
        --redirect \
        --hsts \
        --domain "$hostname" \
        --email "$email"

    certificate_ready=1
    apache2ctl configtest
    systemctl reload apache2
    curl --proto '=https' --tlsv1.2 --connect-timeout 10 --max-time 20 \
        --fail --silent --show-error --head \
        "https://${hostname}/login/index.php" >/dev/null

    printf 'Moodle HTTPS is active at https://%s\n' "$hostname"
    printf 'Run verify-host.sh before creating users or importing the pilot.\n'
}

main "$@"
