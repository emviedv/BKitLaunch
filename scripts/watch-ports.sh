#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <port1> [port2] [...]"
  exit 1
fi

if ! command -v lsof >/dev/null 2>&1; then
  echo "❌ 'lsof' not found. Please install lsof to use this script."
  exit 1
fi

get_last() {
  local port="$1"
  eval "echo \${LAST_${port}:-}"
}

set_last() {
  local port="$1"; shift
  local val="$*"
  eval "LAST_${port}=\"$val\""
}

echo "👀 Watching ports: $*"
START_TS=$(date +%s)
WATCH_SECONDS=${WATCH_SECONDS:-}
while true; do
  for PORT in "$@"; do
    PIDS="$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
    PIDS="$(echo "$PIDS" | tr '\n' ' ')"
    LAST_VAL=$(get_last "$PORT")
    if [ "$LAST_VAL" != "$PIDS" ]; then
      TS=$(date '+%H:%M:%S')
      echo "[$TS] Port $PORT -> PIDs: ${PIDS:-<none>}"
      if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
          ps -o pid,ppid,command -p "$PID" 2>/dev/null | sed -n '2p' || true
        done
      fi
      set_last "$PORT" "$PIDS"
    fi
  done
  sleep 1
  if [ -n "$WATCH_SECONDS" ]; then
    NOW_TS=$(date +%s)
    ELAPSED=$((NOW_TS - START_TS))
    if [ "$ELAPSED" -ge "$WATCH_SECONDS" ]; then
      echo "⏹️  Watch finished after ${WATCH_SECONDS}s"
      exit 0
    fi
  fi
done
