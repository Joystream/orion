#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

# start orion services
cd ..
make up
cd network-tests

sleep 10

CONTAINER_ID=$(./run-node-docker.sh)

function cleanup() {
    docker logs ${CONTAINER_ID} --tail 15
    docker stop ${CONTAINER_ID}
    docker rm ${CONTAINER_ID}
    docker-compose -f ../docker-compose.yml up -d
    docker-compose -f ../archive/docker-compose.yml up -d
    docker-compose -f ./docker-compose.node.yml down -v
    docker network rm joystream_default
}

# trap cleanup EXIT

sleep 3

export DEBUG=integration-tests:*
npm run node-ts-strict ./src/scenarios/token.ts
trap cleanup EXIT
