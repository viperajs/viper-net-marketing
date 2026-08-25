// Audit everything below the hero in the Next.js app: the reveals, the strike
// line, the process track, the questions accordion, the hold interaction and
// the form. Needs the production server up on 3000.
// Usage: node review/site-next.js [url]
const { launch, connect, evaluate, sleep } = require('./cdp');
const URL = process.argv[2] || 'http://127.0.0.1:3000/';

(async () => {
  const b = await launch(9271);
  const c = await connect(9271);
  await c.send('Runtime.enable');
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  c.events.length = 0;
  await c.send('Page.navigate', { url: URL });
  await sleep(6000);

  console.log('sections:', await evaluate(c, "[...document.querySelectorAll('main > section')].map(s=>s.id).join(' ')"));
  // document.fonts.check() answers true for a missing family, because a fallback
  // satisfies the request. The face list is the honest source.
  console.log('font faces loaded:', await evaluate(c,
    "[...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.status).join(', ') || 'none'"));

  // scroll the whole page so every reveal and the track get their chance
  await evaluate(c, `(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  })()`);
  await sleep(2500);
  console.log('reveals:', await evaluate(c,
    "document.querySelectorAll('.vn-reveal').length + ' total, ' + document.querySelectorAll('.vn-reveal.vn-in').length + ' played'"));
  console.log('strike line drawn:', await evaluate(c, "document.getElementById('spineLive').style.strokeDashoffset"), '(0 = fully drawn)');
  console.log('process track fill:', await evaluate(c, "getComputedStyle(document.getElementById('trackFill')).getPropertyValue('--track').trim()"));

  // questions accordion
  await evaluate(c, "document.querySelector('.vn-q').click()");
  await sleep(700);
  console.log('question opens:', await evaluate(c,
    "document.querySelector('.vn-q').getAttribute('aria-expanded') + ', panel ' + document.querySelector('.vn-a').getBoundingClientRect().height.toFixed(0) + 'px'"));
  await evaluate(c, "document.querySelector('.vn-q').click()");
  await sleep(900);
  console.log('question closes to:', await evaluate(c, "document.querySelector('.vn-a').getBoundingClientRect().height.toFixed(0) + 'px'"));

  // hold to strike: press, watch it charge, release early, then complete it
  await evaluate(c, "document.getElementById('holder').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, cancelable:true}))");
  await sleep(400);
  const charging = await evaluate(c, "getComputedStyle(document.getElementById('holder')).getPropertyValue('--hold').trim()");
  await evaluate(c, "document.getElementById('holder').dispatchEvent(new PointerEvent('pointerup', {bubbles:true}))");
  await sleep(900);
  const eased = await evaluate(c, "getComputedStyle(document.getElementById('holder')).getPropertyValue('--hold').trim()");
  await evaluate(c, "document.getElementById('holder').dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, cancelable:true}))");
  await sleep(1600);
  console.log(`hold: charged to ${charging} in 0.4s, eased back to ${eased}, completed:`,
    await evaluate(c, "document.getElementById('holder').classList.contains('vn-done') + ', label ' + document.querySelector('.vn-holder-label').textContent"));
  console.log('promises lit:', await evaluate(c, "document.getElementById('promises').classList.contains('vn-lit')"));

  // the form must refuse an empty submit before it ever reaches the API
  await evaluate(c, "document.getElementById('form').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}))");
  await sleep(600);
  console.log('empty submit says:', JSON.stringify(await evaluate(c, "document.getElementById('formNote').textContent")));

  console.log('horizontal overflow px:', await evaluate(c, 'document.documentElement.scrollWidth - document.documentElement.clientWidth'));
  const errs = c.events
    .filter(e => e.method === 'Runtime.exceptionThrown' ||
      (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
    .map(e => e.params.exceptionDetails?.text || e.params.args?.map(a => a.value).join(' '));
  console.log('console errors:', errs.length ? JSON.stringify(errs.slice(0, 4)) : 'none');

  c.close();
  b.proc.kill();
})();
