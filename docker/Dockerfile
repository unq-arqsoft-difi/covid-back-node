# Builder stage
FROM node:13-alpine as builder
ENV NODE_ENV=production

WORKDIR /opt/app

COPY .sequelizerc index.js package.json package-lock.json /opt/app/
COPY wait-for-it.sh /opt/app/
COPY src/ /opt/app/src/
COPY db/config.json /opt/app/db/config.json
COPY db/migrations/ /opt/app/db/migrations/
COPY db/models/ /opt/app/db/models/
COPY db/seeders/ /opt/app/db/seeders/

RUN chmod +x /opt/app/wait-for-it.sh
RUN npm install

# Deploy stage
FROM node:13-alpine
RUN apk add --no-cache bash=~5

ENV NODE_ENV=production

COPY --from=builder /opt/app/ /opt/app/
WORKDIR /opt/app

CMD [ "npm", "start" ]
