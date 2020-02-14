FROM node:10-alpine

WORKDIR /

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

CMD ["yarn", "start"]