# Telegram Bot - Quick Start Guide

## ⚡ Quick Commands

```bash
# First time setup
cd telegrambot
cp sample.env .env
nano .env              # Configure your bot token and settings
./deploy.sh start      # Deploy the bot

# Daily operations
./deploy.sh logs       # View logs
./deploy.sh status     # Check status
./deploy.sh restart    # Restart bot
./deploy.sh health     # Run health checks

# Monitoring
./deploy.sh monitor    # PM2 dashboard
docker stats eksicodeTelegramBot  # Resource usage

# Maintenance
./deploy.sh backup     # Create backup
./deploy.sh clean      # Clean old logs
./deploy.sh rebuild    # Full rebuild
```

## 📋 Required Configuration

Edit `.env` file with these required values:

```bash
# Get from @BotFather on Telegram
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Your admin channel ID (use @userinfobot to find)
ADMIN_CH_ID=-1001234567890

# Backend API credentials
API_URL=http://backend:9000
API_USER=your_username
API_PASS=your_password

# Redis password (must match docker-compose.yml)
REDIS_PASSWORD=changeme
```

## 🚀 Deployment Steps

### 1. Configure

```bash
cd telegrambot
cp sample.env .env
nano .env
```

### 2. Start

```bash
./deploy.sh start
```

### 3. Verify

```bash
./deploy.sh status
./deploy.sh health
```

### 4. Monitor

```bash
./deploy.sh logs
```

## 🔧 Common Tasks

### View Logs

```bash
# Follow logs in real-time
./deploy.sh logs

# View specific process
docker exec eksicodeTelegramBot pm2 logs eksicodeBot-user

# View last 100 lines
docker exec eksicodeTelegramBot pm2 logs --lines 100
```

### Check Status

```bash
# Overall status
./deploy.sh status

# PM2 processes
docker exec eksicodeTelegramBot pm2 list

# Resource usage
docker stats eksicodeTelegramBot --no-stream
```

### Restart Bot

```bash
# Restart all processes
./deploy.sh restart

# Restart specific process
docker exec eksicodeTelegramBot pm2 restart eksicodeBot-func
```

### Health Checks

```bash
# Run all health checks
./deploy.sh health

# Check PM2
docker exec eksicodeTelegramBot pm2 ping

# Check Redis
docker exec eksicodeRedis redis-cli -a changeme ping

# Check backend
curl http://localhost:9000/health
```

## 🐛 Troubleshooting

### Bot Not Responding

```bash
# 1. Check if running
./deploy.sh status

# 2. View logs for errors
./deploy.sh logs

# 3. Run health checks
./deploy.sh health

# 4. Restart
./deploy.sh restart
```

### Check Queue

```bash
# View queue length
docker exec eksicodeRedis redis-cli -a changeme LLEN bull:telegram:wait

# View queue jobs
docker exec eksicodeRedis redis-cli -a changeme KEYS "bull:telegram:*"
```

### High Memory Usage

```bash
# Check usage
docker stats eksicodeTelegramBot

# Restart processes
docker exec eksicodeTelegramBot pm2 restart all

# Or full restart
./deploy.sh restart
```

### View Error Logs

```bash
# PM2 error logs
docker exec eksicodeTelegramBot pm2 logs --err

# Container logs
docker logs eksicodeTelegramBot --tail 100

# Specific log file
docker exec eksicodeTelegramBot cat logs/func-error.log
```

## 📊 Monitoring Commands

### PM2 Monitoring

```bash
# Interactive dashboard
./deploy.sh monitor

# Process info
docker exec eksicodeTelegramBot pm2 show eksicodeBot-func

# Process list
docker exec eksicodeTelegramBot pm2 list
```

### Resource Monitoring

```bash
# Real-time stats
docker stats eksicodeTelegramBot

# Container inspect
docker inspect eksicodeTelegramBot

# Network info
docker network inspect eksicode_nw
```

### Log Files

```bash
# List log files
ls -lh telegrambot/logs/

# View specific log
tail -f telegrambot/logs/func-out.log

# Search for errors
grep -i error telegrambot/logs/*.log
```

## 🔄 Update & Maintenance

### Update Code

```bash
# 1. Backup first
./deploy.sh backup

# 2. Pull latest code
git pull

# 3. Rebuild
./deploy.sh rebuild
```

### Clean Up

```bash
# Clean logs and unused images
./deploy.sh clean

# Manual cleanup
find telegrambot/logs -name "*.log" -mtime +7 -delete
docker system prune -f
```

### Backup

```bash
# Create backup
./deploy.sh backup

# Backups saved to: telegrambot/backups/YYYYMMDD_HHMMSS/
```

## ⚙️ Configuration Tuning

### Low Traffic (< 100 messages/min)

```bash
# In .env
QUEUE_CONCURRENCY=5
WORKER_THREADS=2
```

### Medium Traffic (100-1000 messages/min)

```bash
# In .env
QUEUE_CONCURRENCY=10
WORKER_THREADS=4
```

### High Traffic (> 1000 messages/min)

```bash
# In .env
QUEUE_CONCURRENCY=20
WORKER_THREADS=8
```

## 🌐 Enable Webhooks (Optional)

### 1. Edit nginx config

```bash
nano nginx/nginx.conf
# Uncomment the webhook location block
```

### 2. Configure webhook

```bash
# In .env
TELEGRAM_WEBHOOK_URL=https://api-demo.eksicode.org/telegram/webhook
TELEGRAM_WEBHOOK_PORT=8080
```

### 3. Restart services

```bash
docker-compose restart nginx telegrambot
```

## 📚 Documentation

- **PRODUCTION_DEPLOYMENT.md** - Full deployment guide
- **PRODUCTION_SETUP_SUMMARY.md** - Setup summary
- **sample.env** - All configuration options
- **README.md** - Bot features and usage

## 🆘 Getting Help

1. Check logs: `./deploy.sh logs`
2. Run health check: `./deploy.sh health`
3. View status: `./deploy.sh status`
4. Read documentation: `PRODUCTION_DEPLOYMENT.md`

## 📝 Important Notes

- ⚠️ Always backup before updates: `./deploy.sh backup`
- ⚠️ Keep `.env` file secure (contains sensitive data)
- ⚠️ Monitor disk space (logs can grow large)
- ⚠️ Check health daily: `./deploy.sh health`
- ⚠️ Update dependencies monthly

## 🎯 Production Checklist

- [ ] Configure `.env` with real values
- [ ] Test bot responds to messages
- [ ] Verify Redis connection
- [ ] Verify backend API connection
- [ ] Setup monitoring alerts
- [ ] Schedule daily backups
- [ ] Document admin procedures
- [ ] Test restart procedures
- [ ] Monitor resource usage
- [ ] Setup log rotation

---

**Need More Help?** See `PRODUCTION_DEPLOYMENT.md` for detailed documentation.
