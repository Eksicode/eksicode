# ============================================================================
# Multi-stage build for Telegram Bot - Production Optimized
# ============================================================================

# ============================================================================
# Stage 1: Builder - Compile TypeScript
# ============================================================================
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

WORKDIR /build

# Copy package files for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build && \
    # Verify build output
    ls -la dist/

# ============================================================================
# Stage 2: Production Runtime
# ============================================================================
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tini \
    tzdata && \
    # Install PM2 globally for process management
    npm install -g pm2@latest

# Set timezone
ENV TZ=Europe/Istanbul

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Use working directory that matches docker-compose.yml
WORKDIR /var/bot

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --prefer-offline --no-audit && \
    npm cache clean --force

# Copy built files and configuration from builder
COPY --from=builder --chown=nodejs:nodejs /build/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /build/help.md ./dist/help.md
COPY --from=builder --chown=nodejs:nodejs /build/docs/helpAdmin.md ./dist/docs/helpAdmin.md
COPY --from=builder --chown=nodejs:nodejs /build/pm2.json ./pm2.json

# Create logs directory with proper permissions
RUN mkdir -p logs && \
    chown -R nodejs:nodejs /var/bot

# Switch to non-root user
USER nodejs

# Health check using PM2 ping
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD pm2 ping || exit 1

# Use tini as init system for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start with PM2 runtime in cluster mode
CMD ["pm2-runtime", "start", "pm2.json", "--env", "production"]
