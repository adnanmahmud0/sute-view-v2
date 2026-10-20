#!/usr/bin/env bash
# Interactive Project Creator for Fullstack Turborepo Starter Kit
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
node "$DIR/scripts/create-project.mjs" "$@"
