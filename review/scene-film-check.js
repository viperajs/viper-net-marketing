// A scene's film must load only when the reader nears it, then scrub with the
// scene rather than play on its own.
const { launch, connect, evaluate, sleep } = require('./cdp');
(async () => {
  const b = await launch(9302); const c = await connect(9302);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width:1440, height:900, deviceScaleFactor:1, mobile:false });
  await c.send('Page.navigate', { url: process.argv[2] || 'http://127.0.0.1:3000/' });
  await sleep(6500);
  const state = () => evaluate(c, `JSON.stringify([...document.querySelectorAll('.vn-scene[data-film]')].map(s=>{
    const w = s.querySelector('.vn-scene-film'); const v = w.querySelector('video');
    return { id: s.id, ready: w.classList.contains('vn-ready'),
      src: v.src ? v.src.slice(0,5) : 'none', t: v.currentTime ? v.currentTime.toFixed(2) : '0' };
  }))`);
  console.log('at the top:      ', await state());
  for (const id of ['services','work','process']) {
    const info = await evaluate(c, `(()=>{const s=document.getElementById('${id}');
      return JSON.stringify({top:s.getBoundingClientRect().top+scrollY,h:s.offsetHeight});})()`);
    const { top, h } = JSON.parse(info);
    await evaluate(c, `scrollTo(0, ${Math.round(top + (h-900)*0.25)})`);
    await sleep(1600);
    const a = JSON.parse(await state()).find(x=>x.id===id);
    await evaluate(c, `scrollTo(0, ${Math.round(top + (h-900)*0.85)})`);
    await sleep(1400);
    const bb = JSON.parse(await state()).find(x=>x.id===id);
    console.log(`#${id.padEnd(9)} ready=${bb.ready} src=${bb.src}  film time ${a.t}s -> ${bb.t}s`);
  }
  c.close(); b.proc.kill();
})();
