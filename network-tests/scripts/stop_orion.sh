#!/usr/bin/env bash
set -e

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

docker-compose -f ../../docker-compose.yml down -v
docker-compose -f ../../archive/docker-compose.yml down -v

