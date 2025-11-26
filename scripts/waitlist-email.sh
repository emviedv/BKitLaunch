#!/usr/bin/env bash
# Export the most recent waitlist signups to stdout.
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required (same value Netlify uses)." >&2
  exit 1
fi

LIMIT="${WAITLIST_LIMIT:-50}"

psql "$DATABASE_URL" -Atc "
  SELECT id,
         email,
         COALESCE(name,'') AS name,
         COALESCE(source,'') AS source,
         created_at,
         COALESCE(ip_hash,'') AS ip_hash,
         COALESCE(user_agent,'') AS user_agent
  FROM waitlist_signups
  ORDER BY created_at DESC
  LIMIT $LIMIT;
"
