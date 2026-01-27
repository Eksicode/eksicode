#!/bin/bash

################################################################################
# Eksicode - Server Deployment Script
################################################################################
#
# Usage:
#   ./deploy-test.sh [command]
#
# Commands:
#   deploy      - Full deployment (pull + rebuild all)
#   update      - Quick update (pull + restart without prune)
#   down        - Stop all services
#   up          - Start services without rebuild
#   logs        - View logs (follow mode)
#   status      - Check service status
#   clean       - Clean up Docker resources
#   help        - Show this help message
#
################################################################################

set -e

# Configuration
PROJECT_PATH="/home/eksicode"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_project_path() {
    if [ ! -d "$PROJECT_PATH" ]; then
        log_error "Project path not found: $PROJECT_PATH"
        exit 1
    fi
    cd "$PROJECT_PATH"
}

# Full deployment - pull, prune, rebuild
cmd_deploy() {
    print_header "Full Deployment"
    check_project_path

    log_info "Branch: $BRANCH"
    log_info "Starting full deployment..."

    echo ""
    echo "========== Git Pull =========="
    echo "Stashing local changes..."
    git stash --include-untracked || true

    echo "Pulling latest from $BRANCH..."
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH

    echo "Latest commit:"
    git log -1 --oneline

    echo ""
    echo "========== Docker Down =========="
    docker compose down --remove-orphans --volumes || true

    echo "Removing any lingering containers..."
    docker rm -f eksicodeBackend eksicodeAdmin eksicodeFrontend eksicodeNginx eksicodeRedis eksicodeTelegramBot 2>/dev/null || true

    echo ""
    echo "========== Docker Prune =========="
    echo "Pruning all unused containers..."
    docker container prune --force

    echo "Pruning all unused images..."
    docker system prune --all --force

    echo "Pruning unused volumes..."
    docker volume prune --force

    echo ""
    echo "========== Docker Build & Up =========="
    docker compose -f docker-compose.yml up --build -d

    echo ""
    echo "========== Status =========="
    docker compose ps

    log_info "Deployment complete!"
}

# Quick update - pull and restart without full prune
cmd_update() {
    print_header "Quick Update"
    check_project_path

    log_info "Branch: $BRANCH"
    log_info "Starting quick update..."

    echo ""
    echo "========== Git Pull =========="
    git stash --include-untracked || true
    git pull origin $BRANCH

    echo "Latest commit:"
    git log -1 --oneline

    echo ""
    echo "========== Docker Rebuild =========="
    docker compose up --build -d

    echo ""
    echo "========== Cleanup =========="
    docker image prune -f

    echo ""
    echo "========== Status =========="
    docker compose ps

    log_info "Update complete!"
}

# Stop all services
cmd_down() {
    print_header "Stopping Services"
    check_project_path

    docker compose down --remove-orphans
    echo "All services stopped."

    log_info "Services stopped."
}

# Start services without rebuild
cmd_up() {
    print_header "Starting Services"
    check_project_path

    docker compose up -d
    docker compose ps

    log_info "Services started."
}

# View logs
cmd_logs() {
    print_header "Service Logs (Ctrl+C to exit)"
    check_project_path

    SERVICE="$1"
    if [ -n "$SERVICE" ]; then
        docker compose logs -f --tail=100 "$SERVICE"
    else
        docker compose logs -f --tail=100
    fi
}

# Check status
cmd_status() {
    print_header "Service Status"
    check_project_path

    echo "========== Container Status =========="
    docker compose ps

    echo ""
    echo "========== Resource Usage =========="
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

    echo ""
    echo "========== Disk Usage =========="
    df -h | grep -E "^/dev|Filesystem"

    echo ""
    echo "========== Docker Disk Usage =========="
    docker system df
}

# Clean Docker resources
cmd_clean() {
    print_header "Cleaning Docker Resources"

    log_warn "This will remove all unused Docker resources!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Pruning containers..."
        docker container prune --force

        echo "Pruning system..."
        docker system prune --all --force

        echo "Pruning volumes..."
        docker volume prune --force

        echo ""
        echo "Disk usage after cleanup:"
        docker system df

        log_info "Cleanup complete!"
    else
        log_info "Cleanup cancelled."
    fi
}

# Show help
cmd_help() {
    cat << EOF
Eksicode - Server Deployment Script

Usage:
  ./deploy-test.sh [command] [options]

Commands:
  deploy          Full deployment: git pull + docker prune + rebuild all
  update          Quick update: git pull + rebuild (no prune)
  down            Stop all services
  up              Start services without rebuild
  logs [service]  View logs (optionally for specific service)
  status          Check service status and resource usage
  clean           Clean up unused Docker resources (interactive)
  help            Show this help message

Options:
  -b, --branch    Git branch to deploy (default: main)

Examples:
  ./deploy-test.sh deploy              # Full deployment from main branch
  ./deploy-test.sh deploy -b develop   # Full deployment from develop branch
  ./deploy-test.sh update              # Quick update
  ./deploy-test.sh logs backend        # View backend logs
  ./deploy-test.sh status              # Check everything

Project Path: $PROJECT_PATH
EOF
}

# Parse arguments
COMMAND=""
SERVICE_ARG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        deploy|update|down|up|status|clean|help)
            COMMAND="$1"
            shift
            ;;
        logs)
            COMMAND="logs"
            shift
            SERVICE_ARG="$1"
            shift || true
            ;;
        -h|--help)
            cmd_help
            exit 0
            ;;
        *)
            if [ -z "$COMMAND" ]; then
                log_error "Unknown option: $1"
                cmd_help
                exit 1
            fi
            shift
            ;;
    esac
done

# Execute command
case "${COMMAND:-help}" in
    deploy)
        cmd_deploy
        ;;
    update)
        cmd_update
        ;;
    down)
        cmd_down
        ;;
    up)
        cmd_up
        ;;
    logs)
        cmd_logs "$SERVICE_ARG"
        ;;
    status)
        cmd_status
        ;;
    clean)
        cmd_clean
        ;;
    help)
        cmd_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        cmd_help
        exit 1
        ;;
esac
