# Quick start

## 1. Run Orion v2 alongside Joystream monorepo local playground

```bash
# Clone the Joystream repository (if not already done)
git clone https://github.com/Joystream/joystream.git
cd joystream

# If needed, run the setup script:
# ./setup.sh

# Enable testing profile for the runtime
export RUNTIME_PROFILE=TESTING

# Build packages
yarn build:packages

# Build/pull joystream-node docker image
yarn build:node:docker

# Start local Joystream playground
yarn start

# Clone the Orion v2 repository
cd ..
git clone https://github.com/Lezek123/orion
cd orion
git checkout orion-v2

# Prepare & build the code
make prepare

# Start all services (archive + orion-v2)
make up

# The GraphQL playground should now accessible at http://localhost:4350/graphql!

# Kill the services once done
make down
```

## 2. Run Orion v2 w/ local archive and custom Joytream node websocket endpoint

```bash
# Clone the Orion v2 repository
# ...(just like in 1.)

# Use custom WS_SOURCE for local Squid archive service
export WS_SOURCE=wss://rpc.joystream.org:9944
# Start all services (archive + orion-v2)
make up

# The GraphQL playground should now accessible at http://localhost:4350/graphql!

# Kill the services once done
make down
```

## 3. Run Orion v2 w/ remote archive

```bash
# Clone the Orion v2 repository
# ...(just like in 1.)

# Use custom Squid archive url
export CUSTOM_ARCHIVE_GATEWAY_URL=https://joystream.archive.subsquid.io/graphql
# Start orion-v2 services (no local archive instance will be launched)
make up-squid

# The GraphQL playground should now accessible at http://localhost:4350/graphql!

# Kill the services once done
make down
```

## Commands

- `make typegen` - generates event types (`src/types`) based on `typegen.json` (the archive endpoint provided in `specVersions` must be pointing to a running archive)
- `make codegen` - generates TypeORM models based on the [input schema](#input-schema)
- `make dbgen` - generates database migration in `db/migrations` (PostgreSQL service must be running) based on the difference between current database schema and TypeORM models
- `make build` - builds the code
- `make prepare` - runs `npm install + codegen + build`
- `make process` - runs the processor locally (w/o docker)
- `make serve` - runs the GraphQL server locally (w/o docker)
- `make up-squid` - runs dockerized `db` + `processor` + `graphql-server` (`docker-compose up -d`)
- `make up-archive` - runs dockerized `archive_db` + `subsquid-gateway` + `archive-ingest` (indexer) + `archive-explorer` (`docker-compose -f archive/docker-compose.yml up -d`)
- `make up` - runs `up-squid` + `up-archive`
- `make down-squid` - kills docker services and volumes created by `up-squid`
- `make down-archive` - kills docker services and volumes created by `up-archive`
- `make down` - kills docker services and volumes created by both `up-squid` and `up-archive`


# Architecture

## Overview

- [`/archive`](../archive/): a [Squid archive](#squid-archive) docker setup, 
- [`/schema`](../schema/) - GraphQL [input schemas](#input-schema),
- [`/src/server-extension`](../src/server-extension/) - [GraphQL server extensions (resolvers)](#custom-type-graphql-resolvers)
- [`/src/model`](../src/model/) - [TypeORM models](#typeorm-models)
- [`/src/processor.ts`](../src/processor.ts) - [Subquid processor setup](#processor-substratebatchprocessor)
- [`/src/mappings`](../src/mappings/) - [Event handlers / mappings](#event-handlers)
- [`/db/migrations`](../db/migrations/) - [PostgreSQL database migrations](#migrations)
- [`/src/utils/overlay.ts`](../src/utils/overlay.ts) - [Overlay utilities for managing in-memory entity cache](#overlay)

## Squid Archive

A [Squid Arachive](https://docs.subsquid.io/archives/) is analogous concept to the Joystream's Query Node _Indexer_. It uses the Joystream node websocket endpoint to fetch data about blocks, events and extrinsics and store it in a relational database (PostgreSQL).

It can be configured via a docker-compose file located in [`archive/docker-compose.yml`](../archive/docker-compose.yml).

Currently the default configuration is to use the websocket endpoint of a Joystream docker node (`ws://joystream-node:9944`) that runs on `joystream_default` network as a data source.

The websocket endpoint can be set via `WS_SOURCE` environment variable.

Archive's GraphQL explorer is by default available on http://localhost:4444/graphql 

## Processor (`SubstrateBatchProcessor`)

[`SubstrateBatchProcessor`](https://docs.subsquid.io/develop-a-squid/substrate-processor/) is a class we use to instantialize the events processor. As opposed to Hydra framework, where we would only implement the event handlers (or "mappings"), Subsquid let's us instantialize and programatically configure the processor instance ourselves (`manifest.yml` file is no longer required), which gives us more controll over its behavior.

`SubstrateBatchProcessor` is just one of the many processor implementations available in Subsquid, but it's the one currently recommended for processing substrate events and extrinsics. This specific processor implementation queries all blocks along with the events of interest from the Squid Arachive (using the `@subsquid/substrate-gateway` service). The maximum number of blocks in a single batch currently depends on the `@subsquid/substrate-gateway` implementation. Currently there are two main components that affect the size of the returned batch:
- [the time it takes to read & prepare a batch (by the gateway) is limited to 5 seconds](https://github.com/subsquid/substrate-gateway/blob/main/substrate-archive/src/postgres/partial.rs#L32)
- [the size of the batch is limited to "1 MB", however, this depends on some assumptions about "average" event/call/extrinsic size, so the actual final batch size may be much greater](https://github.com/subsquid/substrate-gateway/blob/main/substrate-archive/src/postgres/partial.rs#L57)

#### Current implementation:

In Orion v2 the implmenetation of the `SubstrateBatchProcessor` processor can be found [here](../src/processor.ts). 

As you can see the `SubstrateBatchProcessor` is given `new TypeormDatabase({ isolationLevel: 'READ COMMITTED' })` instance in this case. This `TypeormDatabase` instance is then used by the processor to perform any operations on the underlying PostgreSQL database. The `isolationLevel: 'READ COMMITTED'` isolation level elimiates the possibility of conflicts that could arise when the database state is being modified by both the processor and via the external graphql api (through mutations)


## Input schema

_Input schema_ is the graphql schema from which both the [TypeORM models](#typeorm-models) (`src/model/generated`) and the final graphQL server api are generated.

The current input schema files can be found [here](/schema).

The Subsquid input schema documentation can be found [here](https://docs.subsquid.io/develop-a-squid/schema-file/). 


## TypeORM models

As mentioned in the previous section, most of the TypeORM models are autogenerated from the _input schema_ (via `make codegen` command) and placed in `src/model/generated` directory. 

Besides those autogenerated models, some custom, handcrafted models can also be added in [`src/model`](`src/model`). Those models, along with the autogenerated ones, will be then used to generate a [migration](#migrations) which defines the final shape of the underlying PostgreSQL database.

In general, custom models can be used for entities that should not be exposed publicly (an alternative approach is to hide the non-public entities using [views](#2000000000000-viewsjs)). All the entities defined in _input schema_ will have corresponding graphql queries automatically generated, which will expose all their data to the public. This is not always desired, as some entities may include private data (like e-mails, ip adresses etc.).

The limitation of declaring non-public entities inside `src/model` is that although they can include relations to public entities defined in the input schema, it doesn't work the other way around.

## Migrations

Migrations are JavaScript files which specify queries to execute when the PostgreSQL database is being setup.

Migrations are located in [`db/migrations`](../db/migrations/) directory.

### Migration generated from TypeORM models

A migration which sets up an intial PostgreSQL database schema (tables, indexes, relations etc.) can be autogenerated from the TypeORM models. In order to do this, however, you have to first start a local PostgreSQL database service.

```bash
# Oftentimes you'll first want to remove the old migration(s)
rm db/migrations/*-Data.js
# Start PostgreSQL database service
docker-compose up -d orion_db
# Generate the new migration
make dbegen
```

This will generate a file like `xxxxxxxxxxxxx-Data.js` inside `db/migrations`, where `xxxxxxxxxxxxx` is the current timestamp.

### Custom migrations

Besides the migration autogenerated from TypeORM models, Orion v2 includes two custom migrations that should always be executed after the initial migration:

#### `2000000000000-Views.js`

This migration generates `public` views for tables like `channel`, `video`, `video_view_event` etc., which allows introducing global filters for all publically exposed entities of given type. The use-cases for this include:
- default filtering out of the content that doesn't belong to any of the categories supported by the gateway,
- default filtering out of the censored content (and all related entities),
- default filtering out of the content excluded by the gateway operator (and all related entities),
- default filtering out of the entities that may include sensitive information, but could still be useful for the operator to be able to query using the api (like channel reports, channel follows and video view events which include the client IP addresses) 

The migration also introduces `processor` database schema, through which the original tables (which include filtered-out data) can be accessed (for example, by the processor or authorized gateway operator).

#### `2100000000000-Indexes.js`

This migration specifies additional indexes on `jsonb` fileds, which are not currently supported through _input schema_.

## Overlay

[Overlay](src/utils/overlay.ts) is an additional memory layer which allows persisting entities in a memory cache, retrieving them (based on id or relations) and performing updates on them, before saving the final state into the database.

This allows combining the result of multiple mutations that happen within the same batch of processed events (see: [`SubstrateBatchProcessor`](#processor-substratebatchprocessor)) into a single database update, as well as batching of INSERT/UPDATE/DELETE operations, which significantly reduces the processing speed.

The `EntityManagerOverlay` is part of the event handler context and is used for managing (creating, updating, retrieving) entities within the event handlers.

## Event handlers

Event handlers (mappings) are responsible for executing the state transitions that should occur when processing a Joystream blockchain event of a given type (for example `Content.VideoCreated`).
They can be found in the [`src/mappings`](../src/mappings/) directory.

Adding a new event to be handled by the processor currently requires the following changes:
- Adding it to [`typegen.json`](../typegen.json) file to inform the Subsquid typegen (`make typegen`) to generate types for this event based on chain metadata
- After running `make typegen`: Adding a mapping from an event name to its constructor inside [`src/utils/events.ts`](../src/utils/events.ts) (`eventConstructors`)
- Adding an event to `SubstrateBatchProcessor` instance via `addEvent` method inside [`src/processor`](../src/processor.ts), to instruct the processor to retrieve events of this type from the archive through `@subsquid/substrate-gateway`
- Implementing a handler function inside `src/mappings` which takes `EventHandlerContext<'{EventModule}.{EventMethod}'>` as argument (replace `{EventModule}.{EventMethod}` accordingly)
- Adding a mapping from event name to handler function inside [`src/processor`](../src/processor.ts) (`eventHandlers`)

## Orion GraphQL API

The Orion GraphQL API is partially autogenerated from the [input schema](#input-schema) by the `@subsquid/openreader` utility.

However, Subsquid also supports adding custom [`type-graphql`](https://typegraphql.com/) resolvers to the autogenerated api.
Those resolvers are defined in the [`src/server-extension/resolvers`](../src/server-extension/resolvers) directory and constitute a significant part of the Orion v2 API.

### Custom `type-graphql` Resolvers

[Custom `type-graphql` resolvers](https://docs.subsquid.io/develop-a-squid/graphql-api/custom-resolvers/) make it possible to define additional queries, mutations and subsriptions that will be then merged with the autogenerated GraphQL schema & resolvers, to produce the final GraphQL api exposed by `@subsquid/graphql-server` (for example, when running `make serve`).

#### "Placeholder" types for autogenerated GraphQL types

Because of the way this merge is performed, it is possible to use "placeholder" types for the autogenerated GraphQL types, which we cannot access from the custom resolvers directly. Examples of such placeholder types can be found in [`src/server-extension/resolvers/baseTypes.ts`](../src/server-extension/resolvers/baseTypes.ts). When the autogenerated GraphQL schema is merged with the custom resolvers, those placeholder type definitions are merged with the definitions generated by `@subsquid/openreader`. Currently, because of the [patched version of `@subsquid/graphql-server`](/patches/@subsquid+graphql-server+3.2.3.patch) used by Orion v2, the autogenerated definitions take priority (note however, that if you specify a property in a placeholder type that doesn't exits in the autogenerated type, it will be added, as this is a non-conflicting change).

#### Custom queries

Custom resolvers may define custom GraphQL queries that either extend the functionality provided by the autogenerated queries or have a completely customized logic.

To facilitate extending the queries, some utility functions were introduced in [`/src/utils/sql.ts`](src/utils/sql.ts). Using those functions we can easily extend PostgreSQL queries that can be generated from the user input with `@subsquid/openreader`.

For example, inside [`src/server-extension/resolvers/ChannelsResolver/index.ts`](src/server-extension/resolvers/ChannelsResolver/index.ts) you can find a query called `extendedChannels`, which build on the `channels` listing query (one of the autogenerated queries), but includes additional information about number of active videos (videos that meet certain criteria) per channel.

Notice that each resolver method can access an entity manger that gets injected into each custom resolver via its constructor, in order to execute queries against Orion's PostgresQL database. 

#### Mutations

Custom resolvers may also define mutations which modify the database state. Note that since both the processor and graphql server operate on the same database, some extra care needs to be taken to not break any assumptions that the processor might be relying on.

Example mutation: `addVideoView` inside [`src/server-extension/resolvers/VideosResolver/index.ts`](../src/server-extension/resolvers/VideosResolver/index.ts)

#### Authentication

Because of [a patch](/patches/@subsquid+graphql-server+3.2.3.patch) that was added to `@subsquid/graphql-server`, the HTTP request data (like ip address, headers etc.) is accessible through GraphQL context, making it possible to introduce reusable authentication middleware.

Currently in Orion v2 there is only one middleware called [`OperatorOnly`](../src/server-extension/resolvers/middleware.ts), which can be used to secure endpoints that should only be accessible for the gateway operator. Those endpoints will require the `OPERATOR_SECRET` (defined in [`.env`](.env)) to be provided in `x-operator-secret` http header.