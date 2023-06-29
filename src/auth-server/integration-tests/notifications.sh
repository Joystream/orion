#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

JOYSTREAM_NODE_TAG=${JOYSTREAM_NODE_TAG:=nara_orion}
OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
ALICE_URI=${ALICE_URI="Alice"}
ALICE=$(docker run --rm joystream/node:${JOYSTREAM_NODE_TAG} key inspect "//${ALICE_URI}" --output-type json | jq .ss58Address -r

echo &>2 "Alice: ${ALICE}"

# create membership using the cli
ALICE_MEMBER_ID=$(yes | npx joystream-cli membership:buy --handle Alice --rootKey=${ALICE} --senderKey=${ALICE} --controllerKey=${ALICE} --senderKey=${ALICE} > /dev/null)

# create anonymous account
RESPONSE=$(curl -i \
  --request POST \
  --url http://localhost:4074/api/v1/anonymous-auth \
  --header 'Content-Type: application/json' \
  --data "{	\"userId\": \"${OPERATOR_SECRET}\" }"
)

SESSION_ID=$(echo "$RESPONSE" | grep -o 'session_id=[^;]*' | cut -d'=' -f2)

# create gateway account
curl --request POST \
  --url http://localhost:4074/api/v1/account \
  --header 'Content-Type: application/json' \
  --header "Cookie: session_id=${SESSION_ID}" \
  --data $(npx ts-node ./generate_payload.ts "testMail@exampl.com" ${ALICE_MEMBER_ID} "test" ${ALICE_URI})
  
# create channel: on chain notification
npx @joystream/cli content:createChannel --input ./channelInput.json

# follow hannel: off chain notification
