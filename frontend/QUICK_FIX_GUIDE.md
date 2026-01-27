# Quick Fix Guide - Frontend, Admin & Telegram Bot Deployment

## ⚡ Problem

Your containers (frontend, admin, telegram bot) are not starting, causing nginx to fail with "host not found" errors.

## 🎯 Root Cause

**Missing `.env` files!** The containers need environment configuration to run.

## ✅ Solution (5 Minutes)

### On Production Server

```bash
cd /opt/eksicode  # Or your project directory

# 1. Create frontend/.env
cp frontend/sample.env frontend/.env
nano frontend/.env
```

Edit these values in `frontend/.env`:
```env
NODE_ENV=production
NEXT_PUBLIC_URL=https://demo.eksicode.org
NEXT_PUBLIC_API_URL=http://backend:9000
NEXTAUTH_SECRET=<generate-random-64-chars>
```

```bash
# 2. Create admin/.env
cp admin/sample.env admin/.env
# Already configured correctly for Docker!

# 3. Create telegrambot/.env
cp telegrambot/sample.env telegrambot/.env
nano telegrambot/.env
```

Add your bot token in `telegrambot/.env`:
```env
BOT_TOKEN=your-telegram-bot-token-here
```

```bash
# 4. Ensure backend/.env exists and is configured
ls -la backend/.env
# If missing, copy from sample and configure

# 5. Rebuild and restart everything
docker-compose down
docker-compose up -d --build

# 6. Watch the logs
docker-compose logs -f
```

### Wait 1-2 Minutes, Then Check

```bash
# Should show all containers "Up" and "healthy"
docker-compose ps

# Check for errors
docker-compose logs nginx --tail 20
docker-compose logs frontend --tail 20
docker-compose logs admin --tail 20
```

## 🔍 If Still Not Working

Run the diagnostic script I created:

```bash
cd /opt/eksicode
./diagnose-and-fix.sh
```

It will check everything and tell you exactly what's wrong.

## 📋 Required Environment Variables

### Frontend (Minimum)
- `NEXT_PUBLIC_API_URL=http://backend:9000`
- `NEXTAUTH_SECRET=<random-string>`
- `NODE_ENV=production`

### Admin (Minimum)
- `PUBLIC_API_URL=http://backend:9000`

### Telegram Bot (Minimum)
- `BOT_TOKEN=<your-bot-token>`
- `API_URL=http://backend:9000`
- `REDIS_HOST=redis`
- `REDIS_PASSWORD=<your-redis-password>`

## 📂 Files Created For You

I've created these files locally. Upload them to production:

1. **`diagnose-and-fix.sh`** - Diagnostic script
2. **`nginx/nginx.conf`** - Fixed nginx configuration
3. **`nginx/eksicode.crt`** - SSL certificate
4. **`nginx/eksicode.key`** - SSL private key
5. **`admin/sample.env`** - Admin environment template
6. **`CONTAINER_DEPLOYMENT_FIX.md`** - Complete documentation

### Upload to Production

From your **local machine**:

```bash
cd /Users/mkltkn/Projects/eksicode/eksicode-latest

# Upload all fixed files
scp diagnose-and-fix.sh user@server:/opt/eksicode/
scp nginx/nginx.conf user@server:/opt/eksicode/nginx/
scp nginx/eksicode.* user@server:/opt/eksicode/nginx/
scp admin/sample.env user@server:/opt/eksicode/admin/
```

## 🚀 Expected Result

After fixing:
- ✅ All containers running
- ✅ Nginx starts without errors
- ✅ Frontend accessible at https://demo.eksicode.org
- ✅ Backend API at https://api-demo.eksicode.org
- ✅ Admin panel at https://admin-demo.eksicode.org
- ✅ Telegram bot responding

## 📞 Still Having Issues?

Check the detailed guides:
- `CONTAINER_DEPLOYMENT_FIX.md` - Complete troubleshooting
- `NGINX_FIX_SUMMARY.md` - Nginx-specific issues
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Full deployment guide

## 💡 Quick Troubleshoot Commands

```bash
# Check container status
docker-compose ps

# Check logs for errors
docker-compose logs frontend | grep -i error
docker-compose logs admin | grep -i error
docker-compose logs nginx | grep -i error

# Restart everything
docker-compose restart

# Nuclear option (rebuild everything)
docker-compose down
docker-compose up -d --build
```

---

**The main issue:** Missing .env files  
**The fix:** Create .env files from samples  
**Time required:** 5 minutes  
**Difficulty:** Easy ✅
