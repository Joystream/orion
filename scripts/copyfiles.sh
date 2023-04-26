#!/bin/bash

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH/..

# Copy files post-build
cp ./src/auth-server/openapi.yml ./lib/auth-server/openapi.yml