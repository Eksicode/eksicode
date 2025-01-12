FROM node:22

COPY package.json ./

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]