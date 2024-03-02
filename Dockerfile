FROM node:20-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY . .
RUN npm run build

ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD [ "npm", "start" ]

