#!/bin/sh

SCRIPT_PATH="$(dirname "$0")"
cd $SCRIPT_PATH/..

EXPORT_FOLDER="recommendations"
if [ -d "./$EXPORT_FOLDER" ]; then
    echo "Deleting old export files..."
    rm -f "./$EXPORT_FOLDER"/*
else
    echo "Creating it folder for export files..."
    mkdir "./$EXPORT_FOLDER"
fi

DB_HOST="localhost"
DB_PORT=23798
DB_NAME="squid"
DB_USER="postgres"
DOCKER_EXEC_COMMAND="docker exec -it orion_db psql -p $DB_PORT -h $DB_HOST -U $DB_USER -d $DB_NAME"
export PGPASSWORD="$1"

VIDEO_SELECT_QUERY="SELECT id as Item_ID, duration, comments_count, EXTRACT(EPOCH FROM created_at) as timestamp, reactions_count, views_num FROM admin.video"
ACCOUNT_SELECT_QUERY="SELECT id as User_ID FROM admin.user"

VIEWS_SELECT_QUERY="SELECT  viewEvent.user_id as User_ID, viewEvent.video_id as item_id, EXTRACT(EPOCH FROM viewEvent.timestamp) as timestamp, 'watch' as event_type FROM admin.video_view_event as viewEvent"
REACTIONS_SELECT_QUERY="SELECT acc.user_id as User_ID, video_id as Item_ID, EXTRACT(EPOCH from created_at) as timestamp, 'like' as event_type FROM admin.video_reaction LEFT JOIN admin.account as acc on acc.membership_id = member_id WHERE acc.user_id IS NOT NULL"
INTERACTIONS_QUERY="WITH viewsCte as (${VIEWS_SELECT_QUERY}), reactionsCte as (${REACTIONS_SELECT_QUERY}) SELECT * FROM viewsCte UNION ALL SELECT * FROM reactionsCte"

echo "Exporting videos..."
${DOCKER_EXEC_COMMAND} -c "COPY (${VIDEO_SELECT_QUERY}) TO STDOUT WITH CSV HEADER" > ./${EXPORT_FOLDER}/videos_export.csv
echo "Exporting users..."
${DOCKER_EXEC_COMMAND} -c "COPY (${ACCOUNT_SELECT_QUERY}) TO STDOUT WITH CSV HEADER" > ./${EXPORT_FOLDER}/accounts_export.csv
echo "Exporting interactions..."
${DOCKER_EXEC_COMMAND} -c "COPY (${INTERACTIONS_QUERY}) TO STDOUT WITH CSV HEADER" > ./${EXPORT_FOLDER}/interactions_export.csv

exit
