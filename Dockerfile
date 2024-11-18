FROM node:23

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# providing env variables
ENV PORT=3002
ENV ORIGIN="http://localhost:4000"
ENV LOKI_HOST="http://localhost:3100"

# Expose port 3002
EXPOSE 3002

# Command to start the application
CMD ["node", "express.js"]