#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

attempts=0
if ! [[ "$(docker container inspect -f '{{.State.Running}}' orion_graphql-server)" = "true" ]]; then
    docker network create joystream_default || true
    docker-compose up -d orion_db
    until docker-compose logs orion_graphql-server | grep "listening on port 4350" || attempts == 10; do
        docker-compose logs --tail 10 orion_graphql-server
        echo "Waiting for the graphql server to be ready..."
        attempts=$((attempts + 1))
        sleep 1
    done
fi
