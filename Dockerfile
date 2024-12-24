FROM ghcr.io/puppeteer/puppeteer:20.8.0

# Set working directory
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./

# Change ownership of files to the "pptruser"
RUN chown -R pptruser:pptruser /app

# Switch to "pptruser" (already the default user in the Puppeteer image)
USER pptruser

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Start the application
CMD ["node", "index.js"]
