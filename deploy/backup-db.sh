#!/usr/bin/env bash
# ==============================================================================
# backup-db.sh - Automated PostgreSQL database backups with retention policy
# ==============================================================================
set -euo pipefail

PROJECT_SLUG="${PROJECT_SLUG:-fullstack}"
CONTAINER_NAME="${PROJECT_SLUG}-postgres"
BACKUP_DIR="/opt/${PROJECT_SLUG}/backups"
TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Notice: Postgres container '${CONTAINER_NAME}' is not running (external DB or infra offline). Skipping local dump."
  exit 0
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-fullstack_db}"

echo "Starting backup of database '${POSTGRES_DB}' to '${BACKUP_FILE}'..."
docker exec "$CONTAINER_NAME" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$BACKUP_FILE"

chmod 600 "$BACKUP_FILE"
echo "Backup completed successfully: $(ls -lh "$BACKUP_FILE" | awk '{print $5}')"

# Retention: purge backups older than RETENTION_DAYS
echo "Purging backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
echo "Backup rotation complete."
