#!/bin/bash

# BiblioKit Deployment Validation Script
# Tests that functions are properly deployed and accessible

set -e

SITE_URL="${1:-https://bibliokit-launch.netlify.app}"

echo "🔍 Validating BiblioKit deployment at: $SITE_URL"
echo "=================================================="

# Test 1: Check if main site loads
echo "1. Testing main site accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Main site loads successfully (HTTP $HTTP_STATUS)"
else
    echo "❌ Main site failed to load (HTTP $HTTP_STATUS)"
    exit 1
fi

# Test 2: Check if functions are accessible (not returning HTML)
echo ""
echo "2. Testing serverless functions..."

WAITLIST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$SITE_URL/.netlify/functions/waitlist")
if [ "$WAITLIST_STATUS" = "200" ]; then
    echo "✅ waitlist function responds to preflight (HTTP $WAITLIST_STATUS)"
else
    echo "⚠️  waitlist function preflight returned HTTP $WAITLIST_STATUS"
fi

SITEMAP_RESPONSE=$(curl -s "$SITE_URL/.netlify/functions/sitemap")
if echo "$SITEMAP_RESPONSE" | grep -q "<urlset"; then
    echo "✅ sitemap function responded with XML"
else
    echo "⚠️  sitemap function response unexpected:"
    echo "$SITEMAP_RESPONSE" | head -c 200
fi

echo ""
echo "=================================================="
echo "🎉 Deployment validation complete!"
echo ""
echo "Next steps:"
echo "1. Visit $SITE_URL to see your site"
echo "2. Check Netlify function logs if any issues persist"
