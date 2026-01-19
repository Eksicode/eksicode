# Multi-stage build for backend
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
# Build bcrypt for the target platform
RUN npm ci --only=production && \
    npm rebuild bcrypt --build-from-source && \
    npm cache clean --force

# Remove build dependencies after bcrypt is built (security optimization)
RUN apk del python3 make g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy prisma schema from builder (needed for Prisma Client)
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client in production
RUN npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use production start script with clustering enabled
CMD ["npm", "run", "start:prod"]
