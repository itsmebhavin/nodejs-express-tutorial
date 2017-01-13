FROM node:slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
Run cd /usr/src/app/
Run npm install
Run node --version

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
#CMD [ "node", "./ch-16/ch-16_ExpressAPI_Docker.js" ]
#CMD [ "node", "ch-4_ExpressGetPost.js" ]
CMD ["node","./ch-10/server.js"]


