FROM node:20

RUN mkdir app

WORKDIR /app

RUN npm install -g typescript

COPY package*.json ./

COPY . ./

RUN npm install

RUN npm uninstall bcrypt

RUN npm i bcrypt

RUN npm run build

EXPOSE 9000

# Use production start script with clustering enabled
CMD ["npm", "run", "start:prod"]