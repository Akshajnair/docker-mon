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

# If production, build the TypeScript files and React frontend
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi
RUN if [ "$NODE_ENV" = "production" ]; then cd frontend && npm run build; fi

# Expose the port specified in the .env file or default
EXPOSE ${PORT}

# Command to run the app using Node's built-in .env support
CMD ["node", "dist/index.js"]