#!/bin/bash

# 🚀 Complete AI Crawler Optimization Setup
# Run this after Netlify deployment succeeds

echo "🤖 AI Crawler Optimization - Final Setup"
echo "========================================"

# Configuration
SITE_URL="${1:-https://bibliokit-launch.netlify.app}"
INDEXNOW_KEY="24afec510999470ea15cf47609985b3c"

echo "Site URL: $SITE_URL"
echo "IndexNow Key: $INDEXNOW_KEY"
echo ""

# Step 1: Verify deployment is live
echo "📡 Step 1: Checking Deployment Status"
echo "------------------------------------"
if curl -s "$SITE_URL" > /dev/null; then
    echo "✅ Site is live and accessible"
else
    echo "❌ Site not accessible - check Netlify deployment"
    exit 1
fi
echo ""

# Step 2: Verify core files are accessible
echo "📄 Step 2: Verifying Core Files"
echo "------------------------------"

# Check robots.txt
if curl -s "$SITE_URL/robots.txt" | grep -q "GPTBot"; then
    echo "✅ robots.txt deployed with AI bot permissions"
else
    echo "❌ robots.txt missing or incorrect"
fi

# Check llms.txt
if curl -s "$SITE_URL/llms.txt" | grep -q "BiblioKit"; then
    echo "✅ llms.txt AI sitemap deployed"
else
    echo "❌ llms.txt missing or incorrect"
fi

# Check IndexNow key
if curl -s "$SITE_URL/indexnow-key.txt" | grep -q "$INDEXNOW_KEY"; then
    echo "✅ IndexNow key file deployed correctly"
else
    echo "❌ IndexNow key file missing or incorrect"
fi
echo ""

# Step 3: Test edge function
echo "🤖 Step 3: Testing Bot Detection"
echo "-------------------------------"
BOT_RESPONSE=$(curl -s -H "User-Agent: GPTBot/1.0" "$SITE_URL/")
if echo "$BOT_RESPONSE" | grep -q "Secure API Management"; then
    echo "✅ Bot detection working - AI crawlers get static HTML"
else
    echo "⚠️  Bot detection may not be active yet (edge function deployment can take a few minutes)"
fi
echo ""

# Step 4: Environment variable instructions
echo "🔐 Step 4: Environment Variable Setup"
echo "------------------------------------"
echo "⚠️  MANUAL STEP REQUIRED:"
echo ""
echo "1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables"
echo "2. Click 'Add a variable'"
echo "3. Add this variable:"
echo ""
echo "   Key:   INDEXNOW_KEY"
echo "   Value: $INDEXNOW_KEY"
echo ""
echo "4. Click 'Save'"
echo "5. Redeploy your site (Deploys → Trigger deploy → Deploy site)"
echo ""

# Step 5: Test everything
echo "🧪 Step 5: Running Tests"
echo "-----------------------"
echo "Running comprehensive test suite..."
echo ""

if [ -f "./scripts/test-ai-crawlers.sh" ]; then
    ./scripts/test-ai-crawlers.sh "$SITE_URL"
else
    echo "Basic tests..."
    # Test GPTBot
    if curl -s -H "User-Agent: GPTBot/1.0" "$SITE_URL/" | grep -q "BiblioKit"; then
        echo "✅ GPTBot gets proper content"
    else
        echo "❌ GPTBot test failed"
    fi
fi

echo ""
echo "🎉 AI Crawler Optimization Complete!"
echo "===================================="
echo ""
echo "Your site is now optimized for AI discoverability! 🚀"
echo ""
echo "Next: Add the environment variable in Netlify Dashboard, then run:"
echo "  node scripts/trigger-indexnow.js $SITE_URL"
