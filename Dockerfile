FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Persistent state (SQLite database + uploaded audio) lives in /app/.data —
# mount a volume there in production.
RUN mkdir -p .data
VOLUME ["/app/.data"]

EXPOSE 3000
CMD ["npm", "start"]
