# Dockerfile for the main API backend
FROM node:18-alpine

WORKDIR /app

# Install dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the server with compiled JS
CMD ["npm", "run", "start:prod"]
