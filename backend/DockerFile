FROM node:20-alpine

WORKDIR /usr/app/src

COPY package*.json ./

ENV NODE_ENV=production

RUN  --mount=type=cache,target=/usr/app/src/.npm \ 
    npm set cache /usr/app/src/.npm && \
    npm ci  


USER node

COPY --chown=node:node . . 

CMD [ "npm","run","dev" ]