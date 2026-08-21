"""Worst-frame legibility audit.

Takes the real glyph rects measured by legibility.js, maps them onto the real
encoded footage through the video's object-fit: cover mapping, composites the
global scrim and each band's local scrim exactly as the CSS does, then reports
the WORST (brightest) frame in every band, not the average. Text shadow is
ignored on purpose, so the number is a floor rather than a flattering average.
"""
import json, glob, sys, math
from PIL import Image

BOXES = sys.argv[1]
FRAMES = sorted(glob.glob(sys.argv[2] + '/*.png'))
DURATION = 6.041667
FPS = 12.0

d = json.load(open(BOXES))
VW, VH = d['viewport']['w'], d['viewport']['h']

# .scrim: radial-gradient(ellipse 120% 90% at 50% 45%, rgba(10,10,18,0) 35%, rgba(10,10,18,.62) 100%)
GLOBAL = dict(rx=1.20, ry=0.90, cx=0.50, cy=0.45, stops=[(0.35, 0.0), (1.0, 0.62)], rgb=(10, 10, 18))
# .band-N::before, each inset -4% of the stage
LOCAL = {
    'band-1': dict(rx=0.56, ry=0.62, cx=0.24, cy=0.50, stops=[(0.0, .68), (0.46, .46), (0.76, 0.0)], rgb=(5, 5, 10)),
    'band-2': dict(rx=0.56, ry=0.62, cx=0.76, cy=0.50, stops=[(0.0, .66), (0.46, .44), (0.76, 0.0)], rgb=(5, 5, 10)),
    'band-3': dict(rx=0.56, ry=0.62, cx=0.24, cy=0.50, stops=[(0.0, .66), (0.46, .44), (0.76, 0.0)], rgb=(5, 5, 10)),
    'band-4': dict(rx=0.78, ry=0.58, cx=0.50, cy=0.38, stops=[(0.0, .72), (0.46, .48), (0.78, 0.0)], rgb=(5, 5, 10)),
}

def alpha_at(g, x, y, w, h, inset=0.0):
    """Alpha of one radial-gradient layer at a viewport point, CSS semantics."""
    x0, y0 = -inset * w, -inset * h
    bw, bh = w * (1 + 2 * inset), h * (1 + 2 * inset)
    dx = (x - (x0 + g['cx'] * bw)) / (g['rx'] * bw)
    dy = (y - (y0 + g['cy'] * bh)) / (g['ry'] * bh)
    dist = math.hypot(dx, dy)
    st = g['stops']
    if dist <= st[0][0]:
        return st[0][1]
    for (p0, a0), (p1, a1) in zip(st, st[1:]):
        if dist <= p1:
            t = (dist - p0) / (p1 - p0) if p1 > p0 else 0
            return a0 + (a1 - a0) * t
    return st[-1][1]

def over(src, rgb, a):
    return tuple(s * (1 - a) + c * a for s, c in zip(src, rgb))

def rel_lum(rgb):
    c = []
    for v in rgb:
        v /= 255.0
        c.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def contrast(fg, bg):
    a, b = rel_lum(fg), rel_lum(bg)
    if a < b: a, b = b, a
    return (a + 0.05) / (b + 0.05)

def parse_rgb(s):
    return tuple(int(v) for v in s[s.index('(') + 1:s.index(')')].split(',')[:3])

# object-fit: cover mapping, viewport px -> video px
probe = Image.open(FRAMES[0])
NW, NH = probe.size
scale = max(VW / NW, VH / NH)
offx, offy = (VW - NW * scale) / 2, (VH - NH * scale) / 2

def dedupe(boxes):
    """Drop the aggregate line rects that the word-split spans sit inside."""
    out = []
    for i, r in enumerate(boxes):
        inside = sum(1 for j, s in enumerate(boxes)
                     if i != j and r['x'] <= s['x'] + s['w'] / 2 <= r['x'] + r['w']
                     and r['y'] <= s['y'] + s['h'] / 2 <= r['y'] + r['h'])
        if inside < 3:
            out.append(r)
    return out

print(f'video {NW}x{NH} -> stage {VW}x{VH}, cover scale {scale:.4f}, offset ({offx:.1f},{offy:.1f})')
worst_overall = (999, None)
for band in d['bands']:
    cls = [c for c in band['cls'].split() if c.startswith('band-')][0]
    g_local = LOCAL[cls]
    lo, hi = band['from'] * DURATION, band['to'] * DURATION
    idx = [k for k in range(len(FRAMES)) if lo <= k / FPS <= hi]
    boxes = dedupe(band['boxes'])
    band_worst = (999, None)
    for k in idx:
        im = Image.open(FRAMES[k]).convert('RGB')
        px = im.load()
        for r in boxes:
            ecls = r.get('cls', '')
            if 'btn-accent' in ecls:
                continue  # sits on its own opaque accent fill, not on the footage
            fg = parse_rgb(r['color'])
            # sample a grid inside the glyph rect, keep the brightest result
            for sx in range(5):
                for sy in range(3):
                    vx = r['x'] + r['w'] * (sx + .5) / 5
                    vy = r['y'] + r['h'] * (sy + .5) / 3
                    if not (0 <= vx < VW and 0 <= vy < VH):
                        continue
                    ix = int((vx - offx) / scale); iy = int((vy - offy) / scale)
                    ix = min(max(ix, 0), NW - 1); iy = min(max(iy, 0), NH - 1)
                    bg = px[ix, iy]
                    bg = over(bg, GLOBAL['rgb'], alpha_at(GLOBAL, vx, vy, VW, VH))
                    bg = over(bg, g_local['rgb'], alpha_at(g_local, vx, vy, VW, VH, inset=0.04))
                    if 'btn-ghost' in ecls:
                        bg = over(bg, (21, 14, 39), 0.42)
                    cr = contrast(fg, bg)
                    if cr < band_worst[0]:
                        band_worst = (cr, (k / FPS, r['tag'], round(vx), round(vy), tuple(round(v) for v in bg)))
    t, tag, x, y, bg = band_worst[1]
    print(f'{cls}  frames {len(idx)}  WORST contrast {band_worst[0]:5.2f}:1  at t={t:.2f}s  {tag} ({x},{y})  bg=rgb{bg}')
    if band_worst[0] < worst_overall[0]:
        worst_overall = (band_worst[0], cls)
print(f'\nworst band overall: {worst_overall[1]} at {worst_overall[0]:.2f}:1  '
      f'(WCAG AA large text 3.0, AA body 4.5, AAA body 7.0)')
