#!/usr/bin/env bash
set -euo pipefail

# Kill all user-owned TCP LISTEN servers except on whitelisted ports.
# Usage:
#   SAFE_PORTS="4111 3115" bash scripts/kill-servers-except.sh
# Optional:
#   DRY_RUN=1 SAFE_PORTS="4111 3115" bash scripts/kill-servers-except.sh

SAFE_PORTS=${SAFE_PORTS:-"4111 3115"}
USER_NAME=$(id -un)
SELF_PID=$$

is_safe_port() {
  local p="$1"
  for sp in $SAFE_PORTS; do
    if [ "$p" = "$sp" ]; then
      return 0
    fi
  done
  return 1
}

if ! command -v lsof >/dev/null 2>&1; then
  echo "❌ 'lsof' not found. Please install lsof to use this script."
  exit 1
fi

echo "🔎 Scanning user-owned LISTEN sockets (excluding ports: $SAFE_PORTS)"

# macOS-safe: restrict to user-owned processes
LIST=$(lsof -nP -iTCP -sTCP:LISTEN -u "$USER_NAME" 2>/dev/null | awk 'NR>1 { print $2, $NF }' || true)

KILLED=0
SKIPPED=0

while read -r PID NAME; do
  [ -z "${PID:-}" ] && continue
  PORT=$(echo "$NAME" | awk -F: '{print $NF}' | tr -d '[]')
  if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
    continue
  fi
  if is_safe_port "$PORT"; then
    echo "⏭️  Skipping PID $PID on safe port $PORT ($NAME)"
    SKIPPED=$((SKIPPED+1))
    continue
  fi
  if [ "$PID" = "$SELF_PID" ]; then
    echo "⏭️  Skipping self PID $PID"
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  if [ "${DRY_RUN:-0}" = "1" ]; then
    echo "DRY-RUN: would kill PID $PID (port $PORT)"
    continue
  fi

  echo "🔧 Killing PID $PID (port $PORT, $NAME)"
  kill "$PID" 2>/dev/null || true
  sleep 0.3
  if kill -0 "$PID" 2>/dev/null; then
    echo "   Force killing PID $PID"
    kill -9 "$PID" 2>/dev/null || true
  fi
  KILLED=$((KILLED+1))
done <<< "$LIST"

echo "✅ Done. Killed: $KILLED, Skipped: $SKIPPED"

