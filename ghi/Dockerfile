# Use the official Node.js image as base
FROM node:lts-bullseye

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]
