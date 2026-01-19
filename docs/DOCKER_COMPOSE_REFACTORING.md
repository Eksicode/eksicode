# Docker Compose Refactoring Summary

## Overview
Refactored `docker-compose.yml` to add Redis and Telegram Bot services with production-ready configurations.

## Changes Made

### 1. **Redis Service** (NEW)
- **Image**: `redis:7-alpine` (lightweight, production-ready)
- **Purpose**: Queue management for Telegram Bot (BullMQ) and potential caching
- **Features**:
  - Password-protected (configurable via `REDIS_PASSWORD` env var, defaults to `changeme`)
  - Persistent data storage with AOF (Append Only File) enabled
  - Memory limits: 2GB max with LRU eviction policy
  - Automatic snapshots for data durability
  - Health checks with authentication
  - Resource limits: 2 CPU cores max, 512MB reserved
  - Data persistence via named volume `redis_data`

**Configuration**:
- AOF persistence: `appendonly yes` with `everysec` sync
- Snapshot intervals:
  - After 900s if at least 1 key changed
  - After 300s if at least 10 keys changed
  - After 60s if at least 10000 keys changed

### 2. **Telegram Bot Service** (NEW)
- **Build**: Uses existing Dockerfile in `./telegrambot`
- **Purpose**: Runs the Telegram bot with queue-based command processing
- **Features**:
  - PM2 process manager for multiple bot processes
  - Redis integration for queue management
  - Environment variables for Redis connection
  - Queue system enabled by default (`ENABLE_QUEUE=true`)
  - Log persistence via named volume `telegrambot_logs`
  - Health checks using PM2 ping
  - Resource limits: 2 CPU cores max, 512MB reserved
  - Depends on Redis and Backend services

**Environment Variables**:
- `REDIS_HOST=redis` (service name in Docker network)
- `REDIS_PORT=6379`
- `REDIS_PASSWORD` (from environment or defaults to `changeme`)
- `ENABLE_QUEUE=true`
- `QUEUE_CONCURRENCY=10`
- `MAX_QUEUE_SIZE=1000`
- `WORKER_THREADS=4`

### 3. **Backend Service** (UPDATED)
- Added dependency on Redis service
- Waits for Redis to be healthy before starting
- No other changes to existing configuration

### 4. **Network Configuration** (UPDATED)
- Explicitly set network driver to `bridge` for better compatibility
- All services communicate via `eksicode_nw` network

### 5. **Volumes** (UPDATED)
- Added `redis_data` volume for Redis persistence
- Added `telegrambot_logs` volume for bot log persistence
- Both use `local` driver for data persistence

## Service Dependencies

```
redis (starts first)
  ↓
backend (waits for redis)
  ↓
telegrambot (waits for redis + backend)
  ↓
frontend (waits for backend)
  ↓
nginx (waits for backend + frontend)
```

## Environment Variables Required

### Root Level (for docker-compose.yml)
Create a `.env` file in the project root or set these environment variables:

```bash
REDIS_PASSWORD=your_secure_redis_password_here
```

### Telegram Bot Service
Ensure `./telegrambot/.env` contains:
```bash
BOT_TOKEN=your_telegram_bot_token
API_URL=http://backend:9000
API_USER=your_api_user
API_PASS=your_api_password
ADMIN_CH_ID=your_admin_channel_id
# ... other bot-specific variables
```

The following Redis variables are automatically set by docker-compose:
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`
- `REDIS_PASSWORD` (from root .env)
- `REDIS_DB=0`

## Production Deployment Checklist

1. **Set Secure Redis Password**:
   ```bash
   export REDIS_PASSWORD=$(openssl rand -base64 32)
   # Or add to .env file in project root
   ```

2. **Update Telegram Bot .env**:
   - Ensure `REDIS_HOST` is set to `redis` (or leave it - docker-compose sets it)
   - Verify all required bot tokens and API credentials

3. **Verify Volume Persistence**:
   - Redis data: `redis_data` volume
   - Bot logs: `telegrambot_logs` volume
   - Both persist across container restarts

4. **Resource Monitoring**:
   - Monitor Redis memory usage (2GB limit)
   - Monitor Telegram Bot CPU/memory usage
   - Adjust resource limits in `deploy.resources` if needed

5. **Health Checks**:
   - All services have health checks configured
   - Services wait for dependencies to be healthy before starting
   - Check logs if services fail to start: `docker-compose logs <service-name>`

## Usage

### Start all services:
```bash
docker-compose up -d
```

### Start specific services:
```bash
docker-compose up -d redis backend telegrambot
```

### View logs:
```bash
docker-compose logs -f telegrambot
docker-compose logs -f redis
```

### Stop services:
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes data):
```bash
docker-compose down -v
```

## Security Considerations

1. **Redis Password**: 
   - ⚠️ **IMPORTANT**: Change the default `changeme` password in production
   - Use a strong, randomly generated password
   - Store in secure environment variable or secrets management

2. **Network Isolation**:
   - All services communicate via internal Docker network
   - Redis port (6379) is exposed for debugging but should be firewalled in production
   - Consider removing port mapping in production if not needed

3. **Volume Security**:
   - Ensure proper file permissions on volumes
   - Consider using Docker secrets for sensitive data

## Troubleshooting

### Redis Connection Issues
- Check if Redis is healthy: `docker-compose ps redis`
- Verify password matches in all services
- Check Redis logs: `docker-compose logs redis`

### Telegram Bot Not Starting
- Verify Redis is running and healthy
- Check bot token is valid
- Review bot logs: `docker-compose logs telegrambot`
- Verify PM2 processes: `docker exec eksicodeTelegramBot pm2 list`

### Queue Not Working
- Ensure `ENABLE_QUEUE=true` in telegrambot environment
- Verify Redis connection in bot logs
- Check queue worker status in PM2

## Performance Tuning

### Redis
- Adjust `maxmemory` based on queue size requirements
- Tune snapshot intervals based on write frequency
- Monitor memory usage and adjust eviction policy if needed

### Telegram Bot
- Adjust `QUEUE_CONCURRENCY` based on message volume
- Tune `WORKER_THREADS` based on CPU availability
- Monitor PM2 process memory usage

## Next Steps

1. Set up monitoring for Redis and Telegram Bot
2. Configure log rotation for bot logs
3. Set up Redis backups for production
4. Consider Redis Sentinel for high availability (if needed)
5. Review and adjust resource limits based on actual usage
