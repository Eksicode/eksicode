FROM node:22
# RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

COPY . ./

RUN npm i sharp

USER root

RUN npm install 

RUN npm run build

EXPOSE 3000

CMD npm run start