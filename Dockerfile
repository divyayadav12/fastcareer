FROM node:20-slim

WORKDIR /app

# Copy package files and install only production dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy already compiled dist and create uploads folder
COPY backend/dist ./dist
RUN mkdir -p uploads

EXPOSE 5000
ENV PORT=5000

CMD ["node", "--max-old-space-size=450", "dist/server.js"]
