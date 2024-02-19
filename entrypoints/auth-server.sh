#!/usr/bin/env bash

set -e

# docker entrypoint fot auth api, to allow running with telemetry
if [[ "$TELEMETRY_ENABLED" = "yes" ]]; then
    node --require ./opentelemetry/index.js ./lib/auth-server/index.js $*
else
    node ./lib/auth-server/index.js $*
fi
