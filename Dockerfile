# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (including devDependencies for building/testing)
RUN npm install

# Copy the rest of your application code
COPY . .

# Optional: Run your build script (if using TypeScript or React)
# RUN npm run build

# Stage 2: Final Runtime Image
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Security: Don't run as root. 'node' user is built into the official image.
USER node

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]