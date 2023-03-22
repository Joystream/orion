#!/bin/bash

SCRIPT_PATH="$(dirname "${BASH_SOURCE[0]}")"
cd $SCRIPT_PATH

docker exec -t mongo mongoexport -d orion -c videoEvents -o videoEvents.json --jsonArray
docker exec -t mongo mongoexport -d orion -c featuredContent -o featuredContent.json
docker exec -t mongo mongoexport -d orion -c reportedVideos -o reportedVideos.json --jsonArray
docker exec -t mongo mongoexport -d orion -c reportedChannels -o reportedChannels.json --jsonArray
mkdir data 2>/dev/null || true
docker cp mongo:videoEvents.json data/videoEvents.json
docker cp mongo:featuredContent.json data/featuredContent.json
docker cp mongo:reportedVideos.json data/reportedVideos.json
docker cp mongo:reportedChannels.json data/reportedChannels.json
echo "OK"