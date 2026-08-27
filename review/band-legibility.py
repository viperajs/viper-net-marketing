"""Read the frames review/band-legibility.js captured and report the contrast.

The number that matters is the brightest patch under a line, not the average:
one blown highlight behind a word is what makes a caption unreadable, and an
average over the whole box hides it. Boxes are reduced by an 8x box filter
first, so a single stray pixel does not fail an otherwise sound frame.

Usage: python3 review/band-legibility.py <framesDir> [minContrast]
"""
import json, pathlib, sys
from PIL import Image

DIR = pathlib.Path(sys.argv[1])
MIN = float(sys.argv[2]) if len(sys.argv) > 2 else 4.5
TEXT = (234, 241, 248)   # --text-primary, the lightest thing on a band


def _lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = (_lin(v) for v in rgb[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


LT = luminance(TEXT)
worst = []
for band in json.loads((DIR / "boxes.json").read_text()):
    ground = Image.open(DIR / f"band{band['band']}-ground.png").convert("RGB")
    for (x, y, w, h) in band["rects"]:
        box = ground.crop((max(0, x), max(0, y),
                           min(ground.width, x + w), min(ground.height, y + h)))
        small = box.resize((max(1, box.width // 8), max(1, box.height // 8)), Image.BOX)
        hi = max(luminance(p) for p in small.getdata())
        ratio = (max(LT, hi) + 0.05) / (min(LT, hi) + 0.05)
        worst.append((ratio, band["band"], (x, y, w, h)))

worst.sort()
for ratio, band, rect in worst[:6]:
    print(f"{'FAIL' if ratio < MIN else 'ok  '} band {band} {rect} contrast {ratio:.2f}:1")
print(f"worst {worst[0][0]:.2f}:1 over {len(worst)} boxes, floor {MIN}:1")
sys.exit(1 if worst[0][0] < MIN else 0)
