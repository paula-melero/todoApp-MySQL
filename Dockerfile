# 1. Build phase
FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
# Bundle app source
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
# Define command to run app
CMD [ "node", "server.js" ]


