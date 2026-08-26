// Walk each pinned scene from top to bottom and record what the reader actually
// sees. Two faults look identical in a screenshot and are measured separately
// here: a stage whose lower half carries nothing (the "gap" the page was
// reported to have), and a swap scene showing two blocks of copy at once.
//
// The gap is measured from the boxes the browser actually laid out rather than
// from pixels, because the film behind a scene is bright enough in places to
// hide an empty band from a brightness scan. An element counts as seen only if
// its own opacity and every ancestor's multiply out above the threshold.
//
// Frames are written alongside the numbers so a failure can be looked at.
//
// Usage: node review/scene-gap.js <outDir> [w] [h] [steps] [url]
const fs = require('fs');
const { launch, connect, evaluate, sleep } = require('./cdp');

const OUT = process.argv[2] || '/tmp/scene-gap';
const W = Number(process.argv[3] || 1440);
const H = Number(process.argv[4] || 900);
const STEPS = Number(process.argv[5] || 16);
const URL = process.argv[6] || 'http://127.0.0.1:3000/';
const LIMIT = 0.38;   // a band this much of the stage tall reads as a hole

const MEASURE = (id) => `(() => {
  const s = document.getElementById(${JSON.stringify(id)});
  const stage = s.querySelector('.vn-scene-stage');
  const box = stage.getBoundingClientRect();
  const seen = (el) => {
    let o = 1;
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.display === 'none') return 0;
      o *= Number(cs.opacity);
      if (o < 0.15) return 0;
    }
    return o;
  };
  // leaves only: a wrapper's box spans the hole its children leave
  const rows = [];
  for (const el of stage.querySelectorAll('h2, h3, p, span, a, li > div, .vn-case-art')) {
    if (!el.classList.contains('vn-case-art') && el.querySelector('h2, h3, p, span, a')) continue;
    if (!seen(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 2 || r.bottom < box.top || r.top > box.bottom) continue;
    rows.push([Math.max(r.top, box.top), Math.min(r.bottom, box.bottom)]);
  }
  rows.sort((a, b) => a[0] - b[0]);
  let cursor = box.top, worst = 0, at = box.top;
  for (const [t, b] of rows) {
    if (t - cursor > worst) { worst = t - cursor; at = cursor; }
    cursor = Math.max(cursor, b);
  }
  if (box.bottom - cursor > worst) { worst = box.bottom - cursor; at = cursor; }
  const vis = (el) => seen(el) > 0;
  const copies = [...s.querySelectorAll('.vn-case')].filter(
    (e) => vis(e) && vis(e.querySelector('.vn-case-copy'))).length;
  return JSON.stringify({
    sc: Number(s.style.getPropertyValue('--sc') || 0),
    stage: Math.round(box.height),
    clipped: Math.round(Math.max(0, box.top - Math.min(...rows.map((r) => r[0])))),
    gap: Math.round(worst), at: Math.round(at - box.top),
    share: worst / box.height, copies,
    count: (s.querySelector('[data-scene-now]') || {}).textContent,
  });
})()`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch(9415);
  const c = await connect(9415);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.navigate', { url: URL });
  await sleep(7000);

  const report = [];
  for (const id of ['services', 'work', 'process']) {
    for (let i = 0; i < STEPS; i++) {
      const f = i / (STEPS - 1);
      await evaluate(c, `(() => {
        const s = document.getElementById('${id}');
        const range = Math.max(0, s.offsetHeight - innerHeight);
        scrollTo(0, s.getBoundingClientRect().top + scrollY + range * ${f});
      })()`);
      await sleep(560);  // longer than the copy's handover fade, so nothing is measured mid transition
      const m = JSON.parse(await evaluate(c, MEASURE(id)));
      const frame = `${id}-${String(i).padStart(2, '0')}.png`;
      const r = await c.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${OUT}/${frame}`, Buffer.from(r.data, 'base64'));
      report.push({ frame, ...m });
    }
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));

  let fail = 0;
  for (const id of ['services', 'work', 'process']) {
    const mine = report.filter((r) => r.frame.startsWith(id));
    const worst = mine.reduce((a, r) => (r.share > a.share ? r : a));
    const clip = mine.reduce((a, r) => (r.clipped > a.clipped ? r : a));
    const dbl = mine.filter((r) => r.copies > 1);
    const bad = worst.share > LIMIT || clip.clipped > 4 || dbl.length;
    if (bad) fail++;
    console.log(
      `${bad ? 'FAIL' : 'ok  '}${id.padEnd(9)} worst gap ${String(worst.gap).padStart(4)}px ` +
      `(${(worst.share * 100).toFixed(0)}% of ${worst.stage}px, at y=${worst.at}) in ${worst.frame}` +
      ` | clipped ${clip.clipped}px | two copies in ${dbl.length} frames`);
  }
  console.log(`${report.length} frames in ${OUT} @ ${W}x${H}`);
  c.close();
  b.proc.kill();
  process.exitCode = fail ? 1 : 0;
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
