FROM node:24-alpine

WORKDIR /app

# Copy the dependency manifests first, so source-only edits reuse this cached layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3000
USER node
CMD ["node", "src/server.js"]