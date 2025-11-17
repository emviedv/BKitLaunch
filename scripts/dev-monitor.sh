#!/bin/bash

# 🔍 BiblioKit Development Monitor
# This script helps monitor the development server and logs

echo "🔍 BiblioKit Development Monitor"
echo "================================"
echo ""

# Defaults can be overridden via env or CLI args per command
# DEV_PORT: external Netlify dev port; TARGET_PORT: Vite port proxied behind dev
DEV_PORT_DEFAULT=${BIBLIOKIT_DEV_PORT:-9989}
TARGET_PORT_DEFAULT=${BIBLIOKIT_TARGET_PORT:-53173}

# Helper to compute session name per port to avoid conflicts
get_session_name() {
    local port="$1"
    if [ -n "$BIBLIOKIT_SCREEN" ]; then
        echo "$BIBLIOKIT_SCREEN"
    else
        echo "bibliokit-dev-${port}"
    fi
}

# Check if a TCP port is currently listening
is_port_listening() {
    local port_to_check="$1"
    if lsof -tiTCP:"${port_to_check}" -sTCP:LISTEN >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Find a free target port, starting from provided base and stepping by 2 (to keep odd/even pairing)
find_free_target_port() {
    local start_port="$1"
    local attempts=10
    local candidate="$start_port"
    for _ in $(seq 1 ${attempts}); do
        if ! is_port_listening "$candidate"; then
            echo "$candidate"
            return 0
        fi
        candidate=$((candidate + 2))
    done
    # If none free in range, fall back to start_port anyway (caller decides what to do)
    echo "$start_port"
}

# Poll the dev server until it responds or we time out
wait_for_server_ready() {
    local port_to_check="$1"
    local attempts="${2:-20}"
    local delay="${3:-1}"
    for i in $(seq 1 ${attempts}); do
        if curl -s --connect-timeout 2 http://localhost:"${port_to_check}" >/dev/null; then
            echo "✅ Server is running on http://localhost:${port_to_check}"
            return 0
        fi
        echo "⏳ Waiting for server on port ${port_to_check}... (${i}/${attempts})"
        sleep "${delay}"
    done
    echo "❌ Server did not become ready on http://localhost:${port_to_check} after $((attempts * delay))s"
    return 1
}

# Stop only the specified dev/target ports and the matching screen session
stop_server() {
    local dev_port_stop="${1:-$DEV_PORT_DEFAULT}"
    local target_port_stop="${2:-$TARGET_PORT_DEFAULT}"
    local session_name_stop
    session_name_stop="$(get_session_name "$dev_port_stop")"

    echo "🛑 Stopping server on ports ${dev_port_stop} → ${target_port_stop} (session: ${session_name_stop})..."
    # Kill only processes listening on our known dev/target ports
    for p in $(lsof -tiTCP:${dev_port_stop} -sTCP:LISTEN 2>/dev/null); do kill -9 "$p" 2>/dev/null || true; done
    for p in $(lsof -tiTCP:${target_port_stop} -sTCP:LISTEN 2>/dev/null); do kill -9 "$p" 2>/dev/null || true; done
    # Kill screen session if exists
    screen -S "$session_name_stop" -X quit 2>/dev/null || true
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

# Monitor function logs for computed session
monitor_functions() {
    local session_name_mon="$1"
    echo "📊 Monitoring Netlify function calls (session: ${session_name_mon})..."
    echo "Press Ctrl+C to stop monitoring"
    echo ""
    screen -r "$session_name_mon"
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
        monitor_functions "$session_name"
        ;;
    "stop")
        # Usage: stop [devPort] [targetPort]
        dev_port_stop="${2:-$DEV_PORT_DEFAULT}"
        target_port_stop="${3:-$TARGET_PORT_DEFAULT}"
        stop_server "$dev_port_stop" "$target_port_stop"
        check_server "$dev_port_stop"
        ;;
    "restart")
        # Usage: restart [devPort] [targetPort]
        dev_port="${2:-$DEV_PORT_DEFAULT}"
        target_port="${3:-$TARGET_PORT_DEFAULT}"
        session_name="$(get_session_name "$dev_port")"
        echo "🔄 Restarting development server (session: ${session_name})..."

        # Choose a free targetPort automatically if the requested one is occupied
        chosen_target_port="$target_port"
        if is_port_listening "$target_port"; then
            local_free_port="$(find_free_target_port "$target_port")"
            if [ "$local_free_port" != "$target_port" ]; then
                echo "ℹ️  Target port ${target_port} is busy. Falling back to ${local_free_port} to avoid killing unrelated processes."
                chosen_target_port="$local_free_port"
            else
                echo "⚠️  Target port ${target_port} is busy and no alternative was found in range; will attempt to free it."
            fi
        fi

        echo "🔧 Using ports: ${dev_port} → ${chosen_target_port}"

        # Stop only our dev/target ports and matching session (avoid killing unrelated processes)
        stop_server "$dev_port" "$chosen_target_port"
        sleep 1

        # Prepare logging directory and file path
        mkdir -p logs 2>/dev/null || true
        log_file="logs/${session_name}_$(date +%Y%m%d-%H%M%S).log"

        # Start with strict Vite port to keep proxy stable, capture logs by redirecting within the screen command
        screen -dmS "$session_name" bash -lc 'cd "/Users/emily/Products/BiblioKit Launch" && npx netlify dev --port '"$dev_port"' --targetPort '"$chosen_target_port"' --command "npm run dev -- --port '"$chosen_target_port"' --strictPort" >> '"$log_file"' 2>&1'

        echo "🗒️  Logging to: $log_file (use: tail -f $log_file)"
        # Wait and verify readiness with polling
        wait_for_server_ready "$dev_port" 30 1
        ;;
    *)
        echo "Usage: $0 {status|monitor|restart} [port] [targetPort]"
        echo ""
        echo "Commands:"
        echo "  status [port]            - Show current development status for a port (default ${DEV_PORT_DEFAULT})"
        echo "  monitor [port]           - Attach to server output (live) for a port (default ${DEV_PORT_DEFAULT})"
        echo "  stop [port] [target]     - Stop dev server for a port pair (default ${DEV_PORT_DEFAULT} → ${TARGET_PORT_DEFAULT})"
        echo "  restart [port] [target]  - Restart dev server; auto-falls back to a free target port if needed"
        echo ""
        show_status "$2"
        ;;
esac
