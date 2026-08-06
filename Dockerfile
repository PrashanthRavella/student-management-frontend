# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS test
RUN npm run lint && npm run test

FROM base AS builder
RUN npm run build

FROM nginx:1.29-alpine
ENV API_UPSTREAM=http://host.docker.internal:8000
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080/health || exit 1
