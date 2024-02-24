# Node version
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json .
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
RUN npm install --production

# -------------------------------------

FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json next.config.js tsconfig.json ./
COPY . .
RUN npm run build

# -------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
