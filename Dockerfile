FROM node:8-alpine

# Add app user to enable running the container as an unprivileged user
RUN addgroup -S app && adduser -S -G app app

RUN apk add -U --no-cache curl su-exec

WORKDIR /home/app

EXPOSE 4000

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY build build

ENV NODE_ENV=production
RUN yarn install

CMD node build/index.js
