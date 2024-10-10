# Dockerfile

# Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src

# Install dependencies
RUN npm ci

# Build TypeScript files
RUN npm run build

# Expose the port specified in the .env file or default
EXPOSE ${PORT}

# Command to run the app using Node's built-in .env support
CMD ["node", "dist/index.js"]