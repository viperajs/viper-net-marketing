"""Render the Viper Net brand assets from the vector mark and the real footage.

Everything is composed in HTML and shot with the machine's own Chromium, so the
wordmark uses the real Archivo file rather than a screenshot of a font. The
banner grounds are frames of the approved hero footage, so the brand images and
the site are literally the same world.

Usage: python3 review/build-brand.py <scratchDir>
Then:  node review/shot-html.js <html> <out.png> <w> <h> <scale>
"""
import pathlib, sys, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
SP = pathlib.Path(sys.argv[1])
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

MARK = (OUT / "mark.svg").read_text()
INNER = MARK[MARK.index(">", MARK.index("<svg")) + 1: MARK.rindex("</svg>")]

ACCENT, CANVAS, TEXT, MUTED = "#6FC3FF", "#080D14", "#EAF1F8", "#97A9BC"

FONTS = f"""
@font-face{{font-family:Archivo;src:url('file://{ROOT}/public/fonts/archivo-800.woff2') format('woff2');font-weight:800}}
@font-face{{font-family:Archivo;src:url('file://{ROOT}/public/fonts/archivo-700.woff2') format('woff2');font-weight:700}}
@font-face{{font-family:'IBM Plex Sans';src:url('file://{ROOT}/public/fonts/plex-sans-400.woff2') format('woff2');font-weight:400}}
@font-face{{font-family:'IBM Plex Mono';src:url('file://{ROOT}/public/fonts/plex-mono-500.woff2') format('woff2');font-weight:500}}
"""

def mark(size, color):
    return f'<svg viewBox="0 0 64 64" width="{size}" height="{size}" style="color:{color};display:block">{INNER}</svg>'

def page(body, css=""):
    return f"<!doctype html><meta charset='utf-8'><style>{FONTS}*{{box-sizing:border-box}}html,body{{margin:0}}{css}</style>{body}"

jobs = []
def job(name, html, w, h, scale=2):
    p = SP / f"brand-{name}.html"
    p.write_text(html)
    jobs.append({"name": name, "html": str(p), "w": w, "h": h, "scale": scale,
                 "out": str(OUT / f"{name}.png")})

# ---- the mark alone, three colourways, square ----
for name, fg, bg in [("mark-accent", ACCENT, CANVAS), ("mark-light", CANVAS, "#EAF1F8"), ("mark-white", "#FFFFFF", CANVAS)]:
    job(name, page(f'<div class="w">{mark(340, fg)}</div>',
                   f".w{{width:512px;height:512px;background:{bg};display:grid;place-items:center}}"), 512, 512, 1)

# ---- the app icon: rounded square, safe padding ----
job("avatar", page(f'<div class="w">{mark(300, ACCENT)}</div>',
                   f".w{{width:512px;height:512px;background:{CANVAS};display:grid;place-items:center;border-radius:112px}}"),
    512, 512, 1)

# ---- horizontal lockup, dark and light ----
def lockup(fg, sub, bg):
    return page(f'''<div class="w">
      <div class="lock">{mark(96, ACCENT if bg == CANVAS else CANVAS)}
        <div class="txt"><div class="wm">VIPER<i>NET</i></div>
        <div class="sub">{sub}</div></div></div></div>''',
      f""".w{{width:1200px;height:360px;background:{bg};display:grid;place-items:center}}
      .lock{{display:flex;align-items:center;gap:28px}}
      .wm{{font:800 76px/1 Archivo;letter-spacing:-.03em;color:{fg}}}
      .wm i{{font-style:normal;color:{ACCENT if bg == CANVAS else '#2C7FB8'};margin-left:.16em}}
      .sub{{font:500 17px/1 'IBM Plex Mono',monospace;letter-spacing:.24em;text-transform:uppercase;
        color:{MUTED if bg == CANVAS else '#5A6B7D'};margin-top:14px}}""")

job("lockup-dark", lockup(TEXT, "Websites built to strike", CANVAS), 1200, 360, 2)
job("lockup-light", lockup("#0B1219", "Websites built to strike", "#EAF1F8"), 1200, 360, 2)

# ---- social header, 1500x500. The left third stays clear: that is where the
# profile picture sits on X, and where a logo overlay lands on LinkedIn. ----
job("banner-x", page(f'''<div class="w">
    <img class="bg" src="file://{SP}/banner-bg.jpg">
    <div class="veil"></div>
    <div class="in">{mark(84, ACCENT)}
      <div><div class="wm">VIPER<i>NET</i></div>
      <div class="tag">Design, build and launch. Live in weeks, not months.</div>
      <div class="by">vipera</div></div></div></div>''',
  f""".w{{width:1500px;height:500px;position:relative;overflow:hidden;background:{CANVAS}}}
  .bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 62%}}
  .veil{{position:absolute;inset:0;background:
     linear-gradient(90deg,{CANVAS} 6%,rgba(8,13,20,.72) 42%,rgba(8,13,20,.35) 100%)}}
  .in{{position:absolute;left:430px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:26px}}
  .wm{{font:800 68px/1 Archivo;letter-spacing:-.03em;color:{TEXT}}}
  .wm i{{font-style:normal;color:{ACCENT};margin-left:.16em}}
  .tag{{font:400 20px/1.5 'IBM Plex Sans',system-ui;color:{MUTED};margin-top:14px}}
  .by{{font:500 14px/1 'IBM Plex Mono',monospace;letter-spacing:.28em;text-transform:uppercase;
    color:{ACCENT};margin-top:16px;opacity:.85}}"""), 1500, 500, 2)

# ---- link preview card, 1200x630 ----
job("banner-og", page(f'''<div class="w">
    <img class="bg" src="file://{SP}/banner-bg2.jpg">
    <div class="veil"></div>
    <div class="in">{mark(72, ACCENT)}
      <h1>Websites built to strike.</h1>
      <p>Design, build and launch. Live in weeks, not months.</p>
      <div class="by">viper net &middot; vipera</div></div></div>''',
  f""".w{{width:1200px;height:630px;position:relative;overflow:hidden;background:{CANVAS}}}
  .bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
  .veil{{position:absolute;inset:0;background:
     linear-gradient(180deg,rgba(8,13,20,.55) 0%,rgba(8,13,20,.86) 62%,{CANVAS} 100%)}}
  .in{{position:absolute;left:82px;right:82px;bottom:76px}}
  h1{{font:800 78px/1.02 Archivo;letter-spacing:-.032em;color:{TEXT};margin:26px 0 0;max-width:15ch}}
  p{{font:400 26px/1.5 'IBM Plex Sans',system-ui;color:{MUTED};margin:18px 0 0;max-width:46ch}}
  .by{{font:500 15px/1 'IBM Plex Mono',monospace;letter-spacing:.28em;text-transform:uppercase;
    color:{ACCENT};margin-top:26px}}"""), 1200, 630, 1)

(SP / "brand-jobs.json").write_text(json.dumps(jobs, indent=1))
print(f"{len(jobs)} assets staged")
