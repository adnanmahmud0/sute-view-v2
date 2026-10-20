#!/usr/bin/env bash
# ==============================================================================
# ssl.sh - Automated Let's Encrypt SSL Provisioning with Auto-Redirect
# ==============================================================================
set -euo pipefail

DOMAIN="${DOMAIN:-example.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-admin@example.com}"
API_SUBDOMAIN="${API_SUBDOMAIN:-api}"
ADMIN_SUBDOMAIN="${ADMIN_SUBDOMAIN:-admin}"

HAS_API="${HAS_API:-true}"
HAS_ADMIN="${HAS_ADMIN:-true}"
HAS_WEB="${HAS_WEB:-true}"

if [ "$DOMAIN" = "example.com" ] || [ -z "$DOMAIN" ]; then
  echo "Notice: DOMAIN is set to '${DOMAIN}'. Skipping real SSL provisioning."
  exit 0
fi

DOMAINS=()
[ "$HAS_API" = "true" ] && DOMAINS+=("-d" "${API_SUBDOMAIN}.${DOMAIN}")
[ "$HAS_ADMIN" = "true" ] && DOMAINS+=("-d" "${ADMIN_SUBDOMAIN}.${DOMAIN}")
DOMAINS+=("-d" "${DOMAIN}" "-d" "www.${DOMAIN}")

echo "================================================================================"
echo " Requesting/Renewing SSL certificates for: ${DOMAINS[*]}"
echo "================================================================================"

sudo certbot --nginx \
  "${DOMAINS[@]}" \
  --non-interactive \
  --agree-tos \
  -m "$CERTBOT_EMAIL" \
  --redirect \
  --expand || {
    echo "Warning: Certbot encountered an issue (check DNS A records point to this server)." >&2
    exit 0
  }

echo "✔ SSL Certificate successfully provisioned and HTTPS redirection enabled!"
