FROM node:20-alpine

WORKDIR /app

# Define build arguments
ARG NEXT_PUBLIC_BACKEND_URL=https://api-demo.eksicode.org
ARG NEXT_STATIC_PAGE_GENERATION_TIMEOUT=180
ARG NODE_OPTIONS="--max-old-space-size=4096"
ARG NEXT_PUBLIC_API_URL=http://backend:9000
ARG HOSTNAME=0.0.0.0
ARG PORT=3000
ARG NEXT_TELEMETRY_DISABLED=1
ARG NODE_ENV=production

# Install necessary build dependencies
RUN apk add --no-cache curl

# Copy the rest of the application
COPY . .

# Install dependencies
RUN npm install

# Install sharp specifically
RUN npm i sharp

# Build the application
RUN npm run build

EXPOSE 3000

# Add a health check script
COPY healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

CMD ["npm", "run", "start"]