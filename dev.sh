#/bin/bash

docker build --tag 'dev' . && docker run --env-file <(env | grep DISCORDBOT) -e LOG_LEVEL=DEBUG 'dev' 