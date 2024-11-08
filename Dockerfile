# Dockerfile for Fragments UI microservice

# Stage 0: install the base dependencies
FROM node:18.18.2@sha256:a6385a6bb2fdcb7c48fc871e35e32af8daaa82c518900be49b76d10c005864c2 AS dependencies

WORKDIR /app

# Copy both package.json and package-lock.json to WORKDIR
COPY package*.json ./

# Install node dependencies (production) defined in package-lock.json
RUN npm ci --only=production

###############################################################################################

# Stage 1: build with the dependencies
FROM node:18.18.2-alpine@sha256:435dcad253bb5b7f347ebc69c8cc52de7c912eb7241098b920f2fc2d7843183d AS build

WORKDIR /app

# Copy cached dependencies (node_modules) from previous stage
COPY --from=dependencies /app /app

# Copy src from local to docker /app/
COPY ./ ./

# Copy .env file from local to docker
COPY .env .env

# Build the app
RUN npm run build


###############################################################################################

# Stage 2: deploy with the dependencies
FROM nginx:1.24.0-alpine@sha256:62cabd934cbeae6195e986831e4f745ee1646c1738dbd609b1368d38c10c5519 AS deploy

# Copy built Next.js app to nginx html directory
COPY --from=build /app/out /usr/share/nginx/html

# Copy nginx configuration to nginx configuration directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Start the nginx server with daemon off
CMD ["nginx", "-g", "daemon off;"]

# We run our service on port 80
EXPOSE 80
