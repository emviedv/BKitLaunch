#!/bin/bash

echo "🔍 Testing Cache Fix Implementation"
echo "=================================="

# Check if server is running
if curl -s http://localhost:9989/ > /dev/null; then
    echo "✅ Server is responding on port 9989"
    
    # Test cache headers
    echo ""
    echo "📊 Cache Headers Analysis:"
    echo "-------------------------"
    
    HEADERS=$(curl -I http://localhost:9989/ 2>/dev/null)
    
    # Check for our new cache control settings
    if echo "$HEADERS" | grep -q "Cache-Control.*max-age=60"; then
        echo "✅ Cache-Control updated: max-age reduced to 60 seconds"
    elif echo "$HEADERS" | grep -q "Cache-Control.*max-age=300"; then
        echo "❌ Still using old cache-control: max-age=300 (5 minutes)"
    else
        echo "⚠️  Cache-Control header not found or different"
    fi
    
    # Check for ETag header
    if echo "$HEADERS" | grep -q "ETag.*ssr-"; then
        echo "✅ Content-based ETag implemented"
    else
        echo "❌ Content-based ETag missing"
    fi
    
    # Check for content hash debug header
    if echo "$HEADERS" | grep -q "X-Content-Hash"; then
        echo "✅ Content hash debug header present"
    else
        echo "❌ Content hash debug header missing"
    fi
    
    # Check for SSR header
    if echo "$HEADERS" | grep -q "X-SSR-Generated"; then
        echo "✅ SSR debug header present"
    else
        echo "❌ SSR debug header missing"
    fi
    
    echo ""
    echo "📋 Full Headers:"
    echo "---------------"
    echo "$HEADERS" | grep -E "(Cache-Control|ETag|X-Content-Hash|X-SSR-Generated)"
    
else
    echo "❌ Server not responding on port 9989"
    echo "💡 Try running: npm run netlify:dev"
fi

echo ""
echo "🎯 Expected Results After Fix:"
echo "- Cache-Control: max-age=60, s-maxage=120 (1-2 min instead of 5-10 min)"
echo "- ETag: Content-based for automatic invalidation"
echo "- X-Content-Hash: Debug tracking of content versions"
echo "- No more cache flashing when content is published"