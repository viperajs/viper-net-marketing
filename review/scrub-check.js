// Confirm the below-hero motion is really driven by scroll: --sp must change as
// the page moves, and must come back down when the reader scrolls up again.
const { launch, connect, evaluate, sleep } = require('./cdp');
const URL = process.argv[2] || 'http://127.0.0.1:3000/';
(async () => {
  const b = await launch(9298); const c = await connect(9298);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await c.send('Page.navigate', { url: URL });
  await sleep(6500);
  const read = () => evaluate(c, `(() => {
    const g = (s) => { const el = document.querySelector(s); if (!el) return 'x';
      const v = getComputedStyle(el).getPropertyValue('--sp').trim(); return v || '-'; };
    return JSON.stringify({ case1: g('.vn-case'), svc: g('.vn-svc'), step: g('.vn-step'),
      start: g('.vn-start'), pp: getComputedStyle(document.querySelector('.vn-root')).getPropertyValue('--pp').trim() });
  })()`);
  const work = await evaluate(c, "document.getElementById('work').offsetTop");
  for (const y of [work - 400, work + 200, work + 900, work + 2200, work + 3600]) {
    await evaluate(c, `scrollTo(0, ${y})`);
    await sleep(450);
    console.log('y', String(y).padStart(5), await read());
  }
  console.log('-- scrolling back up --');
  for (const y of [work + 900, work - 400]) {
    await evaluate(c, `scrollTo(0, ${y})`);
    await sleep(450);
    console.log('y', String(y).padStart(5), await read());
  }
  c.close(); b.proc.kill();
})();
