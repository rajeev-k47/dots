#!/bin/bash
mpv --no-audio --loop --fullscreen $HOME/Videos/Untitled.mp4 &
ANIM_PID=$!
hyprlock
kill "$ANIM_PID"
