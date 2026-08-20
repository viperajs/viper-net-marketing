const { launch, connect, evaluate, sleep } = require('./cdp');
const URL = 'http://127.0.0.1:8081/';
(async () => {
  const b = await launch(9225);
  const c = await connect(9225);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.navigate', { url: URL }); await sleep(1500);

  const heroPx = await evaluate(c, 'document.getElementById("hero").offsetHeight - innerHeight');
  console.log('hero scroll range:', heroPx, 'px (', (heroPx / 900).toFixed(1), 'viewports )');

  for (const step of [120, 240, 360]) {
    await evaluate(c, 'scrollTo({top:0,behavior:"instant"})'); await sleep(700);
    const steps = Math.ceil(heroPx / step) + 1;
    const rows = [];
    for (let i = 0; i < steps; i++) {
      await c.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: step });
      await sleep(400); // a beat between flicks, like a real reader
      rows.push(await evaluate(c, `[...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' ')`));
    }
    const m = rows.map(r => r.split(' ').map(Number));
    const holds = [0, 1, 2, 3].map(i => m.filter(r => r[i] > 0.95).length);
    const peaks = [0, 1, 2, 3].map(i => Math.max(...m.map(r => r[i])).toFixed(2));
    console.log(`flick ${step}px x${steps}: full-opacity steps per band = ${holds.join(', ')} | peak = ${peaks.join(', ')}`);
  }
  c.close(); b.proc.kill();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
