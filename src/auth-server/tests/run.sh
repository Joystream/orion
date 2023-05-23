#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

if ! [[ "$( docker container inspect -f '{{.State.Running}}' orion_db )" = "true" ]]; then
    docker network create joystream_default || true
    docker-compose up -d orion_db
    until docker-compose logs orion_db | grep "database system is ready to accept connections"; do
    docker-compose logs --tail 10 orion_db
    echo "Waiting for the db to be ready..."
    sleep 1
    done
    make migrate
fi

# Run the tests
npx ts-mocha "./src/auth-server/tests/*.ts" --timeout 60000 --exit