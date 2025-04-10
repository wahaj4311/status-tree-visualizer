# Use an official Node runtime as a parent image
# Using a version that includes build tools might be safer for sqlite3
FROM node:23-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install required build tools for sqlite3 (on Debian-based Node images)
# RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
# Alpine version (if using node:18-alpine, but sticking to Debian for easier build tools)
# RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies including sqlite3
RUN npm install

# Bundle app source
COPY . .

# Define volume for the database file to persist data
# The actual mount will be handled by docker-compose
VOLUME /usr/src/app

# Expose the port Service A runs on
EXPOSE 3001

# Define the command to run your app
CMD [ "node", "server.js" ] 