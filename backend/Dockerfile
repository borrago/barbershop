FROM node:18-alpine

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Create uploads directory
RUN mkdir -p uploads

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make scripts executable
RUN chmod +x scripts/*.js

EXPOSE 3001

CMD ["npm", "run", "dev"] 