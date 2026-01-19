#!/bin/bash

################################################################################
# Eksicode Telegram Bot - Production Deployment Script
################################################################################
#
# Usage:
#   ./deploy.sh [command]
#
# Commands:
#   start       - Build and start the bot in production mode
#   stop        - Stop the bot
#   restart     - Restart the bot
#   logs        - View bot logs (follow mode)
#   status      - Check bot status
#   health      - Check health status
#   monitor     - Open PM2 monitoring dashboard
#   backup      - Backup configuration and logs
#   clean       - Clean up old logs and unused images
#   rebuild     - Force rebuild and restart
#   help        - Show this help message
#
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="../docker-compose.yml"
SERVICE_NAME="telegrambot"
CONTAINER_NAME="eksicodeTelegramBot"

# Helper functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_info "Copy sample.env to .env and configure it:"
        print_info "  cp sample.env .env"
        print_info "  nano .env"
        exit 1
    fi
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed!"
        exit 1
    fi
}

# Command functions
cmd_start() {
    print_header "Starting Telegram Bot"
    check_env_file
    check_docker
    
    print_info "Building and starting services..."
    cd ..
    docker-compose up -d --build $SERVICE_NAME
    cd telegrambot
    
    sleep 5
    
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        print_success "Bot started successfully!"
        print_info "View logs: ./deploy.sh logs"
        print_info "Check status: ./deploy.sh status"
    else
        print_error "Failed to start bot!"
        print_info "Check logs: docker-compose logs $SERVICE_NAME"
        exit 1
    fi
}

cmd_stop() {
    print_header "Stopping Telegram Bot"
    
    cd ..
    docker-compose stop $SERVICE_NAME
    cd telegrambot
    
    print_success "Bot stopped successfully!"
}

cmd_restart() {
    print_header "Restarting Telegram Bot"
    
    cd ..
    docker-compose restart $SERVICE_NAME
    cd telegrambot
    
    print_success "Bot restarted successfully!"
    sleep 3
    cmd_status
}

cmd_logs() {
    print_header "Bot Logs (Ctrl+C to exit)"
    
    cd ..
    docker-compose logs -f --tail=100 $SERVICE_NAME
    cd telegrambot
}

cmd_status() {
    print_header "Bot Status"
    
    # Docker container status
    print_info "Container Status:"
    cd ..
    docker-compose ps $SERVICE_NAME
    cd telegrambot
    echo ""
    
    # PM2 process status
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        print_info "PM2 Processes:"
        docker exec $CONTAINER_NAME pm2 list
        echo ""
        
        print_info "Resource Usage:"
        docker stats $CONTAINER_NAME --no-stream
    else
        print_warning "Container is not running!"
    fi
}

cmd_health() {
    print_header "Health Check"
    
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        # PM2 health
        print_info "PM2 Health:"
        if docker exec $CONTAINER_NAME pm2 ping > /dev/null 2>&1; then
            print_success "PM2 is healthy"
        else
            print_error "PM2 is not responding!"
        fi
        echo ""
        
        # Docker health
        print_info "Docker Health:"
        health_status=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "no healthcheck")
        if [ "$health_status" == "healthy" ]; then
            print_success "Container is healthy"
        else
            print_warning "Container health: $health_status"
        fi
        echo ""
        
        # Redis connection
        print_info "Redis Connection:"
        if docker exec $CONTAINER_NAME sh -c 'node -e "const Redis = require(\"ioredis\"); const r = new Redis({host:\"redis\",port:6379,password:process.env.REDIS_PASSWORD}); r.ping().then(()=>{console.log(\"OK\");process.exit(0)}).catch(()=>process.exit(1));"' 2>/dev/null; then
            print_success "Redis connection OK"
        else
            print_error "Redis connection failed!"
        fi
        echo ""
        
        # Backend API connection
        print_info "Backend API Connection:"
        if docker exec $CONTAINER_NAME wget -q --spider http://backend:9000/health 2>/dev/null; then
            print_success "Backend API is reachable"
        else
            print_error "Backend API is not reachable!"
        fi
    else
        print_error "Container is not running!"
        exit 1
    fi
}

cmd_monitor() {
    print_header "PM2 Monitoring Dashboard (Ctrl+C to exit)"
    
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker exec -it $CONTAINER_NAME pm2 monit
    else
        print_error "Container is not running!"
        exit 1
    fi
}

cmd_backup() {
    print_header "Creating Backup"
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup .env
    if [ -f .env ]; then
        cp .env "$BACKUP_DIR/.env"
        print_success "Backed up .env"
    fi
    
    # Backup logs
    if [ -d logs ]; then
        tar -czf "$BACKUP_DIR/logs.tar.gz" logs/
        print_success "Backed up logs"
    fi
    
    # Backup PM2 logs from container
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker exec $CONTAINER_NAME pm2 save
        docker cp $CONTAINER_NAME:/var/bot/logs "$BACKUP_DIR/container_logs"
        print_success "Backed up container logs"
    fi
    
    print_success "Backup completed: $BACKUP_DIR"
}

cmd_clean() {
    print_header "Cleaning Up"
    
    print_info "Cleaning old logs..."
    if [ -d logs ]; then
        find logs -name "*.log" -mtime +7 -delete
        print_success "Removed logs older than 7 days"
    fi
    
    print_info "Cleaning Docker images..."
    cd ..
    docker-compose down --rmi local
    docker image prune -f
    cd telegrambot
    print_success "Cleaned unused Docker images"
    
    print_success "Cleanup completed!"
}

cmd_rebuild() {
    print_header "Rebuilding Bot"
    
    check_env_file
    
    print_info "Stopping and removing container..."
    cd ..
    docker-compose stop $SERVICE_NAME
    docker-compose rm -f $SERVICE_NAME
    
    print_info "Rebuilding from scratch..."
    docker-compose build --no-cache $SERVICE_NAME
    
    print_info "Starting bot..."
    docker-compose up -d $SERVICE_NAME
    cd telegrambot
    
    sleep 5
    print_success "Rebuild completed!"
    cmd_status
}

cmd_help() {
    cat << EOF
Eksicode Telegram Bot - Deployment Script

Usage:
  ./deploy.sh [command]

Commands:
  start       Build and start the bot in production mode
  stop        Stop the bot
  restart     Restart the bot
  logs        View bot logs (follow mode)
  status      Check bot status and PM2 processes
  health      Run health checks (PM2, Redis, Backend)
  monitor     Open PM2 monitoring dashboard (interactive)
  backup      Backup configuration and logs
  clean       Clean up old logs and unused Docker images
  rebuild     Force rebuild and restart (no cache)
  help        Show this help message

Examples:
  ./deploy.sh start          # Start the bot
  ./deploy.sh logs           # View logs in real-time
  ./deploy.sh status         # Check if everything is running
  ./deploy.sh health         # Run health checks
  ./deploy.sh backup         # Create a backup before updates

For more information, see PRODUCTION_DEPLOYMENT.md
EOF
}

# Main script
main() {
    case "${1:-}" in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        logs)
            cmd_logs
            ;;
        status)
            cmd_status
            ;;
        health)
            cmd_health
            ;;
        monitor)
            cmd_monitor
            ;;
        backup)
            cmd_backup
            ;;
        clean)
            cmd_clean
            ;;
        rebuild)
            cmd_rebuild
            ;;
        help|--help|-h)
            cmd_help
            ;;
        *)
            print_error "Unknown command: ${1:-}"
            echo ""
            cmd_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
