#!/usr/bin/env bash
# Export the most recent waitlist signups to stdout.
set -euo pipefail

load_database_url() {
  if [[ -n "${DATABASE_URL:-}" ]]; then
    echo "$DATABASE_URL"
    return 0
  fi

  for env_file in .env.local .env; do
    if [[ -f "$env_file" ]]; then
      local line
      line=$(grep -E '^DATABASE_URL=' "$env_file" | tail -n 1 || true)
      if [[ -n "$line" ]]; then
        local value="${line#DATABASE_URL=}"
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        if [[ -n "$value" ]]; then
          echo "$value"
          return 0
        fi
      fi
    fi
  done

  return 1
}

DB_URL="$(load_database_url || true)"
if [[ -z "$DB_URL" ]]; then
  echo "DATABASE_URL is required (set env or add to .env/.env.local)." >&2
  exit 1
fi

LIMIT="${WAITLIST_LIMIT:-50}"

psql "$DB_URL" -Atc "
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
