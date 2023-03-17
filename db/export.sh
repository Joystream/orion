#!/bin/bash

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

source ../.env

DOCKER_COMPOSE="docker-compose -f ../docker-compose.yml"

echo "Exporting sessions..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy session to '/persisted_data/session' csv;"
echo "Exporting users..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy user to '/persisted_data/user' csv;"
echo "Exporting accounts..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy account to '/persisted_data/account' csv;"
echo "Exporting tokens..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy token to '/persisted_data/token' csv;"
echo "Exporting video views..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy video_view_event to '/persisted_data/video_view_event' csv;"
echo "Exporting channel follows..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy channel_follow to '/persisted_data/channel_follow' csv;"
echo "Exporting reports..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy report to '/persisted_data/report' csv;"
echo "Exporting gateway config..."
$DOCKER_COMPOSE exec orion_db psql -p ${DB_PORT} -U admin -d ${DB_NAME} -c "\copy gateway_config to '/persisted_data/gateway_config' csv;"