#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ./utils.sh

if [ -z "${SETUP}" ]; then
  setup 
fi

