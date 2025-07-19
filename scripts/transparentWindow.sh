#!/bin/bash

focused_window=$(hyprctl activewindow -j)
default_transparency=0.85
increment=0.05
MAX_TRANSPARENCY=1.0
MIN_TRANSPARENCY=0.5
window_name=$(echo "$focused_window" | jq -r '.class')
config_file="$HOME/.config/hypr/custom/rules.conf"

if [ $# -ne 1 ]; then
  echo "Usage: $0 [increase|decrease]"
  exit 1
fi

ACTION="$1"
if [ "$ACTION" != "increase" ] && [ "$ACTION" != "decrease" ]; then
  echo "Use 'increase' or 'decrease'."
  exit 1
fi

existing_rule=$(grep "$window_name" "$config_file")
echo "$existing_rule"
if [ -n "$existing_rule" ]; then
  CURRENT_TRANSPARENCY=$(echo "$existing_rule" | grep -oP 'opacity \K[0-9.]+')

  if [ "$ACTION" == "increase" ]; then
    NEW_TRANSPARENCY=$(echo "$CURRENT_TRANSPARENCY + $increment" | bc)
  else
    NEW_TRANSPARENCY=$(echo "$CURRENT_TRANSPARENCY - $increment" | bc)
  fi

  if (($(echo "$NEW_TRANSPARENCY > $MAX_TRANSPARENCY" | bc -l))); then
    NEW_TRANSPARENCY=$MAX_TRANSPARENCY
  elif (($(echo "$NEW_TRANSPARENCY < $MIN_TRANSPARENCY" | bc -l))); then
    NEW_TRANSPARENCY=$MIN_TRANSPARENCY
  fi

  sed -i -E \
    "s|windowrulev2 = opacity [0-9.]+ [0-9.]+, class:\\^\\($window_name\\)\\\$|windowrulev2 = opacity $NEW_TRANSPARENCY $NEW_TRANSPARENCY, class:^($window_name)\$|g" \
    "$config_file"

else
  NEW_RULE="windowrulev2 = opacity $default_transparency $default_transparency, class:^($window_name)\$"
  echo "$NEW_RULE" >>"$config_file"
fi
