#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS_DIR="$ROOT_DIR/public/video-assets"
CLIPS_DIR="$ASSETS_DIR/clips"
OUTPUT_DIR="$ASSETS_DIR/output"
VOICEOVER_FILE="$ASSETS_DIR/axiltree-short-voiceover.aiff"
SUBTITLES_FILE="$ROOT_DIR/ONE_MINUTE_SHORT_CAPTIONS.srt"
OUTPUT_FILE="$OUTPUT_DIR/axiltree-how-to-1min.mp4"

mkdir -p "$OUTPUT_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is required but not installed."
  echo "Install on macOS with: brew install ffmpeg"
  exit 1
fi

if [[ ! -f "$VOICEOVER_FILE" ]]; then
  echo "Error: voiceover file not found at $VOICEOVER_FILE"
  echo "Generate it first with the macOS 'say' command or add your own narration audio at the same path."
  exit 1
fi

if [[ ! -f "$SUBTITLES_FILE" ]]; then
  echo "Error: subtitle file not found at $SUBTITLES_FILE"
  exit 1
fi

declare -a CLIP_FILES=(
  "$CLIPS_DIR/01-landing.mp4"
  "$CLIPS_DIR/02-signup.mp4"
  "$CLIPS_DIR/03-account.mp4"
  "$CLIPS_DIR/04-links.mp4"
  "$CLIPS_DIR/05-design.mp4"
  "$CLIPS_DIR/06-public-page.mp4"
  "$CLIPS_DIR/07-copy-share.mp4"
)

declare -a DURATIONS=(4 6 8 14 11 9 8)

for file in "${CLIP_FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Error: missing clip $file"
    echo "Add all clips in order to $CLIPS_DIR"
    exit 1
  fi
done

ffmpeg -y \
  -i "${CLIP_FILES[0]}" \
  -i "${CLIP_FILES[1]}" \
  -i "${CLIP_FILES[2]}" \
  -i "${CLIP_FILES[3]}" \
  -i "${CLIP_FILES[4]}" \
  -i "${CLIP_FILES[5]}" \
  -i "${CLIP_FILES[6]}" \
  -i "$VOICEOVER_FILE" \
  -i "$SUBTITLES_FILE" \
  -filter_complex "
    [0:v]trim=0:${DURATIONS[0]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v0];
    [1:v]trim=0:${DURATIONS[1]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v1];
    [2:v]trim=0:${DURATIONS[2]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v2];
    [3:v]trim=0:${DURATIONS[3]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v3];
    [4:v]trim=0:${DURATIONS[4]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v4];
    [5:v]trim=0:${DURATIONS[5]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v5];
    [6:v]trim=0:${DURATIONS[6]},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v6];
    [v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0[finalv];
    [7:a]apad=pad_dur=60,atrim=0:60,asetpts=PTS-STARTPTS,volume=1.0[finala]
  " \
  -map "[finalv]" \
  -map "[finala]" \
  -map 8:0 \
  -c:v libx264 \
  -preset medium \
  -crf 20 \
  -c:a aac \
  -b:a 192k \
  -c:s mov_text \
  -metadata:s:s:0 language=eng \
  -t 60 \
  "$OUTPUT_FILE"

echo "Built short video: $OUTPUT_FILE"
