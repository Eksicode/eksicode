#!/bin/bash

# ============================================================================
# EksiCode - Container Deployment Diagnostic & Fix Script
# ============================================================================

set -e  # Exit on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "============================================================================"
echo "EksiCode - Container Deployment Diagnostic & Fix"
echo "============================================================================"
echo ""

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✓${NC} $message"
            ;;
        "error")
            echo -e "${RED}✗${NC} $message"
            ;;
        "warning")
            echo -e "${YELLOW}⚠${NC} $message"
            ;;
        "info")
            echo -e "${BLUE}ℹ${NC} $message"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_status "error" "docker-compose.yml not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

print_status "info" "Checking project structure..."

# ============================================================================
# Step 1: Check for missing .env files
# ============================================================================
echo ""
echo "Step 1: Checking for missing environment files..."
echo "------------------------------------------------------------"

MISSING_ENV=0

# Check backend .env
if [ ! -f "backend/.env" ]; then
    print_status "error" "backend/.env is missing"
    MISSING_ENV=1
else
    print_status "success" "backend/.env exists"
fi

# Check frontend .env
if [ ! -f "frontend/.env" ]; then
    print_status "error" "frontend/.env is missing"
    MISSING_ENV=1
else
    print_status "success" "frontend/.env exists"
fi

# Check admin .env
if [ ! -f "admin/.env" ]; then
    print_status "error" "admin/.env is missing"
    MISSING_ENV=1
else
    print_status "success" "admin/.env exists"
fi

# Check telegrambot .env
if [ ! -f "telegrambot/.env" ]; then
    print_status "error" "telegrambot/.env is missing"
    MISSING_ENV=1
else
    print_status "success" "telegrambot/.env exists"
fi

# Check root .env (for Redis password)
if [ ! -f ".env" ]; then
    print_status "warning" ".env (root) is missing - will create default"
    echo "REDIS_PASSWORD=changeme" > .env
    print_status "success" "Created .env with default Redis password"
fi

# ============================================================================
# Step 2: Check SSL certificates
# ============================================================================
echo ""
echo "Step 2: Checking SSL certificates..."
echo "------------------------------------------------------------"

if [ ! -f "nginx/eksicode.crt" ]; then
    print_status "error" "nginx/eksicode.crt is missing"
    print_status "info" "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/eksicode.key -out nginx/eksicode.crt \
        -subj "/C=TR/ST=Istanbul/L=Istanbul/O=Eksicode/OU=IT/CN=demo.eksicode.org" \
        2>/dev/null
    print_status "success" "Generated self-signed SSL certificates"
else
    print_status "success" "SSL certificates exist"
fi

# ============================================================================
# Step 3: Check if containers are built
# ============================================================================
echo ""
echo "Step 3: Checking Docker containers..."
echo "------------------------------------------------------------"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_status "error" "Docker is not running!"
    echo "Please start Docker and run this script again."
    exit 1
fi

print_status "success" "Docker is running"

# Check container status
echo ""
print_status "info" "Current container status:"
docker-compose ps

# ============================================================================
# Step 4: Create minimal .env files if missing
# ============================================================================
if [ $MISSING_ENV -eq 1 ]; then
    echo ""
    echo "Step 4: Creating minimal .env files..."
    echo "------------------------------------------------------------"
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        print_status "warning" "Creating frontend/.env from sample.env"
        if [ -f "frontend/sample.env" ]; then
            cp frontend/sample.env frontend/.env
            print_status "success" "Created frontend/.env"
            print_status "warning" "IMPORTANT: Edit frontend/.env and configure production values!"
        else
            print_status "error" "frontend/sample.env not found"
        fi
    fi
    
    # Admin .env
    if [ ! -f "admin/.env" ]; then
        print_status "warning" "Creating admin/.env"
        cat > admin/.env << 'EOF'
PUBLIC_API_URL=http://backend:9000
NODE_ENV=production
PORT=3001
HOSTNAME=0.0.0.0
BACKEND_URL=http://backend:9000
EOF
        print_status "success" "Created admin/.env"
    fi
    
    # Telegrambot .env
    if [ ! -f "telegrambot/.env" ]; then
        print_status "warning" "Creating telegrambot/.env from sample.env"
        if [ -f "telegrambot/sample.env" ]; then
            cp telegrambot/sample.env telegrambot/.env
            print_status "success" "Created telegrambot/.env"
            print_status "warning" "IMPORTANT: Edit telegrambot/.env and add BOT_TOKEN!"
        else
            print_status "error" "telegrambot/sample.env not found"
        fi
    fi
fi

# ============================================================================
# Step 5: Check individual container logs
# ============================================================================
echo ""
echo "Step 5: Checking container logs for errors..."
echo "------------------------------------------------------------"

check_container_logs() {
    local container=$1
    local service=$2
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo ""
        print_status "info" "Last 20 lines of $service logs:"
        docker logs $container --tail 20 2>&1 | tail -20
        
        # Check for common errors
        if docker logs $container 2>&1 | grep -qi "error\|fatal\|exception\|failed"; then
            print_status "error" "$service has errors in logs"
        else
            print_status "success" "$service logs look okay"
        fi
    else
        print_status "warning" "$service container ($container) not found"
    fi
}

check_container_logs "eksicodeBackend" "Backend"
check_container_logs "eksicodeFrontend" "Frontend"
check_container_logs "eksicodeAdmin" "Admin"
check_container_logs "eksicodeTelegramBot" "Telegram Bot"
check_container_logs "eksicodeNginx" "Nginx"

# ============================================================================
# Step 6: Recommendations
# ============================================================================
echo ""
echo "============================================================================"
echo "Diagnostic Complete - Recommendations:"
echo "============================================================================"
echo ""

if [ $MISSING_ENV -eq 1 ]; then
    print_status "warning" "Environment files were missing and have been created"
    echo ""
    echo "IMPORTANT: You must configure these files:"
    echo "  1. frontend/.env - Set NEXT_PUBLIC_API_URL and other production values"
    echo "  2. admin/.env - Already configured for Docker network"
    echo "  3. telegrambot/.env - Add your BOT_TOKEN and other credentials"
    echo "  4. backend/.env - Ensure DATABASE_URL and AWS credentials are set"
    echo ""
    print_status "info" "After configuring .env files, run:"
    echo "  docker-compose down"
    echo "  docker-compose up -d --build"
    echo ""
fi

echo "Common issues and solutions:"
echo ""
echo "1. Frontend not starting:"
echo "   - Check frontend/.env has correct NEXT_PUBLIC_API_URL"
echo "   - Check: docker-compose logs frontend"
echo "   - Solution: docker-compose up -d --build frontend"
echo ""
echo "2. Admin not starting:"
echo "   - Check admin/.env has PUBLIC_API_URL=http://backend:9000"
echo "   - Check: docker-compose logs admin"
echo "   - Solution: docker-compose up -d --build admin"
echo ""
echo "3. Telegram Bot not starting:"
echo "   - Check telegrambot/.env has BOT_TOKEN"
echo "   - Check: docker-compose logs telegrambot"
echo "   - Solution: docker-compose restart telegrambot"
echo ""
echo "4. Nginx showing 'host not found':"
echo "   - Ensure nginx/nginx.conf has been updated with DNS resolver"
echo "   - Check: docker-compose logs nginx"
echo "   - Solution: docker-compose restart backend frontend admin nginx"
echo ""
echo "5. Database connection errors:"
echo "   - Check backend/.env has correct DATABASE_URL"
echo "   - Ensure PostgreSQL is accessible"
echo "   - Test: psql \$DATABASE_URL -c 'SELECT 1;'"
echo ""

echo "============================================================================"
echo "Next Steps:"
echo "============================================================================"
echo ""
echo "1. Review and edit all .env files with your production values"
echo "2. Run: docker-compose down"
echo "3. Run: docker-compose up -d --build"
echo "4. Monitor: docker-compose logs -f"
echo "5. Check: docker-compose ps (all should be 'Up' and 'healthy')"
echo ""

print_status "info" "For detailed deployment guide, see: PRODUCTION_DEPLOYMENT_GUIDE.md"
print_status "info" "For nginx fix details, see: NGINX_FIX_SUMMARY.md"

echo ""
echo "============================================================================"
