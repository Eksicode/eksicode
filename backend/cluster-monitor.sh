#!/bin/bash

# Production Cluster Monitoring Script
# This script monitors the cluster health and provides insights

echo "🔍 EksiCode Backend Cluster Monitor"
echo "=================================="

# Check if the application is running
if ! pgrep -f "node.*server.js" > /dev/null; then
    echo "❌ No backend processes found"
    exit 1
fi

echo "📊 Process Information:"
echo "----------------------"

# Get master process
MASTER_PID=$(pgrep -f "node.*server.js" | head -n 1)
echo "🏭 Master Process: $MASTER_PID"

# Get worker processes
WORKER_PIDS=$(pgrep -f "node.*server.js" | tail -n +2)
WORKER_COUNT=$(echo "$WORKER_PIDS" | wc -l)
echo "👷 Worker Count: $WORKER_COUNT"

if [ "$WORKER_COUNT" -eq 0 ]; then
    echo "⚠️  No worker processes found - clustering may be disabled"
else
    echo "👷 Worker PIDs: $WORKER_PIDS"
fi

echo ""
echo "💾 Memory Usage:"
echo "---------------"

# Memory usage for each process
if [ ! -z "$MASTER_PID" ]; then
    MASTER_MEM=$(ps -p $MASTER_PID -o rss= 2>/dev/null)
    if [ ! -z "$MASTER_MEM" ]; then
        MASTER_MEM_MB=$((MASTER_MEM / 1024))
        echo "🏭 Master: ${MASTER_MEM_MB}MB"
    fi
fi

TOTAL_WORKER_MEM=0
for PID in $WORKER_PIDS; do
    if [ ! -z "$PID" ]; then
        WORKER_MEM=$(ps -p $PID -o rss= 2>/dev/null)
        if [ ! -z "$WORKER_MEM" ]; then
            WORKER_MEM_MB=$((WORKER_MEM / 1024))
            echo "👷 Worker $PID: ${WORKER_MEM_MB}MB"
            TOTAL_WORKER_MEM=$((TOTAL_WORKER_MEM + WORKER_MEM))
        fi
    fi
done

if [ "$TOTAL_WORKER_MEM" -gt 0 ]; then
    TOTAL_WORKER_MEM_MB=$((TOTAL_WORKER_MEM / 1024))
    echo "📊 Total Worker Memory: ${TOTAL_WORKER_MEM_MB}MB"
fi

echo ""
echo "🌐 Network Connections:"
echo "----------------------"

# Check listening ports
LISTENING=$(netstat -tlnp 2>/dev/null | grep :9000 | wc -l)
echo "📡 Listening on port 9000: $LISTENING connections"

# Active connections
CONNECTIONS=$(netstat -tnp 2>/dev/null | grep :9000 | grep ESTABLISHED | wc -l)
echo "🔗 Active connections: $CONNECTIONS"

echo ""
echo "📈 System Resources:"
echo "-------------------"

# CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
echo "🖥️  CPU Usage: ${CPU_USAGE}%"

# Memory usage
MEM_INFO=$(free -m | grep Mem:)
MEM_TOTAL=$(echo $MEM_INFO | awk '{print $2}')
MEM_USED=$(echo $MEM_INFO | awk '{print $3}')
MEM_PERCENT=$((MEM_USED * 100 / MEM_TOTAL))
echo "💾 Memory Usage: ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_PERCENT}%)"

# Load average
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}')
echo "⚖️  Load Average:$LOAD_AVG"

echo ""
echo "✅ Cluster monitoring complete"

# Health check
if [ "$WORKER_COUNT" -gt 0 ] && [ "$LISTENING" -gt 0 ]; then
    echo "🟢 Cluster Status: HEALTHY"
    exit 0
else
    echo "🟡 Cluster Status: WARNING"
    exit 1
fi
