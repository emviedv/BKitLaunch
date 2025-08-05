#!/bin/bash

# BiblioKit SSR Validation Script
echo "🔍 BiblioKit SSR Implementation Validation"
echo "=========================================="

# Check build outputs
echo ""
echo "📦 Build Structure Validation:"
echo "------------------------------"

if [ -d "dist/client" ]; then
    echo "✅ Client build directory exists"
    if [ -f "dist/client/index.html" ]; then
        echo "✅ Client HTML template exists"
    else
        echo "❌ Client HTML template missing"
    fi
    
    if [ -d "dist/client/assets" ]; then
        echo "✅ Client assets directory exists"
        asset_count=$(find dist/client/assets -name "*.js" -o -name "*.css" | wc -l)
        echo "   - Found $asset_count client assets"
    else
        echo "❌ Client assets missing"
    fi
else
    echo "❌ Client build directory missing"
fi

if [ -d "dist/server" ]; then
    echo "✅ Server build directory exists"
    if [ -f "dist/server/entry-server.js" ]; then
        echo "✅ Server entry point exists"
        server_size=$(du -h dist/server/entry-server.js | cut -f1)
        echo "   - Server bundle size: $server_size"
    else
        echo "❌ Server entry point missing"
    fi
else
    echo "❌ Server build directory missing"
fi

# Check edge function
echo ""
echo "⚡ Edge Function Validation:"
echo "---------------------------"

if [ -f "netlify/edge-functions/ssr.ts" ]; then
    echo "✅ SSR edge function exists"
else
    echo "❌ SSR edge function missing"
fi

# Check configuration files
echo ""
echo "⚙️  Configuration Validation:"
echo "-----------------------------"

if grep -q "edge_functions.*netlify/edge-functions" netlify.toml; then
    echo "✅ Edge functions directory configured"
else
    echo "❌ Edge functions directory not configured"
fi

if grep -q "publish.*dist/client" netlify.toml; then
    echo "✅ Publish directory configured correctly"
else
    echo "❌ Publish directory not configured correctly"
fi

if grep -q "build:client.*--ssrManifest" package.json; then
    echo "✅ SSR manifest build configured"
else
    echo "❌ SSR manifest build not configured"
fi

if grep -q "build:server.*--ssr.*entry-server" package.json; then
    echo "✅ Server build configured"
else
    echo "❌ Server build not configured"
fi

# Check SEO system
echo ""
echo "🔍 SEO System Validation:"
echo "-------------------------"

if [ -f "src/lib/seo.ts" ]; then
    echo "✅ SEO metadata system exists"
else
    echo "❌ SEO metadata system missing"
fi

if [ -f "src/hooks/useSEO.ts" ]; then
    echo "✅ Client-side SEO hook exists"
else
    echo "❌ Client-side SEO hook missing"
fi

# Check entry points
echo ""
echo "🚀 Entry Points Validation:"
echo "---------------------------"

if [ -f "src/entry-client.tsx" ]; then
    echo "✅ Client entry point exists"
else
    echo "❌ Client entry point missing"
fi

if [ -f "src/entry-server.tsx" ]; then
    echo "✅ Server entry point exists"
else
    echo "❌ Server entry point missing"
fi

# Summary
echo ""
echo "📊 Validation Summary:"
echo "====================="

# Count checkmarks
checks_total=11
checks_passed=$(echo "
dist/client exists: $([ -d 'dist/client' ] && echo 1 || echo 0)
dist/client/index.html exists: $([ -f 'dist/client/index.html' ] && echo 1 || echo 0)
dist/server exists: $([ -d 'dist/server' ] && echo 1 || echo 0)
dist/server/entry-server.js exists: $([ -f 'dist/server/entry-server.js' ] && echo 1 || echo 0)
edge function exists: $([ -f 'netlify/edge-functions/ssr.ts' ] && echo 1 || echo 0)
edge functions configured: $(grep -q 'edge_functions.*netlify/edge-functions' netlify.toml && echo 1 || echo 0)
publish dir configured: $(grep -q 'publish.*dist/client' netlify.toml && echo 1 || echo 0)
SSR manifest configured: $(grep -q 'build:client.*--ssrManifest' package.json && echo 1 || echo 0)
server build configured: $(grep -q 'build:server.*--ssr.*entry-server' package.json && echo 1 || echo 0)
SEO system exists: $([ -f 'src/lib/seo.ts' ] && echo 1 || echo 0)
entry points exist: $([ -f 'src/entry-client.tsx' ] && [ -f 'src/entry-server.tsx' ] && echo 1 || echo 0)
" | grep -o '1' | wc -l)

echo "✅ Checks passed: $checks_passed/$checks_total"

if [ "$checks_passed" -eq "$checks_total" ]; then
    echo "🎉 SSR implementation is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Netlify staging environment"
    echo "2. Test with: curl -H 'User-Agent: Googlebot' https://your-domain.com/"
    echo "3. Validate SEO with Google Rich Results Test"
    echo "4. Check social media previews"
    echo "5. Deploy to production"
else
    echo "⚠️  Some checks failed. Please review the issues above."
fi