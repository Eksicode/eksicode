# Telegram Bot - Production Deployment Guide

## Overview

This guide covers deploying the Eksicode Telegram Bot in a production environment using Docker, Redis queue management, and PM2 process management.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Compose                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Telegram   │─────▶│    Redis     │                    │
│  │     Bot      │      │    Queue     │                    │
│  │  (PM2 + 3    │      │  (BullMQ)    │                    │
│  │  processes)  │      └──────────────┘                    │
│  └──────┬───────┘              │                            │
│         │                      │                            │
│         ▼                      ▼                            │
│  ┌──────────────────────────────────┐                      │
│  │        Backend API               │                      │
│  │    (Eksicode Backend)            │                      │
│  └──────────────────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Telegram API   │
│   (Webhook or   │
│    Polling)     │
└─────────────────┘
```

## Features

### ✅ Production-Ready Features

- **Multi-Stage Docker Build**: Optimized image size with builder and runtime stages
- **PM2 Process Management**: 3 separate processes with auto-restart and monitoring
- **Redis Queue Integration**: BullMQ for reliable message processing
- **Worker Threads**: Concurrent processing of tasks
- **Health Checks**: Docker health checks using PM2 ping
- **Resource Limits**: CPU and memory constraints
- **Logging**: Structured logging with rotation
- **Security**: Non-root user, minimal dependencies
- **Signal Handling**: Proper shutdown with Tini init system

## Prerequisites

1. Docker and Docker Compose installed
2. Redis instance (included in docker-compose.yml)
3. Backend API running and accessible
4. Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Quick Start

### 1. Environment Configuration

Copy the sample environment file and configure it:

```bash
cd telegrambot
cp sample.env .env
```

Edit `.env` with your production values:

```bash
# Required: Bot token from @BotFather
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Required: Backend API endpoint
API_URL=http://backend:9000
API_USER=your_username
API_PASS=your_password

# Required: Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=changeme

# Required: Admin channel for notifications
ADMIN_CH_ID=-1001234567890
```

### 2. Build and Deploy

#### Development Mode

```bash
# Build and start all services
docker-compose up --build

# Or start only the telegrambot
docker-compose up --build telegrambot
```

#### Production Mode

```bash
# Build and start in detached mode
docker-compose up -d --build telegrambot

# View logs
docker-compose logs -f telegrambot

# Check status
docker-compose ps telegrambot
```

### 3. Verify Deployment

```bash
# Check PM2 processes
docker exec eksicodeTelegramBot pm2 list

# Check PM2 logs
docker exec eksicodeTelegramBot pm2 logs

# Check health status
docker exec eksicodeTelegramBot pm2 ping

# View specific process logs
docker exec eksicodeTelegramBot pm2 logs eksicodeBot-user
docker exec eksicodeTelegramBot pm2 logs eksicodeBot-func
docker exec eksicodeTelegramBot pm2 logs sourcess_controller
```

## Production Configuration

### Resource Allocation

Current limits (configured in `docker-compose.yml`):

```yaml
resources:
  limits:
    cpus: '2.0'
    memory: 2G
  reservations:
    cpus: '0.5'
    memory: 512M
```

Adjust based on your load:

- **Light load** (< 100 messages/min): 0.5 CPU, 512M RAM
- **Medium load** (100-1000 messages/min): 1.0 CPU, 1G RAM
- **Heavy load** (> 1000 messages/min): 2.0+ CPU, 2G+ RAM

### Queue Configuration

Optimize for your message volume:

```bash
# Low volume: Process sequentially
QUEUE_CONCURRENCY=2
WORKER_THREADS=2

# Medium volume: Balanced processing
QUEUE_CONCURRENCY=10
WORKER_THREADS=4

# High volume: Maximum throughput
QUEUE_CONCURRENCY=20
WORKER_THREADS=8
```

### PM2 Configuration

Three processes are managed by PM2:

1. **eksicodeBot-user** (`telegram.js`)
   - Main bot interface
   - Handles user interactions
   - Memory limit: 500M

2. **eksicodeBot-func** (`telegram_func.js`)
   - Background functions
   - Message processing
   - Memory limit: 800M

3. **sourcess_controller** (`sourcess_controller.js`)
   - Source monitoring
   - Cron jobs
   - Daily restart at 3 AM
   - Memory limit: 400M

## Polling vs. Webhook Mode

### Polling Mode (Default)

**Pros:**
- Simpler setup
- No external URL required
- Works behind NAT/firewall

**Cons:**
- Higher latency
- More resource usage
- Constant polling overhead

### Webhook Mode (Recommended for Production)

**Pros:**
- Lower latency
- Less resource usage
- Instant message delivery

**Cons:**
- Requires public HTTPS URL
- Needs nginx configuration

#### Enable Webhook Mode

1. **Update nginx configuration** (`nginx/nginx.conf`):

```nginx
# Uncomment the webhook location block
location /telegram/webhook {
  proxy_pass http://telegrambot:8080/webhook;
  # ... rest of configuration
}
```

2. **Update `.env`**:

```bash
TELEGRAM_WEBHOOK_URL=https://api-demo.eksicode.org/telegram/webhook
TELEGRAM_WEBHOOK_PORT=8080
TELEGRAM_WEBHOOK_PATH=/webhook
```

3. **Update `docker-compose.yml`** (if using webhook port):

```yaml
telegrambot:
  ports:
    - "8080:8080"  # Expose webhook port internally
```

4. **Restart services**:

```bash
docker-compose restart telegrambot nginx
```

## Monitoring & Maintenance

### Health Checks

Docker health check runs every 30 seconds:

```bash
# Check health status
docker inspect --format='{{json .State.Health}}' eksicodeTelegramBot | jq

# View health check logs
docker inspect eksicodeTelegramBot | jq '.[0].State.Health'
```

### Log Management

Logs are stored in the `logs/` directory:

```bash
# View PM2 logs
docker exec eksicodeTelegramBot pm2 logs --lines 100

# View specific process
docker exec eksicodeTelegramBot pm2 logs eksicodeBot-func --lines 50

# View Docker logs
docker-compose logs -f --tail=100 telegrambot

# Check log size
docker exec eksicodeTelegramBot du -sh /var/bot/logs/
```

### Performance Monitoring

```bash
# PM2 monitoring dashboard
docker exec -it eksicodeTelegramBot pm2 monit

# Process information
docker exec eksicodeTelegramBot pm2 show eksicodeBot-func

# Resource usage
docker stats eksicodeTelegramBot
```

### Backup & Recovery

#### Backup Configuration

```bash
# Backup environment file
cp telegrambot/.env telegrambot/.env.backup

# Backup logs (optional)
tar -czf logs-backup-$(date +%Y%m%d).tar.gz telegrambot/logs/
```

#### Recovery

```bash
# Restart all processes
docker exec eksicodeTelegramBot pm2 restart all

# Restart specific process
docker exec eksicodeTelegramBot pm2 restart eksicodeBot-user

# Full container restart
docker-compose restart telegrambot

# Rebuild and restart
docker-compose up -d --build --force-recreate telegrambot
```

## Troubleshooting

### Bot Not Responding

1. Check PM2 processes:
```bash
docker exec eksicodeTelegramBot pm2 list
```

2. Check logs for errors:
```bash
docker exec eksicodeTelegramBot pm2 logs --err
```

3. Verify Redis connection:
```bash
docker exec eksicodeTelegramBot node -e "const Redis = require('ioredis'); const redis = new Redis({host: 'redis', port: 6379, password: process.env.REDIS_PASSWORD}); redis.ping().then(r => console.log('Redis:', r)).catch(e => console.error('Error:', e));"
```

4. Verify backend connection:
```bash
docker exec eksicodeTelegramBot wget -O- http://backend:9000/health
```

### High Memory Usage

1. Check process memory:
```bash
docker exec eksicodeTelegramBot pm2 list
```

2. Adjust memory limits in `pm2.json`:
```json
"max_memory_restart": "500M"
```

3. Reduce concurrency:
```bash
QUEUE_CONCURRENCY=5
WORKER_THREADS=2
```

### Queue Backlog

1. Check Redis queue:
```bash
docker exec eksicodeRedis redis-cli -a changeme LLEN bull:telegram:wait
```

2. Increase concurrency temporarily:
```bash
# Edit .env
QUEUE_CONCURRENCY=20
WORKER_THREADS=8

# Restart
docker-compose restart telegrambot
```

### Connection Issues

1. Check network:
```bash
docker network inspect eksicode_nw
```

2. Test connectivity:
```bash
# Ping backend from bot container
docker exec eksicodeTelegramBot ping -c 3 backend

# Ping Redis
docker exec eksicodeTelegramBot ping -c 3 redis
```

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` file
- ✅ Use strong Redis password
- ✅ Rotate bot token periodically
- ✅ Restrict admin channel access

### 2. Network Security

- ✅ Use internal Docker network
- ✅ Don't expose unnecessary ports
- ✅ Enable webhook IP whitelist (if using webhooks)
- ✅ Use HTTPS for webhooks

### 3. Container Security

- ✅ Run as non-root user (nodejs:1001)
- ✅ Use minimal Alpine base image
- ✅ Regular security updates
- ✅ Resource limits configured

### 4. Redis Security

- ✅ Set strong password
- ✅ Use persistence (AOF + RDB)
- ✅ Limit memory usage
- ✅ Regular backups

## Performance Optimization

### 1. Redis Optimization

```bash
# In docker-compose.yml
--maxmemory 2gb
--maxmemory-policy allkeys-lru
--save 900 1 --save 300 10 --save 60 10000
```

### 2. Node.js Optimization

```bash
# Set appropriate heap size
NODE_OPTIONS=--max-old-space-size=1536

# Enable production mode
NODE_ENV=production
```

### 3. PM2 Optimization

- Use fork mode (1 instance per process)
- Set appropriate memory restart limits
- Configure cron restarts for memory leaks
- Enable log rotation

### 4. Queue Optimization

```bash
# Adjust based on load
QUEUE_CONCURRENCY=10        # Number of parallel jobs
WORKER_THREADS=4            # Worker thread pool
MAX_QUEUE_SIZE=1000         # Prevent queue overflow
QUEUE_RETRY_ATTEMPTS=3      # Failed job retries
```

## Scaling Considerations

### Horizontal Scaling

For very high load, consider:

1. **Multiple bot instances** (different bot tokens)
2. **Separate Redis instances** (queue sharding)
3. **Load balancer** for webhook mode
4. **Dedicated worker containers** for queue processing

### Vertical Scaling

Increase resources in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4.0'
      memory: 4G
```

## Maintenance Schedule

### Daily

- ✅ Check bot responsiveness
- ✅ Monitor error logs
- ✅ Verify queue processing

### Weekly

- ✅ Review resource usage
- ✅ Check log file sizes
- ✅ Verify backup integrity
- ✅ Update dependencies (if needed)

### Monthly

- ✅ Security updates
- ✅ Performance optimization
- ✅ Clean old logs
- ✅ Review and optimize queue settings

## Support & Resources

- **Documentation**: See `README.md` for basic usage
- **Analysis**: See `ANALYSIS.md` for code structure
- **Multithreading**: See `MULTITHREADING_PLAN.md` for architecture
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md` for features

## Version History

- **v2.0.0** - Production-ready with Redis queue and PM2
- **v1.0.0** - Initial release

---

**Last Updated**: January 2026
**Maintained by**: Eksicode Team
