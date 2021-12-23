FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

ENV NODE_ENV production
# this arg exists for successful build outside of dokku: use "--build-arg DATABASE_URL=postgres://foo" when building locally
ARG DATABASE_URL

COPY db/ ./db/

COPY . .
RUN npm run generate
RUN npm run build

COPY .env.production .env

EXPOSE 8080

CMD npm run start
# best practice is to leave below uncommented so the user isn't root, but I'm getting a permission denied error on dokku's build so I'm leaving it
# USER node
