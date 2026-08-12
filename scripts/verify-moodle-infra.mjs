import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const infraRoot = path.join(repoRoot, "infra", "moodle");
const scripts = [
  "bootstrap-ubuntu.sh",
  "install-site.sh",
  "enable-tls.sh",
  "verify-host.sh",
];

function file(name) {
  return path.join(infraRoot, name);
}

function read(name) {
  return readFileSync(file(name), "utf8");
}

function run(script, args, options = {}) {
  return spawnSync(file(script), args, {
    cwd: repoRoot,
    encoding: "utf8",
    ...options,
  });
}

for (const script of scripts) {
  assert.ok(statSync(file(script)).mode & 0o111, `${script} must be executable`);
  execFileSync("bash", ["-n", file(script)], { cwd: repoRoot });
}

const bootstrap = read("bootstrap-ubuntu.sh");
assert.match(bootstrap, /MOODLE_TAG="MOODLE_5022"/);
assert.match(bootstrap, /https:\/\/github\.com\/moodle\/moodle\.git/);
assert.match(bootstrap, /SUPPORTED_VERSION="24\.04"/);
assert.match(bootstrap, /MOODLE_ROOT="\/var\/www\/moodle"/);
assert.match(bootstrap, /MOODLE_DATA="\/var\/lib\/moodledata"/);
assert.match(bootstrap, /a2dissite moodle\.conf/);
assert.doesNotMatch(bootstrap, /chmod\s+-R\s+0?777/);
assert.doesNotMatch(bootstrap, /(curl|wget)[^\n|]*\|\s*(ba)?sh/);

const plan = run("bootstrap-ubuntu.sh", ["--plan", "--hostname", "learn.bangla.test"]);
assert.equal(plan.status, 0, plan.stderr);
assert.match(plan.stdout, /MOODLE_5022/);
assert.match(plan.stdout, /no host changes were made/i);

const unsafeHost = run("bootstrap-ubuntu.sh", ["--plan", "--hostname", "HTTPS://Bad Host"]);
assert.notEqual(unsafeHost.status, 0);

const installer = read("install-site.sh");
for (const setting of [
  "registerauth=",
  "guestloginbutton=0",
  "forcelogin=1",
  "enablewebservices=0",
  "cookiesecure=1",
  "cookiehttponly=1",
]) {
  assert.ok(installer.includes(setting), `missing secure Moodle default: ${setting}`);
}
assert.match(installer, /refusing a destructive reinstall/);
assert.doesNotMatch(installer, /source\s+["']?\$?config_file/);

const temporary = mkdtempSync(path.join(tmpdir(), "bangla-moodle-infra-"));
try {
  const configPath = path.join(temporary, "site.env");
  const dbPassword = "DbPilot_2026_Safe_Value_123456";
  const adminPassword = "AdminPilot_2026_Safe";
  writeFileSync(
    configPath,
    [
      "MOODLE_WWWROOT=https://learn.bangla.au",
      "MOODLE_DB_NAME=bangla_moodle",
      "MOODLE_DB_USER=bangla_moodle",
      `MOODLE_DB_PASSWORD=${dbPassword}`,
      "MOODLE_ADMIN_USER=platformadmin",
      `MOODLE_ADMIN_PASSWORD=${adminPassword}`,
      "MOODLE_ADMIN_EMAIL=owner@bangla.au",
      "MOODLE_SUPPORT_EMAIL=support@bangla.au",
      "MOODLE_NOREPLY_EMAIL=noreply@bangla.au",
      "MOODLE_SITE_NAME=Bangladesh Culture History and Literature Pilot",
      "MOODLE_SITE_SHORTNAME=Bangla Pilot",
      "",
    ].join("\n"),
    { mode: 0o600 },
  );

  const valid = run("install-site.sh", ["--check-config", configPath]);
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /secrets: set and redacted/);
  assert.ok(!valid.stdout.includes(dbPassword), "database password leaked to output");
  assert.ok(!valid.stdout.includes(adminPassword), "administrator password leaked to output");

  writeFileSync(configPath, `${readFileSync(configPath, "utf8")}UNEXPECTED_KEY=value\n`);
  const unknownKey = run("install-site.sh", ["--check-config", configPath]);
  assert.notEqual(unknownKey.status, 0);
  assert.match(unknownKey.stderr, /unknown configuration key/);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

const example = run("install-site.sh", ["--check-config", file("site.env.example")]);
assert.notEqual(example.status, 0, "placeholder secrets must never pass validation");

const apache = read("apache-moodle.conf.example");
assert.match(apache, /DocumentRoot \/var\/www\/moodle\/public/);
assert.match(apache, /FallbackResource \/r\.php/);
assert.match(apache, /Options -Indexes/);

const cronService = read("moodle-cron.service");
const cronTimer = read("moodle-cron.timer");
assert.match(cronService, /User=www-data/);
assert.match(cronService, /admin\/cli\/cron\.php/);
assert.match(cronTimer, /OnCalendar=\*-\*-\* \*:\*:00/);

const tls = read("enable-tls.sh");
assert.match(tls, /certbot --apache/);
assert.match(tls, /--redirect/);
assert.match(tls, /certificate_ready == 0/);
assert.match(tls, /Moodle wwwroot/);

const verifier = read("verify-host.sh");
for (const check of ["PHP 8.3", "MariaDB 10.11", "moodle-cron.timer", "HTTP redirects to HTTPS"]) {
  assert.ok(verifier.includes(check), `host verifier is missing: ${check}`);
}

console.log("Moodle infrastructure validation passed: 4 shell tools, secret-safe config, pinned host plan and release prerequisites.");
