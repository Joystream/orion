#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

# start the archive db and gateway
docker network create joystream_default || true
cd archive
docker-compose up -d archive_db
docker-compose up -d gateway
cd ..

# copy export file
mkdir -p ./db/export
cp ./src/tests/migrations/export.json ./db/export/export.json

# load the archive db
until docker logs orion_archive_db | grep "database system is ready to accept connections" >/dev/null; do
    sleep 1
done
docker cp ./src/tests/migrations/archive_dump orion_archive_db:/tmp/archive_dump
docker exec orion_archive_db psql -f /tmp/archive_dump -U postgres -p 12345 >/dev/null

# start the orion stack
docker-compose up -d orion_db
until docker logs orion_db | grep "database system is ready to accept connections" >/dev/null; do
    sleep 1
done
make migrate >/dev/null
docker-compose up -d orion_processor
# TODO: improve this
# until docker logs orion_processor | grep "Saving database updates..." >/dev/null; do
#     sleep 1
# done
sleep 20

cleanup() {
    rm -rf ./db/export
    make down
}

# Run the tests
npx ts-mocha "./src/tests/migrations/*.ts" --timeout 60000 --exit

trap cleanup EXIT
