#!/usr/bin/env bash
# ==============================================================================
# deploy.sh - Zero-Downtime Blue/Green Deployment Engine for Turborepo Monorepo
# ==============================================================================
set -euo pipefail

PROJECT_SLUG="${PROJECT_SLUG:-fullstack}"
REGISTRY="${REGISTRY:-ghcr.io/owner/repo}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
ENV_FILE="${ENV_FILE:-/opt/${PROJECT_SLUG}/.env.cleaned}"

HAS_API="${HAS_API:-true}"
HAS_ADMIN="${HAS_ADMIN:-true}"
HAS_WEB="${HAS_WEB:-true}"

STATE_DIR="/opt/${PROJECT_SLUG}/state"
NETWORK_NAME="${PROJECT_SLUG}-net"

mkdir -p "$STATE_DIR"

echo "================================================================================"
echo " Starting Blue/Green Deployment: ${PROJECT_SLUG} (Tag: ${IMAGE_TAG})"
echo "================================================================================"

# Verify internal Docker network exists
if ! docker network inspect "$NETWORK_NAME" > /dev/null 2>&1; then
  echo "==> Creating internal Docker network: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
fi

# 1. PRE-DEPLOYMENT DATABASE BACKUP
if [ -f "/opt/${PROJECT_SLUG}/deploy/backup-db.sh" ]; then
  echo "==> Running pre-deployment database backup..."
  /opt/${PROJECT_SLUG}/deploy/backup-db.sh || echo "Warning: Backup script failed or skipped."
fi

# 2. DATABASE MIGRATIONS (Run isolated one-off container against new API image)
if [ "$HAS_API" = "true" ]; then
  IMAGE_API="${REGISTRY}-api:${IMAGE_TAG}"
  echo "==> Running Prisma database migrations using ${IMAGE_API}..."
  docker run --rm \
    --network "$NETWORK_NAME" \
    --env-file "$ENV_FILE" \
    "$IMAGE_API" \
    npx prisma migrate deploy
  echo "✔ Prisma migrations applied successfully."
fi

# Function to get next slot
get_target_slot() {
  local svc="$1"
  local state_file="${STATE_DIR}/${svc}.slot"
  local current="blue"
  if [ -f "$state_file" ]; then
    current="$(cat "$state_file")"
  fi
  if [ "$current" = "blue" ]; then
    echo "green"
  else
    echo "blue"
  fi
}

get_port() {
  local svc="$1"
  local slot="$2"
  case "$svc" in
    api)
      [ "$slot" = "blue" ] && echo "5000" || echo "5001"
      ;;
    admin)
      [ "$slot" = "blue" ] && echo "3001" || echo "3011"
      ;;
    web)
      [ "$slot" = "blue" ] && echo "3000" || echo "3010"
      ;;
  esac
}

# 3. LAUNCH TARGET CONTAINERS (Standby Slot)
declare -A TARGET_SLOTS
declare -A TARGET_PORTS

deploy_service() {
  local svc="$1"
  local image="$2"
  local internal_port="$3"
  local extra_args="${4:-}"

  local target_slot
  target_slot="$(get_target_slot "$svc")"
  local target_port
  target_port="$(get_port "$svc" "$target_slot")"
  local container_name="${PROJECT_SLUG}-${svc}-${target_slot}"

  TARGET_SLOTS["$svc"]="$target_slot"
  TARGET_PORTS["$svc"]="$target_port"

  echo "==> Deploying ${svc^^} to '${target_slot}' slot on port ${target_port} (container: ${container_name})..."

  # Remove existing target container if left behind
  docker rm -f "$container_name" 2>/dev/null || true

  # Start target container
  # shellcheck disable=SC2086
  docker run -d \
    --name "$container_name" \
    --restart unless-stopped \
    --network "$NETWORK_NAME" \
    -p "127.0.0.1:${target_port}:${internal_port}" \
    --env-file "$ENV_FILE" \
    $extra_args \
    "$image"

  echo "✔ ${container_name} launched."
}

if [ "$HAS_API" = "true" ]; then
  deploy_service "api" "${REGISTRY}-api:${IMAGE_TAG}" "5000" \
    "-v /opt/${PROJECT_SLUG}/volumes/uploads:/app/apps/api/uploads -v /opt/${PROJECT_SLUG}/volumes/winston:/app/apps/api/winston"
fi

if [ "$HAS_ADMIN" = "true" ]; then
  deploy_service "admin" "${REGISTRY}-admin:${IMAGE_TAG}" "3001"
fi

if [ "$HAS_WEB" = "true" ]; then
  deploy_service "web" "${REGISTRY}-web:${IMAGE_TAG}" "3000"
fi

# 4. HEALTH CHECK VERIFICATION LOOP
wait_for_health() {
  local svc="$1"
  local target_slot="${TARGET_SLOTS[$svc]}"
  local container_name="${PROJECT_SLUG}-${svc}-${target_slot}"
  local port="${TARGET_PORTS[$svc]}"

  echo "==> Awaiting health confirmation for ${container_name}..."
  local attempts=0
  local max_attempts=18

  while [ "$attempts" -lt "$max_attempts" ]; do
    attempts=$((attempts + 1))
    local health_status
    health_status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container_name" 2>/dev/null || echo "dead")"

    if [ "$health_status" = "healthy" ]; then
      echo "✔ ${container_name} is healthy! (attempt ${attempts}/${max_attempts})"
      return 0
    fi

    # Fallback to direct curl if Docker healthcheck is initializing
    if curl -fs "http://127.0.0.1:${port}" > /dev/null 2>&1 || curl -fs "http://127.0.0.1:${port}/health/live" > /dev/null 2>&1; then
      echo "✔ ${container_name} responded to HTTP probe! (attempt ${attempts}/${max_attempts})"
      return 0
    fi

    echo "    Waiting for ${container_name} (status: ${health_status})... [${attempts}/${max_attempts}]"
    sleep 5
  done

  echo "❌ ERROR: Health check timed out for ${container_name} after 90 seconds!" >&2
  echo "==> Dumping recent logs for debugging:"
  docker logs --tail 50 "$container_name"
  echo "==> Aborting deployment. Live traffic remains on active slots untouched."
  docker rm -f "$container_name" 2>/dev/null || true
  exit 1
}

[ "$HAS_API" = "true" ] && wait_for_health "api"
[ "$HAS_ADMIN" = "true" ] && wait_for_health "admin"
[ "$HAS_WEB" = "true" ] && wait_for_health "web"

# 5. SWITCH TRAFFIC IN NGINX (Zero Downtime)
echo "==> All target services verified healthy. Switching Nginx upstream traffic..."
export PROJECT_SLUG
export HAS_API HAS_ADMIN HAS_WEB
[ "$HAS_API" = "true" ] && export API_PORT="${TARGET_PORTS[api]}"
[ "$HAS_ADMIN" = "true" ] && export ADMIN_PORT="${TARGET_PORTS[admin]}"
[ "$HAS_WEB" = "true" ] && export WEB_PORT="${TARGET_PORTS[web]}"

/opt/${PROJECT_SLUG}/deploy/render-nginx.sh
echo "✔ Nginx traffic switched to new slots without dropped connections."

# 6. GRACEFUL DRAIN & STOP OLD CONTAINERS
echo "==> Draining old slot containers..."
sleep 5

stop_old_container() {
  local svc="$1"
  local target_slot="${TARGET_SLOTS[$svc]}"
  local old_slot
  [ "$target_slot" = "blue" ] && old_slot="green" || old_slot="blue"
  local old_container="${PROJECT_SLUG}-${svc}-${old_slot}"

  if docker ps -q --filter "name=^/${old_container}$" | grep -q .; then
    echo "    Stopping previous slot: ${old_container} (preserved for instant rollback)..."
    docker stop -t 10 "$old_container" || true
  fi

  # Record new active slot in persistent state file
  echo "$target_slot" > "${STATE_DIR}/${svc}.slot"
}

[ "$HAS_API" = "true" ] && stop_old_container "api"
[ "$HAS_ADMIN" = "true" ] && stop_old_container "admin"
[ "$HAS_WEB" = "true" ] && stop_old_container "web"

# 7. CLEANUP OLD DOCKER IMAGES
echo "==> Pruning unused Docker images older than 72 hours..."
docker image prune -af --filter "until=72h" > /dev/null 2>&1 || true

echo "================================================================================"
echo " Deployment Successfully Finished! Zero Downtime Achieved. 🚀"
echo "================================================================================"
