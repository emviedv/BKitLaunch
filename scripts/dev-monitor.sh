#!/bin/bash

# 🔍 BiblioKit Development Monitor
# This script helps monitor the development server and logs

echo "🔍 BiblioKit Development Monitor"
echo "================================"
echo ""

# Check if server is running
check_server() {
    if curl -s --connect-timeout 2 http://localhost:9989 > /dev/null; then
        echo "✅ Server is running on http://localhost:9989"
        return 0
    else
        echo "❌ Server is not responding"
        return 1
    fi
}

# Monitor function logs
monitor_functions() {
    echo "📊 Monitoring Netlify function calls..."
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    
    # Attach to screen session to see live output
    screen -r bibliokit-dev
}

# Show current status
show_status() {
    echo "📋 Current Development Status:"
    echo "------------------------------"
    
    # Check server
    check_server
    
    # Check screen sessions
    echo ""
    echo "🖥️  Active Screen Sessions:"
    screen -list 2>/dev/null || echo "No screen sessions found"
    
    # Check recent function calls
    echo ""
    echo "🔧 Recent Function Activity:"
    echo "(Checking for admin-auth, content-management activity...)"
    
    # Show last few lines if we can access the screen session
    if screen -list | grep -q "bibliokit-dev"; then
        echo "✅ Development server session is active"
    else
        echo "❌ No active development server session"
    fi
}

# Main menu
case "$1" in
    "status")
        show_status
        ;;
    "monitor")
        monitor_functions
        ;;
    "restart")
        echo "🔄 Restarting development server..."
        screen -S bibliokit-dev -X quit 2>/dev/null || true
        sleep 2
        screen -dmS bibliokit-dev bash -c 'cd "/Users/emily/Products/BiblioKit Launch " && npx netlify dev'
        sleep 5
        check_server
        ;;
    *)
        echo "Usage: $0 {status|monitor|restart}"
        echo ""
        echo "Commands:"
        echo "  status  - Show current development status"
        echo "  monitor - Attach to server output (live monitoring)"
        echo "  restart - Restart the development server"
        echo ""
        show_status
        ;;
esac