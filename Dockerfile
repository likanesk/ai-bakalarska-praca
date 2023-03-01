# Development
FROM node:lts-alpine AS development

RUN apk update \
 && apk add curl bash make \
 && rm -rf /var/cache/apk/*

# Specify our working directory, this is in our container/in our image
WORKDIR /ecb-exchange-rates-rest-api/src/app

# Copy the package*.json from host to container
COPY package*.json ./

# Here we install all the deps
RUN npm install -g npm@9.3.1 \
 && npm install glob rimraf \ 
 && npm install --only=development

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build


#
# Production
FROM node:lts-alpine as production

# ENV variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Specify our working directory, this is in our container/in our image
WORKDIR /ecb-exchange-rates-rest-api/src/app

# Copy the package*.json from host to container
COPY package*.json ./

# Here we install all the deps
RUN npm install --only=production

# Bundle app source / copy all other files
COPY . .
COPY --from=development /ecb-exchange-rates-rest-api/src/app/dist ./dist

# Port number
EXPOSE 3000

# # Run app
CMD [ "node", "dist/main" ]
