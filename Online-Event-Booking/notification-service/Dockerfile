# Stage 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies separately for caching
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Final image
FROM node:18-alpine
WORKDIR /app

# Create non-root user and set permissions
RUN adduser -D myuser && \
    mkdir -p /app && \
    chown -R myuser:myuser /app

# Copy from builder
COPY --from=builder --chown=myuser:myuser /app/node_modules ./node_modules
COPY --chown=myuser:myuser . .

USER myuser

EXPOSE 3001

CMD ["node", "src/index.js"]