#!/bin/bash

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

docker-compose down -v
docker-compose up -d orion_db
until docker-compose logs orion_db | grep "server started"; do
  echo "Waiting for the db to be ready..."
  sleep 1
done
make migrate

npx ts-mocha "./src/auth-server/tests/!(globalRateLimit).ts" --timeout 60000 --exit
# Run global rate limit test after all other tests
npx ts-mocha ./src/auth-server/tests/globalRateLimit.ts --timeout 60000 --exit