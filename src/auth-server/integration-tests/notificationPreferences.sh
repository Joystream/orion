#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

JOYSTREAM_NODE_TAG=${JOYSTREAM_NODE_TAG:=nara_orion}
OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
ALICE_URI=${ALICE_URI="Alice"}
ALICE=$(docker run --rm joystream/node:${JOYSTREAM_NODE_TAG} key inspect "//${ALICE_URI}" --output-type json | jq .ss58Address -r

echo &>2 "Alice: ${ALICE}"
