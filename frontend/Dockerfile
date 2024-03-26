FROM node:20-alpine
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

COPY . ./

USER root
RUN npm install 
RUN npm i sharp


RUN npm run build

EXPOSE 4000

CMD npm run start
