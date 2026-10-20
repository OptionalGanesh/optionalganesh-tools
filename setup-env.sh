#!/usr/bin/env bash

# Setup script for local development environment

set -e

echo "=== Optional Ganesh Tools Setup ==="
echo "This repository primarily consists of static HTML tools."
echo "No heavy native dependencies are required."
echo ""

# Check for a way to serve local files
HAS_SERVER=false

echo "Checking for local server options..."

if command -v python3 &> /dev/null; then
    echo "✅ Python 3 is installed."
    HAS_SERVER=true
elif command -v python &> /dev/null; then
    echo "✅ Python is installed."
    HAS_SERVER=true
else
    echo "❌ Python is not installed."
fi

if command -v node &> /dev/null; then
    echo "✅ Node.js is installed."
    if command -v npx &> /dev/null; then
        HAS_SERVER=true
    fi
else
    echo "❌ Node.js is not installed."
fi

echo ""

if [ "$HAS_SERVER" = true ]; then
    echo "You are ready to run the project!"
    echo "You can serve the static files using one of the following commands:"
    echo ""
    echo "Using Python 3:"
    echo "  python3 -m http.server 8000"
    echo ""
    echo "Using Node.js (npx):"
    echo "  npx serve"
    echo ""
    echo "Then, open http://localhost:8000 (or the port specified by npx serve) in your browser."
else
    echo "⚠️  No simple local server found (Python or Node.js/npx)."
    echo "Please install Python 3 or Node.js to easily serve the static files locally."
fi

echo "==================================="
