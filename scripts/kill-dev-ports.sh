#!/usr/bin/env bash
set -euo pipefail

# Kill any processes bound to dev ports before starting Vite.
# Usage: DEV_PORTS="9990 9989" bash scripts/kill-dev-ports.sh

# Default to freeing the standard Vite port if none provided
PORTS=${DEV_PORTS:-"53173"}

if ! command -v lsof >/dev/null 2>&1; then
  echo "ℹ️  'lsof' not found; skipping port cleanup"
  exit 0
fi

for PORT in $PORTS; do
  # Broad check: any listener on this port
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "🔧 Port $PORT in use — terminating listeners..."
    # Collect PIDs in LISTEN state
    PIDS=$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN | tr '\n' ' ')
    if [ -n "$PIDS" ]; then
      echo "   Killing PIDs: $PIDS"
      kill $PIDS 2>/dev/null || true
      sleep 0.5
      # If still alive, force kill
      for PID in $PIDS; do
        if kill -0 "$PID" 2>/dev/null; then
          echo "   Force killing PID $PID"
          kill -9 "$PID" 2>/dev/null || true
        fi
      done
    fi
    # Final check; sometimes new wrapper processes appear briefly
    if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "   ⚠️  Port $PORT still appears busy. Retry once..."
      sleep 0.5
      PIDS2=$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN | tr '\n' ' ')
      if [ -n "$PIDS2" ]; then
        kill -9 $PIDS2 2>/dev/null || true
      fi
    fi
  fi
done

echo "✅ Dev ports free: $PORTS"
