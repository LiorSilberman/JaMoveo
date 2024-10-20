# Use an official Node.js runtime as a parent image (using Node 18 as requested)
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local code to the container's workspace
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app using npm start (suitable for development)
CMD ["npm", "start"]
