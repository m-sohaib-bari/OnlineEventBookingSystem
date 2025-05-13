# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy app files
COPY . .

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app

# Create non-root user (Alpine uses adduser)
RUN adduser -D myuser && \
    mkdir -p /app && \
    chown -R myuser:myuser /app

# Copy from builder
COPY --from=builder --chown=myuser:myuser /app/node_modules ./node_modules
COPY --from=builder --chown=myuser:myuser /app .

USER myuser

EXPOSE 3000
CMD ["node", "src/index.js"]