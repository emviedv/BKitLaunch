#!/bin/bash

echo "🚀 Starting BiblioKit Development Server"
echo "========================================="

# Clean environment
echo "🧹 Cleaning any remaining processes..."
pkill -f "netlify\|vite" 2>/dev/null || true
sleep 1

# Check that ports are free
echo "🔍 Checking ports..."
if lsof -i:8282 >/dev/null 2>&1; then
    echo "❌ Port 8282 is in use. Killing process..."
    lsof -ti:8282 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

echo "✅ Environment ready"
echo ""

# Start the server
echo "🌟 Starting Netlify Dev on port 8282..."
echo "📁 Project: BiblioKit Launch"
echo "🔗 URL will be: http://localhost:8282"
echo "🔑 Admin: http://localhost:8282/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================="

# Use exec to replace the shell process and avoid suspension
exec npx netlify dev --port 8282