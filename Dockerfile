FROM node:18-alpine

WORKDIR /app

# Installs latest Chromium and necessary fonts.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . .
RUN npm install

CMD ["npm", "start"]
