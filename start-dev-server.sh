#!/bin/bash

echo "🚀 Starting BiblioKit Development Server"
echo "========================================="

# Clean environment
echo "🧹 Cleaning any remaining processes..."
pkill -f "netlify\|vite" 2>/dev/null || true
sleep 1

# Check that ports are free (using netlify.toml configured ports)
echo "🔍 Checking ports 5175 and 5176..."
if lsof -i:5175 >/dev/null 2>&1; then
    echo "❌ Port 5175 is in use. Killing process..."
    lsof -ti:5175 | xargs kill -9 2>/dev/null || true
    sleep 1
fi
if lsof -i:5176 >/dev/null 2>&1; then
    echo "❌ Port 5176 is in use. Killing process..."
    lsof -ti:5176 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

echo "✅ Environment ready"
echo ""

# Start the server using netlify.toml configuration
echo "🌟 Starting Netlify Dev (port 5175 → 5176)..."
echo "📁 Project: BiblioKit Launch"
echo "🔗 URL will be: http://localhost:5175"
echo "🔑 Admin: http://localhost:5175/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================="

# Use exec to replace the shell process - let netlify.toml drive the ports
exec npx netlify dev