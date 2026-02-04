# Multi-stage build for admin panel
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for API URL (must be set at build time for Vite)
ARG PUBLIC_API_URL=https://api.eksicode.org
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

# Copy package files for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
# Using npm install instead of npm ci to handle lock file sync issues
RUN npm install

# Copy configuration files
COPY svelte.config.js ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Copy source code
COPY src ./src

# Create static directory (SvelteKit optional, but needed for build)
RUN mkdir -p ./static

# Build SvelteKit application with the API URL baked in
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

# Copy package files
COPY package*.json ./

# Install only production dependencies and @sveltejs/adapter-node
# Using npm install instead of npm ci to handle lock file sync issues
RUN npm install --only=production && \
    npm install @sveltejs/adapter-node && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Copy healthcheck script
COPY healthcheck.sh /healthcheck.sh

# Make healthcheck executable
RUN chmod +x /healthcheck.sh

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD /healthcheck.sh || exit 1

# Start SvelteKit production server
CMD ["node", "build"]
