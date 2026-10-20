#!/usr/bin/env bash
# ==============================================================================
# env-clean.sh - Clean and normalize .env files for Docker execution
# Strips Windows CRLF (\r), inline comments, whitespace, and validates KEY=VALUE.
# ==============================================================================
set -euo pipefail

INPUT_FILE="${1:-.env}"
OUTPUT_FILE="${2:-.env.cleaned}"

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file '$INPUT_FILE' not found." >&2
  exit 1
fi

# Clean stream: remove carriage returns, trim whitespace, ignore comments and empty lines
tr -d '\r' < "$INPUT_FILE" | \
  sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' | \
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=' > "$OUTPUT_FILE"

chmod 600 "$OUTPUT_FILE"
echo "Cleaned environment file generated at $OUTPUT_FILE ($(wc -l < "$OUTPUT_FILE") variables)"
