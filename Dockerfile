FROM node:20-bullseye-slim

# Set production env by default
ENV NODE_ENV=production

WORKDIR /app

# Install minimal system deps (ca-certificates are commonly required)
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Expose the port the app listens on (can be overridden by $PORT)
EXPOSE 3000

# Healthcheck (optional; some platforms ignore it)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:3000/ || exit 1

# Start the app. The app will read PORT from environment if provided by the host.
CMD ["node", "app.js", "--prod"]
