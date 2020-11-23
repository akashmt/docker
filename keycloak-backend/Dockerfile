FROM node:14-slim


# ARG NODE_ENV=development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["server.js"]