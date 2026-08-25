// Record the scroll journey as frames, exactly as the page renders it.
//
// Why this is not a plain screen recording: the Chromium available here is built
// without an H.264 decoder, so the hero video never plays in it and a straight
// capture would show the poster for the whole journey. Instead the hero's video
// element is swapped for an image, and for every scroll position the matching
// film frame is loaded into it, through the same hold-and-map the page uses. The
// rest of the page renders untouched, so what comes out is the real thing.
//
// Needs the film frames served somewhere, e.g.
//   ffmpeg -i assets/hero-scrub.mp4 -vf "fps=30,scale=1440:-2" -q:v 3 frames/%04d.jpg
//   (cd frames && python3 -m http.server 8099)
//
// Usage: node review/record-scroll.js [url] [outDir] [framesBase] [frameCount]
const fs = require('fs');
const { launch, connect, evaluate, sleep } = require('./cdp');

const URL = process.argv[2] || 'http://127.0.0.1:3000/';
const OUT = process.argv[3] || '/tmp/scroll-frames';
const FILM = process.argv[4] || 'http://127.0.0.1:8099';
const FILM_COUNT = Number(process.argv[5] || 181);
const W = 1440, H = 900;
const HOLD = 0.15;          // matches CinematicSite.jsx
const HERO_FRAMES = 330;    // the scrubbed journey
const TAIL_FRAMES = 200;    // the page below it

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch(9292);
  const c = await connect(9292);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.navigate', { url: URL });
  await sleep(7000);

  // swap the undecodable video for an image the recorder can drive
  await evaluate(c, `(() => {
    const stage = document.getElementById('stage');
    const v = document.getElementById('vn-hero-video');
    if (v) v.style.display = 'none';
    const p = document.querySelector('.vn-poster');
    if (p) p.style.display = 'none';
    const ring = document.querySelector('.vn-ring');
    if (ring) ring.style.display = 'none';
    const img = document.createElement('img');
    img.id = 'filmshot';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0';
    stage.insertBefore(img, stage.firstChild);
    window.__setFilm = (n) => new Promise(res => {
      const img = document.getElementById('filmshot');
      const src = '${FILM}/' + String(n).padStart(4, '0') + '.jpg';
      if (img.getAttribute('src') === src) return res(true);
      img.onload = () => res(true);
      img.onerror = () => res(false);
      img.setAttribute('src', src);
    });
  })()`);

  const heroRange = await evaluate(c, "document.querySelector('.vn-hero').offsetHeight - innerHeight");
  const pageMax = await evaluate(c, 'document.documentElement.scrollHeight - innerHeight');

  let n = 0;
  let loadFailures = 0;
  const shoot = async (y) => {
    await evaluate(c, `scrollTo(0, ${Math.round(y)})`);
    if (y <= heroRange) {
      const p = heroRange ? y / heroRange : 0;
      const t = Math.max(0, Math.min(1, (p - HOLD) / (1 - HOLD)));
      const idx = Math.min(FILM_COUNT, Math.max(1, Math.round(t * (FILM_COUNT - 1)) + 1));
      const ok = await evaluate(c, `window.__setFilm(${idx})`);
      if (!ok) loadFailures++;
    }
    await sleep(70);
    const r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/${String(n).padStart(4, '0')}.png`, Buffer.from(r.data, 'base64'));
    n++;
  };

  // ease the scroll the way a reader moves: slow in, steady, slow out
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  for (let i = 0; i < HERO_FRAMES; i++) await shoot(ease(i / (HERO_FRAMES - 1)) * heroRange);
  for (let i = 0; i < TAIL_FRAMES; i++) {
    const t = (i + 1) / TAIL_FRAMES;
    await shoot(heroRange + ease(t) * (pageMax - heroRange));
  }

  console.log('captured', n, 'frames | film load failures:', loadFailures, '| heroRange', heroRange, '| pageMax', pageMax);
  c.close();
  b.proc.kill();
})();
