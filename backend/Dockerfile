FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]