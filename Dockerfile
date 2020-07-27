FROM node:12.18.2-stretch-slim

LABEL maintainer="cefadrom <cefadrom1@gmail.com>"
LABEL version="1.0"
LABEL description="The 4th version of my discord bot, with multiple bot clients support, and a web panel"

WORKDIR /cefabot-v4

RUN apt update && apt install -y python3 make ffmpeg opus-tools build-essential && rm -rf /var/lib/apt/lists/*

RUN npm install typescript@3.9.7 node-gyp postcss-cli -g --silent


# Installing the bot
COPY package.json ./
RUN npm install --silent

COPY . ./

RUN npm run build --slient


# Installing the web panel
WORKDIR web

RUN npm install --silent

RUN npm run build --slient


# Starting
WORKDIR /cefabot

CMD node lib/app.js
