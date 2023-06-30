#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ./utils.sh 

if [ -z "${SETUP}" ]; then
  setup 
fi

curl --request POST \
  --url http://localhost:4350/graphql \
  --header 'Content-Type: application/json' \
  --data '{"query":"mutation MyMutation {\n  followChannel(channelId: \"1\")\n}\n","operationName":"Operations"}'

export OFFCHAIN_NOTIFICATION_PERFORMED=1
