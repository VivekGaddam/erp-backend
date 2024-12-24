# FROM ghcr.io/puppeteer/puppeteer:23.11.1

# # Set environment variable for Puppeteer executable
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# WORKDIR /usr/src/app

# # Install dependencies required by Puppeteer
# RUN apt-get update && apt-get install -y \
#     libnss3 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libcups2 \
#     libxkbcommon-x11-0 \
#     libxcomposite1 \
#     libxrandr2 \
#     xdg-utils \
#     libgbm1 \
#     libasound2 \
#     libx11-xcb1 && \
#     rm -rf /var/lib/apt/lists/*

# COPY package*.json ./
# RUN npm ci
# COPY . .

# CMD ["node", "server.js"]

# Use the official Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:20.8.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose a port (optional, adjust if needed)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

