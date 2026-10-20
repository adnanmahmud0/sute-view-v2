# 🚀 Zero-Manual-SSH CI/CD & Production Deployment Guide

This guide explains the automated, zero-manual-SSH CI/CD pipeline and deployment engine for the **Fullstack Turborepo Monorepo**. It supports any Linux VPS (AWS EC2, DigitalOcean, Hetzner, Linode) and automates mobile application builds (Expo React Native and Flutter).

---

## 📑 Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [DNS & Domain Records](#2-dns--domain-records)
3. [Server Preparation](#3-server-preparation)
4. [GitHub Secrets & Variables](#4-github-secrets--variables)
5. [The Autonomous Deployment Pipeline](#5-the-autonomous-deployment-pipeline)
6. [Blue/Green Zero-Downtime Deployment Deep Dive](#6-bluegreen-zero-downtime-deployment-deep-dive)
7. [Mobile App Build Automation](#7-mobile-app-build-automation)
8. [Instant Rollback & Disaster Recovery](#8-instant-rollback--disaster-recovery)
9. [Database Backups & Retention](#9-database-backups--retention)

---

## 1. Architectural Overview

```
                               git push origin main
                                        │
                                        ▼
┌─────────────────────── GitHub Actions Cloud Runners ────────────────────────┐
│                                                                             │
│  [detect]              ──► Dynamically discovers present workspaces         │
│  [quality-check]       ──► Parallel linting, typechecks & production builds │
│  [bootstrap-server]    ──► Idempotent VPS provisioner (Swap, Docker, Nginx) │
│  [build-images]        ──► Multi-stage Docker builds -> GHCR private images │
│  [deploy]              ──► Standby slot launch -> Health probe -> Nginx swap│
│  [ssl]                 ──► Certbot Let's Encrypt HTTPS auto-expansion       │
│  [smoke-test]          ──► Verifies public HTTP probes & outputs summary    │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │ Automated SSH
                                        ▼
┌──────────────────────── Any Linux VPS (Ubuntu 24.04) ───────────────────────┐
│                                                                             │
│  [Virtual Memory] 2GB Swapfile (prevents Out-Of-Memory container kills)     │
│  [Firewall (UFW)] Ports 22 (SSH), 80 (HTTP), 443 (HTTPS) only               │
│                                                                             │
│  [Nginx Reverse Proxy & SSL Termination]                                    │
│     ├── api.yourdomain.com    ──► Upstream: Port 5000 (Blue) / 5001 (Green) │
│     ├── admin.yourdomain.com  ──► Upstream: Port 3001 (Blue) / 3011 (Green) │
│     └── yourdomain.com        ──► Upstream: Port 3000 (Blue) / 3010 (Green) │
│                                                                             │
│  [Isolated Docker Network: fullstack-net]                                   │
│     ├── fullstack-postgres (Postgres 17 Alpine, internal only)              │
│     ├── fullstack-api-[blue|green]                                          │
│     ├── fullstack-admin-[blue|green]                                        │
│     └── fullstack-web-[blue|green]                                          │
│                                                                             │
│  [Automated Backups] Daily pg_dump gzip at 02:00 UTC (7-day retention)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DNS & Domain Records

Configure the following **A Records** with your DNS provider (Cloudflare, Namecheap, Route53, GoDaddy):

| Type         | Host    | Target / Value   | Purpose                                                   |
| ------------ | ------- | ---------------- | --------------------------------------------------------- |
| **A Record** | `@`     | `YOUR_SERVER_IP` | Points root domain (`yourdomain.com`) directly to server  |
| **A Record** | `admin` | `YOUR_SERVER_IP` | Subdomain for Super Admin portal (`admin.yourdomain.com`) |
| **A Record** | `api`   | `YOUR_SERVER_IP` | Subdomain for Express backend (`api.yourdomain.com`)      |
| **A Record** | `www`   | `YOUR_SERVER_IP` | Canonical `www.yourdomain.com`                            |

> ⚠️ **Notice**: Always use an **A Record** for the apex `@` domain (never a CNAME) to avoid breaking MX (email) and TXT verification records.

---

## 3. Server Preparation

Launch a clean VPS with **Ubuntu 24.04 LTS**:

- Minimum recommended: 1 vCPU, 1 GB RAM (AWS `t3.micro`, Hetzner CX22, DigitalOcean $4–$6/mo droplet).
- Open inbound firewall ports on your cloud provider:
  - `22` (SSH)
  - `80` (HTTP)
  - `443` (HTTPS)
  - Keep internal ports (`5000`, `3001`, `3000`, `5432`) **CLOSED** to the internet.

No manual software installation is required on the server. The pipeline automatically runs [`deploy/bootstrap.sh`](file:///A:/fullstack-turborepo-starter-kit-v2/deploy/bootstrap.sh) on first run.

---

## 4. GitHub Secrets & Variables

### Enable GitHub Container Registry (GHCR) Permissions

1. Go to repository **Settings → Actions → General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions** and click **Save**.

### Repository Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret Name      | Example Value                            | Description                                            |
| ---------------- | ---------------------------------------- | ------------------------------------------------------ |
| `SERVER_HOST`    | `18.226.104.67`                          | Server public IP address                               |
| `SERVER_USER`    | `ubuntu`                                 | SSH user (default `ubuntu`)                            |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Entire text of your private SSH key                    |
| `ENV_FILE`       | _(Content of `.env`)_                    | Production environment variables                       |
| `EXPO_TOKEN`     | _(Optional)_                             | Personal access token from `expo.dev` for cloud builds |

### Repository Variables

Go to **Settings → Secrets and variables → Actions → Variables**:

| Variable Name     | Example Value          | Description                                      |
| ----------------- | ---------------------- | ------------------------------------------------ |
| `DEPLOY_ENABLED`  | `true`                 | Set to `true` to enable automated deployment     |
| `DOMAIN`          | `mycompany.com`        | Your live root domain                            |
| `API_SUBDOMAIN`   | `api`                  | Subdomain for backend API (default: `api`)       |
| `ADMIN_SUBDOMAIN` | `admin`                | Subdomain for admin dashboard (default: `admin`) |
| `PROJECT_SLUG`    | `fullstack`            | Unique prefix for containers and directories     |
| `CERTBOT_EMAIL`   | `devops@mycompany.com` | Contact email for Let's Encrypt certificates     |

---

## 5. The Autonomous Deployment Pipeline

1. **`detect`**: Discovers which apps exist in your active template branch (e.g. `main` vs `expo-web-api`).
2. **`quality-check`**: Validates TypeScript compilation and builds across workspaces.
3. **`bootstrap-server`**: Idempotently provisions swap memory, Docker, Nginx, UFW firewall, and PostgreSQL.
4. **`build-images`**: Builds optimized multi-stage Docker images with Turborepo pruning and publishes to GHCR.
5. **`deploy`**:
   - Creates an automated database snapshot.
   - Runs `prisma migrate deploy` in an isolated container.
   - Launches target containers on standby slot ports.
   - Verifies container health probes (`/health/live`).
   - Atomically switches Nginx upstream configuration.
   - Drains and stops previous containers without downtime.
6. **`ssl`**: Requests or auto-expands Let's Encrypt certificates with HTTPS 301 redirection.
7. **`smoke-test`**: Probes the live API and renders a Markdown summary in GitHub Actions.

---

## 6. Blue/Green Zero-Downtime Deployment Deep Dive

Traffic moves between two alternating slots:

| Service          | Blue Port | Green Port |
| ---------------- | --------- | ---------- |
| **API**          | `5000`    | `5001`     |
| **Super Admin**  | `3001`    | `3011`     |
| **Web Frontend** | `3000`    | `3010`     |

If a deployment fails health checks during the 90-second verification window, the new container is safely killed and removed. **Live traffic remains on the active slot with zero user disruption.**

---

## 7. Mobile App Build Automation

### React Native (Expo)

- **Workflow**: `.github/workflows/mobile-expo.yml`
- **Profiles**:
  - `preview`: Generates a standalone Android APK.
  - `production`: Builds an Android App Bundle (AAB) & iOS IPA for app store submission.
- **Over-The-Air (OTA) Updates**: Pushing JavaScript/UI changes to `main` automatically broadcasts updates via `eas update --branch production`.

### Flutter

- **Workflow**: `.github/workflows/mobile-flutter.yml`
- **Output Artifacts**:
  - `app-release.apk`: Direct-install Android package.
  - `app-release.aab`: Google Play Store submission bundle.
- **Automatic Releases**: Tagging a commit with `v1.0.0` compiles release binaries and creates a GitHub Release with the APK/AAB attached.

---

## 8. Instant Rollback & Disaster Recovery

If an issue occurs in production:

1. Navigate to **Actions → Production Rollback → Run workflow**.
2. Click **Run workflow**.
3. The server immediately starts the standby slot container and flips Nginx traffic back in less than 5 seconds.

To trigger rollback manually via SSH:

```bash
/opt/fullstack/deploy/rollback.sh
```

---

## 9. Database Backups & Retention

- **Automated Schedule**: Every night at `02:00 UTC` via system cron.
- **Pre-Deployment Trigger**: Runs automatically before every database migration and container swap.
- **Location**: `/opt/fullstack/backups/db_backup_YYYYMMDD_HHMMSS.sql.gz`
- **Retention**: Backups older than 7 days are automatically purged to prevent disk saturation.
- **Manual Backup**:
  ```bash
  /opt/fullstack/deploy/backup-db.sh
  ```
- **Restore from Backup**:
  ```bash
  gunzip < /opt/fullstack/backups/db_backup_20261006_020000.sql.gz | \
    docker exec -i fullstack-postgres psql -U postgres -d fullstack_db
  ```
