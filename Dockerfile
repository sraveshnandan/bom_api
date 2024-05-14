# Stage 1: Build the application
FROM node:15 AS builder

WORKDIR /build

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

# Stage 2: Create a lightweight container to run the application
FROM node:15-alpine

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

# Expose the port your app runs on
EXPOSE 8000

# Command to run the application
CMD ["node", "./dist/app.js"]
