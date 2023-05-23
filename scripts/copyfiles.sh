#!/bin/sh

SCRIPT_PATH="$(dirname "$0")"
cd $SCRIPT_PATH/..

# Copy files post-build
cp ./src/auth-server/openapi.yml ./lib/auth-server/openapi.yml
cp -R ./src/auth-server/emails/templates ./lib/auth-server/emails/templates