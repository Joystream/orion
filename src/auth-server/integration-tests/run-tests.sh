#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ./utils.sh

echo "Setting up" >&2
setup

echo "Running tests" >&2




