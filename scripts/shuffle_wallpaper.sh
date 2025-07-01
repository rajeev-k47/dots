#!/bin/bash
WALLPAPER_DIR="$HOME/Pictures/Wallpapers"
COUNTDOWN=60

XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
CONFIG_DIR="$XDG_CONFIG_HOME/ags"

while true; do
  sleep "$COUNTDOWN"

  IMAGE=$(find "$WALLPAPER_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | shuf -n1)

  if [[ -n "$IMAGE" ]]; then
    swww img "$IMAGE" \
      --transition-fps 60 \
      --transition-step 100 \
      --transition-type grow

    # Generate colors for ags
    "$CONFIG_DIR"/scripts/color_generation/colorgen.sh "$IMAGE" --apply --smart
  fi
done
