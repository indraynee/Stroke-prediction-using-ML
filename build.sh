#!/usr/bin/env bash
# Build script for Render deployment
# This runs during the Build phase on Render
set -e

echo "=== Installing backend dependencies ==="
cd backend
pip install -r requirements.txt

echo "=== Installing frontend dependencies ==="
cd ../frontend
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Copying frontend build to backend ==="
cp -r dist ../backend/dist

echo "=== Build complete ==="
