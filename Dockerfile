FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Set environment variable for Puppeteer executable
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "server.js"]
