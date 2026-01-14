FROM node:20

RUN mkdir /var/bot/

WORKDIR /var/bot/

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . /var/bot/

RUN npm run build

RUN npm install pm2 -g

CMD [ "pm2-runtime", "start", "pm2.json" ]
