# Multi-stage build for telegrambot
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install pm2 globally (required for pm2-runtime)
RUN npm install -g pm2@latest

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/pm2.json ./pm2.json

# Copy necessary files (logs directory will be created at runtime)
RUN mkdir -p logs

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port if needed (telegram bot doesn't typically need ports)
# EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('fs').existsSync('/app/logs') && process.exit(0) || process.exit(1)"

# Use pm2-runtime for process management
CMD ["pm2-runtime", "start", "pm2.json"]
