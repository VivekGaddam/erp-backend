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
