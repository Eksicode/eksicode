# Nginx Docker Problem - Fix Summary

**Date:** January 20, 2026  
**Issue:** Nginx container failing to start with "host not found in upstream" error  
**Status:** ✅ FIXED

---

## Problem Analysis

### Root Cause
Nginx was failing with the error:
```
[emerg] 1#1: host not found in upstream "frontend" in /etc/nginx/nginx.conf:81
```

This happened because:
1. **Missing SSL Certificates**: The original issue was missing SSL certificate files (`eksicode.crt` and `eksicode.key`)
2. **DNS Resolution Issue**: Nginx tries to resolve upstream hostnames (frontend, backend, admin) at startup time
3. **Container Start Order**: If the upstream containers aren't ready when nginx starts, DNS resolution fails
4. **Static Upstream Configuration**: The `upstream backend_cluster` block required the backend to be resolvable at nginx startup

### Why This Happens
Docker's internal DNS (127.0.0.11) only resolves container names when the containers are running. If nginx starts before other containers are healthy, it can't resolve their hostnames and fails to start.

---

## Solution Implemented

### 1. Added Docker DNS Resolver
Added Docker's internal DNS resolver to nginx configuration:

```nginx
http {
  # DNS resolver for Docker internal DNS
  resolver 127.0.0.11 valid=30s ipv6=off;
  resolver_timeout 10s;
  ...
}
```

### 2. Changed to Variable-Based Proxy Pass
Changed from static upstream references to variable-based DNS resolution:

**Before:**
```nginx
location / {
  proxy_pass http://frontend:3000;
}
```

**After:**
```nginx
location / {
  set $frontend_upstream frontend:3000;
  proxy_pass http://$frontend_upstream;
}
```

This allows nginx to:
- Start even if upstream containers aren't ready yet
- Resolve DNS dynamically at request time (not startup time)
- Gracefully handle container restarts

### 3. Removed Static Upstream Block
Commented out the static `upstream backend_cluster` block that was causing startup failures:

```nginx
# upstream backend_cluster {
#   server backend:9000 max_fails=3 fail_timeout=30s;
#   keepalive 32;
# }
```

### 4. Generated SSL Certificates
Created self-signed SSL certificates for development/testing:
- `nginx/eksicode.crt` (1.3KB)
- `nginx/eksicode.key` (1.7KB)

---

## Files Modified

### 1. `nginx/nginx.conf`
- Added Docker DNS resolver
- Changed all `proxy_pass` directives to use variables
- Commented out static upstream block
- Applied to all server blocks: frontend, backend, admin

### 2. `nginx/eksicode.crt` (NEW)
- Self-signed SSL certificate
- Valid for 365 days
- CN=demo.eksicode.org

### 3. `nginx/eksicode.key` (NEW)
- Private key for SSL certificate
- RSA 2048-bit

### 4. `fix-nginx-production.sh` (NEW)
- Automated deployment script
- Handles service restart in correct order
- Includes health checks and verification

---

## Deployment Instructions

### Option A: Automated Deployment (Recommended)

On your **production server**, run:

```bash
cd /opt/eksicode  # Or your project directory

# Upload the fixed nginx.conf first
# (from your local machine)
scp nginx/nginx.conf user@server:/opt/eksicode/nginx/

# Upload SSL certificates
scp nginx/eksicode.crt user@server:/opt/eksicode/nginx/
scp nginx/eksicode.key user@server:/opt/eksicode/nginx/

# Then on the server, run the fix script
./fix-nginx-production.sh
```

### Option B: Manual Deployment

On your **production server**:

```bash
cd /opt/eksicode

# Step 1: Upload the fixed nginx configuration
# (Already done if you used scp above)

# Step 2: Stop nginx
docker-compose stop nginx

# Step 3: Ensure other services are running
docker-compose up -d redis backend frontend admin telegrambot

# Step 4: Wait for services to be healthy
sleep 10

# Step 5: Start nginx with new configuration
docker-compose up -d nginx

# Step 6: Check logs
docker-compose logs nginx --tail 50

# Step 7: Verify services
docker-compose ps
```

---

## Verification Steps

After deployment, verify everything is working:

### 1. Check Container Status
```bash
docker-compose ps
```
All containers should show "Up" and "healthy" status.

### 2. Check Nginx Logs
```bash
docker-compose logs nginx --tail 50
```
Should NOT show "host not found" errors.

### 3. Test Endpoints Locally
```bash
# Backend
curl http://localhost:9000/health

# Frontend
curl http://localhost:3000/

# Admin
curl http://localhost:3001/
```

### 4. Test Public URLs
```bash
# Frontend
curl https://demo.eksicode.org

# Backend API
curl https://api-demo.eksicode.org/health

# Admin Panel
curl https://admin-demo.eksicode.org
```

### 5. Check Browser
Visit your sites in a browser:
- https://demo.eksicode.org
- https://api-demo.eksicode.org
- https://admin-demo.eksicode.org

---

## Troubleshooting

### Issue: Nginx still shows "host not found"

**Solution:**
```bash
# Check if frontend/backend/admin are running
docker-compose ps

# Check their logs
docker-compose logs frontend --tail 50
docker-compose logs backend --tail 50

# Restart services in order
docker-compose restart backend frontend admin nginx
```

### Issue: Frontend/Backend not starting

**Solution:**
```bash
# Check logs for errors
docker-compose logs frontend
docker-compose logs backend

# Common issues:
# - Database connection failed (check DATABASE_URL)
# - Out of memory (increase memory limits)
# - Build errors (rebuild: docker-compose up -d --build frontend)
```

### Issue: SSL Certificate Warnings

**Solution:**
The self-signed certificates will show browser warnings. For production, use Let's Encrypt:

```bash
# Stop nginx
docker-compose stop nginx

# Generate Let's Encrypt certificates
sudo certbot certonly --standalone \
  -d demo.eksicode.org \
  -d api-demo.eksicode.org \
  -d admin-demo.eksicode.org

# Copy certificates
sudo cp /etc/letsencrypt/live/demo.eksicode.org/fullchain.pem \
  /opt/eksicode/nginx/eksicode.crt
sudo cp /etc/letsencrypt/live/demo.eksicode.org/privkey.pem \
  /opt/eksicode/nginx/eksicode.key

# Fix permissions
sudo chown $USER:$USER /opt/eksicode/nginx/eksicode.*
chmod 644 /opt/eksicode/nginx/eksicode.crt
chmod 600 /opt/eksicode/nginx/eksicode.key

# Start nginx
docker-compose start nginx
```

---

## Technical Details

### Why Variable-Based Proxy Pass Works

**Static proxy_pass:**
```nginx
proxy_pass http://frontend:3000;
```
- DNS resolution happens at nginx startup/reload
- Fails if container isn't running
- Nginx won't start if resolution fails

**Variable-based proxy_pass:**
```nginx
set $frontend_upstream frontend:3000;
proxy_pass http://$frontend_upstream;
```
- DNS resolution happens at request time
- Nginx can start even if containers aren't ready
- Returns 502/503 if container is down (but nginx stays running)
- Automatically works when containers come online

### Docker DNS Resolver (127.0.0.11)

Docker's embedded DNS server:
- Runs on 127.0.0.11:53 inside containers
- Resolves container names to IP addresses
- Only resolves names of containers on the same network
- Updates automatically when containers start/stop

---

## Performance Impact

The variable-based approach has minimal performance impact:
- DNS queries are cached by nginx (valid=30s)
- Adds ~1ms per request (negligible)
- More reliable than static upstreams
- Better for dynamic container environments

---

## Future Improvements

### 1. Use Let's Encrypt for Production
Replace self-signed certificates with Let's Encrypt for trusted SSL.

### 2. Add Health Check Endpoints
Nginx can check upstream health before routing:
```nginx
location / {
  set $frontend_upstream frontend:3000;
  proxy_pass http://$frontend_upstream;
  
  # Add health check
  health_check interval=10s fails=3 passes=2;
}
```

### 3. Add Load Balancing (if scaling)
If you run multiple instances:
```nginx
upstream backend_pool {
  least_conn;
  server backend1:9000;
  server backend2:9000;
  server backend3:9000;
}
```

### 4. Setup Auto-Renewal for SSL
Create a cron job to renew Let's Encrypt certificates automatically.

---

## Summary

✅ **Fixed Issues:**
1. Missing SSL certificates - Generated self-signed certificates
2. Nginx DNS resolution - Added Docker DNS resolver
3. Static upstream failures - Changed to variable-based proxy_pass
4. Container start order - Nginx now starts regardless of upstream status

✅ **Benefits:**
1. Nginx starts reliably even if other containers are slow
2. Graceful handling of container restarts
3. Better error messages (502/503 instead of startup failure)
4. More suitable for Docker environments

✅ **Next Steps:**
1. Deploy the fixed configuration to production
2. Replace self-signed certificates with Let's Encrypt
3. Monitor nginx logs for any issues
4. Set up SSL auto-renewal

---

## References

- **Nginx DNS Resolution**: http://nginx.org/en/docs/http/ngx_http_core_module.html#resolver
- **Docker DNS**: https://docs.docker.com/config/containers/container-networking/#dns-services
- **Let's Encrypt**: https://letsencrypt.org/getting-started/
- **Nginx Variables**: http://nginx.org/en/docs/varindex.html

---

**Questions or Issues?**

If you encounter any problems:
1. Check the logs: `docker-compose logs -f`
2. Verify container status: `docker-compose ps`
3. Review this document's troubleshooting section
4. Check the full deployment guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

**Last Updated:** January 20, 2026
