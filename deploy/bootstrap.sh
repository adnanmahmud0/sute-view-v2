#!/usr/bin/env bash
# ==============================================================================
# bootstrap.sh - Idempotent Server Provisioning for Ubuntu VPS (AWS/DO/Hetzner)
# Configures Swap, Docker, Nginx, Certbot, UFW Firewall, Postgres, and Backups.
# ==============================================================================
set -euo pipefail

PROJECT_SLUG="${PROJECT_SLUG:-fullstack}"
TARGET_DIR="/opt/${PROJECT_SLUG}"

echo "================================================================================"
echo " Starting Self-Bootstrapping for Project: ${PROJECT_SLUG}"
echo "================================================================================"

# 1. SWAP MEMORY CONFIGURATION (Prevents Out-Of-Memory Crashes on 1GB/2GB VPS)
if ! swapon --show | grep -q "/swapfile"; then
  echo "==> Configuring 2GB Swap Memory..."
  if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
  fi
  sudo swapon /swapfile
  if ! grep -q "/swapfile" /etc/fstab; then
    echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
  fi
  echo "✔ Swapfile active: $(swapon --show --bytes | awk 'NR>1 {print $3/1024/1024 " MB"}')"
else
  echo "✔ Swap already configured."
fi

# 2. ESSENTIAL PACKAGES & REPOSITORIES
echo "==> Updating package indices and installing essential tools..."
sudo apt-get update -y
sudo apt-get install -y --no-install-recommends \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  ufw \
  nginx \
  certbot \
  python3-certbot-nginx \
  jq

# 3. DOCKER ENGINE INSTALLATION
if ! command -v docker > /dev/null 2>&1; then
  echo "==> Installing official Docker Engine..."
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER"
  echo "✔ Docker installed successfully."
else
  echo "✔ Docker already installed: $(docker --version)"
fi

# Configure Docker daemon log rotation (prevents runaway container logs)
sudo mkdir -p /etc/docker
if [ ! -f /etc/docker/daemon.json ]; then
  echo "==> Setting Docker daemon log rotation..."
  sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
  sudo systemctl restart docker
fi

# 4. FIREWALL CONFIGURATION (UFW)
echo "==> Configuring UFW Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
echo "✔ Firewall active (Ports 22, 80, 443 open; backend & DB ports blocked externally)."

# 5. DIRECTORY STRUCTURE & VOLUMES
echo "==> Setting up application directories at ${TARGET_DIR}..."
sudo mkdir -p \
  "${TARGET_DIR}/deploy" \
  "${TARGET_DIR}/state" \
  "${TARGET_DIR}/backups" \
  "${TARGET_DIR}/volumes/uploads" \
  "${TARGET_DIR}/volumes/winston"

sudo chown -R "$USER:$USER" "$TARGET_DIR"

# 6. DOCKER NETWORK & INFRASTRUCTURE DATABASE
echo "==> Booting PostgreSQL infrastructure..."
export PROJECT_SLUG
if [ -f "${TARGET_DIR}/deploy/docker-compose.infra.yml" ]; then
  docker compose -f "${TARGET_DIR}/deploy/docker-compose.infra.yml" up -d
  echo "✔ Infrastructure containers running."
fi

# 7. AUTOMATED DAILY BACKUP CRON JOB
CRON_JOB="0 2 * * * ${TARGET_DIR}/deploy/backup-db.sh >> /var/log/${PROJECT_SLUG}-db-backup.log 2>&1"
if ! crontab -l 2>/dev/null | grep -Fq "${TARGET_DIR}/deploy/backup-db.sh"; then
  echo "==> Registering daily database backup cron job (02:00 UTC)..."
  (crontab -l 2>/dev/null || true; echo "$CRON_JOB") | crontab -
  echo "✔ Backup cron registered."
else
  echo "✔ Backup cron already registered."
fi

echo "================================================================================"
echo " Server Bootstrapping Completed Successfully!"
echo "================================================================================"
