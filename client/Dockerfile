# Use an official Node.js runtime as a parent image (using Node 18 as requested)
FROM node:18

# Set the working directory in the container
WORKDIR /app

COPY .env.production .env.development

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local code to the container's workspace
COPY . .

# Run build script with more verbose output
RUN npm run build --verbose

# Expose the port the app runs on
EXPOSE 3000

# Run the app using npm start (suitable for development)
CMD ["npm", "start"]
