const { launch, connect, evaluate, shot, sleep } = require('./cdp');
const sites = [
  ['https://www.averaeood.bg/', 'avera'],
  ['https://bgoil.bg/', 'bgoil'],
  ['https://www.sbsecurity.net/', 'sbsecurity']
];
(async () => {
  const b = await launch(9223, { proxy: process.env.HTTPS_PROXY });
  const c = await connect(9223);
  await c.send('Page.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  for (const [url, name] of sites) {
    try {
      await c.send('Page.navigate', { url });
      await sleep(6000);
      await evaluate(c, 'scrollTo(0,0)');
      await sleep(700);
      await shot(c, __dirname + '/shots/client-' + name + '.png');
      const t = await evaluate(c, 'document.title');
      console.log(name, 'captured |', t.slice(0, 70));
    } catch (e) { console.log(name, 'FAILED', e.message.slice(0, 120)); }
  }
  c.close(); b.proc.kill();
})();
