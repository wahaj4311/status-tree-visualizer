# Use an official Node runtime as a parent image
FROM node:23-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Note: We can't copy ../frontend directly because Docker can't access 
# paths outside the build context. The docker-compose.yml will handle this.

# Expose the port the aggregator runs on (including frontend/WebSockets)
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "server.js" ]
