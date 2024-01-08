FROM node:18-alpine AS node

FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
ADD assets assets
RUN npm ci
ADD tsconfig.json .
ADD typegen.json .
ADD joystream.jsonl .
ADD src src
ADD schema schema
ADD scripts scripts
RUN npx squid-typeorm-codegen
RUN npx squid-substrate-typegen typegen.json
RUN npm run build

FROM node-with-gyp AS deps
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
ADD assets assets
RUN npm ci --production

FROM node AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib
RUN echo -e "loglevel=silent\nupdate-notifier=false" > /squid/.npmrc
ADD db db
ADD assets assets
ADD schema schema
ADD scripts scripts
# TODO: use shorter PROMETHEUS_PORT
ENV PROCESSOR_PROMETHEUS_PORT 3000
EXPOSE 3000
EXPOSE 4000


FROM squid AS processor
CMD ["npm", "run", "processor-start"]


FROM squid AS query-node
CMD ["npm", "run", "graphql-server-start"]
