#!/bin/bash

docker stop ease-frontend
docker rm ease-frontend

docker build -t ease/frontend .
docker run -d -it --rm -p 80:80 -p 443:443 --name ease-frontend  ease/frontend
