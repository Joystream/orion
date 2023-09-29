#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

if ! [[ "$(docker container inspect -f '{{.State.Running}}' orion_db)" = "true" ]]; then
    docker network create joystream_default || true
    docker-compose up -d orion_db
    until docker-compose logs orion_db | grep "database system is ready to accept connections" >/dev/null; do
        sleep 1
    done
    make migrate >/dev/null
fi

cleanup() {
    docker-compose down -v
}

# Run the tests
npx ts-mocha "./src/mail-scheduler/tests/*.ts" --timeout 60000 --exit

trap cleanup EXIT
