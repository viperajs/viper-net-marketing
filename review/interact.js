const { launch, connect, evaluate, shot, sleep } = require('./cdp');
const URL = 'http://127.0.0.1:8081/';
const OUT = __dirname + '/shots/';
(async () => {
  const b = await launch(9224);
  const c = await connect(9224);
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Log.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.navigate', { url: URL }); await sleep(1500);

  // ---- flick test on the beat map
  for (const step of [120, 240, 360]) {
    const log = await evaluate(c, `(async()=>{
      scrollTo(0,0); await new Promise(r=>setTimeout(r,300));
      const rows=[]; const n = ${step}===120?26:(${step}===240?14:10);
      for(let i=0;i<n;i++){
        scrollBy(0,${step});
        await new Promise(r=>setTimeout(r,380));
        rows.push([...document.querySelectorAll('.band')].map(b=>(+getComputedStyle(b).opacity).toFixed(2)).join(' '));
      }
      return rows.join('|');
    })()`);
    const rows = log.split('|').map(r => r.split(' ').map(Number));
    const holds = [0, 1, 2, 3].map(i => rows.filter(r => r[i] > 0.95).length);
    const seen = [0, 1, 2, 3].map(i => Math.max(...rows.map(r => r[i])).toFixed(2));
    console.log(`flick ${step}px: full-opacity steps per band = ${holds.join(', ')} | peak seen = ${seen.join(', ')}`);
  }

  // ---- FAQ
  await evaluate(c, 'scrollTo(0,document.getElementById("questions").offsetTop-60)'); await sleep(900);
  await evaluate(c, 'document.querySelector(".qa .q").click()'); await sleep(900);
  const faqOpen = await evaluate(c, `(()=>{const p=document.querySelector('.qa .a');
    return 'expanded='+document.querySelector('.qa .q').getAttribute('aria-expanded')+' height='+getComputedStyle(p).height})()`);
  await shot(c, OUT + 'faq-open.png');
  await evaluate(c, 'document.querySelector(".qa .q").click()'); await sleep(900);
  const faqShut = await evaluate(c, `getComputedStyle(document.querySelector('.qa .a')).height`);
  console.log('faq open:', faqOpen, '| after closing:', faqShut);

  // ---- the hold, performed like a visitor: press, wait, release
  await evaluate(c, 'scrollTo(0,document.getElementById("strike").offsetTop-60)'); await sleep(900);
  const box = await evaluate(c, `(()=>{const r=document.getElementById('holder').getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)})})()`);
  const { x, y } = JSON.parse(box);
  // short press, released early: must ease back, not snap
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await sleep(400);
  const mid = await evaluate(c, `getComputedStyle(document.getElementById('holder')).getPropertyValue('--hold')`);
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await sleep(700);
  const back = await evaluate(c, `getComputedStyle(document.getElementById('holder')).getPropertyValue('--hold')`);
  // full press
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await sleep(1700);
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  await sleep(900);
  const done = await evaluate(c, `document.getElementById('promises').classList.contains('lit')+' | label='+document.querySelector('.holder-label').textContent`);
  console.log('hold: at 0.4s =', mid.trim(), '| eased back to', back.trim(), '| completed:', done);
  await shot(c, OUT + 'strike-done.png');

  // ---- form validation
  await evaluate(c, 'scrollTo(0,document.getElementById("start").offsetTop-60)'); await sleep(900);
  await evaluate(c, 'document.querySelector("#form button[type=submit]").click()'); await sleep(500);
  const bad = await evaluate(c, `document.getElementById('formNote').textContent`);
  console.log('empty submit says:', bad);
  await shot(c, OUT + 'form-error.png');

  // ---- reduced motion, flipped live while the page is open
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await sleep(1200);
  const rm = await evaluate(c, `(()=>{const sh=getComputedStyle(document.getElementById('staticHero')).display;
    const pinned=document.body.classList.contains('pinned');
    const spine=document.getElementById('spineLive').style.strokeDashoffset;
    return 'staticHero='+sh+' pinned='+pinned+' spineOffset='+spine})()`);
  console.log('reduced motion ON mid-session:', rm);
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await sleep(1200);
  const rm2 = await evaluate(c, `(()=>{const sh=getComputedStyle(document.getElementById('staticHero')).display;
    return 'staticHero='+sh+' pinned='+document.body.classList.contains('pinned')})()`);
  console.log('reduced motion OFF again:', rm2);

  const logs = c.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map(e => e.params.entry.text);
  console.log('console errors:', JSON.stringify(logs));
  c.close(); b.proc.kill();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
