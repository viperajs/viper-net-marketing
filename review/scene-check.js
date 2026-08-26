// Confirm each pinned scene really holds and really advances: the stage must
// stay put while the section scrolls, and the items must arrive in order.
const { launch, connect, evaluate, sleep } = require('./cdp');
const URL = process.argv[2] || 'http://127.0.0.1:3000/';
(async () => {
  const b = await launch(9299); const c = await connect(9299);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await c.send('Page.navigate', { url: URL });
  await sleep(6500);
  const scenes = await evaluate(c, `JSON.stringify([...document.querySelectorAll('.vn-scene')].map(s=>({
    id:s.id, top:s.offsetTop, h:s.offsetHeight, items:s.querySelectorAll('[data-step]').length })))`);
  for (const sc of JSON.parse(scenes)) {
    console.log(`\n#${sc.id}  height ${sc.h}px  items ${sc.items}`);
    const range = sc.h - 900;
    for (const f of [0, 0.25, 0.5, 0.75, 1]) {
      await evaluate(c, `scrollTo(0, ${sc.top} + ${Math.round(range * f)})`);
      await sleep(420);
      const r = await evaluate(c, `(() => {
        const s = document.getElementById('${sc.id}');
        const stage = s.querySelector('.vn-scene-stage').getBoundingClientRect();
        const ks = [...s.querySelectorAll('[data-step]')].map(e=>Number(getComputedStyle(e).getPropertyValue('--op')||0).toFixed(2));
        return JSON.stringify({ stageTop: Math.round(stage.top), op: ks.join(' ') });
      })()`);
      const v = JSON.parse(r);
      console.log(`  p=${f}  stage top ${String(v.stageTop).padStart(4)}  item opacity ${v.op}`);
    }
  }
  c.close(); b.proc.kill();
})();
