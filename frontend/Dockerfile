FROM node:20 AS builder

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
COPY package*.json next.config.mjs tsconfig.json ./
COPY . .

RUN npm install sharp

RUN npm install

RUN npm run build

# -------------------------------------
FROM node:20 AS runner

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install sharp

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY . .

RUN npm install

USER root

EXPOSE 4000
ENV PORT 4000

CMD ["npm", "run", "start"]
