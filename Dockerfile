# ----- Base node -----
FROM node:12.22.7-stretch-slim AS base
WORKDIR /cefabot
RUN apt update && apt install -y libcairo2-dev libpango1.0-dev libjpeg-dev && rm -rf /var/lib/apt/lists/*


# ----- Setup -----
FROM base AS setup

# Build packages
RUN apt update && apt install -y make pkg-config build-essential python libsqlite3-dev && rm -rf /var/lib/apt/lists/*

# NPM config
RUN npm set progress=false && npm config set depth 0

# Bot dependencies
COPY package.json ./
RUN npm install --production --no-package-lock && cp -r node_modules prod_node_modules && npm install --no-package-lock

# Web dependencies
WORKDIR web
COPY web/package.json ./
RUN npm install --no-package-lock

# Bot build
WORKDIR /cefabot
COPY . ./
RUN npm run build

# Web build
WORKDIR web
RUN npm run build


# ----- Release -----
FROM base

LABEL maintainer="cefadrom <cefadrom1@gmail.com>"
LABEL description="The 4th version of my discord bot, with multiple bot clients support, and a web panel"

# Install bot
WORKDIR /cefabot
COPY . ./
COPY --from=setup /cefabot/prod_node_modules ./node_modules
COPY --from=setup /cefabot/lib ./lib
COPY --from=setup /cefabot/web/public/build ./web/public/build

CMD node lib/app.js
