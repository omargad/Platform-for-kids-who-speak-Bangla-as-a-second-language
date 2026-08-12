# Moodle 5.2 single-VM deployment

This is the lowest-cost production-shaped deployment for the pilot. It uses one
Linux VM, core Moodle and MariaDB. Do not deploy from a GitHub Codespace; a
Codespace is suitable for development, not persistent child data or production
operations.

Authoritative references:

- [Moodle 5.2.2 download and requirements](https://download.moodle.org/releases/latest/)
- [Moodle 5.2 installation](https://docs.moodle.org/502/en/Installing_Moodle)
- [Apache document-root and routing requirements](https://docs.moodle.org/502/en/Apache)
- [Moodle cron](https://docs.moodle.org/502/en/Cron)

## Prerequisites the client must provide

- access to one AWS/Azure/GCP/Oracle account with usable credits;
- a DNS zone and the chosen `learn.<domain>` and `www.<domain>` names;
- named platform owner, support owner and safeguarding/privacy contact; and
- an approved outbound-email method for account messages.

## Pinned pilot baseline

- Moodle tag: `MOODLE_5022` (8 August 2026)
- PHP: 8.3
- MariaDB: 10.11 or newer within Moodle's supported range
- VM starting point: 2 vCPU, 4 GB RAM, 25 GB encrypted persistent disk

Patch within the Moodle 5.2 supported line after testing. Do not silently track
an unpinned development branch in production.

## Installation outline

1. Create an Ubuntu 24.04 LTS VM, restrict SSH to key authentication and enable
   automatic security updates.
2. Install Apache, MariaDB, Git, PHP 8.3 CLI/Apache and the Moodle-required PHP
   modules (`curl`, `gd`, `intl`, `mbstring`, `mysqli`, `soap`, `xml`, `zip`,
   `opcache`, `sodium`).
3. Obtain Moodle only from Moodle's official repository/download service and
   check out `MOODLE_5022` under `/var/www/moodle`.
4. Create a dedicated MariaDB database and least-privilege database user with
   `utf8mb4` collation. Generate the password in the deployment secret store;
   never commit it to this repository.
5. Create `/var/lib/moodledata` outside the web root, owned by the web-service
   user and inaccessible over HTTP.
6. Adapt `apache-moodle.conf.example`: set the real hostname and keep
   `DocumentRoot /var/www/moodle/public` plus `FallbackResource /r.php`.
7. Run Moodle's command-line installer as the web-service user, then make the
   Moodle code read-only to that user. Keep only `moodledata` writable.
8. Enable whole-site HTTPS after DNS resolves; HTTP must redirect to HTTPS.
9. Install and enable `moodle-cron.service` and `moodle-cron.timer`. Confirm a
   successful run in Moodle's system-status report.
10. Disable public self-registration and guest course access. Create named
    adult accounts and import only the approved pilot learner list.
11. Configure nightly database and `moodledata` backups to storage outside the
    VM, then prove a restore to a separate test site.
12. Deploy the Next.js companion with `PLATFORM_MODE=moodle`, set both Moodle
    URL variables to the HTTPS learning hostname and test the retired surfaces.

## Companion application configuration

```dotenv
PLATFORM_MODE=moodle
MOODLE_URL=https://learn.example.org
NEXT_PUBLIC_MOODLE_URL=https://learn.example.org
```

Expected checks after `npm run build && npm start`:

- `/topics`, `/books`, `/library`, `/resources` and `/safety` remain on the
  companion site;
- `/teach`, `/classroom`, `/family`, `/studio`, `/learn`, language tools,
  worksheets and certificates return a temporary redirect to Moodle; and
- retired custom LMS API prefixes return `410` with code
  `CUSTOM_LMS_RETIRED`; `/api/health` and the read-only library response remain.

## Moodle course setup

Follow `moodle/pilot/README.md`. Keep the course hidden until:

```bash
npm run verify:moodle-release
```

passes and the client signs off. Do not install optional plugins during the
first pilot unless a documented requirement cannot be met by Moodle core.

## Production acceptance checks

- Moodle security overview has no unresolved critical findings.
- Cron runs every minute and does not accumulate failures.
- HTTPS and secure cookies are enforced; the certificate renews automatically.
- Database, `moodledata`, Moodle config and companion `.data` backups are
  encrypted, off-VM and restored successfully in a drill.
- Disk, HTTP availability, cron age and backup age are monitored.
- Test users prove student, teacher, reviewer and administrator separation.
- Mail delivery, password recovery and support contact are tested.
- The three-module course passes the manifest release check, accessibility
  validation and consented child-pilot procedure.
