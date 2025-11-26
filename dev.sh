#/bin/bash

docker build --tag 'dev' . && docker run --env-file <(env | grep DISCORDBOT) 'dev'