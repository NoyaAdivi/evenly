# ---------- stage 1: install production dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# ---------- stage 2: small, non root runtime image ----------
FROM node:22-alpine AS runtime
ARG GIT_SHA=local
ENV NODE_ENV=production \
    PORT=3000 \
    GIT_SHA=${GIT_SHA}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1
CMD ["node", "src/server.js"]
