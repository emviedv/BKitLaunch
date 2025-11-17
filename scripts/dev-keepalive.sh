#!/usr/bin/env bash
set -euo pipefail

# Simple long-running no-op so Netlify Dev stays up without running our dev command.
while true; do sleep 3600; done

