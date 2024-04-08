#!/usr/bin/env bash

set -e

# docker entrypoint fot graphql-server, to allow running with telemetry
if [[ "$TELEMETRY_ENABLED" = "yes" ]]; then
    node --require ./opentelemetry/index.js ./node_modules/@subsquid/graphql-server/bin/run.js --subscriptions $*
else
    node ./node_modules/@subsquid/graphql-server/bin/run.js --subscriptions $*
fi
