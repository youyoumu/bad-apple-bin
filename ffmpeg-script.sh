#!/bin/env bash
source ./config.env

#create frames dir if not exist
mkdir -p ${FRAMES_DIR}

ffmpeg -i ${VIDEO_FILE} -vf scale=${WIDTH}:${HEIGHT},format=gray ${FRAMES_DIR}/frame_%04d.png

VIDEO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
FRAME_COUNT=$(ls "${FRAMES_DIR}"/frame_*.png | wc -l)

echo "Extracted $FRAME_COUNT frames"
echo "Video duration: $VIDEO_DURATION seconds"
