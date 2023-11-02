FROM node:18
WORKDIR /usr/src/clean-node-api

COPY ./package.json .
RUN yarn --prod

COPY ./dist ./dist

EXPOSE 5009

CMD yarn start
