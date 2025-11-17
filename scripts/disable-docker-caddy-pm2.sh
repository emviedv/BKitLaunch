#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Disabling Docker, Caddy, and PM2 if present"

# Stop PM2 processes (user-space)
if command -v pm2 >/dev/null 2>&1; then
  echo "➡️  PM2 detected — stopping all PM2 processes"
  pm2 save || true
  pm2 delete all || true
  pm2 kill || true
else
  echo "ℹ️  PM2 not found"
fi

# Stop Caddy (via brew services if available), then fallback to pkill
if command -v caddy >/dev/null 2>&1 || command -v brew >/dev/null 2>&1; then
  echo "➡️  Attempting to stop Caddy"
  if command -v brew >/dev/null 2>&1; then
    brew services stop caddy || true
  fi
  if command -v caddy >/dev/null 2>&1; then
    caddy stop || true
  fi
  pkill -f "caddy" 2>/dev/null || true
else
  echo "ℹ️  Caddy not found"
fi

# Stop Docker containers and attempt to shut down Docker Desktop (macOS)
if command -v docker >/dev/null 2>&1; then
  echo "➡️  Docker detected — stopping containers"
  docker ps -q | xargs -r docker stop || true
  docker ps -aq | xargs -r docker rm -f || true
  # Compose (v1 or v2)
  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose down || true
  fi
  docker compose down 2>/dev/null || true
  # Quit Docker Desktop on macOS
  if [ "$(uname)" = "Darwin" ]; then
    osascript -e 'quit app "Docker"' 2>/dev/null || true
  fi
else
  echo "ℹ️  Docker not found"
fi

echo "✅ Disable attempts complete"

