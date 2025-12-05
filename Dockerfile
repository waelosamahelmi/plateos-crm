# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_OPENROUTER_API_KEY
ARG VITE_EMAIL_PASSWORD

# Set environment variables for the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV VITE_EMAIL_PASSWORD=$VITE_EMAIL_PASSWORD

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
