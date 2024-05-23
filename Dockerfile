# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (Vite's default port)
EXPOSE 3500

# Set environment variables
ENV PORT="3500"
ENV isProduction='yes'


# Command to run the application in development mode with --host flag
CMD ["npm", "start"]
