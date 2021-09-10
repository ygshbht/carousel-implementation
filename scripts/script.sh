#!/usr/bin/env bash

root_dir=/var/www/carousel_implementation/ 

cd $root_dir
docker build -t carousel_implementation $root_dir

docker stop carousel_implementation
docker rm carousel_implementation
docker run -d -p 3502:80 --name carousel_implementation carousel_implementation