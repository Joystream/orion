#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

docker network create joystream_default || true
docker-compose -f ../../docker-compose.yml up -d
docker-compose -f ../../archive/docker-compose.yml up -d

