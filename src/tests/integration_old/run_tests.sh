#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
ALICE_URI=${ALICE_URI="Alice"}
export DB_ADMIN_USER=admin
export DB_ADMIN_PASS=admin
export DB_PORT=23798
export DB_NAME=squid
export APP_NAME=Gleev

./setup.sh "Alice" "Bob"

yes | npx @joystream/cli content:createChannel --input ./channelInput.json --context=Member --useMemberId=16 >/dev/null

# npx ts-node ./executeExtrinsics.ts

# now use newman to run tests
