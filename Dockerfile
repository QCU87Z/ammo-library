# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install root deps
COPY package.json ./
RUN npm install

# Install server deps
COPY server/package.json server/
RUN cd server && npm install

# Install client deps
COPY client/package.json client/
RUN cd client && npm install

# Copy source
COPY shared/ shared/
COPY server/ server/
COPY client/ client/

# Build client
RUN cd client && npm run build

# Build server
RUN cd server && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/server/package.json server/
COPY --from=builder /app/server/dist/ server/dist/
COPY --from=builder /app/server/node_modules/ server/node_modules/
COPY --from=builder /app/client/dist/ client/dist/
COPY --from=builder /app/shared/ shared/

WORKDIR /app/server

ENV PORT=3000
ENV DATA_PATH=/data/data.json
ENV CLIENT_DIST=/app/client/dist

EXPOSE 3000

CMD ["node", "dist/server/src/index.js"]
