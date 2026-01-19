# Multi-stage build for frontend
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files for better layer caching
COPY package.json package-lock.json ./

# Install dependencies (with legacy-peer-deps due to next-auth not officially supporting Next.js 16 yet)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies (with legacy-peer-deps due to next-auth not officially supporting Next.js 16 yet)
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy built application from base stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/next.config.mjs ./next.config.mjs

# Copy healthcheck script
COPY healthcheck.sh /healthcheck.sh

# Make healthcheck executable
RUN chmod +x /healthcheck.sh

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD /healthcheck.sh || exit 1

# Start Next.js production server
CMD ["npm", "run", "start"]
