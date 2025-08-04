#!/bin/bash

# BiblioKit Deployment Validation Script
# Tests that functions are properly deployed and accessible

set -e

SITE_URL="${1:-https://bibliokit-launch.netlify.app}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@bibliokit.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

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

# Test content-management function
echo "   Testing content-management function..."
CONTENT_RESPONSE=$(curl -s "$SITE_URL/.netlify/functions/content-management?action=current")
if echo "$CONTENT_RESPONSE" | grep -q "<!DOCTYPE html>"; then
    echo "❌ content-management function returning HTML (SPA fallback triggered)"
    echo "Response preview: $(echo "$CONTENT_RESPONSE" | head -c 100)..."
    exit 1
elif echo "$CONTENT_RESPONSE" | grep -q '"success"'; then
    echo "✅ content-management function returning JSON"
else
    echo "⚠️  content-management function response unclear:"
    echo "$CONTENT_RESPONSE" | head -c 200
fi

# Test admin-auth function
echo "   Testing admin-auth function..."
AUTH_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test@test.com\",\"password\":\"wrong\"}" \
    "$SITE_URL/.netlify/functions/admin-auth")

if echo "$AUTH_RESPONSE" | grep -q "<!DOCTYPE html>"; then
    echo "❌ admin-auth function returning HTML (SPA fallback triggered)"
    exit 1
elif echo "$AUTH_RESPONSE" | grep -q '"success"'; then
    echo "✅ admin-auth function returning JSON"
else
    echo "⚠️  admin-auth function response unclear:"
    echo "$AUTH_RESPONSE" | head -c 200
fi

# Test 3: Verify admin login works (if credentials provided)
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo ""
    echo "3. Testing admin authentication..."
    
    ADMIN_LOGIN_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
        "$SITE_URL/.netlify/functions/admin-auth")
    
    if echo "$ADMIN_LOGIN_RESPONSE" | grep -q '"success":true'; then
        echo "✅ Admin authentication successful"
        
        # Extract token for further tests
        TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$TOKEN" ]; then
            echo "✅ Admin token received"
            
            # Test authenticated content management
            echo "   Testing authenticated content management..."
            AUTH_CONTENT_RESPONSE=$(curl -s \
                -H "Authorization: Bearer $TOKEN" \
                "$SITE_URL/.netlify/functions/content-management?action=versions")
            
            if echo "$AUTH_CONTENT_RESPONSE" | grep -q '"success"'; then
                echo "✅ Authenticated content management working"
            else
                echo "⚠️  Authenticated content management unclear response"
            fi
        fi
    else
        echo "⚠️  Admin authentication failed (expected with test credentials)"
        echo "Response: $ADMIN_LOGIN_RESPONSE"
    fi
fi

# Test 4: Check database connectivity through functions
echo ""
echo "4. Testing database connectivity..."
DB_TEST_RESPONSE=$(curl -s "$SITE_URL/.netlify/functions/db-test")
if echo "$DB_TEST_RESPONSE" | grep -q "<!DOCTYPE html>"; then
    echo "❌ db-test function returning HTML"
elif echo "$DB_TEST_RESPONSE" | grep -q '"success"'; then
    echo "✅ Database test function accessible"
    if echo "$DB_TEST_RESPONSE" | grep -q '"connected":true'; then
        echo "✅ Database connection successful"
    else
        echo "⚠️  Database connection issues (may be expected if DB not configured)"
    fi
else
    echo "⚠️  Database test response unclear"
fi

echo ""
echo "=================================================="
echo "🎉 Deployment validation complete!"
echo ""
echo "Next steps:"
echo "1. Visit $SITE_URL to see your site"
echo "2. Visit $SITE_URL/admin to access admin dashboard"
echo "3. Check Netlify function logs if any issues persist"
echo ""
echo "If functions are still returning HTML, ensure:"
echo "- netlify.toml has the functions redirect rule"
echo "- Netlify build completed without function bundling errors"
echo "- Environment variables are properly set in Netlify dashboard"