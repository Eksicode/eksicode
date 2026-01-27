#!/bin/bash

# Deploy to Testing Server
# Server: root@65.21.61.151
# Path: /home/eksicode/

set -e

# Configuration
SSH_HOST="root@65.21.61.151"
REMOTE_PATH="/home/eksicode"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse arguments
SERVICES=""
SKIP_RESTART=false
BRANCH="main"

show_help() {
    echo "Usage: $0 [OPTIONS] [SERVICES...]"
    echo ""
    echo "Deploy to testing server (${SSH_HOST})"
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -b, --branch     Git branch to pull (default: main)"
    echo "  --skip-restart   Only pull code, don't restart containers"
    echo ""
    echo "Services (optional, deploys all if none specified):"
    echo "  admin            Deploy admin panel only"
    echo "  backend          Deploy backend only"
    echo "  frontend         Deploy frontend only"
    echo ""
    echo "Examples:"
    echo "  $0                    Deploy all services"
    echo "  $0 admin              Deploy only admin panel"
    echo "  $0 admin backend      Deploy admin and backend"
    echo "  $0 -b develop admin   Deploy admin from develop branch"
    echo "  $0 --skip-restart     Pull code without restarting"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        --skip-restart)
            SKIP_RESTART=true
            shift
            ;;
        admin|backend|frontend)
            SERVICES="$SERVICES $1"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Default to all services if none specified
if [ -z "$SERVICES" ]; then
    SERVICES="admin backend frontend"
fi

log_info "Starting deployment to testing server..."
log_info "Branch: $BRANCH"
log_info "Services: $SERVICES"

# Check SSH connection
log_info "Checking SSH connection..."
if ! ssh -o ConnectTimeout=5 "$SSH_HOST" "echo 'Connected'" &>/dev/null; then
    log_error "Cannot connect to $SSH_HOST"
    exit 1
fi
log_info "SSH connection OK"

# Pull latest code on server
log_info "Pulling latest code from git..."

ssh "$SSH_HOST" << ENDSSH
    set -e
    cd $REMOTE_PATH

    echo "Current branch:"
    git branch --show-current

    echo "Stashing any local changes..."
    git stash --include-untracked || true

    echo "Fetching latest..."
    git fetch origin

    echo "Checking out $BRANCH..."
    git checkout $BRANCH

    echo "Pulling latest changes..."
    git pull origin $BRANCH

    echo "Latest commit:"
    git log -1 --oneline
ENDSSH

if [ "$SKIP_RESTART" = true ]; then
    log_info "Code pulled. Skipping container restart (--skip-restart)"
    exit 0
fi

# Build and restart containers
log_info "Building and restarting containers on server..."

# Determine which containers to restart
CONTAINERS=""
for service in $SERVICES; do
    case $service in
        admin)
            CONTAINERS="$CONTAINERS admin"
            ;;
        backend)
            CONTAINERS="$CONTAINERS backend"
            ;;
        frontend)
            CONTAINERS="$CONTAINERS frontend"
            ;;
    esac
done

ssh "$SSH_HOST" << ENDSSH
    set -e
    cd $REMOTE_PATH

    echo "Building containers: $CONTAINERS"
    docker-compose build --no-cache $CONTAINERS

    echo "Restarting containers..."
    docker-compose up -d $CONTAINERS

    echo "Cleaning up old images..."
    docker image prune -f

    echo ""
    echo "Container status:"
    docker-compose ps $CONTAINERS
ENDSSH

log_info "Deployment complete!"
log_info "Services deployed:"
for service in $SERVICES; do
    case $service in
        admin)
            echo "  - Admin: https://admin.eksicode.org"
            ;;
        backend)
            echo "  - API: https://api.eksicode.org"
            ;;
        frontend)
            echo "  - Frontend: https://eksicode.org"
            ;;
    esac
done
