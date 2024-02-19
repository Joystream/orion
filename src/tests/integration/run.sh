#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

if ! [[ "$(docker container inspect -f '{{.State.Running}}' orion_db)" = "true" ]]; then
    docker network create joystream_default || true
    docker-compose up -d orion_db &
    2>/dev/null
    until docker-compose logs orion_db | grep "database system is ready to accept connections" >/dev/null; do
        echo "Waiting for the db to be ready..."
        sleep 1
    done
    make migrate >/dev/null
fi

cleanup() {
    docker-compose down -v
}

# Run the tests
npx ts-mocha "./src/tests/integration/notifications.test.ts" --timeout 60000 --exit

trap cleanup EXIT
