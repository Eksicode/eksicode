# EksiCode - Production Deployment Guide

**Version:** 1.0.0  
**Last Updated:** January 19, 2026  
**Target Environment:** Production Server (Linux)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Server Requirements](#server-requirements)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)
6. [Installation Steps](#installation-steps)
7. [Service Configuration](#service-configuration)
8. [Database Setup](#database-setup)
9. [SSL/TLS Configuration](#ssltls-configuration)
10. [Deployment Process](#deployment-process)
11. [Post-Deployment Verification](#post-deployment-verification)
12. [Monitoring & Maintenance](#monitoring--maintenance)
13. [Troubleshooting](#troubleshooting)
14. [Backup & Recovery](#backup--recovery)
15. [Security Best Practices](#security-best-practices)
16. [Performance Optimization](#performance-optimization)
17. [Rollback Procedures](#rollback-procedures)

---

## System Overview

EksiCode is a full-stack web application consisting of:

- **Frontend**: Next.js 16 application (Port 3000)
- **Backend**: Node.js/Express API with clustering (Port 9000)
- **Admin Panel**: SvelteKit admin dashboard
- **Telegram Bot**: PM2-managed bot with queue system
- **Database**: PostgreSQL
- **Cache/Queue**: Redis 7
- **Reverse Proxy**: Nginx with SSL

---

## Architecture

### Service Architecture

```
Internet
    ↓
Nginx (80/443) ← SSL Termination
    ↓
    ├─→ Frontend (3000) ← Next.js
    │       ↓
    └─→ Backend (9000) ← Express API (Clustered)
            ↓
        ┌───┴───┐
        ↓       ↓
    Redis (6379)  PostgreSQL (5432)
        ↓
    Telegram Bot
```

### Component Communication

- **Frontend → Backend**: HTTP/HTTPS via Nginx
- **Backend → Database**: PostgreSQL connection pool
- **Backend → Redis**: Queue management, caching
- **Telegram Bot → Backend**: REST API calls
- **Telegram Bot → Redis**: Message queue (BullMQ)

---

## Prerequisites

### Required Software

1. **Operating System**: Linux (Ubuntu 20.04+ or Debian 11+)
2. **Docker**: Version 20.10+
3. **Docker Compose**: Version 2.0+
4. **Git**: Version 2.25+
5. **Node.js**: Version 20+ (for local testing)
6. **PostgreSQL**: Version 14+ (external database)

### Required Accounts & Credentials

- PostgreSQL database credentials
- AWS account (for S3 media storage)
- Email service credentials (Yandex/AWS SES)
- Telegram Bot token
- SSL certificates (Let's Encrypt or commercial)
- Domain names configured with DNS

---

## Server Requirements

### Minimum Requirements (Small Deployment)

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 10Mbps
- **Concurrent Users**: ~100

### Recommended Requirements (Medium Deployment)

- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 100Mbps
- **Concurrent Users**: ~500

### High-Performance Requirements (Large Deployment)

- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 100GB+ SSD
- **Network**: 1Gbps
- **Concurrent Users**: 1000+

### Port Requirements

| Service | Port | Access |
|---------|------|--------|
| Nginx | 80 | Public |
| Nginx | 443 | Public |
| Frontend | 3000 | Internal |
| Backend | 9000 | Internal |
| PostgreSQL | 5432 | External/Internal |
| Redis | 6379 | Internal |

---

## Pre-Deployment Checklist

### 1. Domain & DNS Configuration

- [ ] Domain name registered
- [ ] DNS A record pointing to server IP
- [ ] Subdomain for API (e.g., api-demo.eksicode.org)
- [ ] Subdomain for frontend (e.g., demo.eksicode.org)
- [ ] DNS propagation verified (24-48 hours)

### 2. SSL Certificates

- [ ] SSL certificates obtained (Let's Encrypt or commercial)
- [ ] Certificate files: `eksicode.crt` and `eksicode.key`
- [ ] Certificates placed in `nginx/` directory
- [ ] Certificate expiration date noted (for renewal)

### 3. Database Preparation

- [ ] PostgreSQL server installed and running
- [ ] Database created
- [ ] Database user created with proper permissions
- [ ] Connection string tested
- [ ] Backup strategy defined

### 4. Cloud Services Setup

- [ ] AWS S3 bucket created for media storage
- [ ] AWS IAM credentials configured
- [ ] Email service credentials obtained
- [ ] Telegram Bot created and token obtained

### 5. Server Preparation

- [ ] Server provisioned (VPS/dedicated)
- [ ] Firewall configured (UFW/iptables)
- [ ] SSH access secured (key-based)
- [ ] Docker and Docker Compose installed
- [ ] Required ports opened

---

## Installation Steps

### Step 1: Server Initial Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget apt-transport-https ca-certificates \
    software-properties-common ufw

# Configure firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Step 2: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/eksicode
sudo chown $USER:$USER /opt/eksicode

# Clone repository
cd /opt/eksicode
git clone <repository-url> .

# Or if using deploy key
eval "$(ssh-agent -s)"
ssh-add /path/to/deploy_key
git clone git@github.com:your-org/eksicode.git .
```

### Step 4: Configure Environment Variables

#### Backend Environment (`backend/.env`)

```bash
# Copy sample environment
cd /opt/eksicode/backend
cp sample.env .env

# Edit configuration
nano .env
```

**Backend .env Configuration:**

```env
# Application
NODE_ENV=production
PORT=9000

# Database (Use external PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/eksicode?connection_limit=10"

# Security
JWT_SECRET="<generate-strong-random-secret>"
AUTHENTICATION_CODE_SECRET_KEY="<generate-strong-random-secret>"

# AWS Configuration
AWS_ACCESS_KEY=<your-aws-access-key>
AWS_SECRET_KEY=<your-aws-secret-key>
AWS_SES_REGION=eu-central-1
AWS_SES_MAIL_SOURCE=noreply@yourdomain.com
AWS_S3_REGION=eu-central-1

# Email Service (Yandex or AWS SES)
EMAIL_SERVICE=Yandex
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>

# CORS Configuration
ALLOWED_ORIGINS=https://demo.eksicode.org,https://api-demo.eksicode.org
ALLOWED_REDIRECT_URLS=https://demo.eksicode.org

# Frontend Host
FRONTEND_HOST=https://demo.eksicode.org
```

**Generate Secrets:**

```bash
# Generate JWT secret
openssl rand -base64 64

# Generate authentication code secret
openssl rand -hex 32
```

#### Frontend Environment (`frontend/.env`)

```bash
cd /opt/eksicode/frontend
cp sample.env .env
nano .env
```

**Frontend .env Configuration:**

```env
# Environment
NODE_ENV=production
PORT=3000

# URLs
NEXT_PUBLIC_URL=https://demo.eksicode.org
NEXT_PUBLIC_API_URL=http://backend:9000
HOSTNAME=0.0.0.0

# NextAuth
NEXTAUTH_SECRET=<generate-strong-random-secret>

# reCAPTCHA (optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your-site-key>
RECAPTCHA_SECRET_KEY=<your-secret-key>

# Media
NEXT_PUBLIC_MEDIA_URL=https://your-bucket.s3.eu-central-1.amazonaws.com/

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

#### Telegram Bot Environment (`telegrambot/.env`)

```bash
cd /opt/eksicode/telegrambot
cp sample.env .env
nano .env
```

**Telegram Bot .env Configuration:**

```env
# Bot Configuration
BOT_TOKEN=<your-telegram-bot-token>
API_URL=http://backend:9000
API_USER=<api-username>
API_PASS=<api-password>
ADMIN_CH_ID=<admin-channel-id>

# Social Links
DISCORD_URL=https://discord.gg/your-server
YOUTUBE_URL=https://youtube.com/@yourchannel
GITHUB_URL=https://github.com/your-org
TWITTER_URL=https://twitter.com/youraccount
ANNOUNCEMENT_CHANNEL_URL=https://t.me/yourchannel

# Redis Configuration (set by docker-compose)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<will-be-set-by-docker-compose>
REDIS_DB=0

# Queue Configuration
ENABLE_QUEUE=true
QUEUE_CONCURRENCY=10
MAX_QUEUE_SIZE=1000
WORKER_THREADS=4
```

#### Root Environment (`.env` in project root)

```bash
cd /opt/eksicode
nano .env
```

**Root .env Configuration:**

```env
# Redis Password (for docker-compose)
REDIS_PASSWORD=<generate-strong-redis-password>
```

**Generate Redis Password:**

```bash
openssl rand -base64 32
```

---

## Service Configuration

### Backend Configuration

**Clustering Settings (for docker-compose.yml):**

```yaml
environment:
  - NODE_ENV=production
  - ENABLE_CLUSTERING=true
  - MAX_WORKERS=4  # Adjust based on CPU cores
  - NODE_OPTIONS=--max-old-space-size=2048
```

**Adjust workers based on server size:**

- **2 CPU cores**: `MAX_WORKERS=2`
- **4 CPU cores**: `MAX_WORKERS=4`
- **8+ CPU cores**: `MAX_WORKERS=6-8`

### Nginx Configuration

**SSL Certificate Setup:**

```bash
# Place SSL certificates
cp your-certificate.crt /opt/eksicode/nginx/eksicode.crt
cp your-private-key.key /opt/eksicode/nginx/eksicode.key

# Set proper permissions
chmod 644 /opt/eksicode/nginx/eksicode.crt
chmod 600 /opt/eksicode/nginx/eksicode.key
```

**Update Domain Names:**

Edit `/opt/eksicode/nginx/nginx.conf`:

```nginx
# Update server_name directives
server_name demo.eksicode.org;  # Frontend
server_name api-demo.eksicode.org;  # Backend
```

### Docker Resource Limits

**Adjust resource limits in `docker-compose.yml`:**

For **Small Server (2 cores, 4GB RAM)**:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 2G
      reservations:
        cpus: '1.0'
        memory: 1G
```

For **Medium Server (4 cores, 8GB RAM)**:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '4.0'
        memory: 4G
      reservations:
        cpus: '2.0'
        memory: 2G
```

---

## Database Setup

### Step 1: Database Migration

```bash
cd /opt/eksicode/backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify migrations
npx prisma migrate status
```

### Step 2: Seed Database

```bash
# Seed initial data
npm run seed

# Or manual seeding
npx tsx prisma/seeders/index.ts
```

**Seed Data Includes:**

- Default roles (superadmin, admin, moderator, user)
- Permissions
- Default admin user
- Sample content (optional)

### Step 3: Verify Database

```bash
# Connect to database
psql -h <host> -U <username> -d eksicode

# Check tables
\dt

# Verify data
SELECT * FROM roles;
SELECT * FROM permissions;
SELECT * FROM users LIMIT 5;

# Exit
\q
```

---

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install -y certbot

# Stop nginx temporarily
docker-compose stop nginx

# Generate certificates
sudo certbot certonly --standalone -d demo.eksicode.org -d api-demo.eksicode.org

# Copy certificates
sudo cp /etc/letsencrypt/live/demo.eksicode.org/fullchain.pem \
    /opt/eksicode/nginx/eksicode.crt
sudo cp /etc/letsencrypt/live/demo.eksicode.org/privkey.pem \
    /opt/eksicode/nginx/eksicode.key

# Set permissions
sudo chown $USER:$USER /opt/eksicode/nginx/eksicode.*
chmod 644 /opt/eksicode/nginx/eksicode.crt
chmod 600 /opt/eksicode/nginx/eksicode.key

# Start nginx
docker-compose start nginx
```

**Setup Auto-Renewal:**

```bash
# Create renewal script
sudo nano /opt/eksicode/renew-ssl.sh
```

```bash
#!/bin/bash
docker-compose -f /opt/eksicode/docker-compose.yml stop nginx
certbot renew
cp /etc/letsencrypt/live/demo.eksicode.org/fullchain.pem \
    /opt/eksicode/nginx/eksicode.crt
cp /etc/letsencrypt/live/demo.eksicode.org/privkey.pem \
    /opt/eksicode/nginx/eksicode.key
docker-compose -f /opt/eksicode/docker-compose.yml start nginx
```

```bash
# Make executable
sudo chmod +x /opt/eksicode/renew-ssl.sh

# Add to crontab (runs monthly)
sudo crontab -e
0 3 1 * * /opt/eksicode/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
```

### Option 2: Commercial Certificate

```bash
# Copy your certificate files
cp your-certificate.crt /opt/eksicode/nginx/eksicode.crt
cp your-private-key.key /opt/eksicode/nginx/eksicode.key

# If you have intermediate certificates, concatenate them
cat your-certificate.crt intermediate.crt > /opt/eksicode/nginx/eksicode.crt

# Set permissions
chmod 644 /opt/eksicode/nginx/eksicode.crt
chmod 600 /opt/eksicode/nginx/eksicode.key
```

---

## Deployment Process

### Step 1: Build and Start Services

```bash
cd /opt/eksicode

# Build all services
docker-compose build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

**Service Start Order:**

1. Redis (starts first)
2. Backend (waits for Redis)
3. Telegram Bot (waits for Redis & Backend)
4. Frontend (waits for Backend)
5. Nginx (waits for Backend & Frontend)

### Step 2: Monitor Service Health

```bash
# Check service status
docker-compose ps

# Expected output - all services should be "Up" and "healthy"
```

### Step 3: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f telegrambot
docker-compose logs -f redis
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Backend health
curl http://localhost:9000/health

# Frontend health
curl http://localhost:3000/

# Check via public URL
curl https://demo.eksicode.org
curl https://api-demo.eksicode.org/health
```

**Expected Responses:**

- Backend: `{"status": "ok"}` or similar
- Frontend: HTML page
- Both: HTTP 200 status

### 2. Service Verification

```bash
# Check all containers are running
docker-compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' eksicodeBackend
docker inspect --format='{{.State.Health.Status}}' eksicodeFrontend
docker inspect --format='{{.State.Health.Status}}' eksicodeRedis
docker inspect --format='{{.State.Health.Status}}' eksicodeTelegramBot

# Expected: "healthy"
```

### 3. Backend Cluster Monitoring

```bash
# Run cluster monitor
docker exec eksicodeBackend /app/cluster-monitor.sh
```

**Expected Output:**

- Master process running
- Worker processes (2-8 depending on configuration)
- Memory usage per process
- Network connections
- System resources

### 4. Database Connection

```bash
# Check backend database connection
docker-compose logs backend | grep -i "database\|prisma\|connected"

# Should see successful connection messages
```

### 5. Redis Connection

```bash
# Connect to Redis CLI
docker exec -it eksicodeRedis redis-cli -a <your-redis-password>

# Test connection
127.0.0.1:6379> PING
# Expected: PONG

# Check keys
127.0.0.1:6379> KEYS *

# Exit
127.0.0.1:6379> EXIT
```

### 6. SSL Certificate Verification

```bash
# Check certificate
openssl s_client -connect demo.eksicode.org:443 -servername demo.eksicode.org

# Check expiration date
echo | openssl s_client -connect demo.eksicode.org:443 2>/dev/null | \
    openssl x509 -noout -dates
```

### 7. Functional Testing

**Frontend Tests:**

- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Posts page loads
- [ ] Post creation works
- [ ] Search functionality works

**Backend API Tests:**

```bash
# Test public endpoint
curl https://api-demo.eksicode.org/health

# Test authentication
curl -X POST https://api-demo.eksicode.org/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test protected endpoint
curl https://api-demo.eksicode.org/users \
  -H "Authorization: Bearer <your-token>"
```

**Telegram Bot Tests:**

- [ ] Bot responds to `/start`
- [ ] Bot responds to `/help`
- [ ] Bot commands work
- [ ] Queue system working (check logs)

---

## Monitoring & Maintenance

### 1. Log Management

**Setup Log Rotation:**

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/eksicode
```

```
/opt/eksicode/nginx/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 root root
    sharedscripts
    postrotate
        docker exec eksicodeNginx nginx -s reload
    endscript
}

/var/lib/docker/volumes/eksicode_telegrambot_logs/_data/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 root root
}
```

### 2. Container Health Monitoring

**Create monitoring script:**

```bash
sudo nano /opt/eksicode/monitor.sh
```

```bash
#!/bin/bash

# EksiCode Health Monitor
SERVICES=("redis" "backend" "frontend" "telegrambot" "nginx")
ALERT_EMAIL="admin@yourdomain.com"

for SERVICE in "${SERVICES[@]}"; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' eksicode${SERVICE^} 2>/dev/null)
    
    if [ "$STATUS" != "healthy" ]; then
        echo "$(date): Service $SERVICE is $STATUS" >> /var/log/eksicode-monitor.log
        # Send alert (configure mail)
        # echo "Service $SERVICE is down" | mail -s "EksiCode Alert" $ALERT_EMAIL
    fi
done
```

```bash
sudo chmod +x /opt/eksicode/monitor.sh

# Add to crontab (runs every 5 minutes)
crontab -e
*/5 * * * * /opt/eksicode/monitor.sh
```

### 3. Resource Monitoring

**Monitor CPU and Memory:**

```bash
# View resource usage
docker stats

# View specific container
docker stats eksicodeBackend

# Continuous monitoring
watch -n 5 'docker stats --no-stream'
```

### 4. Database Monitoring

```bash
# Check database connections
docker exec eksicodeBackend npx prisma studio

# Or connect directly
psql -h <host> -U <username> -d eksicode -c "SELECT COUNT(*) FROM pg_stat_activity;"
```

### 5. Disk Space Monitoring

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up old images/containers
docker system prune -a --volumes
```

### 6. Performance Metrics

**Install monitoring tools:**

```bash
# Install Prometheus & Grafana (optional)
# Or use cloud monitoring services (AWS CloudWatch, Datadog, etc.)
```

---

## Troubleshooting

### Common Issues

#### 1. Service Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Check configuration
docker-compose config

# Rebuild service
docker-compose up -d --build <service-name>
```

#### 2. Database Connection Failed

```bash
# Verify DATABASE_URL
docker exec eksicodeBackend env | grep DATABASE_URL

# Test connection from container
docker exec -it eksicodeBackend psql $DATABASE_URL

# Check database is accessible
psql -h <host> -U <username> -d eksicode -c "SELECT 1;"
```

#### 3. Redis Connection Failed

```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker exec -it eksicodeRedis redis-cli -a <password> PING

# Check Redis password matches
docker exec eksicodeBackend env | grep REDIS_PASSWORD
docker exec eksicodeTelegramBot env | grep REDIS_PASSWORD
```

#### 4. High Memory Usage

```bash
# Check memory per service
docker stats --no-stream

# Restart service to free memory
docker-compose restart <service-name>

# Adjust memory limits in docker-compose.yml
```

#### 5. SSL Certificate Errors

```bash
# Verify certificate files exist
ls -la /opt/eksicode/nginx/eksicode.*

# Check certificate validity
openssl x509 -in /opt/eksicode/nginx/eksicode.crt -text -noout

# Check nginx configuration
docker exec eksicodeNginx nginx -t

# Reload nginx
docker exec eksicodeNginx nginx -s reload
```

#### 6. 502 Bad Gateway

```bash
# Check backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Check nginx upstream configuration
docker exec eksicodeNginx cat /etc/nginx/nginx.conf | grep upstream

# Test backend directly
curl http://localhost:9000/health
```

#### 7. Frontend Build Failures

```bash
# Check Node.js memory
# Increase in docker-compose.yml:
NODE_OPTIONS="--max-old-space-size=4096"

# Clear Next.js cache
docker-compose exec frontend rm -rf .next

# Rebuild
docker-compose up -d --build frontend
```

#### 8. Telegram Bot Not Responding

```bash
# Check bot is running
docker exec eksicodeTelegramBot pm2 list

# Check bot logs
docker-compose logs telegrambot

# Restart bot
docker-compose restart telegrambot

# Verify bot token
docker exec eksicodeTelegramBot env | grep BOT_TOKEN
```

### Debug Mode

**Enable debug logging:**

```bash
# Backend
docker-compose exec backend sh
export DEBUG=*
npm run start:dev

# Check detailed logs
docker-compose logs -f backend | grep -i error
```

---

## Backup & Recovery

### 1. Database Backup

**Automated Daily Backup:**

```bash
# Create backup script
sudo nano /opt/eksicode/backup-db.sh
```

```bash
#!/bin/bash

# Database credentials
DB_HOST="<your-db-host>"
DB_USER="<your-db-user>"
DB_NAME="eksicode"
BACKUP_DIR="/opt/eksicode/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD="<your-db-password>" pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
    | gzip > $BACKUP_DIR/eksicode_$DATE.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: eksicode_$DATE.sql.gz"
```

```bash
# Make executable
sudo chmod +x /opt/eksicode/backup-db.sh

# Test backup
sudo /opt/eksicode/backup-db.sh

# Schedule daily backup (3 AM)
sudo crontab -e
0 3 * * * /opt/eksicode/backup-db.sh >> /var/log/eksicode-backup.log 2>&1
```

### 2. Database Restore

```bash
# Restore from backup
gunzip < /opt/eksicode/backups/database/eksicode_20260119_030000.sql.gz | \
    PGPASSWORD="<password>" psql -h <host> -U <user> -d eksicode
```

### 3. Application Backup

```bash
# Backup environment files
tar -czf /opt/eksicode/backups/config_$(date +%Y%m%d).tar.gz \
    /opt/eksicode/backend/.env \
    /opt/eksicode/frontend/.env \
    /opt/eksicode/telegrambot/.env \
    /opt/eksicode/.env \
    /opt/eksicode/nginx/*.crt \
    /opt/eksicode/nginx/*.key

# Backup volumes
docker run --rm -v eksicode_redis_data:/data -v /opt/eksicode/backups:/backup \
    alpine tar -czf /backup/redis_data_$(date +%Y%m%d).tar.gz -C /data .

docker run --rm -v eksicode_telegrambot_logs:/data -v /opt/eksicode/backups:/backup \
    alpine tar -czf /backup/bot_logs_$(date +%Y%m%d).tar.gz -C /data .
```

### 4. Full System Backup

```bash
# Create full backup script
sudo nano /opt/eksicode/backup-full.sh
```

```bash
#!/bin/bash

BACKUP_DIR="/opt/eksicode/backups/full"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Stop services
cd /opt/eksicode
docker-compose stop

# Backup everything
tar -czf $BACKUP_DIR/eksicode_full_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.next' \
    --exclude='backups' \
    /opt/eksicode

# Backup volumes
docker run --rm -v eksicode_redis_data:/data -v $BACKUP_DIR:/backup \
    alpine tar -czf /backup/redis_$DATE.tar.gz -C /data .

# Start services
docker-compose start

echo "Full backup completed: eksicode_full_$DATE.tar.gz"
```

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong, random secrets (min 32 characters)
- ✅ Rotate secrets periodically (every 90 days)
- ✅ Use different secrets for development/staging/production

### 2. Database Security

- ✅ Use strong database passwords
- ✅ Restrict database access by IP
- ✅ Enable SSL for database connections
- ✅ Regular security updates
- ✅ Limit connection pool size

### 3. Docker Security

- ✅ Run containers as non-root user (already configured)
- ✅ Limit container resources
- ✅ Keep Docker updated
- ✅ Use official base images
- ✅ Scan images for vulnerabilities

```bash
# Scan images
docker scan eksicode-backend
docker scan eksicode-frontend
```

### 4. Network Security

- ✅ Use firewall (UFW/iptables)
- ✅ Only expose required ports
- ✅ Use internal Docker network
- ✅ Enable fail2ban for SSH protection

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. SSL/TLS Security

- ✅ Use TLS 1.2+  only (already configured in nginx)
- ✅ Strong cipher suites
- ✅ HSTS enabled
- ✅ Regular certificate renewal

### 6. Application Security

- ✅ Rate limiting enabled (already configured)
- ✅ CORS properly configured
- ✅ Helmet.js security headers (already configured)
- ✅ Input validation with Zod (already configured)
- ✅ JWT token expiration
- ✅ Password hashing with bcrypt (already configured)

### 7. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd /opt/eksicode
docker-compose pull
docker-compose up -d

# Update Node.js dependencies
cd backend && npm audit fix
cd frontend && npm audit fix
cd telegrambot && npm audit fix
```

---

## Performance Optimization

### 1. Backend Optimization

**Adjust clustering based on load:**

```yaml
# docker-compose.yml
environment:
  - MAX_WORKERS=4  # Match CPU cores
  - NODE_OPTIONS=--max-old-space-size=2048
```

**Database connection pool:**

```env
# backend/.env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"
```

**Adjust based on workers:**
- Total connections = `MAX_WORKERS × connection_limit`
- Ensure database can handle total connections

### 2. Redis Optimization

**Tune Redis configuration in `docker-compose.yml`:**

```yaml
command: >
  sh -c "redis-server
  --maxmemory 4gb  # Increase for larger queue
  --maxmemory-policy allkeys-lru"
```

### 3. Nginx Optimization

**Already optimized in `nginx.conf`:**

- Gzip compression enabled
- Connection keep-alive
- Proxy buffering
- Static file caching
- Worker processes auto-configured

**Additional tuning:**

```nginx
# Increase worker connections for high traffic
events {
    worker_connections 16000;  # Increase from 8000
}
```

### 4. Frontend Optimization

**Next.js optimization (already configured):**

```env
# frontend/.env
NODE_OPTIONS="--max-old-space-size=4096"
NEXT_STATIC_PAGE_GENERATION_TIMEOUT=180
```

**Enable ISR (Incremental Static Regeneration):**

```javascript
// In Next.js pages
export const revalidate = 60; // Revalidate every 60 seconds
```

### 5. Database Optimization

```sql
-- Add indexes for frequently queried columns (already in schema.prisma)
-- Monitor slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- Vacuum database regularly
VACUUM ANALYZE;
```

### 6. CDN for Static Assets

- Use CloudFlare or AWS CloudFront
- Serve media from S3 with CloudFront
- Cache static assets (JS, CSS, images)

---

## Rollback Procedures

### 1. Quick Rollback (Same Code)

```bash
cd /opt/eksicode

# Stop services
docker-compose down

# Restore from backup
tar -xzf backups/config_YYYYMMDD.tar.gz -C /

# Start services
docker-compose up -d
```

### 2. Code Rollback (Git)

```bash
cd /opt/eksicode

# Check commit history
git log --oneline

# Rollback to previous version
git checkout <commit-hash>

# Or rollback to previous commit
git reset --hard HEAD~1

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### 3. Database Rollback

```bash
# Restore database from backup
gunzip < backups/database/eksicode_YYYYMMDD.sql.gz | \
    PGPASSWORD="<password>" psql -h <host> -U <user> -d eksicode

# Restart backend
docker-compose restart backend
```

### 4. Emergency Disable Clustering

```bash
# If clustering causes issues
docker-compose exec backend sh -c "export ENABLE_CLUSTERING=false && npm run start:dev"

# Or update docker-compose.yml
environment:
  - ENABLE_CLUSTERING=false
```

---

## Appendices

### A. Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a service
docker-compose restart <service-name>

# View logs
docker-compose logs -f <service-name>

# Execute command in container
docker exec -it <container-name> <command>

# Check service health
docker-compose ps

# Rebuild service
docker-compose up -d --build <service-name>

# Remove all containers and volumes
docker-compose down -v

# Update services
docker-compose pull && docker-compose up -d
```

### B. Port Reference

| Service | Internal Port | External Port | Protocol |
|---------|---------------|---------------|----------|
| Nginx | 80, 443 | 80, 443 | HTTP/HTTPS |
| Frontend | 3000 | - | HTTP |
| Backend | 9000 | - | HTTP |
| Redis | 6379 | 6379* | TCP |
| PostgreSQL | 5432 | - | TCP |

*Redis port exposed for debugging - should be firewalled in production

### C. Default Credentials

**After deployment, create admin user via database seeding:**

```bash
cd /opt/eksicode/backend
npm run seed
```

**Or create manually:**

```sql
-- Connect to database
psql -h <host> -U <user> -d eksicode

-- Check if admin exists
SELECT * FROM users WHERE email = 'admin@eksicode.org';

-- If not, create via API or update seed script
```

### D. Environment Variables Reference

See detailed environment variable configurations in [Service Configuration](#service-configuration) section.

### E. API Endpoints

**Public Endpoints:**
- `GET /health` - Health check
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /posts` - List posts

**Protected Endpoints:**
- `GET /users` - List users (admin)
- `POST /posts` - Create post (authenticated)
- `PUT /users/:id` - Update user (self or admin)

**Full API documentation:**
- Swagger UI: `https://api-demo.eksicode.org/api-docs` (if implemented)
- Or refer to backend route files in `/backend/src/routes/`

### F. Maintenance Schedule

**Daily:**
- [x] Monitor service health
- [x] Check error logs
- [x] Verify backup completion

**Weekly:**
- [x] Review system resources
- [x] Check disk space
- [x] Review security logs
- [x] Test disaster recovery

**Monthly:**
- [x] Update system packages
- [x] Update Docker images
- [x] Review and optimize database
- [x] Renew SSL certificates (if needed)
- [x] Security audit

**Quarterly:**
- [x] Rotate secrets and passwords
- [x] Review and update documentation
- [x] Load testing
- [x] Security penetration testing

---

## Support & Contacts

**Documentation:**
- Project README: `/opt/eksicode/README.md`
- Admin Panel Docs: `/opt/eksicode/admin/README.md`
- Telegram Bot Docs: `/opt/eksicode/telegrambot/README.md`

**Monitoring:**
- Logs: `/opt/eksicode/nginx/logs/`
- Container logs: `docker-compose logs`
- System logs: `/var/log/`

**Emergency Contacts:**
- System Administrator: [Your contact]
- Development Team: [Your contact]
- Database Administrator: [Your contact]

---

## Changelog

### Version 1.0.0 - January 19, 2026
- Initial production deployment guide
- Complete system architecture documentation
- Security best practices
- Monitoring and maintenance procedures
- Backup and recovery procedures
- Troubleshooting guide

---

## Conclusion

This deployment guide covers the complete production deployment process for EksiCode. Follow each section carefully and verify at each step. For issues not covered in this guide, check the troubleshooting section or contact the development team.

**Remember:**
- Always test in staging before production
- Keep backups current
- Monitor services continuously
- Document any changes
- Follow security best practices

**Good luck with your deployment! 🚀**
