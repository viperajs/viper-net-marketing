// Walk the page on a handset the way a thumb does, and shoot it at set points.
//
// Why the small steps: the phone's motion is scroll-driven, and every element's
// progress is written on a scroll event. Jumping straight to a position fires
// one event and lands on a frame the reader would never see, which is how a
// perfectly good screen can be photographed looking dead. Stepping through it
// gives the same frames a reader gets.
//
// It also reports what mode the page chose, so a gate that stopped matching
// shows up as a number rather than as a screenshot someone has to interpret.
//
// Usage: node review/phone-walk.js <outDir> [w] [h] [stops] [url]
//   stops: comma separated fractions of the scrollable height, e.g. 0,0.25,0.5
const fs = require('fs');
const { launch, connect, evaluate, sleep } = require('./cdp');

const OUT = process.argv[2] || '/tmp/phone-walk';
const W = Number(process.argv[3] || 390);
const H = Number(process.argv[4] || 844);
const STOPS = (process.argv[5] || '0,0.07,0.13,0.2,0.3,0.4,0.5,0.6,0.72,0.85').split(',').map(Number);
const URL = process.argv[6] || 'http://127.0.0.1:3000/';
const STEP = 90;   // px per scroll event, about one thumb frame

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch(9426);
  const c = await connect(9426);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await c.send('Page.navigate', { url: URL });
  await sleep(7000);

  console.log(await evaluate(c, `JSON.stringify({
    heroScreens: +(document.querySelector('.vn-hero').offsetHeight / innerHeight).toFixed(2),
    heroPins: getComputedStyle(document.querySelector('.vn-stage')).position === 'sticky',
    poster: /hero-poster/.test(getComputedStyle(document.getElementById('poster')).backgroundImage),
    stillHero: getComputedStyle(document.getElementById('staticHero')).display !== 'none',
    scenesPin: getComputedStyle(document.querySelector('.vn-scene-stage')).position === 'sticky',
    caseCopyShown: [...document.querySelectorAll('.vn-case-copy')].every((e) => +getComputedStyle(e).opacity > .9),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })`));

  const max = await evaluate(c, 'document.documentElement.scrollHeight - innerHeight');
  let y = 0, shot = 0, next = 0;
  while (y <= max && next < STOPS.length) {
    await evaluate(c, `scrollTo({ top: ${Math.round(y)}, behavior: 'instant' })`);
    await sleep(28);
    if (y >= STOPS[next] * max) {
      await sleep(420);
      const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
      fs.writeFileSync(`${OUT}/p${String(shot++).padStart(2, '0')}.jpg`, Buffer.from(r.data, 'base64'));
      next++;
    }
    y += STEP;
  }
  console.log(`${shot} frames in ${OUT} @ ${W}x${H}, page ${max + H}px`);
  c.close();
  b.proc.kill();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
