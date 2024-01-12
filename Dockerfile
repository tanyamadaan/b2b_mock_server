# Use an official Node.js runtime as a base image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the application code to the container
COPY . .

# Builds the Express Project
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the build environment
COPY --from=build /app/dist /app
COPY --from=build /app/node_modules /app/node_modules

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]