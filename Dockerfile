FROM node:alpine

RUN mkdir /asanbalada
WORKDIR /asanbalada
ADD api lib public index.js package.json .
RUN npm install

CMD ["npm", "start"]
