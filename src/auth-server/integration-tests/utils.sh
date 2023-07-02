#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

export JOYSTREAM_NODE_TAG=${JOYSTREAM_NODE_TAG:=nara_orion}
export OPERATOR_SECRET=${OPERATOR_SECRET:=this-is-not-so-secret-change-it}
export ALICE_URI=${ALICE_URI="Alice"}

export ALICE=$(docker run --rm joystream/node:${JOYSTREAM_NODE_TAG} key inspect "//${ALICE_URI}" --output-type json | jq .ss58Address -r)

# create membership using the cli
export ALICE_MEMBER_ID=$(yes | npx joystream-cli membership:buy --handle Alice --rootKey=${ALICE} --senderKey=${ALICE} --controllerKey=${ALICE} --senderKey=${ALICE} > /dev/null)

# create anonymous account
export ANON_AUTH_RESPONSE=$(curl -i \
  --request POST \
  --url http://localhost:4074/api/v1/anonymous-auth \
  --header 'Content-Type: application/json' \
  --data "{	\"userId\": \"\" }"
)

export ANON_SESSION_ID=$(echo "$ANON_AUTH_RESPONSE" | grep -o 'session_id=[^;]*' | cut -d'=' -f2)

export PAYLOADS=$(npx ts-node ./generate_payload.ts "testMail@example.com" ${ALICE_MEMBER_ID} "test" ${ALICE_URI})
export ACCOUNT_PAYLOAD=$(echo ${PAYLOADS} | jq .account)
export LOGIN_PAYLOAD=$(echo ${PAYLOADS} | jq .login)

# create gateway account
curl --request POST \
  --url http://localhost:4074/api/v1/account \
  --header 'Content-Type: application/json' \
  --header "Cookie: session_id=${ANON_SESSION_ID}" \
  --data ${ACCOUNT_PAYLOAD}

echo "*********************************************************************** " >&2
echo "OnChain notification: Creating channel" >&2
yes | npx @joystream/cli content:createChannel --input ./channelInput.json --context=Member --useMemberId=$ALICE_MEMBER_ID > /dev/null

echo "*********************************************************************** " >&2
echo "Offchain notification: Follow channel" >&2
export LOGIN_RESPONSE=$(curl -i \
  --request POST \
  --url http://localhost:4074/api/v1/login \
  --header 'Content-Type: application/json' \
  --data ${LOGIN_PAYLOAD}
)
export LOGIN_SESSION_ID=$(echo "$LOGIN_RESPONSE" | grep -o 'session_id=[^;]*' | cut -d'=' -f2)

curl --request POST \
  --url http://localhost:4350/graphql \
  --header "Cookie: session_id=${LOGIN_SESSION_ID}" \
  --header 'Content-Type: application/json' \
  --data '{"query":"mutation FollowChannel {\n  followChannel(channelId: \"1\") {\n    added\n    channelId\n    followId\n    follows\n  }\n}\n","operationName":"FollowChannel"}'

echo "*********************************************************************** " >&2
echo "Preferences update: mutate" >&2
curl --request POST \
  --url http://localhost:4350/graphql \
  --header 'Content-Type: application/json' \
  --header "Cookie: session_id=${LOGIN_SESSION_ID}" \
  --data '{"query":"mutation SetNotificationPreferences {\n\tsetAccountNotificatioPreferences(\n\t\tauctionBidCanceledInAppNotificationEnabled: false\n\t\tauctionBidCanceledMailNotificationEnabled: false\n\t\tauctionBidMadeInAppNotificationEnabled: false\n\t\tauctionBidMadeMailNotificationEnabled: false\n\t\tauctionCanceledInAppNotificationEnabled: false\n\t\tauctionCanceledMailNotificationEnabled: false\n\t\tbidMadeCompletingAuctionInAppNotificationEnabled: false\n\t\tbidMadeCompletingAuctionMailNotificationEnabled: false\n\t\tbuyNowCanceledInAppNotificationEnabled: false\n\t\tbuyNowCanceledMailNotificationEnabled: false\n\t\tbuyNowPriceUpdatedInAppNotificationEnabled: false\n\t\tbuyNowPriceUpdatedMailNotificationEnabled: false\n\t\tchannelCreatedInAppNotificationEnabled: false\n\t\tchannelCreatedMailNotificationEnabled: false\n\t\tchannelFundsWithdrawnInAppNotificationEnabled: false\n\t\tchannelFundsWithdrawnMailNotificationEnabled: false\n\t\tchannelPaymentMadeInAppNotificationEnabled: false\n\t\tchannelPaymentMadeMailNotificationEnabled: false\n\t\tchannelPayoutsUpdatedInAppNotificationEnabled: false\n\t\tchannelPayoutsUpdatedMailNotificationEnabled: false\n\t\tchannelRewardClaimedAndWithdrawnInAppNotificationEnabled: false\n\t\tchannelRewardClaimedAndWithdrawnMailNotificationEnabled: false\n\t\tchannelRewardClaimedInAppNotificationEnabled: false\n\t\tchannelRewardClaimedMailNotificationEnabled: false\n\t\tcommentCreatedInAppNotificationEnabled: false\n\t\tcommentCreatedMailNotificationEnabled: false\n\t\tcommentTextUpdatedInAppNotificationEnabled: false\n\t\tcommentTextUpdatedMailNotificationEnabled: false\n\t\tenglishAuctionSettledInAppNotificationEnabled: false\n\t\tenglishAuctionSettledMailNotificationEnabled: false\n\t\tenglishAuctionStartedInAppNotificationEnabled: false\n\t\tenglishAuctionStartedMailNotificationEnabled: false\n\t\tmemberBannedFromChannelInAppNotificationEnabled: false\n\t\tmemberBannedFromChannelMailNotificationEnabled: false\n\t\tmetaprotocolTransactionStatusMailNotificationEnabled: false\n\t\tnftBoughtInAppNotificationEnabled: false\n\t\tnftBoughtMailNotificationEnabled: false\n\t\tnftIssuedInAppNotificationEnabled: false\n\t\tnftIssuedMailNotificationEnabled: false\n\t\tnftSellOrderMadeInAppNotificationEnabled: false\n\t\tnftSellOrderMadeMailNotificationEnabled: false\n\t\topenAuctionBidAcceptedInAppNotificationEnabled: false\n\t\topenAuctionBidAcceptedMailNotificationEnabled: false\n\t\topenAuctionStartedInAppNotificationEnabled: false\n\t\topenAuctionStartedMailNotificationEnabled: false\n\t\tmetaprotocolTransactionStatusInAppNotificationEnabled: false\n\t)\n}\n","operationName":"SetNotificationPreferences"}'

echo "*********************************************************************** " >&2
echo "Notification visibility as an anon user" >&2
curl --request POST \
  --url http://localhost:4350/graphql \
  --header "Cookie: session_id=${ANON_SESSION_ID}" \
  --header 'Content-Type: application/json' \
  --data '{"query":"query MyQuery {\n  offChainNotifications {\n    id\n    account {\n      id\n    }\n    inAppRead\n    mailSent\n  }\n}\n","operationName":"MyMutation"}' | jq

echo "************************************************************************ " >&2
echo "Mark Notification as read unread" >&2
