/* Viper Net — the strike line. Plain JS, no dependencies. */
(function () {
  'use strict';

  var VIDEO_URL = 'assets/hero-scrub.mp4';
  var POSTER_URL = 'assets/hero-poster.jpg';
  var VIDEO_BYTES = 6000000;

  var hero = document.getElementById('hero');
  var stage = document.getElementById('stage');
  var video = document.getElementById('hero-video');
  var poster = document.getElementById('poster');
  var ring = document.getElementById('ring');
  var cue = document.getElementById('cue');
  var bandEls = [].slice.call(document.querySelectorAll('.band'));

  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
  var smoothstep = function (p, e0, e1) {
    var t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  function rng(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  /* ---------- split the headlines once, at load ---------- */
  var rand = rng(20260820);
  function split(el, mode, spread) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    var sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = text;
    el.appendChild(sr);
    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    var words = text.split(' ');
    var totalChars = text.replace(/ /g, '').length;
    var charIndex = 0;
    words.forEach(function (word, wi) {
      var w = document.createElement('span');
      w.className = 'w';
      if (mode === 'drift' || mode === 'rise') {
        w.style.setProperty('--th', (wi / Math.max(1, words.length)) * 0.5);
      } else if (mode === 'punch') {
        w.style.setProperty('--th', (wi / Math.max(1, words.length)) * 0.46);
        if (/finished/i.test(word)) w.classList.add('em');
      }
      for (var i = 0; i < word.length; i++) {
        var c = document.createElement('span');
        c.className = 'c';
        c.textContent = word[i];
        if (mode === 'grid') {
          c.style.setProperty('--th', (charIndex / Math.max(1, totalChars)) * (spread || 0.5) + rand() * 0.06);
          c.style.setProperty('--jx', (18 + rand() * 34).toFixed(1) + 'px');
        }
        w.appendChild(c);
        charIndex++;
      }
      if (wi < words.length - 1) w.appendChild(document.createTextNode(' '));
      vis.appendChild(w);
    });
    el.appendChild(vis);
  }

  var bands = bandEls.map(function (el) {
    var r = (el.getAttribute('data-band') || '0,1').split(',');
    var mode = el.getAttribute('data-entrance') || 'drift';
    [].slice.call(el.querySelectorAll('.split')).forEach(function (s) {
      split(s, mode, parseFloat(el.getAttribute('data-spread')) || 0.5);
    });
    return {
      el: el,
      a: parseFloat(r[0]),
      b: parseFloat(r[1]),
      ramp: parseFloat(el.getAttribute('data-ramp')) || 0,
      settle: el.classList.contains('settle'),
      op: -1,
      k: -1
    };
  });

  /* ---------- the caption drive, delta gated ---------- */
  var loadK = 0;
  function updateCaptions(p) {
    for (var i = 0; i < bands.length; i++) {
      var bd = bands[i];
      var f = Math.min(0.02, (bd.b - bd.a) / 3);
      var inRamp = i === 0 ? 1 : smoothstep(p, bd.a, bd.a + f);
      var outRamp = i === bands.length - 1 ? 0 : smoothstep(p, bd.b - f, bd.b);
      var op = inRamp * (1 - outRamp);
      var k = clamp((p - bd.a) / (bd.ramp || Math.min(0.025, (bd.b - bd.a) * 0.35)), 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(op - bd.op) > 0.004) {
        bd.op = op;
        bd.el.style.opacity = op.toFixed(3);
        bd.el.style.visibility = op < 0.004 ? 'hidden' : 'visible';
      }
      if (Math.abs(k - bd.k) > 0.008) {
        bd.k = k;
        bd.el.style.setProperty('--k', k.toFixed(3));
        if (bd.settle) {
          bd.el.style.setProperty('--ks2', clamp((k - 0.5) * 3, 0, 1).toFixed(3));
          bd.el.style.setProperty('--kb', clamp((k - 0.68) * 3.4, 0, 1).toFixed(3));
        }
      }
    }
    if (cue) {
      var c = 1 - clamp(p * 9, 0, 1);
      if (Math.abs(c - (cue._v || -1)) > 0.02) { cue._v = c; cue.style.setProperty('--cue', c.toFixed(2)); }
    }
  }

  /* ---------- hero progress ---------- */
  function heroProgress() {
    var range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
  }

  /* ---------- gated seeks ---------- */
  var seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!video.duration || isNaN(t)) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', function () {
    seekBusy = false;
    if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function () { seekBusy = false; pendingTime = null; failVideo(); });

  /* ---------- the lerped drive loop that rests ---------- */
  var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    if (video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      heroOnScreen = es[0].isIntersecting;
      if (heroOnScreen && rafId === null && scrubOn) rafId = requestAnimationFrame(tick);
    }, { rootMargin: '10px' }).observe(hero);
  }

  /* ---------- the video, streamed as a Blob behind the ring ---------- */
  var heroInited = false;
  function initHeroOnce() {
    if (heroInited) return;
    heroInited = true;
    poster.style.backgroundImage = "url('" + POSTER_URL + "')";
    var started = false;
    var start = function () { if (!started) { started = true; loadHeroBlob().catch(failVideo); } };
    var img = new Image();
    img.onload = start;
    img.onerror = start;
    img.src = POSTER_URL;
    setTimeout(start, 4000);
    // band one opens settled: a one-time, time-based assembly that hands over to scroll.
    // driven by an interval, so it can never stall behind a throttled frame loop.
    var t0 = performance.now();
    var ramp = setInterval(function () {
      loadK = clamp((performance.now() - t0) / 900, 0, 1);
      updateCaptions(shown);
      if (loadK >= 1) clearInterval(ramp);
    }, 32);
  }

  function loadHeroBlob() {
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
    return fetch(VIDEO_URL, { signal: ctrl.signal }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('no video');
      var total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
      var reader = res.body.getReader();
      var chunks = [], got = 0, lastRing = 0;
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          clearTimeout(watchdog);
          watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
          chunks.push(r.value);
          got += r.value.length;
          var frac = Math.min(1, got / total);
          var now = performance.now();
          if (now - lastRing > 100 || frac === 1) {
            lastRing = now;
            ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
          }
          return pump();
        });
      })().then(function () {
        clearTimeout(watchdog);
        ring.style.setProperty('--ld', 0);
        video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
        video.load();
        video.addEventListener('canplay', function () {
          requestSeek(heroProgress() * video.duration);
          stage.classList.add('video-ready');
        }, { once: true });
      });
    });
  }

  function failVideo() {
    if (stage.classList.contains('video-failed')) return;
    stage.classList.add('video-failed');
    if (ring) ring.style.display = 'none';
  }

  /* ---------- the five static-hero gates, live in both directions ---------- */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var scrubOn = false;
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    window.addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(function (b) { b.op = -1; b.k = -1; });
    unpinFinalStates();
    updateCaptions(heroProgress());
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    window.removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function applyHeroMode() {
    if (GATES.some(function (q) { return matchMedia(q).matches; })) disableScrub();
    else enableScrub();
  }
  var MQLS = GATES.map(function (q) { return matchMedia(q); });
  MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });

  /* ---------- the strike line: the page's spine ---------- */
  var spineLive = document.getElementById('spineLive');
  var spineNode = document.getElementById('spineNode');
  var lastSpine = -1;
  function drawSpine() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    if (Math.abs(p - lastSpine) < 0.002) return;
    lastSpine = p;
    spineLive.style.strokeDashoffset = Math.round(1000 * (1 - p));
    spineNode.style.setProperty('--nodey', Math.round(p * window.innerHeight) + 'px');
  }

  /* ---------- page motion: reveals, track, nav ---------- */
  var nav = document.getElementById('nav');
  var track = document.getElementById('track');
  var trackFill = document.getElementById('trackFill');

  var revealIO = null;
  if ('IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    [].slice.call(document.querySelectorAll('.reveal')).forEach(function (el, i, all) {
      var siblings = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (c) {
        return c.classList && c.classList.contains('reveal');
      }) : [el];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = (idx * 0.09) + 's';
      el.addEventListener('transitionend', function once(ev) {
        if (ev.propertyName !== 'transform') return;
        el.style.transitionDelay = '0s';
        el.removeEventListener('transitionend', once);
      });
      revealIO.observe(el);
    });
    if (track) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { trackFill.style.setProperty('--track', '100%'); }
      }, { threshold: 0.3 }).observe(track);
    }
    // pause the living details of a section while it is off screen
    var liveIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('onscreen', e.isIntersecting); });
    }, { rootMargin: '20% 0px' });
    [].slice.call(document.querySelectorAll('section')).forEach(function (s) { liveIO.observe(s); });
  }

  function onPageScroll() {
    drawSpine();
    if (nav) nav.classList.toggle('solid', window.scrollY > 60);
  }
  window.addEventListener('scroll', onPageScroll, { passive: true });
  window.addEventListener('resize', function () { lastSpine = -1; drawSpine(); }, { passive: true });

  /* ---------- questions ---------- */
  [].slice.call(document.querySelectorAll('.qa')).forEach(function (qa) {
    var btn = qa.querySelector('.q');
    var panel = qa.querySelector('.a');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function () { panel.style.height = '0px'; });
      } else {
        panel.style.height = panel.scrollHeight + 'px';
      }
    });
    panel.addEventListener('transitionend', function () {
      if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
    });
  });

  /* ---------- the one interactive moment: hold to strike ---------- */
  var holder = document.getElementById('holder');
  var promises = document.getElementById('promises');
  var holdV = 0, holding = false, holdRaf = null, holdLast = 0, holdDone = false;
  function holdTick(now) {
    var dt = Math.min(100, now - (holdLast || now));
    holdLast = now;
    holdV += (holding ? dt / 1250 : -dt / 900);
    holdV = clamp(holdV, 0, 1);
    holder.style.setProperty('--hold', holdV.toFixed(3));
    if (holdV >= 1 && !holdDone) completeHold();
    if ((holding && holdV < 1) || (!holding && holdV > 0)) holdRaf = requestAnimationFrame(holdTick);
    else { holdRaf = null; holdLast = 0; }
  }
  function startHold(e) {
    if (holdDone) return;
    if (e && e.cancelable) e.preventDefault();
    holding = true;
    if (holdRaf === null) holdRaf = requestAnimationFrame(holdTick);
  }
  function endHold() { holding = false; if (holdRaf === null && holdV > 0) holdRaf = requestAnimationFrame(holdTick); }
  function completeHold() {
    holdDone = true;
    holder.classList.add('done');
    holder.querySelector('.holder-label').textContent = 'Struck';
    promises.classList.add('lit');
  }
  if (holder) {
    holder.addEventListener('pointerdown', startHold);
    holder.addEventListener('pointerup', endHold);
    holder.addEventListener('pointerleave', endHold);
    holder.addEventListener('pointercancel', endHold);
    holder.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startHold(); }
    });
    holder.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') endHold();
    });
    holder.addEventListener('click', function (e) { e.preventDefault(); });
  }

  /* ---------- the form: opens the visitor's own email app ---------- */
  var form = document.getElementById('form');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#f-name').value.trim();
      var mail = form.querySelector('#f-mail').value.trim();
      var msg = form.querySelector('#f-msg').value.trim();
      if (!name || !mail || !msg || mail.indexOf('@') < 1) {
        note.textContent = 'Fill in your name, your email and what you need, then try again.';
        note.classList.add('show', 'err');
        return;
      }
      note.classList.remove('err');
      var body = 'Name: ' + name + '\nEmail: ' + mail + '\n\n' + msg;
      var href = 'mailto:balakchiev09@gmail.com?subject=' +
        encodeURIComponent('New project: ' + name) + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      note.textContent = 'Your email app is open with the message ready. Hit send and I answer on the next working day.';
      note.classList.add('show');
    });
  }

  /* ---------- dust in the fixed environment ---------- */
  var dust = document.getElementById('dust');
  if (dust) {
    var dr = rng(77);
    for (var d = 0; d < 16; d++) {
      var i2 = document.createElement('i');
      i2.style.left = (dr() * 100).toFixed(2) + '%';
      i2.style.top = (60 + dr() * 60).toFixed(2) + '%';
      i2.style.animationDuration = (22 + dr() * 26).toFixed(1) + 's';
      i2.style.animationDelay = '-' + (dr() * 40).toFixed(1) + 's';
      i2.style.opacity = (0.14 + dr() * 0.26).toFixed(2);
      dust.appendChild(i2);
    }
  }

  /* ---------- reduced motion, honoured live, in both directions ---------- */
  function pinToFinalStates() {
    document.body.classList.add('pinned');
    spineLive.style.strokeDashoffset = 0;
    spineNode.style.setProperty('--nodey', Math.round(window.innerHeight * 0.5) + 'px');
    if (trackFill) trackFill.style.setProperty('--track', '100%');
    if (promises) promises.classList.add('lit');
    if (holder && !holdDone) { holdV = 1; holder.style.setProperty('--hold', '1'); completeHold(); }
    [].slice.call(document.querySelectorAll('.reveal')).forEach(function (el) {
      el.style.transitionDelay = '0s';
      el.classList.add('in');
    });
  }
  function unpinFinalStates() {
    document.body.classList.remove('pinned');
    lastSpine = -1;
    drawSpine();
  }
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    if (e.matches) pinToFinalStates();
    else applyHeroMode();
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) pinToFinalStates();

  /* ---------- pause every loop on a hidden tab ---------- */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  applyHeroMode();
  drawSpine();
  onPageScroll();
})();
