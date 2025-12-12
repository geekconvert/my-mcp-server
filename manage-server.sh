#!/bin/bash

# manage-server.sh - Script to manage the MCP server

case "$1" in
  start)
    echo "🚀 Starting MCP server..."
    cd "$(dirname "$0")"
    nohup node simple-mcp-server.mjs > simple-server.log 2>&1 &
    echo $! > server.pid
    echo "✅ Server started on http://localhost:3001/mcp"
    echo "📋 PID: $(cat server.pid)"
    ;;
  stop)
    echo "🛑 Stopping MCP server..."
    if [ -f server.pid ]; then
      kill $(cat server.pid) 2>/dev/null
      rm server.pid
      echo "✅ Server stopped"
    else
      echo "❌ Server PID file not found"
      pkill -f "node simple-mcp-server.mjs"
    fi
    ;;
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
  status)
    if [ -f server.pid ] && kill -0 $(cat server.pid) 2>/dev/null; then
      echo "✅ Server is running (PID: $(cat server.pid))"
    else
      echo "❌ Server is not running"
    fi
    ;;
  test)
    echo "🧪 Testing MCP server..."
    node test-mcp.mjs
    ;;
  logs)
    echo "📋 Server logs:"
    tail -f simple-server.log
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|test|logs}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the MCP server"
    echo "  stop    - Stop the MCP server"
    echo "  restart - Restart the MCP server"
    echo "  status  - Check server status"
    echo "  test    - Run tests against the server"
    echo "  logs    - Show server logs"
    exit 1
    ;;
esac