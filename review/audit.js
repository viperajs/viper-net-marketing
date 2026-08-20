const { launch, connect, evaluate, shot, sleep } = require('./cdp');
const URL = 'http://127.0.0.1:8081/';
const OUT = __dirname + '/shots/';

(async () => {
  const b = await launch(9222);
  const c = await connect(9222);
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Log.enable');
  const errs = [];
  c.events.length = 0;

  async function viewport(w, h, mobile = false) {
    await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    await c.send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: 5 });
  }
  async function go() {
    await c.send('Page.navigate', { url: URL });
    await sleep(1800);
  }

  // ---- desktop 1440x900
  await viewport(1440, 900);
  await go();
  await shot(c, OUT + 'desk-top.png');
  const title = await evaluate(c, 'document.title');
  const bandCount = await evaluate(c, 'document.querySelectorAll(".band").length');
  const b1 = await evaluate(c, 'getComputedStyle(document.querySelector(".band-1")).opacity');
  console.log('title:', title, '| bands:', bandCount, '| band1 opacity at top:', b1);

  // scrub probe: band opacity + k across the hero
  const probe = await evaluate(c, `(async()=>{
    const out=[];
    const H=document.getElementById('hero').offsetHeight-innerHeight;
    for(const f of [0,.15,.3,.45,.6,.75,.9,1]){
      scrollTo(0,Math.round(H*f));
      await new Promise(r=>setTimeout(r,420));
      out.push(f+' -> '+[...document.querySelectorAll('.band')].map((b,i)=>
        i+':'+(+getComputedStyle(b).opacity).toFixed(2)+'/k'+(b.style.getPropertyValue('--k')||'0')).join(' '));
    }
    scrollTo(0,0);
    return out.join('\\n');
  })()`);
  console.log('--- band drive across hero ---\n' + probe);

  // full page shots
  await evaluate(c, 'scrollTo(0,document.getElementById("services").offsetTop-60)'); await sleep(1200);
  await shot(c, OUT + 'desk-services.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("work").offsetTop-60)'); await sleep(1400);
  await shot(c, OUT + 'desk-work.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("process").offsetTop-60)'); await sleep(1400);
  await shot(c, OUT + 'desk-process.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("strike").offsetTop-60)'); await sleep(1400);
  await shot(c, OUT + 'desk-strike.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("questions").offsetTop-60)'); await sleep(1400);
  await shot(c, OUT + 'desk-faq.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("start").offsetTop-60)'); await sleep(1400);
  await shot(c, OUT + 'desk-start.png');
  await evaluate(c, 'scrollTo(0,document.body.scrollHeight)'); await sleep(1200);
  await shot(c, OUT + 'desk-footer.png');

  // reveals actually played?
  const reveals = await evaluate(c, `(()=>{const all=[...document.querySelectorAll('.reveal')];
    return all.length+' reveals, '+all.filter(e=>e.classList.contains('in')).length+' played'})()`);
  console.log('reveals:', reveals);

  // sideways overflow?
  const side = await evaluate(c, 'document.documentElement.scrollWidth - innerWidth');
  console.log('horizontal overflow px:', side);

  // ---- phone 375x812 with touch (static hero gate)
  await viewport(375, 812, true);
  await go();
  await shot(c, OUT + 'phone-top.png');
  const gate = await evaluate(c, `(()=>{const s=getComputedStyle(document.getElementById('staticHero'));
    const v=document.getElementById('hero-video');
    return 'staticHero display:'+s.display+' | video src set:'+(!!v.getAttribute('src'))+' | poster:'+(document.getElementById('poster').style.backgroundImage||'none')})()`);
  console.log('phone gate:', gate);
  await evaluate(c, 'scrollTo(0,document.getElementById("work").offsetTop-40)'); await sleep(1400);
  await shot(c, OUT + 'phone-work.png');
  await evaluate(c, 'scrollTo(0,document.getElementById("start").offsetTop-40)'); await sleep(1400);
  await shot(c, OUT + 'phone-start.png');
  const sidePhone = await evaluate(c, 'document.documentElement.scrollWidth - innerWidth');
  console.log('phone horizontal overflow px:', sidePhone);

  // console errors collected from the whole run
  const logs = c.events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
    .map(e => e.params.entry.text);
  const exc = c.events.filter(e => e.method === 'Runtime.exceptionThrown')
    .map(e => e.params.exceptionDetails.exception?.description || 'exception');
  console.log('console errors:', JSON.stringify(logs.concat(exc), null, 1));

  c.close(); b.proc.kill();
})().catch(e => { console.error('AUDIT FAILED', e); process.exit(1); });
