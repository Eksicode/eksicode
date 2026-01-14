# Production Multithreading Deployment Guide

## Overview

Your EksiCode backend has been configured with production-ready multithreading using Node.js clustering. This setup provides:

- **Automatic load balancing** across multiple CPU cores
- **Process fault tolerance** with automatic worker restart
- **Graceful shutdown** handling
- **Resource optimization** for production environments
- **Health monitoring** capabilities

## Configuration Files Updated

### 1. Backend Server (`/backend/src/server.ts`)

**New Features:**
- ✅ Production-ready clustering with configurable worker count
- ✅ Automatic worker restart on failure (max 5 restarts per minute)
- ✅ Graceful shutdown handling for zero-downtime deployments
- ✅ Worker health monitoring
- ✅ Memory leak protection

**Environment Controls:**
```bash
# Enable/disable clustering
ENABLE_CLUSTERING=true/false

# Control worker count (defaults to CPU count)
MAX_WORKERS=4

# Production mode
NODE_ENV=production
```

### 2. Package.json Scripts

**New Scripts:**
```bash
npm run start:prod    # Production with clustering enabled
npm run start:dev     # Development without clustering
npm run watch         # Development with auto-reload (no clustering)
```

### 3. Docker Configuration

**Production Settings:**
- Resource limits: 4 CPUs, 8GB RAM
- Environment variables for clustering
- Optimized memory allocation per worker

### 4. Nginx Configuration

**Load Balancing Features:**
- ✅ Upstream configuration for backend cluster
- ✅ Connection keep-alive optimization
- ✅ Automatic failover handling
- ✅ Health check endpoints
- ✅ Performance tuning for high concurrency

## Deployment Instructions

### Development Environment

```bash
# Start without clustering (single process)
npm run start:dev

# Or start with file watching
npm run watch
```

### Production Environment

#### Option 1: Direct Node.js

```bash
# Build the application
npm run build

# Start with clustering enabled
npm run start:prod
```

#### Option 2: Docker (Recommended)

```bash
# Build and start with docker-compose
docker-compose up -d

# Monitor cluster health
docker exec eksicodeBackend /app/cluster-monitor.sh
```

## Monitoring and Maintenance

### Cluster Health Monitoring

Use the included monitoring script:

```bash
# Check cluster status
./backend/cluster-monitor.sh
```

This script provides:
- Process information (master/workers)
- Memory usage per process
- Network connection stats
- System resource utilization
- Health status indicators

### Log Monitoring

```bash
# View application logs
docker logs eksicodeBackend -f

# View nginx logs
docker logs eksicodeNginx -f
```

### Performance Metrics

Monitor these key metrics in production:

1. **Worker Count**: Should match configured `MAX_WORKERS`
2. **Memory Usage**: Each worker typically uses 100-500MB
3. **CPU Usage**: Should be distributed across cores
4. **Response Times**: Should improve with clustering
5. **Error Rates**: Should remain low with failover

## Production Configuration Recommendations

### Optimal Settings by Server Size

#### Small Server (2 CPU cores, 4GB RAM)
```env
MAX_WORKERS=2
NODE_OPTIONS="--max-old-space-size=1024"
PRISMA_CONNECTION_LIMIT=5
```

#### Medium Server (4 CPU cores, 8GB RAM)
```env
MAX_WORKERS=4
NODE_OPTIONS="--max-old-space-size=2048"
PRISMA_CONNECTION_LIMIT=10
```

#### Large Server (8+ CPU cores, 16GB+ RAM)
```env
MAX_WORKERS=8
NODE_OPTIONS="--max-old-space-size=4096"
PRISMA_CONNECTION_LIMIT=15
```

### Database Connection Pool

**Important**: Adjust database connection limits based on worker count:
- Total connections = `MAX_WORKERS × PRISMA_CONNECTION_LIMIT`
- Ensure your database can handle the total connection count
- Consider using connection pooling services for large deployments

### Memory Management

Each worker process should be allocated:
- **Minimum**: 512MB RAM
- **Recommended**: 1-2GB RAM
- **Maximum**: 4GB RAM (Node.js limit without flags)

## Troubleshooting

### Common Issues

#### 1. Workers Not Starting
```bash
# Check if clustering is enabled
echo $ENABLE_CLUSTERING

# Check worker logs
docker logs eksicodeBackend | grep "Worker"
```

#### 2. High Memory Usage
```bash
# Monitor per-worker memory
./backend/cluster-monitor.sh

# Adjust memory limits
export NODE_OPTIONS="--max-old-space-size=2048"
```

#### 3. Database Connection Errors
```bash
# Reduce connection pool size
PRISMA_CONNECTION_LIMIT=5

# Check total connections
# Total = MAX_WORKERS × PRISMA_CONNECTION_LIMIT
```

#### 4. Load Balancing Issues
```bash
# Check nginx upstream configuration
nginx -t

# Restart nginx
docker restart eksicodeNginx
```

### Performance Optimization

#### 1. Adjust Worker Count
```bash
# Too many workers (over-subscription)
MAX_WORKERS=2  # For 4 core system

# Too few workers (under-utilization)
MAX_WORKERS=4  # For 4 core system
```

#### 2. Memory Optimization
```bash
# Increase heap size for memory-intensive operations
NODE_OPTIONS="--max-old-space-size=4096"

# Enable garbage collection optimization
NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"
```

#### 3. Database Optimization
```bash
# Optimize connection pool
PRISMA_CONNECTION_LIMIT=10
PRISMA_TIMEOUT=20000

# Enable query optimization
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=50&pool_timeout=20"
```

## Security Considerations

1. **Process Isolation**: Each worker runs in isolated memory space
2. **Graceful Restart**: Workers can be restarted without affecting others
3. **Resource Limits**: Docker limits prevent resource exhaustion
4. **Health Checks**: Automatic detection of unhealthy workers

## Rollback Plan

If issues occur with clustering, quickly disable it:

```bash
# Method 1: Environment variable
export ENABLE_CLUSTERING=false
docker restart eksicodeBackend

# Method 2: Switch to development script
# Update docker-compose.yml command to: npm run start:dev
```

## Performance Benefits

Expected improvements with clustering:

- **2-4x** increase in concurrent request handling
- **30-50%** reduction in response times under load
- **Zero-downtime** deployments with rolling restarts
- **Automatic failover** for individual worker failures
- **Better resource utilization** across CPU cores

## Next Steps

1. Deploy to staging environment first
2. Run load tests to verify performance improvements
3. Monitor for 24-48 hours before production deployment
4. Set up automated monitoring and alerting
5. Document your specific configuration settings

For additional support or issues, refer to the monitoring logs and system metrics provided by the cluster monitoring script.
