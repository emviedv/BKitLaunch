#!/bin/bash

# 🔍 BiblioKit Development Monitor
# This script helps monitor the development server and logs

echo "🔍 BiblioKit Development Monitor"
echo "================================"
echo ""

# Defaults can be overridden via env or CLI args per command
# DEV_PORT: external Netlify dev port; TARGET_PORT: Vite port proxied behind dev
DEV_PORT_DEFAULT=${BIBLIOKIT_DEV_PORT:-9989}
TARGET_PORT_DEFAULT=${BIBLIOKIT_TARGET_PORT:-9990}

# Helper to compute session name per port to avoid conflicts
get_session_name() {
    local port="$1"
    if [ -n "$BIBLIOKIT_SCREEN" ]; then
        echo "$BIBLIOKIT_SCREEN"
    else
        echo "bibliokit-dev-${port}"
    fi
}

# Check if server is running
check_server() {
    local port_to_check="${1:-$DEV_PORT_DEFAULT}"
    if curl -s --connect-timeout 2 http://localhost:${port_to_check} > /dev/null; then
        echo "✅ Server is running on http://localhost:${port_to_check}"
        return 0
    else
        echo "❌ Server is not responding on http://localhost:${port_to_check}"
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
    local port_arg="$1"
    local port_to_check="${port_arg:-$DEV_PORT_DEFAULT}"
    local session_name
    session_name="$(get_session_name "$port_to_check")"

    echo "📋 Current Development Status:"
    echo "------------------------------"
    
    # Check server
    check_server "$port_to_check"
    
    # Check screen sessions
    echo ""
    echo "🖥️  Active Screen Sessions:"
    screen -list 2>/dev/null || echo "No screen sessions found"
    
    # Indicate whether our target session exists
    if screen -list | grep -q "$session_name"; then
        echo "✅ Session '$session_name' is active"
    else
        echo "ℹ️  Session '$session_name' not found"
    fi
}

# Main menu
case "$1" in
    "status")
        # Optional: status [port]
        show_status "$2"
        ;;
    "monitor")
        # Optional: monitor [port]
        port_mon="${2:-$DEV_PORT_DEFAULT}"
        session_name="$(get_session_name "$port_mon")"
        monitor_functions() {
            echo "📊 Monitoring Netlify function calls..."
            echo "Press Ctrl+C to stop monitoring"
            echo ""
            screen -r "$session_name"
        }
        monitor_functions
        ;;
    "restart")
        # Usage: restart [devPort] [targetPort]
        dev_port="${2:-$DEV_PORT_DEFAULT}"
        target_port="${3:-$TARGET_PORT_DEFAULT}"
        session_name="$(get_session_name "$dev_port")"
        echo "🔄 Restarting development server on ports ${dev_port} → ${target_port} (session: ${session_name})..."
        screen -S "$session_name" -X quit 2>/dev/null || true
        sleep 1
        # Start without killing other processes; rely on unique port/session
        screen -dmS "$session_name" bash -c 'cd "/Users/emily/Products/BiblioKit Launch" && npx netlify dev --port '"$dev_port"' --targetPort '"$target_port"' --command "npm run dev -- --port '"$target_port"'"'
        # Give the server more time to boot on first run
        sleep 8
        check_server "$dev_port"
        ;;
    *)
        echo "Usage: $0 {status|monitor|restart} [port] [targetPort]"
        echo ""
        echo "Commands:"
        echo "  status [port]            - Show current development status for a port (default ${DEV_PORT_DEFAULT})"
        echo "  monitor [port]           - Attach to server output (live) for a port (default ${DEV_PORT_DEFAULT})"
        echo "  restart [port] [target]  - Restart dev server on custom ports without killing other servers"
        echo ""
        show_status "$2"
        ;;
esac