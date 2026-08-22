// Audit the cinematic hero as it runs inside the Next.js app, not in the
// standalone build. Needs the production server up:
//   npm run build && npx next start   (with the env vars /api/contact needs)
// Usage: node review/hero-next.js [url]
const { launch, connect, evaluate, sleep } = require('./cdp');
const URL = process.argv[2] || 'http://127.0.0.1:3000/';

(async () => {
  const b = await launch(9270);
  const c = await connect(9270);
  await c.send('Runtime.enable');
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  c.events.length = 0;
  await c.send('Page.navigate', { url: URL });
  await sleep(7000);

  // every stylesheet the document asks for must actually resolve: a missing
  // Tailwind chunk silently drops position:fixed and the whole layout shifts
  console.log('stylesheets:', await evaluate(c, `(async () => {
    const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href);
    const out = [];
    for (const href of links) { const r = await fetch(href); out.push(r.status + ' ' + href.split('/').pop()); }
    return out.join(' | ');
  })()`));

  // position: sticky pins to the nearest scrolling ancestor, so any ancestor
  // with overflow hidden/auto/scroll silently steals the hero's stage
  console.log('sticky breakers:', await evaluate(c, `(() => {
    const stage = document.querySelector('.vn-stage');
    const bad = [];
    for (let el = stage.parentElement; el && el !== document.documentElement; el = el.parentElement) {
      const s = getComputedStyle(el);
      if (['hidden','auto','scroll'].includes(s.overflowY)) bad.push(el.tagName + '.' + String(el.className).slice(0, 30));
    }
    return bad.length ? bad.join(', ') : 'none';
  })()`));

  const range = await evaluate(c, "document.querySelector('.vn-hero').offsetHeight - innerHeight");
  console.log('hero scroll range:', range, 'px (', (range / 900).toFixed(1), 'viewports )');

  for (const p of [0, 0.1, 0.35, 0.6, 0.9, 1]) {
    await evaluate(c, `scrollTo(0, ${range} * ${p})`);
    await sleep(700);
    console.log(' progress', String(p).padEnd(5),
      '| stage top', await evaluate(c, "Math.round(document.querySelector('.vn-stage').getBoundingClientRect().top)"),
      '| band opacity', await evaluate(c, "[...document.querySelectorAll('.vn-band')].map(b=>Number(getComputedStyle(b).opacity).toFixed(2)).join(' ')"));
  }

  await evaluate(c, 'scrollTo(0,0)');
  await sleep(500);
  console.log('stage class:', await evaluate(c, "document.querySelector('.vn-stage').className"));
  console.log('horizontal overflow px:', await evaluate(c, 'document.documentElement.scrollWidth - document.documentElement.clientWidth'));

  const errs = c.events
    .filter(e => e.method === 'Runtime.exceptionThrown' ||
      (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
    .map(e => e.params.exceptionDetails?.text || e.params.args?.map(a => a.value).join(' '));
  console.log('console errors:', errs.length ? JSON.stringify(errs.slice(0, 5)) : 'none');

  c.close();
  b.proc.kill();
})();
