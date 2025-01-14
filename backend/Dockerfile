FROM node:22

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

CMD ["npm", "run", "start"]