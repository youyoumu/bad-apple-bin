#!/bin/env bash
source ./config.env

#create frames dir if not exist
mkdir -p ${FRAMES_DIR}

ffmpeg -i ${VIDEO_FILE} -vf scale=${WIDTH}:${HEIGHT},format=gray ${FRAMES_DIR}/frame_%04d.png
