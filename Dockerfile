# Image source
FROM node:16-alpine

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json /app/

RUN apk update && \
  apk add git
# Then install the NPM module
RUN yarn install

# Copy current directory to APP folder
COPY . /app/

EXPOSE 5000
CMD ["npm", "run", "start:dev"]
