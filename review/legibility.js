// Worst-frame legibility audit, step 1: measure the real caption boxes and the
// video's cover mapping in a real browser. Pixel math happens in legibility.py.
const { launch, connect, evaluate, sleep } = require('./cdp');
(async () => {
  const b = await launch(9240);
  const c = await connect(9240);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.navigate', { url: 'http://127.0.0.1:8081/index.html' });
  await sleep(5000);
  const out = await evaluate(c, `(() => {
    const hero = document.getElementById('hero');
    const bands = [...document.querySelectorAll('.band')];
    const range = hero.offsetHeight - innerHeight;
    const res = { viewport: { w: innerWidth, h: innerHeight }, bands: [] };
    for (const band of bands) {
      const [a, z] = band.dataset.band.split(',').map(Number);
      const mid = (a + z) / 2;
      scrollTo(0, range * mid);
      const stage = document.getElementById('stage').getBoundingClientRect();
      // real glyph rects, not the element block: a left-aligned h1 in a wide box
      // must not be audited over screen regions its letters never touch
      const boxes = [];
      for (const el of band.querySelectorAll('h1,h2,p,.btn')) {
        const color = getComputedStyle(el).color;
        const cls = el.className;
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.textContent.trim()) continue;
          const rg = document.createRange();
          rg.selectNodeContents(n);
          for (const r of rg.getClientRects()) {
            if (r.width > 1 && r.height > 1) boxes.push({ x: r.x, y: r.y, w: r.width, h: r.height, color, cls, tag: el.tagName });
          }
        }
      }
      res.bands.push({ cls: band.className, from: a, to: z, stage: { x: stage.x, y: stage.y, w: stage.width, h: stage.height }, boxes });
    }
    return JSON.stringify(res);
  })()`);
  console.log(out);
  c.close(); b.proc.kill();
})();
