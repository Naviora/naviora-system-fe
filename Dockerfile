# Multi-stage Dockerfile for Next.js application
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Accept env vars before build (IMPORTANT)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SIGNALING_URL
ARG NEXT_PUBLIC_TINYMCE_API_KEY
ARG NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_URLS
ARG NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_USERNAME
ARG NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_CREDENTIAL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SIGNALING_URL=$NEXT_PUBLIC_SIGNALING_URL
ENV NEXT_PUBLIC_TINYMCE_API_KEY=$NEXT_PUBLIC_TINYMCE_API_KEY
ENV NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_URLS=$NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_URLS
ENV NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_USERNAME=$NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_USERNAME
ENV NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_CREDENTIAL=$NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_CREDENTIAL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Development stage
FROM base AS development
WORKDIR /app

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

# Install all dependencies (including devDependencies)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

EXPOSE 3001
ENV PORT 3001

# Start the development server
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /app

ENV APP_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts using standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3002
ENV PORT 3002

# Choose runtime based on APP_ENV
CMD ["node", "server.js"]