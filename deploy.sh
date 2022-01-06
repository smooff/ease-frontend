#!/bin/bash

docker stop ease-frontend
docker rm ease-frontend

docker build -f Dockerfile -t ease/frontend .
docker run -it --rm -p 80:80 ease/frontend