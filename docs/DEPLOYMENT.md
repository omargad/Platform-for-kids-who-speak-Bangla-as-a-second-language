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
- [ ] `.data/` on encrypted disk, scheduled backups tested
- [ ] OS auto-updates on; SSH by key only
- [ ] Rate limiting at the proxy for `/api/auth/*` (e.g. Caddy `rate_limit` or nginx `limit_req`)
- [ ] Review `docs/PROJECT_PACK.md` safety items and `/safety` page statements still hold
