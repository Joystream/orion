if [ -z "${SETUP}" ]; then
  setup 
fi

if [ -z "${OFFCHAIN_NOTIFICATION_PERFORMED}" ]; then
  echo "Offchain notification was not performed"
  exit 1
fi

access_as_anon_user=$(curl -i \
    --request POST \
  --url http://localhost:4074/api/v1/anonymous-auth \
  --header 'Content-Type: application/json' \
  --data "{	\"userId\": \"anon" }"
)

curl --request POST \
  --url http://localhost:4350/graphql \
  --header 'Content-Type: application/json' \
  --data '{"query":"query MyQuery {\n  auctionByUniqueInput(where: {id: \"\"})\n  offChainNotifications {\n    id\n    mailSent\n    inAppRead\n    account {\n      id\n    }\n  }\n}\n","operationName":"GetOffchainNotificatio"}'



