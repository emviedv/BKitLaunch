#!/bin/bash

# 🧪 AI Crawler Test Suite
# Tests all implemented optimization features

echo "🚀 Testing AI Crawler Optimization for BiblioKit"
echo "================================================"

# Configuration
SITE_URL="${1:-https://bibliokit-launch.netlify.app}"
echo "Testing site: $SITE_URL"
echo ""

# Test 1: robots.txt accessibility
echo "📄 Test 1: robots.txt"
echo "----------------------"
if curl -s "$SITE_URL/robots.txt" | grep -q "GPTBot"; then
    echo "✅ robots.txt exists and allows GPTBot"
else
    echo "❌ robots.txt missing or doesn't allow GPTBot"
fi
echo ""

# Test 2: AI sitemap (llms.txt)
echo "🗺️ Test 2: AI Sitemap (llms.txt)"
echo "--------------------------------"
if curl -s "$SITE_URL/llms.txt" | grep -q "BiblioKit"; then
    echo "✅ llms.txt exists with site content"
else
    echo "❌ llms.txt missing or empty"
fi
echo ""

# Test 3: IndexNow key file
echo "🔑 Test 3: IndexNow Key"
echo "----------------------"
if curl -s "$SITE_URL/indexnow-key.txt" | grep -q -E "^[a-z0-9]{32}$"; then
    echo "✅ IndexNow key file exists and has valid format"
else
    echo "❌ IndexNow key file missing or invalid format"
fi
echo ""

# Test 4: Bot detection - GPTBot
echo "🤖 Test 4: Bot Detection (GPTBot)"
echo "--------------------------------"
GPTBOT_RESPONSE=$(curl -s -H "User-Agent: GPTBot/1.0" "$SITE_URL/")
if echo "$GPTBOT_RESPONSE" | grep -q "Secure API Management"; then
    echo "✅ GPTBot gets static HTML with full content"
else
    echo "❌ GPTBot not getting proper static content"
fi

if echo "$GPTBOT_RESPONSE" | grep -q "x-served-by.*bot-detection"; then
    echo "✅ Edge function serving bot content"
else
    echo "⚠️  Edge function may not be active (check deployment)"
fi
echo ""

# Test 5: Bot detection - PerplexityBot
echo "🔍 Test 5: Bot Detection (PerplexityBot)"
echo "---------------------------------------"
PERPLEXITY_RESPONSE=$(curl -s -H "User-Agent: PerplexityBot/1.0" "$SITE_URL/product")
if echo "$PERPLEXITY_RESPONSE" | grep -q "AI Rename Layers"; then
    echo "✅ PerplexityBot gets product page content"
else
    echo "❌ PerplexityBot not getting product content"
fi
echo ""

# Test 6: Schema markup verification
echo "📊 Test 6: Schema Markup"
echo "-----------------------"
SCHEMA_TEST=$(curl -s -H "User-Agent: ClaudeBot/1.0" "$SITE_URL/")
if echo "$SCHEMA_TEST" | grep -q '"@type": "Organization"'; then
    echo "✅ Organization schema present"
else
    echo "❌ Organization schema missing"
fi

PRODUCT_SCHEMA=$(curl -s -H "User-Agent: ClaudeBot/1.0" "$SITE_URL/product")
if echo "$PRODUCT_SCHEMA" | grep -q '"@type": "SoftwareApplication"'; then
    echo "✅ Product schema present"
else
    echo "❌ Product schema missing"
fi
echo ""

# Test 7: Regular user experience
echo "👤 Test 7: Regular User (SPA)"
echo "----------------------------"
USER_RESPONSE=$(curl -s "$SITE_URL/")
if echo "$USER_RESPONSE" | grep -q '<div id="root">'; then
    echo "✅ Regular users get SPA (React app)"
else
    echo "❌ SPA not loading properly for users"
fi
echo ""

# Test 8: Updated timestamps
echo "📅 Test 8: Updated Timestamps"
echo "----------------------------"
TIMESTAMP_TEST=$(curl -s -H "User-Agent: GPTBot/1.0" "$SITE_URL/")
CURRENT_DATE=$(date +%Y-%m-%d)
if echo "$TIMESTAMP_TEST" | grep -q "Updated $CURRENT_DATE"; then
    echo "✅ Fresh timestamp present: $CURRENT_DATE"
else
    echo "⚠️  Timestamp may be outdated or missing"
fi
echo ""

# Test 9: IndexNow function
echo "🔄 Test 9: IndexNow Function"
echo "---------------------------"
INDEXNOW_RESPONSE=$(curl -s -X POST "$SITE_URL/.netlify/functions/indexnow" -H "Content-Type: application/json" -d '{"test": true}')
if echo "$INDEXNOW_RESPONSE" | grep -q "IndexNow submission"; then
    echo "✅ IndexNow function responding"
    echo "   Response: $(echo "$INDEXNOW_RESPONSE" | jq -r '.message' 2>/dev/null || echo "Function working")"
else
    echo "❌ IndexNow function not responding"
fi
echo ""

# Test 10: Performance check
echo "⚡ Test 10: Performance"
echo "----------------------"
BOT_TIME=$(curl -s -o /dev/null -w "%{time_total}" -H "User-Agent: GPTBot/1.0" "$SITE_URL/")
USER_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL/")

echo "Bot response time: ${BOT_TIME}s"
echo "User response time: ${USER_TIME}s"

if (( $(echo "$BOT_TIME < 2.0" | bc -l) )); then
    echo "✅ Bot responses are fast (< 2s)"
else
    echo "⚠️  Bot responses slower than expected"
fi
echo ""

# Summary
echo "📋 Test Summary"
echo "==============="
echo "Site: $SITE_URL"
echo "Tested: $(date)"
echo ""
echo "Next steps:"
echo "1. Deploy to production if tests pass"
echo "2. Run: node scripts/trigger-indexnow.js"
echo "3. Monitor AI crawler logs in Netlify"
echo "4. Check AI search results in 1-2 weeks"
echo ""
echo "🎉 AI Crawler Optimization Testing Complete!" 