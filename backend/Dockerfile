FROM node:20-alpine

RUN apk add --no-cache bind-tools

COPY package*.json ./

RUN npm ci  

USER node

COPY --chown=node:node . . 

CMD ["npm", "run", "otel"]
