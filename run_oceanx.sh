#!/usr/bin/env bash
# ==============================================================================
# OCEANX — Virtual Ocean Observation & Autonomous Decision Simulator
# Smart India Hackathon 2026 | Problem Statement 26065
# Team: Coders May Cry (CMC)
# ==============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "=================================================================="
echo " Starting OCEANX — Virtual Ocean Observation & Decision Simulator"
echo " Problem Statement ID: 26065 | Theme: Robotics & Drones          "
echo " Team: Coders May Cry (CMC)                                      "
echo "=================================================================="

# Check for framework python or python3
if [ -f "/Library/Frameworks/Python.framework/Versions/3.14/bin/python3" ]; then
    PY_BIN="/Library/Frameworks/Python.framework/Versions/3.14/bin/python3"
elif command -v python3 &>/dev/null; then
    PY_BIN="python3"
else
    echo "Error: python3 not found!"
    exit 1
fi

echo ">> Initializing SQLite database and telemetry tables..."
$PY_BIN "$BACKEND_DIR/database/db.py"

echo ">> Starting Python Backend Server on port 8000..."
$PY_BIN "$BACKEND_DIR/main.py" &
BACKEND_PID=$!

echo ">> Starting Frontend Development Server on port 5173..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Trap exit signals to shut down both cleanly
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'OceanX servers stopped.'; exit 0" INT TERM EXIT

echo "=================================================================="
echo " OceanX is now running!"
echo " Frontend:  http://localhost:5173"
echo " Backend:   http://localhost:8000/api/sensors"
echo " Press Ctrl+C to terminate both servers."
echo "=================================================================="

wait
