FROM node:18-alpine

# Establish a working folder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source files last because they change the most
COPY service ./service

# Create non-root user
RUN addgroup -g 1001 -S service && \
    adduser -S service -u 1001 && \
    chown -R service:service /app

USER service

# Run the service on port 8000
ENV PORT=8000
ENV NODE_ENV=production
EXPOSE $PORT

CMD ["node", "service/app.js"]