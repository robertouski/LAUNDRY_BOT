FROM node:18-bullseye as app

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libfreetype6 \
    libharfbuzz0b \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
