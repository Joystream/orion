# Running Orion locally

There are 3 most common ways to run Orion locally:
- [Running alongside local Joystream monorepo playground](#running-alongside-local-joystream-monorepo-playground)
- [Running w/ local Subsquid archive, but custom Joystream node WebSocket endpoint](#run-orion-v2-using-local-archive-and-custom-joytream-node-websocket-endpoint)
- [Running w/ custom Subsquid archive endpoint](#run-orion-v2-w-remote-archive)

## Running alongside local [Joystream monorepo](https://github.com/Joystream/joystream) playground

If you need a full local Joystream playground setup which includes:
- [Joystream node](https://github.com/Joystream/joystream/tree/master/bin/node) (dev chain)
- Orion
- [Subsquid archive](https://docs.subsquid.io/arrowsquid/archives/overview/)
- [Query node](https://github.com/Joystream/joystream/tree/master/query-node)
- [Storage node](https://github.com/Joystream/joystream/tree/master/storage-node)
- [Distributor node](https://github.com/Joystream/joystream/tree/master/distributor-node)

You can run it in the following way:

```bash
# Clone the Orion repository (if not already done)
git clone https://github.com/Joystream/orion
cd orion

# Build local `joystream/orion` docker image
make build-docker

# Clone the Joystream repository (if not already done)
cd ..
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
# (it may take a few minutes before the local chain is set up
# and all the services are up)
yarn start
```

### Local Orion endpoints

After executing those steps you will be able to access the local instance of Orion at:
- http://localhost:4074/playground ([Auth API](./tutorials/authentication-api.md) playground)
- http://localhost:4350/graphql (GraphQL API playground)

**The first step you should take in order to be able to interact with the GraphQL API is to [authenticate](./tutorials/authentication-api.md#anonymous-auth)!**

### Using `joystream-cli` to verify local setup

Once you have full local Joystream playground set up, you will be able to use the `joystream-cli` to integrate with the local Joystream node, Query node and Storage node in order to create channels and videos that will then be processed by Orion, for example:

```bash
# Skip manual confirmations
export AUTO_CONFIRM=true

# Create new membership using //Alice key (assumes you're in Joystream monorepo root directory)
./cli/bin/run membership:buy --handle alice --controllerKey j4W7rVcUCxi2crhhjRq46fNDRbVHTjJrz6bKxZwehEMQxZeSf --rootKey j4W7rVcUCxi2crhhjRq46fNDRbVHTjJrz6bKxZwehEMQxZeSf

# Create a new channel
CHANNEL_ID=$(./cli/bin/run content:createChannel -i ./cli/examples/content/CreateChannel.json --context Member)

# Create a video in the new channel
./cli/bin/run content:createVideo -i ./cli/examples/content/CreateVideo.json -c $CHANNEL_ID
```

## Run Orion v2 using local archive and custom Joytream node websocket endpoint

If you want to run the [Subsquid archive](https://docs.subsquid.io/arrowsquid/archives/overview/) locally, but you want to set a custom Joystream node websocket endpoint as a source of events, you can execute the following commands:

```bash
# Clone the Orion repository if not already done... (just like in the first section)

# Prepare the workspace
make prepare

# Set custom websocket endpoint for the local Subsquid archive service
export WS_SOURCE=wss://rpc.joystream.org:9944

# Start all services (archive + orion-v2)
make up
```

To see the progress of Subsquid archive sync, you can use:
```bash
docker logs --tail 10 -f orion_archive_ingest
```

To see the progress of Orion's processor sync:
```bash
docker logs --tail 10 -f orion_processor
```

The local Orion API endpoints are going to be the same as those described in the first section ([Local Orion endpoints](#local-orion-endpoints))

Once you're done with your tests, you can run `make down` to remove all Orion and Subsquid archive docker services.

Alternatively, since Subsquid archive and Orion services have separate `docker-compose.yml` files, you can bring them down separately by running:
```bash
# Bring down Orion:
docker-compose down -v

# Bring down the Subsquid archive:
docker-compose -f ./archive/docker-compose.yml down -v
```

## Run Orion v2 w/ remote archive

If the Joystream chain you're interested in has a public Subsquid archive available, you can use a custom archive endpoint to save the time it takes to sync all the events from the chain.

For example, the Joystream mainnet chain has a public archive maintained by Subsquid at https://joystream.archive.subsquid.io/graphql

```bash
# Clone the Orion repository if not already done... (just like in the first section)

# Prepare the workspace
make prepare

# Set custom Subsquid archive url
export CUSTOM_ARCHIVE_GATEWAY_URL=https://joystream.archive.subsquid.io/graphql

# Start Orion services (no local archive instance will be launched in this case)
make up-squid
```

To follow the progress of Orion's processor sync (since the archive is already synced this should only take 5-10 minutes):
```bash
docker logs --tail 10 -f orion_processor
```

Again, the local Orion API endpoints are going to be the same as those described in the first section ([Local Orion endpoints](#local-orion-endpoints))

After you're done with the tests you can use either `make down` or `docker-compose down -v` to bring down all Orion services.
