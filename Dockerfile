FROM node:20-slim

WORKDIR /app

# Copy package files and install only production dependencies with legacy peer deps
COPY backend/package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy pre-compiled JavaScript
COPY backend/dist ./dist
RUN mkdir -p uploads

EXPOSE 5000
ENV PORT=5000

CMD ["node", "--max-old-space-size=450", "dist/server.js"]
