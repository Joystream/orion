#!/bin/bash

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ../.env

DOCKER_COMPOSE="docker-compose -f ../docker-compose.yml"

echo "Exporting video views..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U postgres -d ${DB_NAME} -c "\copy processor.video_view_event to '/persisted_data/video_view_event' csv;"
echo "Exporting channel follows..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U postgres -d ${DB_NAME} -c "\copy processor.channel_follow to '/persisted_data/channel_follow' csv;"
echo "Exporting reports..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U postgres -d ${DB_NAME} -c "\copy processor.report to '/persisted_data/report' csv;"
echo "Exporting gateway config..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U postgres -d ${DB_NAME} -c "\copy gateway_config to '/persisted_data/gateway_config' csv;"
echo "Exporting NFT featuring requests..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U postgres -d ${DB_NAME} -c "\copy processor.nft_featuring_request to '/persisted_data/nft_featuring_request' csv;"
