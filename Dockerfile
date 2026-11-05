FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY local-server.js cloud.js ./
COPY public ./public
ENV HOST=0.0.0.0 PORT=3000 VAULT_PATH=/data/vault STATE_PATH=/data/state
EXPOSE 3000
CMD ["node", "server.js"]
