// Worst-frame legibility for the hero captions, at any viewport.
//
// review/legibility.js does this for the wide screen by computing the video's
// cover mapping and auditing the footage frames directly. This one is simpler
// and works anywhere: it drives the real page to each band's own midpoint,
// measures the caption boxes, then hides only the glyphs and shoots the ground
// they were sitting on, scrims and all. review/band-legibility.py reads the
// brightest patch under each line and reports the contrast.
//
// Hiding only the glyphs matters: the band's scrim is part of the ground, so
// removing the whole band would audit a page that never renders.
//
// Usage: node review/band-legibility.js <outDir> [w] [h] [url]
// Then:  python3 review/band-legibility.py <outDir>
const fs = require('fs');
const { launch, connect, evaluate, sleep } = require('./cdp');

const OUT = process.argv[2] || '/tmp/band-legibility';
const W = Number(process.argv[3] || 390);
const H = Number(process.argv[4] || 844);
const URL = process.argv[5] || 'http://127.0.0.1:3000/';
const LINES = 'h1,h2,p,.vn-btn';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch(9431);
  const c = await connect(9431);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 900 });
  await c.send('Emulation.setTouchEmulationEnabled', { enabled: W < 900, maxTouchPoints: 5 });
  await c.send('Page.navigate', { url: URL });
  await sleep(11000);   // the film is fetched whole before the hero can scrub

  const bands = JSON.parse(await evaluate(c, `JSON.stringify(
    [...document.querySelectorAll('.vn-band')].map((b) => b.dataset.band.split(',').map(Number)))`));
  if (!bands.length) { console.log('no bands at this viewport: the still hero is showing'); c.close(); b.proc.kill(); return; }
  const range = await evaluate(c, "document.querySelector('.vn-hero').offsetHeight - innerHeight");

  const boxes = [];
  for (let i = 0; i < bands.length; i++) {
    const mid = (bands[i][0] + bands[i][1]) / 2;
    // walk in rather than jump: the drive is scroll-fed and lerped, so a jump
    // lands on a frame the reader never sees
    let y = Math.max(0, range * mid - 600);
    while (y < range * mid) {
      await evaluate(c, `scrollTo({ top: ${Math.round(y)}, behavior: 'instant' })`);
      await sleep(24);
      y += 70;
    }
    await evaluate(c, `scrollTo({ top: ${Math.round(range * mid)}, behavior: 'instant' })`);
    await sleep(900);

    const rects = JSON.parse(await evaluate(c, `(() => {
      const band = document.querySelectorAll('.vn-band')[${i}];
      const out = [];
      for (const el of band.querySelectorAll('${LINES}')) {
        const r = el.getBoundingClientRect();
        if (r.width > 4 && r.height > 4 && Number(getComputedStyle(el).opacity) > 0.5)
          out.push([Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]);
      }
      return JSON.stringify(out);
    })()`));

    let r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/band${i}-text.png`, Buffer.from(r.data, 'base64'));
    const hide = (v) => `document.querySelectorAll('.vn-band')[${i}]
      .querySelectorAll('${LINES}').forEach((e) => e.style.visibility = '${v}')`;
    await evaluate(c, hide('hidden'));
    await sleep(200);
    r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/band${i}-ground.png`, Buffer.from(r.data, 'base64'));
    await evaluate(c, hide(''));
    boxes.push({ band: i, rects });
  }
  fs.writeFileSync(`${OUT}/boxes.json`, JSON.stringify(boxes, null, 1));
  console.log(`${bands.length} bands at ${W}x${H}, boxes per band: ${boxes.map((b) => b.rects.length).join(',')}`);
  c.close();
  b.proc.kill();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
