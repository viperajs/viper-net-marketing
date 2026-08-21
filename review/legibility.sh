#!/bin/sh
# Measure the real glyph rects in a browser, then audit them against the real
# footage frames. Needs `python3 -m http.server 8081` running in viper-net-site/.
set -e
cd "$(dirname "$0")/.."
SP="${SCRATCH:-/tmp/claude-0/-home-user-viper-net-marketing/92a564bf-3791-5388-a0a5-cae24163058d/scratchpad}"
node review/legibility.js 2>/dev/null | tail -1 > "$SP/boxes.json"
python3 review/legibility.py "$SP/boxes.json" "$SP/hi"
