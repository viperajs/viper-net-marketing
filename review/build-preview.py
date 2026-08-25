"""Build a single self-contained HTML file from viper-net-site/.

Everything the page needs is inlined as data URIs: the fonts, the stylesheets,
the script, the poster, the ending frame and the hero footage itself. Used to
publish a private preview the owner can open and scroll in a real browser,
since the container cannot expose a port and the headless Chromium here has no
H.264 decoder.

The source folder is never modified. The only behaviour change in the preview
copy is the video load path: the streamed Blob fetch is replaced by a direct
src assignment, because the footage is already in the document rather than
arriving over the network.
"""
import base64, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "viper-net-site"
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "review" / "preview.html"

def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

html = (SITE / "index.html").read_text()
fonts_css = (SITE / "assets" / "fonts.css").read_text()
styles_css = (SITE / "assets" / "styles.css").read_text()
app_js = (SITE / "assets" / "app.js").read_text()

# fonts: whatever the stylesheet actually references, so a change of type trio
# does not silently ship a page with no fonts in it
import re as _re
for file in sorted(set(_re.findall(r"url\('fonts/([^']+)'\)", fonts_css))):
    uri = data_uri(SITE / "assets" / "fonts" / file, "font/woff2")
    fonts_css = fonts_css.replace(f"url('fonts/{file}')", f"url('{uri}')")
assert "url('fonts/" not in fonts_css, "a font reference was left pointing at a file"

# every image the stylesheet references, inlined: the artifact host blocks
# outside requests and relative paths do not resolve inside it
for name in ("hero-ending.jpg", "case-1.jpg", "case-2.jpg", "case-3.jpg"):
    uri = data_uri(SITE / "assets" / name, "image/jpeg")
    styles_css = styles_css.replace(f'url("{name}")', f'url("{uri}")')
assert "url(\"case-" not in styles_css and "url(\"hero-" not in styles_css, "an image reference was left pointing at a file"

# the script's two asset URLs
poster = data_uri(SITE / "assets" / "hero-poster.jpg", "image/jpeg")
video = data_uri(SITE / "assets" / "hero-scrub.mp4", "video/mp4")
app_js = app_js.replace("var POSTER_URL = 'assets/hero-poster.jpg';", f"var POSTER_URL = '{poster}';")

# the footage is already in the document, so hand it straight to the element
# instead of streaming it: same ready state, same seeking, no network step
old_loader = re.search(r"  function loadHeroBlob\(\) \{.*?\n  \}\n", app_js, re.S)
assert old_loader, "loadHeroBlob not found; the source changed shape"
app_js = app_js.replace(old_loader.group(0), """  function loadHeroBlob() {
    return new Promise(function (resolve, reject) {
      ring.style.setProperty('--ld', 0);
      video.src = VIDEO_SRC;
      video.load();
      video.addEventListener('canplay', function () {
        requestSeek(heroProgress() * video.duration);
        stage.classList.add('video-ready');
        resolve();
      }, { once: true });
      video.addEventListener('error', function () { reject(new Error('no video')); }, { once: true });
    });
  }
""")
app_js = app_js.replace("  var VIDEO_URL = 'assets/hero-scrub.mp4';",
                        f"  var VIDEO_SRC = '{video}';")

# fold the four external references into the document
html = html.replace('<link rel="preload" href="assets/fonts/syne.woff2" as="font" type="font/woff2" crossorigin>\n', "")
html = html.replace('<link rel="preload" href="assets/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>\n', "")
html = html.replace('<link rel="stylesheet" href="assets/fonts.css">',
                    "<style>\n" + fonts_css + "\n</style>")
html = html.replace('<link rel="stylesheet" href="assets/styles.css">',
                    "<style>\n" + styles_css + "\n</style>")
html = html.replace('<script src="assets/app.js"></script>',
                    "<script>\n" + app_js + "\n</script>")
html = html.replace('<meta property="og:image" content="https://example.com/assets/hero-poster.jpg">',
                    '<meta property="og:image" content="' + poster + '">')

# Preview-only: narrow the static-hero gates. The shipped page swaps the scrub
# for the composed still on phones and in any portrait frame under 1024px, which
# is exactly the shape of a preview panel, so the preview would never show the
# thing it exists to show. Reduced motion is still honoured. Both sides of the
# gate are rewritten together: the CSS media query list and the JS array must
# always agree, or one side loads what the other hides.
PREVIEW_GATES = [
    "(max-width: 420px)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)",
]
old_css_gates = re.search(r"@media \(max-width: 720px\),\n.*?\(prefers-reduced-motion: reduce\)\{", html, re.S)
assert old_css_gates, "the CSS gate list changed shape"
html = html.replace(old_css_gates.group(0), "@media " + ",\n       ".join(PREVIEW_GATES) + "{")
old_js_gates = re.search(r"  var GATES = \[.*?\n  \];", html, re.S)
assert old_js_gates, "the JS gate list changed shape"
html = html.replace(old_js_gates.group(0),
                    "  var GATES = [\n" + ",\n".join("    '" + g + "'" for g in PREVIEW_GATES) + "\n  ];")

# the artifact host supplies the document skeleton, so ship the page content only
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
styles = re.findall(r"<style>.*?</style>", html, re.S)
# the artifact gallery names the page from this tag
OUT.write_text("<title>Viper Net</title>\n" + "\n".join(styles) + "\n" + body)
print(f"{OUT}  {OUT.stat().st_size/1048576:.2f} MB")
