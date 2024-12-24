FROM ghcr.io/puppeteer/puppeteer:20.8.0

# Set working directory
WORKDIR /app

# Copy files and set ownership to pptruser during copy
COPY --chown=pptruser:pptruser package.json package-lock.json ./

# Install dependencies
USER pptruser
RUN npm install

# Copy the rest of the app
COPY --chown=pptruser:pptruser . .

# Start the application
CMD ["node", "server.js"]
