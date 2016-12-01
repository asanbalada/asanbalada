FROM node:alpine

RUN mkdir /asanbalada
WORKDIR /asanbalada
ADD api api
ADD lib lib
ADD public public
ADD index.js package.json ./
RUN npm install
RUN sed -i 's/localhost/0.0.0.0/g' index.js
CMD ["npm", "start"]
