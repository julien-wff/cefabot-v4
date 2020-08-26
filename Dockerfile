# ----- Base node -----
FROM node:12.18.2-stretch-slim AS base
WORKDIR /cefabot
RUN apt update && apt install -y python3 make ffmpeg opus-tools build-essential && rm -rf /var/lib/apt/lists/*


# ----- Dependencies -----
FROM base AS dependencies

# Bot dependencies
COPY package.json ./
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

# Web dependencies
WORKDIR web
COPY web/package.json ./
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install


# ----- Build -----
FROM base AS build
RUN npm install typescript@3.9.7 node-gyp postcss-cli -g --silent
WORKDIR /cefabot
COPY . ./

# Build bot
COPY --from=dependencies /cefabot/node_modules ./node_modules
RUN npm run build

# Build web
WORKDIR web
COPY --from=dependencies /cefabot/web/node_modules ./node_modules
COPY ./web/rollup-plugin-svelte/index.js ./node_modules/rollup-plugin-svelte/index.js
RUN npm run build


# ----- Release -----
FROM base AS cefabot

LABEL maintainer="cefadrom <cefadrom1@gmail.com>"
LABEL description="The 4th version of my discord bot, with multiple bot clients support, and a web panel"

# Install bot
WORKDIR /cefabot
COPY --from=dependencies /cefabot/prod_node_modules ./node_modules
COPY --from=build /cefabot/lib ./lib
COPY scripts scripts

# Install web
WORKDIR web
COPY --from=dependencies /cefabot/web/prod_node_modules ./node_modules
COPY --from=build /cefabot/web/public ./public

WORKDIR /cefabot
CMD node lib/app.js
