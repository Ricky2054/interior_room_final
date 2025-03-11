#!/bin/bash

# This script is used to start the appropriate server based on the SERVER_TYPE environment variable

if [ "$SERVER_TYPE" = "text2image" ]; then
    echo "Starting text2image server..."
    exec gunicorn -k uvicorn.workers.UvicornWorker text2image:app --bind 0.0.0.0:$PORT
else
    echo "Starting interior server..."
    exec gunicorn -k uvicorn.workers.UvicornWorker server_interior:app --bind 0.0.0.0:$PORT
fi 