# 1. Pull node image from docker hub and build it
FROM node:10
# change working dir in container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
# copy everything in curr dir of machine into curr dir of container
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
# Define command to run app
CMD [ "node", "server.js" ]


