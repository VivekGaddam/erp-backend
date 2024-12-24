FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Set environment variable for Puppeteer executable
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Install dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon-x11-0 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libasound2 \
    libx11-xcb1 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "server.js"]
