#!/usr/bin/env bash
set -e


# SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
# cd $SCRIPT_PATH

JOYSTREAM_NODE_TAG=${JOYSTREAM_NODE_TAG:=nara_orion}
OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
ALICE_URI=${ALICE_URI="Alice"}
export DB_ADMIN_USER=admin
export DB_ADMIN_PASS=admin
export DB_PORT=23798
export DB_NAME=squid
export APP_NAME=Gleev

# ALICE=$(docker run --rm joystream/node:${JOYSTREAM_NODE_TAG} key inspect "//${ALICE_URI}" --output-type json | jq .ss58Address -r)

# if ! [[ "$( docker container inspect -f '{{.State.Running}}' orion_db )" = "true" ]]; then
#     docker network create joystream_default || true
#     docker-compose up -d orion_db
#     until docker-compose logs orion_db | grep "database system is ready to accept connections"; do
#     docker-compose logs --tail 10 orion_db
#     echo "Waiting for the db to be ready..."
#     sleep 1
#     done
#     make migrate
# fi

# if [[ "$( docker container inspect -f '{{.State.Running}}' joystream_node )" = "true" ]]; then
  # npx ts-mocha "./src/tests/integration/*.test.ts" --timeout 60000 --exit
  # fi

npx ts-mocha "./src/tests/integration/*.test.ts" --timeout 60000 --exit
