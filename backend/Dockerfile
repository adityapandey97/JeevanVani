# Multi-stage Dockerfile for JeevanVaani Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Production Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create unprivileged user for security
RUN addgroup -S jeevanvani && adduser -S jeevanvani -G jeevanvani

COPY --from=builder --chown=jeevanvani:jeevanvani /app /app

USER jeevanvani

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
