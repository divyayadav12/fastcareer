FROM node:20-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install all dependencies (including dev for typescript compilation)
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build typescript to dist/
RUN npm run build

# Expose port (Render sets PORT env automatically)
EXPOSE 5000

# Start server
CMD ["npm", "start"]
