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

## Reproducible installation

Four executable tools now turn the runbook into a guarded deployment sequence:

| Tool | Purpose | Changes the host? |
| --- | --- | --- |
| `bootstrap-ubuntu.sh` | Installs the supported stack, pinned Moodle source, PHP settings, Apache template and cron units | Only with `--apply` |
| `install-site.sh` | Strictly validates a secrets file, creates the local database, runs Moodle's CLI installer and applies closed pilot defaults | Only with `--install` |
| `enable-tls.sh` | Enables the Moodle virtual host and obtains a Let's Encrypt certificate after DNS resolves | Yes; rolls the site back to disabled if issuance fails |
| `verify-host.sh` | Checks versions, extensions, filesystem permissions, services, cron, HTTPS and redirect behaviour | No |

Start with a non-mutating plan on the Ubuntu 24.04 VM:

```bash
cd /path/to/platform/infra/moodle
./bootstrap-ubuntu.sh --plan --hostname learn.client-domain.example
sudo ./bootstrap-ubuntu.sh --apply --hostname learn.client-domain.example
```

The bootstrap deliberately leaves the Moodle Apache site disabled. Prepare
secrets outside the checkout:

```bash
cp site.env.example /tmp/site.env
# Replace every placeholder locally. Do not commit this file.
sudo install -o root -g root -m 0600 /tmp/site.env /root/bangla-moodle.env
./install-site.sh --check-config /root/bangla-moodle.env
sudo ./install-site.sh --install /root/bangla-moodle.env
```

The configuration parser treats values literally, rejects unknown/duplicate
keys and never prints either password. Database and administrator passwords use
the documented safe character sets because Moodle's official non-interactive
installer receives them as process arguments. Run this step before the Apache
site is enabled, on the dedicated VM, with no untrusted local users.

After the learning hostname resolves to the VM and inbound ports 80/443 are
open:

```bash
sudo ./enable-tls.sh \
  --hostname learn.client-domain.example \
  --email platform-owner@client-domain.example
sudo ./verify-host.sh --hostname learn.client-domain.example
```

`enable-tls.sh` validates that the requested hostname matches both Apache and
Moodle's configured `wwwroot`. If certificate issuance fails, it disables the
Moodle virtual host again. A passing host verification still does not approve
the course for children.

The scripts implement these security boundaries:

- Ubuntu 24.04, Moodle `MOODLE_5022`, PHP 8.3 and Moodle's required extensions
  are checked rather than assumed;
- Moodle source is root-owned and read-only to the web server;
- `/var/lib/moodledata` is outside the web root and inaccessible to other OS
  users;
- the MariaDB account receives privileges only on its dedicated database;
- public self-registration, guest login, object embedding and web services are
  disabled; login, password policy, secure cookies and completion are enabled;
- cron activates only after Moodle installation; and
- HTTPS plus HTTP-to-HTTPS redirection are mandatory host-verification checks.

Backups, outbound mail, monitoring and restore testing remain environment-
specific operations. Configure them before enrolling the pilot cohort. Deploy
the Next.js companion with `PLATFORM_MODE=moodle`, set both Moodle URL variables
to the HTTPS learning hostname and test every retired surface.

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

Repository-side infrastructure validation is safe to run anywhere:

```bash
npm run verify:moodle-infra
```

It checks shell syntax, executable modes, dry-run behaviour, secret redaction,
placeholder rejection, pinned versions, Apache routing and cron definitions. It
does not pretend to replace `verify-host.sh` on the real VM.

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
