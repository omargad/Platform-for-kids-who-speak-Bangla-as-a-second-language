# Deployment runbook

The platform is a standard Next.js server with a SQLite database and a media
directory, so it runs on any VM or container service. The client has offered
cloud credits (AWS / Azure / Google Cloud / Oracle) and a domain — the smallest
credible production setup is a single small VM (2 vCPU / 2 GB RAM) with a
persistent disk.

## What the app needs

1. Node.js 22 (or Docker).
2. A persistent directory for `.data/` — it holds the SQLite database and
   grown-up-uploaded pronunciation audio. Everything else is stateless.
3. A reverse proxy terminating HTTPS on the client's domain.

## Option A — single VM (recommended first deployment)

Works identically on AWS EC2/Lightsail, Azure VM, GCP Compute Engine or OCI.

```bash
# on Ubuntu 24.04
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs caddy

git clone <repo-url> bangla-adventures && cd bangla-adventures
npm ci
npm run build

# run as a service
sudo tee /etc/systemd/system/bangla.service <<'EOF'
[Unit]
Description=Bangla Adventures
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/bangla-adventures
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl enable --now bangla
```

Caddy reverse proxy (automatic HTTPS once DNS points at the VM):

```
# /etc/caddy/Caddyfile
banglaadventures.example.com {
    reverse_proxy localhost:3000
}
```

Back up `/home/ubuntu/bangla-adventures/.data` on a schedule (it is the entire
application state).

## Option B — Docker on any container service

```bash
docker build -t bangla-adventures .
docker run -d -p 3000:3000 -v bangla_data:/app/.data --restart unless-stopped bangla-adventures
```

On Azure App Service / Google Cloud Run / AWS ECS, attach a persistent volume
(Azure Files, Cloud Run volume mount, EFS) at `/app/.data`. Do not scale beyond
one instance while on SQLite — see "Scaling" below.

The image declares a container `HEALTHCHECK` against `/api/health`; orchestrators
that read it (ECS, Docker Swarm, Compose) get liveness for free.

## Per-cloud quick starts

The client offered AWS, Azure, Google Cloud or Oracle credits. Any of these
works; pick the one whose credits are largest. All need one small always-on
instance and one persistent disk for `/app/.data`.

**AWS — Lightsail container or Lightsail VM.** Simplest is a Lightsail VM
(Option A) with an attached block-storage disk mounted where `.data` lives.
For containers, push the image to a registry and run it on Lightsail Containers
or ECS Fargate with an EFS volume at `/app/.data` (Fargate is single-writer safe
here because we run one task).

**Azure — App Service for Containers** (Linux). Deploy the image, set
`WEBSITES_PORT=3000`, and mount an Azure Files share at `/app/.data`. Or use a
B1s VM per Option A.

**Google Cloud — Compute Engine VM** (Option A) is the direct fit because Cloud
Run's filesystem is ephemeral. If using Cloud Run, mount a Cloud Storage volume
or a Filestore share at `/app/.data`, set min instances to 1 and max to 1 while
on SQLite.

**Oracle Cloud — Always Free Ampere VM** (Option A) is generous and costs
nothing; attach a block volume for `.data`.

## Health check

`GET /api/health` returns `200 {"status":"ok"}` when the database is reachable
and `503` otherwise. Point the load balancer / uptime monitor at it. It is
uncacheable and does no auth, so it is safe to poll.

## DNS

Point an `A` record for the client's domain at the VM/load-balancer IP. The
reverse proxy (Caddy above, or nginx + certbot) obtains TLS certificates
automatically.

## Scaling path

SQLite + a filesystem media directory intentionally keep first deployment
simple and cheap. When the platform needs more than one server instance:

1. Swap `db/index.ts` to a hosted database — the schema is plain Drizzle
   SQLite, so Turso/libSQL is a drop-in; Postgres requires regenerating the
   schema with `drizzle-kit`.
2. Swap `lib/storage.ts` for S3/GCS/R2 — it is a two-function module
   (`putMediaObject` / `getMediaObject`) and the database only stores object
   keys.
3. Move session storage with the database (it already lives there).

## Security checklist before go-live

- [ ] HTTPS enforced end to end (proxy redirects HTTP → HTTPS)
- [ ] `.data/` on encrypted disk, scheduled backups tested — use
      `scripts/backup.sh` (checkpoints the SQLite WAL, tars `.data`, prunes old
      archives). Daily cron example:
      `0 3 * * * cd /path/to/app && bash scripts/backup.sh /var/backups/bangla 14`
- [ ] OS auto-updates on; SSH by key only
- [ ] Rate limiting: the app enforces per-IP limits on `/api/auth/*` and account
      endpoints in-process (fine for one instance). Add proxy-level limits
      (Caddy `rate_limit` / nginx `limit_req`) as defence in depth, and rely on
      the proxy alone if you ever run multiple instances.
- [ ] Review `docs/PROJECT_PACK.md` safety items and `/safety` page statements still hold
- [ ] `GET /api/health` returns 200 from the load balancer's health check

## What still needs the client

The application is deploy-ready; going live needs two things only the client can
provide (both are listed in the project brief's client support):

1. **Cloud account access or credits** on one of AWS / Azure / Google Cloud /
   Oracle, to create the instance and persistent disk above.
2. **A domain (and DNS access)**, to point at the instance and issue TLS.

With those, first deployment is Option A (single VM) or the matching per-cloud
quick start — roughly 30–60 minutes.
