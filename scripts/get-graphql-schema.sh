#!/bin/sh

set -e

export GQL_PORT=33333

# Start the squid-graphql-server in the background
npx squid-graphql-server &

# Wait for 5 seconds to allow the server to start
sleep 5

# Get the GraphQL schema and output it to a file
./node_modules/get-graphql-schema/dist/index.js http://localhost:${GQL_PORT}/graphql

# Find the PID of the squid-graphql-server
SERVER_PID=$(ps | grep 'squid-graphql-server' | grep -v grep | awk '{print $1}')

# Kill the server process
if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID
fi
