FROM node:alpine

RUN mkdir /asanbalada
WORKDIR /asanbalada
ADD api api
ADD lib lib
ADD public public
ADD index.js package.json ./
RUN npm install

CMD ["npm", "start"]
