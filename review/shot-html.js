// Render a local HTML file to PNG at an exact size, using the machine's Chromium.
// Usage: node review/shot-html.js <jobs.json>
const fs = require('fs');
const { launch, connect, sleep } = require('./cdp');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await launch(9296);
  const c = await connect(9296);
  await c.send('Page.enable');
  for (const j of jobs) {
    await c.send('Emulation.setDeviceMetricsOverride',
      { width: j.w, height: j.h, deviceScaleFactor: j.scale, mobile: false });
    await c.send('Page.navigate', { url: 'file://' + j.html });
    await sleep(900);
    const r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(j.out, Buffer.from(r.data, 'base64'));
    console.log('  ', j.name, j.w + 'x' + j.h, '@' + j.scale + 'x');
  }
  c.close(); b.proc.kill();
})();
