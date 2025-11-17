#!/usr/bin/env bash
set -Eeuo pipefail

BASE_PORT=${VITE_DEV_PORT:-53173}
MAX_TRIES=${VITE_PORT_SCAN_MAX:-15}

echo "🌐 Starting full-stack dev: Vite (port scan from ${BASE_PORT}) + Netlify Dev (9989)"

# Ensure proxy port is clean
DEV_PORTS="9989" bash scripts/kill-dev-ports.sh || true

# Find a free Vite port starting from BASE_PORT
CHOSEN_PORT=""
for ((i=0; i<MAX_TRIES; i++)); do
  CANDIDATE=$((BASE_PORT + i))
  if ! lsof -nP -iTCP:"$CANDIDATE" -sTCP:LISTEN >/dev/null 2>&1; then
    CHOSEN_PORT="$CANDIDATE"
    break
  fi
done

if [ -z "$CHOSEN_PORT" ]; then
  echo "❌ No free Vite port found in range ${BASE_PORT}..$((BASE_PORT + MAX_TRIES - 1))"
  exit 1
fi

echo "▶️  Vite: http://127.0.0.1:${CHOSEN_PORT} (logs: vite.log)"
# Ensure Vite sees the functions origin so the app can call functions cross-origin when
# you open the Vite URL directly (avoids Netlify Dev page auto-reload behavior)
export VITE_FUNCTIONS_ORIGIN="http://localhost:9989"
nohup npx vite --host 127.0.0.1 --port "$CHOSEN_PORT" --strictPort > vite.log 2>&1 &
VITE_PID=$!

# Cleanup handler
cleanup() {
  if [ -n "$VITE_PID" ] && kill -0 "$VITE_PID" 2>/dev/null; then
    echo "🔻 Stopping Vite (PID $VITE_PID)"
    kill "$VITE_PID" 2>/dev/null || true
    sleep 0.5
    kill -9 "$VITE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Wait until Vite is listening
for i in {1..120}; do
  if lsof -nP -iTCP:"$CHOSEN_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "✅ Vite ready on http://127.0.0.1:${CHOSEN_PORT}"
    break
  fi
  sleep 0.25
done

# Start Netlify Dev proxying to Vite
echo "▶️  Netlify Dev: http://localhost:9989 → 127.0.0.1:${CHOSEN_PORT}"
NODE_OPTIONS=--dns-result-order=ipv4first npx netlify dev \
  --port 9989 \
  --targetPort "$CHOSEN_PORT" \
  --command "bash scripts/dev-keepalive.sh"
