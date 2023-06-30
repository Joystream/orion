#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

# create channel: on chain notification
npx @joystream/cli content:createChannel --input ./channelInput.json


