#!/bin/bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/../../..

docker network create joystream_default || true
docker-compose down -v
docker-compose up -d orion_db
until docker-compose logs orion_db | grep "database system is ready to accept connections"; do
  docker-compose logs --tail 10 orion_db
  echo "Waiting for the db to be ready..."
  sleep 1
done
make migrate

# Test global rate limit first
npx ts-mocha ./src/auth-server/tests/globalRateLimit.ts --timeout 60000 --exit

# Run other tests (new process will be created so the global rate limit will be reset)
npx ts-mocha "./src/auth-server/tests/!(globalRateLimit).ts" --timeout 60000 --exit