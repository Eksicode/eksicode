# EksiCode - Deployment Quick Start

This is a condensed version of the full deployment guide. For detailed instructions, see [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md).

---

## Prerequisites Checklist

- [ ] Ubuntu 20.04+ server with 4GB+ RAM, 2+ CPU cores
- [ ] Docker & Docker Compose installed
- [ ] Domain name configured (DNS A records)
- [ ] SSL certificates obtained
- [ ] PostgreSQL database ready
- [ ] AWS S3 bucket for media (optional)
- [ ] Telegram Bot token
- [ ] Email service credentials

---

## Quick Deployment Steps

### 1. Clone Repository

```bash
cd /opt
sudo git clone <your-repo> eksicode
cd eksicode
```

### 2. Configure Environment Variables

Create environment files from samples:

```bash
# Backend
cd backend
cp sample.env .env
nano .env  # Edit with your values

# Frontend  
cd ../frontend
cp sample.env .env
nano .env  # Edit with your values

# Telegram Bot
cd ../telegrambot
cp sample.env .env
nano .env  # Edit with your values

# Root (for Redis password)
cd ..
echo "REDIS_PASSWORD=$(openssl rand -base64 32)" > .env
```

### 3. Configure SSL Certificates

```bash
# Copy your certificates
cp your-certificate.crt nginx/eksicode.crt
cp your-private-key.key nginx/eksicode.key

# Or use Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/eksicode.crt
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/eksicode.key
```

### 4. Update Nginx Domain Names

Edit `nginx/nginx.conf` and replace:
- `demo.eksicode.org` → your frontend domain
- `api-demo.eksicode.org` → your API domain

### 5. Setup Database

```bash
cd backend

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

### 6. Deploy with Docker

```bash
cd /opt/eksicode

# Build and start all services
docker-compose up -d

# Monitor logs
docker-compose logs -f
```

### 7. Verify Deployment

```bash
# Check services are healthy
docker-compose ps

# Test health endpoints
curl http://localhost:9000/health
curl http://localhost:3000/

# Test public URLs
curl https://yourdomain.com
curl https://api.yourdomain.com/health

# Check cluster status
docker exec eksicodeBackend /app/cluster-monitor.sh
```

---

## Critical Environment Variables

### Backend (.env)

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/eksicode?connection_limit=10"
JWT_SECRET="<64-char-random-string>"
AWS_ACCESS_KEY=<your-key>
AWS_SECRET_KEY=<your-secret>
EMAIL_SERVICE=Yandex
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>
ALLOWED_ORIGINS=https://yourdomain.com
FRONTEND_HOST=https://yourdomain.com
```

### Frontend (.env)

```env
NODE_ENV=production
NEXT_PUBLIC_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=http://backend:9000
NEXTAUTH_SECRET="<random-secret>"
NEXT_PUBLIC_MEDIA_URL=https://your-bucket.s3.amazonaws.com/
```

### Telegram Bot (.env)

```env
BOT_TOKEN=<your-bot-token>
API_URL=http://backend:9000
REDIS_HOST=redis
REDIS_PORT=6379
ENABLE_QUEUE=true
```

---

## Quick Commands

```bash
# View all service status
docker-compose ps

# View logs for a service
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Update and restart
docker-compose pull && docker-compose up -d

# Check cluster health
docker exec eksicodeBackend /app/cluster-monitor.sh
```

---

## Troubleshooting

### Service won't start
```bash
docker-compose logs <service-name>
docker-compose up -d --build <service-name>
```

### Database connection failed
```bash
# Check DATABASE_URL is correct
docker exec eksicodeBackend env | grep DATABASE_URL
```

### 502 Bad Gateway
```bash
# Check backend is running
docker-compose ps backend
docker-compose logs backend
curl http://localhost:9000/health
```

### Redis connection failed
```bash
docker exec -it eksicodeRedis redis-cli -a <your-redis-password> PING
```

---

## Daily Maintenance

### View Logs
```bash
docker-compose logs -f --tail=100
```

### Monitor Resources
```bash
docker stats
```

### Backup Database
```bash
pg_dump -h <host> -U <user> eksicode | gzip > backup_$(date +%Y%m%d).sql.gz
```

---

## Service Ports

| Service | Port | Access |
|---------|------|--------|
| Nginx | 80, 443 | Public |
| Frontend | 3000 | Internal |
| Backend | 9000 | Internal |
| Redis | 6379 | Internal |

---

## Architecture Overview

```
Internet → Nginx (SSL) → Frontend (Next.js)
                       ↓
                    Backend (Express + Clustering)
                       ↓
                   ┌───┴───┐
                   ↓       ↓
               Redis   PostgreSQL
                   ↓
            Telegram Bot
```

---

## Performance Tuning

### Adjust Worker Count (docker-compose.yml)

```yaml
backend:
  environment:
    - MAX_WORKERS=4  # Match your CPU cores
```

**Recommendations:**
- 2 cores → MAX_WORKERS=2
- 4 cores → MAX_WORKERS=4  
- 8+ cores → MAX_WORKERS=6-8

### Adjust Memory Limits

```yaml
backend:
  environment:
    - NODE_OPTIONS=--max-old-space-size=2048  # 2GB per worker
```

---

## Security Checklist

- [ ] Strong passwords for all services
- [ ] Firewall configured (ports 22, 80, 443 only)
- [ ] SSL certificates valid and auto-renewing
- [ ] Environment files not committed to Git
- [ ] Database access restricted by IP
- [ ] Redis password set
- [ ] Regular backups configured
- [ ] System updates scheduled

---

## Backup Strategy

### Database Backup (Daily)

```bash
#!/bin/bash
pg_dump -h <host> -U <user> eksicode | \
  gzip > /backups/db_$(date +%Y%m%d).sql.gz
```

### Configuration Backup

```bash
tar -czf /backups/config_$(date +%Y%m%d).tar.gz \
  backend/.env frontend/.env telegrambot/.env \
  nginx/*.crt nginx/*.key
```

---

## Support

For detailed documentation:
- **Full Guide**: [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Project README**: [README.md](./README.md)
- **Admin Panel**: [admin/README.md](./admin/README.md)

---

## Quick Reference: First Time Setup

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone and configure
cd /opt && git clone <repo> eksicode
cd eksicode
cp backend/sample.env backend/.env
cp frontend/sample.env frontend/.env
cp telegrambot/sample.env telegrambot/.env

# 3. Edit all .env files with your credentials
nano backend/.env
nano frontend/.env
nano telegrambot/.env

# 4. Setup SSL
cp your-cert.crt nginx/eksicode.crt
cp your-key.key nginx/eksicode.key

# 5. Update nginx domains
nano nginx/nginx.conf

# 6. Setup database
cd backend
npx prisma migrate deploy
npm run seed

# 7. Deploy
cd ..
docker-compose up -d

# 8. Verify
docker-compose ps
curl http://localhost:9000/health
```

---

**Need help?** Check the comprehensive [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed instructions.
