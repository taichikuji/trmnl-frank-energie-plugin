#!/bin/bash

docker run \
    --publish 4567:4567 \
    --volume "$(pwd):/plugin:Z" \
    trmnl/trmnlp serve