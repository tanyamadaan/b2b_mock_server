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

# Generate the Prisma Client
RUN npx prisma generate

# Builds the Express Project
RUN npm run build

FROM node:20-alpine AS ondc-mock-server

WORKDIR /app

# Copy only the necessary files from the build environment
COPY --from=build /app/dist /app
COPY --from=build /app/src/openapi /app/openapi
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/prisma /app/prisma

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["node", "--max_old_space_size=4096","index.js"]
