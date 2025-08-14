#!/bin/bash

set -euo pipefail

PROJECT_ROOT="/Users/emily/Products/BiblioKit Launch"
cd "$PROJECT_ROOT"

FRONTEND_PORT="${FRONTEND_PORT:-9990}"
DEV_PORT="${DEV_PORT:-9989}"

echo "Starting Caddy with FRONTEND_PORT=$FRONTEND_PORT, DEV_PORT=$DEV_PORT"
if ! command -v caddy >/dev/null 2>&1; then
  echo "Caddy is not installed. Install from https://caddyserver.com/docs/install or via: brew install caddy"
  exit 1
fi

# Run Caddy with this project's Caddyfile
exec caddy run --config Caddyfile --adapter caddyfile


