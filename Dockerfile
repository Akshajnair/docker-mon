# Dockerfile

# Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy code into the container
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src
COPY frontend/ ./frontend

# Install dependencies
RUN npm ci
RUN cd frontend && npm ci

# Build TypeScript files
RUN npm run build
RUN cd frontend && npm run build

# Expose the port specified in the .env file or default
EXPOSE ${PORT}

# Command to run the app using Node's built-in .env support
CMD ["node", "dist/index.js"]