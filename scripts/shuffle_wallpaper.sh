#!/bin/bash
WALLPAPER_DIR="$HOME/Pictures/Wallpapers"
COUNTDOWN=60
while true; do
  sleep "$COUNTDOWN"
  IMAGE=$(find "$WALLPAPER_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | shuf -n1)
  [[ -n "$IMAGE" ]] && swww img "$IMAGE" --transition-fps 60 --transition-step 100 --transition-type grow
done
