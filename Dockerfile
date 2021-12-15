FROM node:16.13
WORKDIR /usr/src/orion

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn run build

CMD ["yarn", "start"]
