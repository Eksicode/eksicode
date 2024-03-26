# Node version
# FROM node:20-alpine AS deps

# WORKDIR /app
# COPY package*.json .
# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV
# RUN npm install

# -------------------------------------

FROM node:20-alpine AS builder

RUN apt-get update && \
    apt-get install -y \
    libjpeg-dev \
    libcairo2-dev \
    libgif-dev \
    libpango1.0-dev \
    python3 \
    make \
    g++

WORKDIR /app
COPY package.json next.config.mjs tsconfig.json ./
COPY . .

RUN npm install sharp

RUN npm install

RUN npm run build

# -------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
# ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

RUN npm install sharp

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./

EXPOSE 4000
ENV PORT 4000

CMD ["npm", "run", "start"]
