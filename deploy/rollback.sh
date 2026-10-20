#!/usr/bin/env bash
# ==============================================================================
# rollback.sh - Instant 1-Click Rollback to Previous Blue/Green Slot
# ==============================================================================
set -euo pipefail

PROJECT_SLUG="${PROJECT_SLUG:-fullstack}"
STATE_DIR="/opt/${PROJECT_SLUG}/state"

HAS_API="${HAS_API:-true}"
HAS_ADMIN="${HAS_ADMIN:-true}"
HAS_WEB="${HAS_WEB:-true}"

echo "================================================================================"
echo " Initiating Rollback for ${PROJECT_SLUG}..."
echo "================================================================================"

get_prev_slot() {
  local svc="$1"
  local current
  current="$(cat "${STATE_DIR}/${svc}.slot" 2>/dev/null || echo "green")"
  [ "$current" = "green" ] && echo "blue" || echo "green"
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

rollback_service() {
  local svc="$1"
  local prev_slot
  prev_slot="$(get_prev_slot "$svc")"
  local prev_container="${PROJECT_SLUG}-${svc}-${prev_slot}"
  local curr_slot
  [ "$prev_slot" = "blue" ] && curr_slot="green" || curr_slot="blue"
  local curr_container="${PROJECT_SLUG}-${svc}-${curr_slot}"

  echo "==> Restoring ${svc^^} to '${prev_slot}' slot (${prev_container})..."
  if docker ps -a -q --filter "name=^/${prev_container}$" | grep -q .; then
    docker start "$prev_container"
  else
    echo "Error: Previous container ${prev_container} not found!" >&2
    exit 1
  fi

  # Wait 5s for container initialization
  sleep 5

  # Switch Nginx upstream
  local prev_port
  prev_port="$(get_port "$svc" "$prev_slot")"
  case "$svc" in
    api) export API_PORT="$prev_port" ;;
    admin) export ADMIN_PORT="$prev_port" ;;
    web) export WEB_PORT="$prev_port" ;;
  esac

  echo "$prev_slot" > "${STATE_DIR}/${svc}.slot"
  echo "✔ ${svc^^} reverted to ${prev_slot} slot."

  # Stop the faulty container
  docker stop -t 5 "$curr_container" || true
}

[ "$HAS_API" = "true" ] && rollback_service "api"
[ "$HAS_ADMIN" = "true" ] && rollback_service "admin"
[ "$HAS_WEB" = "true" ] && rollback_service "web"

export PROJECT_SLUG HAS_API HAS_ADMIN HAS_WEB
/opt/${PROJECT_SLUG}/deploy/render-nginx.sh

echo "================================================================================"
echo " Rollback Complete! Traffic restored to previous version. 🔄"
echo "================================================================================"
