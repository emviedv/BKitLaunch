#!/bin/bash

# Kill any existing processes
pkill -f "netlify\|vite" 2>/dev/null || true
sleep 2

echo "Starting BiblioKit development server on port 8282..."

# Start netlify dev with proper stdin/stdout handling
nohup npx netlify dev --port 8282 </dev/null > server.log 2>&1 &
SERVER_PID=$!

echo "Server starting with PID: $SERVER_PID"
echo "Waiting for server to be ready..."

# Wait for server to be ready
for i in {1..30}; do
    if curl -s http://localhost:8282 > /dev/null 2>&1; then
        echo "✅ Server ready at http://localhost:8282"
        echo "✅ Admin panel: http://localhost:8282/admin"
        echo ""
        echo "To view logs: tail -f server.log"
        echo "To stop server: pkill -f 'netlify dev'"
        exit 0
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

echo "❌ Server failed to start. Check server.log for details:"
tail -20 server.log
exit 1