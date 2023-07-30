#!/usr/bin/env bash
set -e

function register_account() {
    USER_URI=$1
    SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
    cd $SCRIPT_PATH

    JOYSTREAM_NODE_TAG=${JOYSTREAM_NODE_TAG:=latest}
    OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
    USER_URI=${USER_URI}

    USER=$(docker run --rm joystream/node:${JOYSTREAM_NODE_TAG} key inspect "//${USER_URI}" --output-type json | jq .ss58Address -r)

    # create membership using the cli
    buy_membership_response=$(yes | npx joystream-cli membership:buy --handle "handle-*-${USER_URI}" --rootKey=${USER} --senderKey=${USER} --controllerKey=${USER} --senderKey=${USER} 2>&1 >/dev/null)
    if [[ $buy_membership_response =~ Membership\ with\ id\ ([0-9]+) ]]; then
        USER_MEMBER_ID=${BASH_REMATCH[1]}
    else
        echo "Member ID not found in the shell string."
        exit -1
    fi

    # create anonymous account
    ANON_AUTH_RESPONSE=$(
        curl -i \
            --request POST \
            --url http://localhost:4074/api/v1/anonymous-auth \
            --header 'Content-Type: application/json' \
            --data "{ \"userId\": \"\" }"
    )

    ANON_SESSION_ID=$(echo "$ANON_AUTH_RESPONSE" | grep -o 'session_id=[^;]*' | cut -d'=' -f2)

    PAYLOADS=$(npx ts-node ./generate_payloads.ts "${USER_MEMBER_ID}_${USER_URI}.test@example.com" ${USER_MEMBER_ID} "test" ${USER_URI})
    ACCOUNT_PAYLOAD=$(echo ${PAYLOADS} | jq .account)
    LOGIN_PAYLOAD=$(echo ${PAYLOADS} | jq .login)

    # create gateway account
    sleep 10 # to allow orion_processor to process membership
    curl --request POST \
        --url http://localhost:4074/api/v1/account \
        --header 'Content-Type: application/json' \
        --header "Cookie: session_id=${ANON_SESSION_ID}" \
        --data "${ACCOUNT_PAYLOAD}"

    echo "Created account for ${USER_URI}"

    # login to gateway
    LOGIN_RESPONSE=$(
        curl -i \
            --request POST \
            --url http://localhost:4074/api/v1/login \
            --header 'Content-Type: application/json' \
            --data "${LOGIN_PAYLOAD}"
    )

    LOGIN_SESSION_ID=$(echo "$LOGIN_RESPONSE" | grep -o 'session_id=[^;]*' | cut -d'=' -f2)
    echo "user logged in with session id: ${LOGIN_SESSION_ID}"

    # Output JSON object containing USER_MEMBER_ID and LOGIN_SESSION_ID and USER to USER_URI.json
    echo "{\"USER_URI\": \"${USER_URI}\", \"USER_MEMBER_ID\": \"${USER_MEMBER_ID}\", \"LOGIN_SESSION_ID\": \"${LOGIN_SESSION_ID}\", \"USER\": \"${USER}\"}" >${USER_URI}.json
}

register_account $1
register_account $2
