#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ./utils.sh

echo "Setting up" >&2

# create channel: on chain notification
npx @joystream/cli content:createChannel --input ./channelInput.json



