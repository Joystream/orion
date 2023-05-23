#!/bin/sh

SCRIPT_PATH="$(dirname "$0")"
cd $SCRIPT_PATH/..

if [ -d schema ]
then
    echo "Generating schema file from schema directory..."
    find schema -type f -exec cat {} \; > schema.graphql
    echo "Done"
else
    echo "Schema directory is empty, skipping schema file generation..."
fi