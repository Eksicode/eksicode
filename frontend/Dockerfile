FROM node:22-alpine

WORKDIR /app

# Install necessary build dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install sharp specifically
RUN npm i sharp

# Build the application
RUN npm run build

EXPOSE 3000

# Add a health check script
COPY healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

CMD ["npm", "run", "start"]