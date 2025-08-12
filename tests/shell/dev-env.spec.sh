#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Dev Environment Checks"
echo "=========================="

failures=0

step() { echo; echo "• $1"; }
pass() { echo "  ✅ $1"; }
fail() { echo "  ❌ $1"; failures=$((failures+1)); }

step "Repo root contains package.json"
if [ -f "package.json" ]; then pass "package.json found"; else fail "package.json missing"; fi

step "Netlify dev config ports"
if grep -q "^\s*port\s*=\s*9989" netlify.toml; then pass "dev.port = 9989"; else fail "dev.port not 9989"; fi
if grep -q "^\s*targetPort\s*=\s*9990" netlify.toml; then pass "dev.targetPort = 9990"; else fail "dev.targetPort not 9990"; fi

step "Netlify dev command configured"
if grep -q "\[dev\]" netlify.toml && grep -q "command\s*=\s*\"npm run dev\"" netlify.toml; then pass "dev.command = npm run dev"; else fail "dev.command not set to npm run dev"; fi

step "SSR edge function present"
if [ -f "netlify/edge-functions/ssr.ts" ]; then pass "ssr.ts exists"; else fail "ssr.ts missing"; fi

step "Built outputs present (after build)"
if [ -d "dist/server" ] && [ -f "dist/server/entry-server.js" ]; then pass "server build present"; else echo "  ℹ️ Run: npm run build"; fi
if [ -d "dist/client" ] && [ -f "dist/client/index.html" ]; then pass "client build present"; else echo "  ℹ️ Run: npm run build"; fi

step "Dev server health (9989)"
if curl -sI http://localhost:9989 | grep -qi "200"; then pass "HTTP 200 on :9989"; else echo "  ℹ️ Start dev: npm run netlify:dev"; fi

step "Edge function active header"
if curl -sI http://localhost:9989 | grep -qi "x-nf-edge-functions: ssr"; then pass "Edge SSR header present"; else echo "  ℹ️ x-nf-edge-functions header not detected (dev mode may still inject Vite)"; fi

echo
if [ "$failures" -gt 0 ]; then
  echo "⚠️  Failures: $failures"; exit 1
else
  echo "🎉 Env checks passed"
fi


