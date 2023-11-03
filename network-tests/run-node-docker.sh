#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ../.env

# Log only to stderr
# Only output from this script should be the container id of the node at the very end

# Location that will be mounted to /spec in containers
# This is where the initial balances files and generated chainspec files will be located.
DATA_PATH=$PWD/data
mkdir -p ${DATA_PATH}

RUNTIME=${RUNTIME:=crt}
RUNTIME_PROFILE=${RUNTIME_PROFILE:=TESTING}

# Source of funds for all new accounts that are created in the tests.
TREASURY_INITIAL_BALANCE=${TREASURY_INITIAL_BALANCE:="100000000"}
TREASURY_ACCOUNT_URI=${TREASURY_ACCOUNT_URI:="//Bob"}
TREASURY_ACCOUNT=$(docker run --rm joystream/node:${RUNTIME} key inspect ${TREASURY_ACCOUNT_URI} --output-type json | jq .ss58Address -r)

echo >&2 " treasury account from suri: ${TREASURY_ACCOUNT}"

# Default initial balances
echo "{
  \"balances\":[
    [\"$TREASURY_ACCOUNT\", $TREASURY_INITIAL_BALANCE]
  ],
  \"vesting\":[]
}" >${DATA_PATH}/initial-balances.json

# Override initial balances from external source
if [[ $INITIAL_BALANCES == http* ]]; then
  echo >&2 "fetching ${INITIAL_BALANCES}"
  wget -O ${DATA_PATH}/initial-balances.json ${INITIAL_BALANCES}
else
  if [ ! -z "$INITIAL_BALANCES" ]; then
    if jq -e . >/dev/null 2>&1 <<<"$INITIAL_BALANCES"; then
      echo >&2 " Detected some valid JSON in INITIAL_BALANCES"
      echo $INITIAL_BALANCES >${DATA_PATH}/initial-balances.json
    else
      echo >&2 "Failed to parse INITIAL_BALANCES as JSON, or got false/null"
    fi
  fi
fi

# Create a chain spec file
docker run --rm -v ${DATA_PATH}:/spec --entrypoint ./chain-spec-builder joystream/node:${RUNTIME} \
  new \
  --fund-accounts \
  --authorities //Alice \
  --deployment dev \
  --chain-spec-path /spec/chain-spec.json \
  --initial-balances-path /spec/initial-balances.json

# Convert the chain spec file to a raw chainspec file
docker run --rm -v ${DATA_PATH}:/spec joystream/node:${RUNTIME} build-spec \
  --raw --disable-default-bootnode \
  --chain /spec/chain-spec.json >${DATA_PATH}/chain-spec-raw.json

# create network
docker network create joystream_default || true

# Start a chain with generated chain spec
export JOYSTREAM_NODE_TAG=${RUNTIME}
docker-compose -f ./docker-compose.node.yml run -d -v ${DATA_PATH}:/spec --name joystream-node \
  -p 9944:9944 -p 9933:9933 joystream-node \
  --alice --validator --unsafe-ws-external --unsafe-rpc-external \
  --rpc-methods Unsafe --rpc-cors=all -l runtime \
  --chain /spec/chain-spec-raw.json --pruning=archive --no-telemetry

docker logs joystream-node --tail 15
echo >&2 "node running"
