FROM node:lts-alpine3.20 AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine3.20 AS release

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY --from=base /app/package.json ./package.json

COPY --from=base /app/.next ./.next

EXPOSE 3000

# Add a health check script
COPY healthcheck.sh /healthcheck.sh

RUN chmod +x /healthcheck.sh

CMD ["npm", "run", "start"]