FROM node:12-stretch

RUN npm i -g pm2

USER node

RUN mkdir /home/node/project

WORKDIR /home/node/project

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "run", "start:dev"]