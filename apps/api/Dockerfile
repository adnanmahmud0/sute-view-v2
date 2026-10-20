# ── Stage 1: Prune monorepo for @repo/api
FROM node:22-bookworm-slim AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune @repo/api --docker

# ── Stage 2: Install dependencies & Build
FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci --ignore-scripts

COPY --from=pruner /app/out/full/ .
RUN npx turbo run build --filter=@repo/api

# ── Stage 3: Minimal Production Runner
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000 \
    IP_ADDRESS=0.0.0.0

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy pruned manifest & install production dependencies only
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled backend dist, prisma schema, and generated client from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Create directories for persistent volumes (uploads and winston logs)
RUN mkdir -p /app/apps/api/uploads /app/apps/api/winston && \
    chown -R expressjs:nodejs /app

USER expressjs
WORKDIR /app/apps/api
EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://127.0.0.1:5000/health/live || exit 1

CMD ["node", "dist/server.js"]
