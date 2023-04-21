#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

CONTAINER_ID=$(./run-node-docker.sh)

function cleanup() {
    docker logs ${CONTAINER_ID} --tail 15
    docker stop ${CONTAINER_ID}
    docker rm ${CONTAINER_ID}
    docker-compose -f ./docker-compose.node.yml down -v
}

trap cleanup EXIT

sleep 3

DEBUG=integration-tests:* npm run node-ts-strict ./src/scenarios/creatorToken.ts

