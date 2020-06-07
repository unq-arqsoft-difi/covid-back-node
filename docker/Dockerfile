# Builder container
FROM node:13-alpine as builder
ENV NODE_ENV=production

WORKDIR /opt/app

COPY  .sequelizerc index.js package.json yarn.lock ./
COPY  src ./src
COPY  db ./db

RUN yarn install --production --frozen-lockfile 

# Deploy container
FROM node:13-alpine
ENV NODE_ENV=production

COPY --from=builder /opt/app /opt/app
WORKDIR /opt/app

CMD [ "yarn", "start:production" ]