#!/bin/bash

# EksiCode - Nginx Fix Deployment Script
# This script fixes the nginx DNS resolution issue on production server

set -e  # Exit on error

echo "=================================="
echo "EksiCode Nginx Fix Deployment"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "Step 1: Uploading fixed nginx configuration..."
# This will be run on local machine to upload to production
# Uncomment and modify if needed:
# scp nginx/nginx.conf user@your-server:/opt/eksicode/nginx/nginx.conf

echo "Step 2: Uploading SSL certificates..."
# Uncomment and modify if needed:
# scp nginx/eksicode.crt user@your-server:/opt/eksicode/nginx/
# scp nginx/eksicode.key user@your-server:/opt/eksicode/nginx/

echo "Step 3: Checking container status..."
docker-compose ps

echo ""
echo "Step 4: Checking which containers are unhealthy..."
UNHEALTHY=$(docker-compose ps --filter "health=unhealthy" -q)
if [ ! -z "$UNHEALTHY" ]; then
    echo "⚠️  Warning: Some containers are unhealthy!"
    docker-compose ps --filter "health=unhealthy"
fi

echo ""
echo "Step 5: Restarting services in correct order..."

# Stop nginx first
echo "  - Stopping nginx..."
docker-compose stop nginx

# Restart backend if needed
echo "  - Ensuring backend is healthy..."
docker-compose up -d backend
sleep 5

# Restart frontend if needed
echo "  - Ensuring frontend is healthy..."
docker-compose up -d frontend
sleep 5

# Restart admin if needed
echo "  - Ensuring admin is healthy..."
docker-compose up -d admin
sleep 5

# Start nginx with new configuration
echo "  - Starting nginx with fixed configuration..."
docker-compose up -d nginx

echo ""
echo "Step 6: Waiting for services to be ready..."
sleep 10

echo ""
echo "Step 7: Checking service health..."
docker-compose ps

echo ""
echo "Step 8: Checking nginx logs..."
docker-compose logs nginx --tail 20

echo ""
echo "Step 9: Testing endpoints..."
echo "  - Testing backend health..."
if curl -f http://localhost:9000/health > /dev/null 2>&1; then
    echo "    ✓ Backend is responding"
else
    echo "    ✗ Backend is not responding"
fi

echo "  - Testing frontend..."
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "    ✓ Frontend is responding"
else
    echo "    ✗ Frontend is not responding"
fi

echo "  - Testing admin..."
if curl -f http://localhost:3001/ > /dev/null 2>&1; then
    echo "    ✓ Admin is responding"
else
    echo "    ✗ Admin is not responding"
fi

echo ""
echo "=================================="
echo "Deployment Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Check if your site is accessible: https://demo.eksicode.org"
echo "2. Monitor logs: docker-compose logs -f"
echo "3. If issues persist, check individual service logs:"
echo "   - docker-compose logs frontend"
echo "   - docker-compose logs backend"
echo "   - docker-compose logs nginx"
echo ""
