"use client";

import { useEffect, useRef } from "react";
import "./cinematic-site.css";

const VIDEO_URL = "/hero/hero-scrub.mp4";
const POSTER_URL = "/hero/hero-poster.jpg";
// the real byte size, the loading ring's fallback when Content-Length is missing
const VIDEO_BYTES = 6957468;
// the film holds on frame one for this much of the hero scroll, so the headline
// gets a plateau before the bright pass through the glass begins
const HOLD = 0.15;
const filmTime = (p) => clamp((p - HOLD) / (1 - HOLD), 0, 1);

// the five static-hero gates. These must stay identical to the media query list
// at the bottom of cinematic-site.css, or one side loads what the other hides.
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// Split a caption into words and characters so the entrances can move them
// independently. The untouched sentence stays in the DOM for screen readers.
function split(el, mode, spread, rand) {
  const text = el.textContent.replace(/\s+/g, " ").trim();
  el.textContent = "";
  const sr = document.createElement("span");
  sr.className = "vn-sr";
  sr.textContent = text;
  el.appendChild(sr);

  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  const words = text.split(" ");
  const totalChars = text.replace(/ /g, "").length;
  let charIndex = 0;

  words.forEach((word, wi) => {
    const w = document.createElement("span");
    w.className = "vn-w";
    if (mode === "focus" || mode === "rise") {
      w.style.setProperty("--th", (wi / Math.max(1, words.length)) * 0.5);
    } else if (mode === "punch") {
      w.style.setProperty("--th", (wi / Math.max(1, words.length)) * 0.46);
      if (/finished/i.test(word)) w.classList.add("vn-em");
    }
    for (let i = 0; i < word.length; i++) {
      const c = document.createElement("span");
      c.className = "vn-c";
      c.textContent = word[i];
      if (mode === "aperture") {
        c.style.setProperty("--th", (charIndex / Math.max(1, totalChars)) * (spread || 0.5) + rand() * 0.06);
        c.style.setProperty("--jx", (18 + rand() * 34).toFixed(1) + "px");
      }
      w.appendChild(c);
      charIndex++;
    }
    if (wi < words.length - 1) w.appendChild(document.createTextNode(" "));
    vis.appendChild(w);
  });
  el.appendChild(vis);
}


// One seek in flight per video, newest target wins. The hero and every scene
// film share this: without it, fast scrolling queues seeks and the picture lags
// behind the page by a growing margin.
function gatedSeek(video, onFail) {
  let busy = false;
  let pending = null;
  const pump = () => {
    busy = false;
    if (pending !== null) {
      const t = pending;
      pending = null;
      seek(t);
    }
  };
  const fail = () => {
    busy = false;
    pending = null;
    if (onFail) onFail();
  };
  function seek(t) {
    if (!video.duration || isNaN(t)) return;
    if (busy) {
      pending = t;
      return;
    }
    busy = true;
    video.currentTime = t;
  }
  video.addEventListener("seeked", pump);
  video.addEventListener("error", fail);
  return { seek, dispose: () => { video.removeEventListener("seeked", pump); video.removeEventListener("error", fail); } };
}

export default function CinematicSite() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = (sel) => root.querySelector(sel);
    const qa = (sel) => [...root.querySelectorAll(sel)];

    const hero = q("#hero");
    const stage = q("#stage");
    const video = q("#vn-hero-video");
    const poster = q("#poster");
    const ring = q("#ring");
    const cue = q("#cue");
    const cleanups = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    /* ---------- split the headlines once, at load ---------- */
    const rand = rng(20260820);
    const bands = qa(".vn-band").map((el) => {
      const [a, b] = (el.dataset.band || "0,1").split(",").map(Number);
      const mode = el.dataset.entrance || "drift";
      el.querySelectorAll(".vn-split").forEach((s) => split(s, mode, parseFloat(el.dataset.spread) || 0.5, rand));
      return { el, a, b, ramp: parseFloat(el.dataset.ramp) || 0, settle: el.classList.contains("vn-settle"), op: -1, k: -1 };
    });

    /* ---------- the caption drive, delta gated ---------- */
    let loadK = 0;
    let cueV = -1;
    function updateCaptions(p) {
      for (let i = 0; i < bands.length; i++) {
        const bd = bands[i];
        const f = Math.min(0.02, (bd.b - bd.a) / 3);
        const inRamp = i === 0 ? 1 : smoothstep(p, bd.a, bd.a + f);
        const outRamp = i === bands.length - 1 ? 0 : smoothstep(p, bd.b - f, bd.b);
        const op = inRamp * (1 - outRamp);
        let k = clamp((p - bd.a) / (bd.ramp || Math.min(0.025, (bd.b - bd.a) * 0.35)), 0, 1);
        if (i === 0) k = Math.max(k, loadK);
        if (Math.abs(op - bd.op) > 0.004) {
          bd.op = op;
          bd.el.style.opacity = op.toFixed(3);
          bd.el.style.visibility = op < 0.004 ? "hidden" : "visible";
        }
        if (Math.abs(k - bd.k) > 0.008) {
          bd.k = k;
          bd.el.style.setProperty("--k", k.toFixed(3));
          if (bd.settle) {
            bd.el.style.setProperty("--ks2", clamp((k - 0.5) * 3, 0, 1).toFixed(3));
            bd.el.style.setProperty("--kb", clamp((k - 0.68) * 3.4, 0, 1).toFixed(3));
          }
        }
      }
      if (cue) {
        const c = 1 - clamp(p * 9, 0, 1);
        if (Math.abs(c - cueV) > 0.02) {
          cueV = c;
          cue.style.setProperty("--cue", c.toFixed(2));
        }
      }
    }

    function heroProgress() {
      const range = hero.offsetHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
    }

    /* ---------- gated seeks ---------- */
    let seekBusy = false;
    let pendingTime = null;
    function requestSeek(t) {
      if (!video.duration || isNaN(t)) return;
      if (seekBusy) {
        pendingTime = t;
        return;
      }
      seekBusy = true;
      video.currentTime = t;
    }
    on(video, "seeked", () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    });
    on(video, "error", () => {
      seekBusy = false;
      pendingTime = null;
      failVideo();
    });

    /* ---------- the lerped drive loop that rests ---------- */
    let target = 0;
    let shown = 0;
    let rafId = null;
    let lastTick = 0;
    let heroOnScreen = true;
    function tick(now) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      if (video.duration) requestSeek(filmTime(shown) * video.duration);
      updateCaptions(shown);
    }
    function onScroll() {
      target = heroProgress();
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
    }

    const observers = [];
    if ("IntersectionObserver" in window) {
      const heroIO = new IntersectionObserver(
        (es) => {
          heroOnScreen = es[0].isIntersecting;
          if (heroOnScreen && rafId === null && scrubOn) rafId = requestAnimationFrame(tick);
        },
        { rootMargin: "10px" }
      );
      heroIO.observe(hero);
      observers.push(heroIO);
    }

    /* ---------- the video, streamed as a Blob behind the ring ---------- */
    let heroInited = false;
    let ramp = null;
    let ctrl = null;
    function initHeroOnce() {
      if (heroInited) return;
      heroInited = true;
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        loadHeroBlob().catch(failVideo);
      };
      const img = new Image();
      img.onload = start;
      img.onerror = start;
      img.src = POSTER_URL;
      setTimeout(start, 4000);
      // band one opens settled: a one-time, time-based assembly that hands over
      // to scroll, on an interval so it cannot stall behind a throttled loop
      const t0 = performance.now();
      ramp = setInterval(() => {
        loadK = clamp((performance.now() - t0) / 900, 0, 1);
        updateCaptions(shown);
        if (loadK >= 1) clearInterval(ramp);
      }, 32);
    }

    function loadHeroBlob() {
      ctrl = new AbortController();
      let watchdog = setTimeout(() => ctrl.abort(), 20000);
      return fetch(VIDEO_URL, { signal: ctrl.signal }).then((res) => {
        if (!res.ok || !res.body) throw new Error("no video");
        const total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
        const reader = res.body.getReader();
        const chunks = [];
        let got = 0;
        let lastRing = 0;
        const pump = () =>
          reader.read().then((r) => {
            if (r.done) return;
            clearTimeout(watchdog);
            watchdog = setTimeout(() => ctrl.abort(), 20000);
            chunks.push(r.value);
            got += r.value.length;
            const frac = Math.min(1, got / total);
            const now = performance.now();
            if (now - lastRing > 100 || frac === 1) {
              lastRing = now;
              ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
            }
            return pump();
          });
        return pump().then(() => {
          clearTimeout(watchdog);
          ring.style.setProperty("--ld", 0);
          video.src = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
          video.load();
          video.addEventListener(
            "canplay",
            () => {
              requestSeek(filmTime(heroProgress()) * video.duration);
              stage.classList.add("vn-video-ready");
            },
            { once: true }
          );
        });
      });
    }

    // the page is complete without the footage: poster plus the dark stage
    function failVideo() {
      if (stage.classList.contains("vn-video-failed")) return;
      stage.classList.add("vn-video-failed");
      if (ring) ring.style.display = "none";
    }

    /* ---------- the five gates, live in both directions ---------- */
    let scrubOn = false;
    function enableScrub() {
      if (scrubOn) return;
      scrubOn = true;
      initHeroOnce();
      window.addEventListener("scroll", onScroll, { passive: true });
      bands.forEach((b) => {
        b.op = -1;
        b.k = -1;
      });
      unpinFinalStates();
      updateCaptions(heroProgress());
      onScroll();
    }
    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
    function applyHeroMode() {
      if (GATES.some((query) => matchMedia(query).matches)) disableScrub();
      else enableScrub();
    }
    const mqls = GATES.map((query) => matchMedia(query));
    mqls.forEach((m) => on(m, "change", applyHeroMode));

    /* ---------- the strike line: the page's spine ---------- */
    const spineLive = q("#spineLive");
    const spineNode = q("#spineNode");
    let lastSpine = -1;
    function drawSpine() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      if (Math.abs(p - lastSpine) < 0.002) return;
      lastSpine = p;
      spineLive.style.strokeDashoffset = Math.round(1000 * (1 - p));
      spineNode.style.setProperty("--nodey", Math.round(p * window.innerHeight) + "px");
    }

    /* ---------- page motion: reveals, track, nav ---------- */
    const nav = q("#nav");
    const track = q("#track");
    const trackFill = q("#trackFill");

    // anything the observer has not played yet. A fast scroll can carry an
    // element past the root margin without the observer ever sampling it, and a
    // missed reveal stays at opacity 0 for good, so the copy would simply never
    // appear. onPageScroll plays whatever has already gone by.
    const pendingReveals = new Set();

    if ("IntersectionObserver" in window) {
      const revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("vn-in");
            pendingReveals.delete(e.target);
            revealIO.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
      );
      qa(".vn-reveal").forEach((el) => {
        pendingReveals.add(el);
        const siblings = el.parentElement
          ? [...el.parentElement.children].filter((c) => c.classList && c.classList.contains("vn-reveal"))
          : [el];
        const idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = idx * 0.09 + "s";
        el.addEventListener("transitionend", function once(ev) {
          if (ev.propertyName !== "transform") return;
          el.style.transitionDelay = "0s";
          el.removeEventListener("transitionend", once);
        });
        revealIO.observe(el);
      });
      observers.push(revealIO);

      if (track) {
        const trackIO = new IntersectionObserver(
          (es) => {
            if (es[0].isIntersecting) trackFill.style.setProperty("--track", "100%");
          },
          { threshold: 0.3 }
        );
        trackIO.observe(track);
        observers.push(trackIO);
      }

      // pause the living details of a section while it is off screen
      const liveIO = new IntersectionObserver(
        (es) => es.forEach((e) => e.target.classList.toggle("vn-onscreen", e.isIntersecting)),
        { rootMargin: "20% 0px" }
      );
      qa("section").forEach((s) => liveIO.observe(s));
      observers.push(liveIO);
    }

    // the nav link for the section the reader is actually in, lit with the same
    // underline the hover state uses. Delta gated: it writes only on a change.
    const navLinks = qa(".vn-nav-links a").map((a) => ({ a, section: q(a.getAttribute("href")) })).filter((l) => l.section);
    let currentLink = null;
    function markCurrentSection() {
      const line = window.innerHeight * 0.4;
      let found = null;
      for (const l of navLinks) {
        const r = l.section.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) found = l.a;
      }
      if (found === currentLink) return;
      if (currentLink) currentLink.classList.remove("vn-current");
      if (found) found.classList.add("vn-current");
      currentLink = found;
    }


    // ---------- scroll-driven section motion ----------
    // Every element listed here gets --sp, its own progress through the viewport
    // from 0 to 1, so the section keeps moving with the scroll in both
    // directions instead of playing once and stopping. Only elements actually
    // on screen are measured, and each write is delta gated.
    const SCRUB = ".vn-start, .vn-promises li";
    const scrub = new Map();
    qa(SCRUB).forEach((el) => scrub.set(el, -2));
    const onScreen = new Set();
    if ("IntersectionObserver" in window) {
      const scrubIO = new IntersectionObserver(
        (es) => es.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target))),
        { rootMargin: "12% 0px" }
      );
      scrub.forEach((_, el) => scrubIO.observe(el));
      observers.push(scrubIO);
    } else {
      scrub.forEach((_, el) => onScreen.add(el));
    }

    let lastPP = -1;
    function updateScrub() {
      const h = window.innerHeight;
      for (const el of onScreen) {
        const r = el.getBoundingClientRect();
        const p = clamp((h - r.top) / (h + r.height), 0, 1);
        if (Math.abs(p - scrub.get(el)) > 0.006) {
          scrub.set(el, p);
          el.style.setProperty("--sp", p.toFixed(3));
        }
      }
      const max = document.documentElement.scrollHeight - h;
      const pp = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      if (Math.abs(pp - lastPP) > 0.004) {
        lastPP = pp;
        root.style.setProperty("--pp", pp.toFixed(3));
      }
    }

    // ---------- pinned scenes ----------
    // Each scene is a tall section with a stage stuck to the screen. Scrolling
    // through the section's height drives the items inside it, the same way the
    // hero's bands are driven: --k is an item's arrival, --op whether it shows.
    // "stack" scenes keep each item once it has arrived; "swap" scenes show one
    // at a time and crossfade.
    const scenes = qa(".vn-scene").map((el) => ({
      el,
      items: [...el.querySelectorAll("[data-step]")],
      mode: el.dataset.mode || "stack",
      now: el.querySelector("[data-scene-now]"),
      p: -2,
      lift: -1e4,
    }));

    // the scene needs room to be scrolled through: one screen to read it, plus
    // a screen of travel per item
    scenes.forEach((s) => {
      if (!s.items.length) return;
      s.el.style.height = `calc(100svh + ${Math.round(s.items.length * 44)}vh)`;
    });


    // A scene's film is fetched only as the reader approaches it, and never on
    // the screens that get the static hero, so a phone downloads none of it.
    const filmCleanups = [];
    if (!GATES.some((query) => matchMedia(query).matches) && "IntersectionObserver" in window) {
      const filmIO = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          filmIO.unobserve(e.target);
          const scene = scenes.find((sc) => sc.el === e.target);
          if (!scene || scene.film) return;
          const wrap = scene.el.querySelector(".vn-scene-film");
          const video = wrap && wrap.querySelector("video");
          if (!video) return;
          // VP9 is roughly a third the size of the h264 at the same quality once
          // the film is dimmed behind a scrim, so prefer it where it decodes
          const webm = scene.el.dataset.filmWebm;
          const url = webm && video.canPlayType('video/webm; codecs="vp9"') ? webm : scene.el.dataset.film;
          if (!url) return;
          const ctrl = new AbortController();
          filmCleanups.push(() => ctrl.abort());
          fetch(url, { signal: ctrl.signal })
            .then((res) => (res.ok ? res.blob() : Promise.reject(new Error("no film"))))
            .then((blob) => {
              video.src = URL.createObjectURL(blob);
              video.load();
              video.addEventListener("canplay", () => {
                scene.film = gatedSeek(video, () => wrap.classList.remove("vn-ready"));
                scene.video = video;
                wrap.classList.add("vn-ready");
                scene.p = -2;
              }, { once: true });
            })
            // the scene is complete without it: the copy and the scrim stand alone
            .catch(() => {});
        });
      }, { rootMargin: "120% 0px" });
      scenes.forEach((sc) => { if (sc.el.dataset.film) filmIO.observe(sc.el); });
      observers.push(filmIO);
    }
    // The scenes only pin where the stylesheet pins them. Everywhere else the
    // variables this writes are inline, so they would beat the stylesheet's own
    // reset and drag a section's content up over its heading. This list must
    // stay identical to the unpin media query in the stylesheet.
    const unpinned = matchMedia("(max-width:860px),(max-height:760px),(prefers-reduced-motion: reduce)");
    function clearSceneVars() {
      scenes.forEach((s) => {
        s.p = -2;
        s.lift = -1e4;
        ["--sc", "--enter", "--edge"].forEach((v) => s.el.style.removeProperty(v));
        s.items.forEach((it) => {
          it.style.removeProperty("--k");
          it.style.removeProperty("--op");
        });
      });
    }
    on(unpinned, "change", (e) => { if (e.matches) clearSceneVars(); });

    function updateScenes() {
      if (unpinned.matches) return;
      const vh = window.innerHeight;
      for (const s of scenes) {
        const range = s.el.offsetHeight - vh;
        if (range <= 0) continue;
        // ENTRY lets the scene begin arriving while it is still rising into
        // view. Without it a scene only starts once it pins to the top, so the
        // reader scrolls through most of an empty screen before anything shows.
        const ENTRY = vh * 0.55;
        const box = s.el.getBoundingClientRect();
        const raw = -box.top + ENTRY;
        const p = clamp(raw / (range + ENTRY), 0, 1);

        // Between two scenes the outgoing stage has already scrolled away while
        // the incoming one is still a screen below its own centre, so the reader
        // crossed a screen of nothing. Instead the content rides in and out: it
        // is pulled toward the middle of the screen while the section is still
        // arriving or already leaving, and dissolves at the edges, so the two
        // scenes hand over rather than leaving a hole between them.
        const arriving = clamp(1 - Math.max(0, box.top) / vh, 0, 1);
        const leaving = clamp(Math.min(box.bottom, vh) / vh, 0, 1);
        const edge = Math.min(arriving, leaving);
        const lift = ((1 - arriving) - (1 - leaving)) * vh * -0.5;
        if (Math.abs(lift - s.lift) > 1.5) {
          s.lift = lift;
          s.el.style.setProperty("--enter", lift.toFixed(1) + "px");
          s.el.style.setProperty("--edge", (edge * edge * (3 - 2 * edge)).toFixed(3));
        }

        if (Math.abs(p - s.p) < 0.004) continue;
        s.p = p;
        s.el.style.setProperty("--sc", p.toFixed(3));
        if (s.film && s.video.duration) s.film.seek(p * s.video.duration);
        const n = s.items.length;
        // items arrive between LEAD and TAIL, so the first one is already there
        // when the scene pins and the last one has a plateau before it releases
        const LEAD = 0.04, TAIL = 0.9;
        const span = (TAIL - LEAD) / n;
        const swap = s.mode === "swap";
        const ks = [], ops = [];
        for (let i = 0; i < n; i++) {
          const ramp = swap ? 0.3 : 0.6;
          const k = clamp((p - (LEAD + i * span)) / (span * ramp), 0, 1);
          // A stack scene keeps every item on screen for the whole scene: they
          // hold the composition together and only brighten as they arrive.
          // Fading them in would leave the lower half of the stage blank while
          // the reader is still at the top of the section. Only a swap scene
          // hides an item, because there only one may be on screen at a time.
          let op = 1;
          if (swap) {
            // the outgoing item starts leaving just before the next arrives, so
            // the two overlap briefly and the stage is never blank between them.
            // They share one composition, so that overlap reads as a dissolve.
            const outAt = LEAD + (i + 1) * span - span * 0.05;
            const out = i === n - 1 ? 0 : clamp((p - outAt) / (span * 0.16), 0, 1);
            op = k * (1 - out);
          }
          ks.push(k);
          ops.push(op);
        }
        // Exactly one item is the live one, always: in a swap scene whichever is
        // most present, in a stack scene the last one that has arrived. The swap
        // scene's copy is bound to that flag rather than to --op, so two blocks
        // of text never dissolve through each other at the handover; only the
        // art, which shares its geometry, actually crossfades.
        let live = 0;
        if (swap) {
          for (let i = 1; i < n; i++) if (ops[i] > ops[live]) live = i;
        } else {
          for (let i = 0; i < n; i++) if (ks[i] > 0.5) live = i;
        }
        s.items.forEach((it, i) => {
          it.style.setProperty("--k", ks[i].toFixed(3));
          it.style.setProperty("--op", ops[i].toFixed(3));
          if (swap) it.dataset.live = i === live ? "1" : "0";
        });
        if (s.now) s.now.textContent = String(live + 1).padStart(2, "0");
      }
    }
    // ---------- the still hero, driven by the same scroll ----------
    // A phone gets no film: a 6.6MB download and a seek per frame is the wrong
    // trade on a handset, and iOS cannot scrub reliably anyway. It still gets
    // the journey, drawn from the two stills the film was cut from. --hp is the
    // hero's progress; the stylesheet pushes the frame in, dissolves it to the
    // closing one and drifts the copy against it.
    let lastHp = -1;
    function updateStillHero() {
      if (scrubOn) return;
      const p = heroProgress();
      if (Math.abs(p - lastHp) < 0.003) return;
      lastHp = p;
      hero.style.setProperty("--hp", p.toFixed(3));
    }

    function onPageScroll() {
      updateStillHero();
      drawSpine();
      updateScenes();
      updateScrub();
      markCurrentSection();
      if (nav) nav.classList.toggle("vn-solid", window.scrollY > 60);
      if (pendingReveals.size) {
        for (const el of pendingReveals) {
          if (el.getBoundingClientRect().bottom < 0) {
            el.style.transitionDelay = "0s";
            el.classList.add("vn-in");
            pendingReveals.delete(el);
          }
        }
      }
    }
    on(window, "scroll", onPageScroll, { passive: true });
    on(window, "resize", () => {
      lastSpine = -1;
      drawSpine();
    }, { passive: true });

    /* ---------- the phone's menu ---------- */
    const navToggle = q("#navToggle");
    if (nav && navToggle) {
      const setMenu = (open) => {
        nav.dataset.menu = open ? "open" : "closed";
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
      };
      setMenu(false);
      on(navToggle, "click", () => setMenu(nav.dataset.menu !== "open"));
      // a link closes it, and so does anything else that moves the reader
      qa(".vn-nav-links a").forEach((a) => on(a, "click", () => setMenu(false)));
      on(document, "keydown", (e) => { if (e.key === "Escape") setMenu(false); });
      on(window, "scroll", () => { if (nav.dataset.menu === "open") setMenu(false); }, { passive: true });
    }

    /* ---------- questions ---------- */
    qa(".vn-qa").forEach((item) => {
      const btn = item.querySelector(".vn-q");
      const panel = item.querySelector(".vn-a");
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (open) {
          panel.style.height = panel.scrollHeight + "px";
          requestAnimationFrame(() => {
            panel.style.height = "0px";
          });
        } else {
          panel.style.height = panel.scrollHeight + "px";
        }
      });
      panel.addEventListener("transitionend", () => {
        if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
      });
    });

    /* ---------- the one interactive moment: hold to strike ---------- */
    const holder = q("#holder");
    const promises = q("#promises");
    let holdV = 0;
    let holding = false;
    let holdRaf = null;
    let holdLast = 0;
    let holdDone = false;
    function holdTick(now) {
      const dt = Math.min(100, now - (holdLast || now));
      holdLast = now;
      holdV += holding ? dt / 1250 : -dt / 900;
      holdV = clamp(holdV, 0, 1);
      holder.style.setProperty("--hold", holdV.toFixed(3));
      if (holdV >= 1 && !holdDone) completeHold();
      if ((holding && holdV < 1) || (!holding && holdV > 0)) holdRaf = requestAnimationFrame(holdTick);
      else {
        holdRaf = null;
        holdLast = 0;
      }
    }
    function startHold(e) {
      if (holdDone) return;
      if (e && e.cancelable) e.preventDefault();
      holding = true;
      if (holdRaf === null) holdRaf = requestAnimationFrame(holdTick);
    }
    function endHold() {
      holding = false;
      if (holdRaf === null && holdV > 0) holdRaf = requestAnimationFrame(holdTick);
    }
    function completeHold() {
      holdDone = true;
      holder.classList.add("vn-done");
      holder.querySelector(".vn-holder-label").textContent = "Struck";
      promises.classList.add("vn-lit");
    }
    if (holder) {
      on(holder, "pointerdown", startHold);
      on(holder, "pointerup", endHold);
      on(holder, "pointerleave", endHold);
      on(holder, "pointercancel", endHold);
      on(holder, "keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          startHold();
        }
      });
      on(holder, "keyup", (e) => {
        if (e.key === " " || e.key === "Enter") endHold();
      });
      on(holder, "click", (e) => e.preventDefault());
    }

    /* ---------- the form ---------- */
    const form = q("#form");
    const note = q("#formNote");
    if (form) {
      on(form, "submit", async (e) => {
        e.preventDefault();
        const name = form.querySelector("#f-name").value.trim();
        const mail = form.querySelector("#f-mail").value.trim();
        const msg = form.querySelector("#f-msg").value.trim();
        if (!name || !mail || !msg || mail.indexOf("@") < 1) {
          note.textContent = "Fill in your name, your email and what you need, then try again.";
          note.classList.add("vn-show", "vn-err");
          return;
        }
        note.classList.remove("vn-err");
        note.classList.add("vn-show");
        note.textContent = "Sending.";
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email: mail, message: msg }),
          });
          if (!res.ok) throw new Error("send failed");
          form.reset();
          note.textContent = "Got it. I answer on the next working day.";
        } catch (err) {
          // the visitor's own email app is the fallback, so a message is never lost
          const body = "Name: " + name + "\nEmail: " + mail + "\n\n" + msg;
          window.location.href =
            "mailto:balakchiev09@gmail.com?subject=" +
            encodeURIComponent("New project: " + name) +
            "&body=" +
            encodeURIComponent(body);
          note.textContent = "Your email app is open with the message ready. Hit send and I answer on the next working day.";
        }
      });
    }

    /* ---------- dust in the fixed environment ---------- */
    const dust = q("#dust");
    if (dust && !dust.childElementCount) {
      const dr = rng(77);
      for (let d = 0; d < 16; d++) {
        const i2 = document.createElement("i");
        i2.style.left = (dr() * 100).toFixed(2) + "%";
        i2.style.top = (60 + dr() * 60).toFixed(2) + "%";
        i2.style.animationDuration = (22 + dr() * 26).toFixed(1) + "s";
        i2.style.animationDelay = "-" + (dr() * 40).toFixed(1) + "s";
        i2.style.opacity = (0.14 + dr() * 0.26).toFixed(2);
        dust.appendChild(i2);
      }
    }

    /* ---------- reduced motion, honoured live, in both directions ---------- */
    function pinToFinalStates() {
      root.classList.add("vn-pinned");
      spineLive.style.strokeDashoffset = 0;
      spineNode.style.setProperty("--nodey", Math.round(window.innerHeight * 0.5) + "px");
      if (trackFill) trackFill.style.setProperty("--track", "100%");
      if (promises) promises.classList.add("vn-lit");
      if (holder && !holdDone) {
        holdV = 1;
        holder.style.setProperty("--hold", "1");
        completeHold();
      }
      qa(".vn-reveal").forEach((el) => {
        el.style.transitionDelay = "0s";
        el.classList.add("vn-in");
        pendingReveals.delete(el);
      });
      scrub.forEach((_, el) => el.style.setProperty("--sp", "1"));
      scenes.forEach((s) => {
        s.el.style.height = "auto";
        s.items.forEach((it) => {
          it.style.setProperty("--k", "1");
          it.style.setProperty("--op", "1");
        });
      });
    }
    function unpinFinalStates() {
      root.classList.remove("vn-pinned");
      lastSpine = -1;
      drawSpine();
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    on(reduce, "change", (e) => {
      if (e.matches) pinToFinalStates();
      else applyHeroMode();
    });
    if (reduce.matches) pinToFinalStates();

    /* ---------- pause every loop on a hidden tab ---------- */
    on(document, "visibilitychange", () => root.classList.toggle("vn-paused", document.hidden));

    if (unpinned.matches) clearSceneVars();
    applyHeroMode();
    updateStillHero();
    drawSpine();
    onPageScroll();

    return () => {
      cleanups.forEach((fn) => fn());
      filmCleanups.forEach((fn) => fn());
      scenes.forEach((sc) => {
        if (sc.film) sc.film.dispose();
        if (sc.video && sc.video.src.startsWith("blob:")) URL.revokeObjectURL(sc.video.src);
      });
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (holdRaf !== null) cancelAnimationFrame(holdRaf);
      if (ramp) clearInterval(ramp);
      if (ctrl) ctrl.abort();
      if (video.src.startsWith("blob:")) URL.revokeObjectURL(video.src);
    };
  }, []);

  const brand = (
    <>
      <svg className="vn-brand-mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M13 9 L32 46 L51 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="21.6" width="44" height="4.6" rx="2.3" fill="currentColor" />
        <circle cx="32" cy="55" r="3.6" fill="currentColor" />
      </svg>
      <span className="vn-brand-name">Viper Net</span>
    </>
  );

  return (
    <div className="vn-root" ref={rootRef}>
      <a className="vn-skip" href="#main">
        Skip to content
      </a>

      {/* the one fixed environment layer: the whole page sits inside one place */}
      <div className="vn-env" aria-hidden="true">
        <div className="vn-env-glow vn-env-glow-a" />
        <div className="vn-env-glow vn-env-glow-b" />
        <div className="vn-env-grain" />
        <div className="vn-env-dust" id="dust" />
      </div>

      {/* SIGNATURE ELEMENT: the strike line, the spine of the whole page */}
      <div className="vn-spine" id="spine" aria-hidden="true">
        <svg viewBox="0 0 24 1000" preserveAspectRatio="none">
          <line className="vn-spine-rail" x1="12" y1="0" x2="12" y2="1000" />
          <line className="vn-spine-live" id="spineLive" x1="12" y1="0" x2="12" y2="1000" />
        </svg>
        <div className="vn-spine-node" id="spineNode" />
      </div>

      <nav className="vn-nav" id="nav">
        <a className="vn-brand" href="#top" aria-label="Viper Net, back to top">
          {brand}
        </a>
        <div className="vn-nav-links" id="navMenu">
          <a href="#services">What we do</a>
          <a href="#work">Work</a>
          <a href="#process">How it goes</a>
          <a href="#questions">Questions</a>
        </div>
        <a className="vn-btn vn-btn-accent vn-btn-sm" href="#start">
          Start a project
        </a>
        {/* on a phone the four links live behind this, since there is no room
            for them in the bar and a site of five sections needs a way through */}
        <button className="vn-nav-toggle" id="navToggle" type="button" aria-expanded="false"
          aria-controls="navMenu" aria-label="Open the menu" />
      </nav>

      <main id="main" tabIndex={-1}>
        <span id="top" />

        {/* ================= HERO ================= */}
        <section className="vn-hero" id="hero" aria-label="Viper Net introduction">
          <div className="vn-stage" id="stage">
            <div className="vn-poster" id="poster" aria-hidden="true" />
            {/* the closing frame of the same film, for the phone's dissolve */}
            <div className="vn-hero-end" aria-hidden="true" />
            <video id="vn-hero-video" preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
            <div className="vn-scrim" aria-hidden="true" />

            <svg className="vn-ring" id="ring" viewBox="0 0 48 48" aria-hidden="true">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="126"
                style={{ strokeDashoffset: "var(--ld, 126)" }}
              />
            </svg>

            <div className="vn-bands" id="bands">
              <div className="vn-band vn-band-1" data-band="0.00,0.13" data-entrance="focus" data-ramp="0.05">
                <p className="vn-chip vn-kicker">Viper Net</p>
                <h1 className="vn-split">Websites built to strike.</h1>
              </div>
              <div className="vn-band vn-band-2" data-band="0.44,0.58" data-entrance="aperture" data-spread="0.5">
                <p className="vn-split vn-lead">No ghosting. No six month builds.</p>
              </div>
              <div className="vn-band vn-band-3" data-band="0.62,0.75" data-entrance="punch">
                <p className="vn-split vn-lead">Fast to load. Easy to find. Finished on time.</p>
              </div>
              <div className="vn-band vn-band-4 vn-settle" data-band="0.80,1.00" data-entrance="rise">
                <h2 className="vn-split">Your site. Live in weeks.</h2>
                <p className="vn-settle-sub">Design, build and launch, handled end to end by one team.</p>
                <div className="vn-settle-cta">
                  <a className="vn-btn vn-btn-accent" href="#start">
                    Start your project
                  </a>
                  <a className="vn-btn vn-btn-ghost" href="#work">
                    See the work
                  </a>
                </div>
              </div>
            </div>

            {/* the composed still hero: phones, short landscape, reduced motion */}
            <div className="vn-static-hero" id="staticHero">
              <p className="vn-chip vn-kicker">Viper Net</p>
              <h1>Websites built to strike.</h1>
              <p className="vn-lead">Design, build and launch. Live in weeks, not months.</p>
              <div className="vn-settle-cta">
                <a className="vn-btn vn-btn-accent" href="#start">
                  Start your project
                </a>
                <a className="vn-btn vn-btn-ghost" href="#work">
                  See the work
                </a>
              </div>
            </div>

            <div className="vn-cue" id="cue" aria-hidden="true">
              <span>Scroll</span>
              <i />
            </div>
          </div>
        </section>

        {/* ================= WHAT WE DO ================= */}
        <section className="vn-services vn-scene" id="services" aria-labelledby="services-h" data-scene="4" data-film="/hero/scene-services.mp4" data-film-webm="/hero/scene-services.webm">
          <div className="vn-scene-stage">
            <div className="vn-scene-film" aria-hidden="true"><video muted playsInline preload="none" tabIndex={-1} /></div>
          <header className="vn-sec-head vn-reveal">
            <p className="vn-chip">01 / What we do</p>
            <h2 id="services-h">Four things, done properly.</h2>
          </header>
          <ol className="vn-svc-list">
            <li className="vn-svc vn-reveal" data-step>
              <span className="vn-svc-n">01</span>
              <div className="vn-svc-body">
                <h3>Websites</h3>
                <p>
                  A site that looks expensive and loads like nothing. Built for the phone first, because that is where your
                  customers already are.
                </p>
              </div>
            </li>
            <li className="vn-svc vn-reveal" data-step>
              <span className="vn-svc-n">02</span>
              <div className="vn-svc-body">
                <h3>Online stores</h3>
                <p>Products, payments, delivery. A shop people finish, instead of abandoning at step three.</p>
              </div>
            </li>
            <li className="vn-svc vn-reveal" data-step>
              <span className="vn-svc-n">03</span>
              <div className="vn-svc-body">
                <h3>Getting found</h3>
                <p>Search built in from the first line, so the people looking for what you sell land on you.</p>
              </div>
            </li>
            <li className="vn-svc vn-reveal" data-step>
              <span className="vn-svc-n">04</span>
              <div className="vn-svc-body">
                <h3>Hosting and support</h3>
                <p>It stays up, it stays fast, and when something breaks you get a person, not a ticket number.</p>
              </div>
            </li>
          </ol>
          <p className="vn-scene-count" aria-hidden="true"><b data-scene-now>01</b> / 04</p>
          </div>
        </section>

        {/* ================= THE WORK ================= */}
        <section className="vn-work vn-scene vn-scene-work" id="work" aria-labelledby="work-h" data-scene="3" data-mode="swap" data-film="/hero/scene-work.mp4" data-film-webm="/hero/scene-work.webm">
          <div className="vn-scene-stage">
            <div className="vn-scene-film" aria-hidden="true"><video muted playsInline preload="none" tabIndex={-1} /></div>
          <header className="vn-sec-head vn-work-head vn-reveal">
            <p className="vn-chip">02 / The work</p>
            <h2 id="work-h">Live sites, real businesses.</h2>
          </header>
          <div className="vn-cases">

          <article className="vn-case vn-reveal" data-step>
            <div className="vn-case-art" aria-hidden="true">
              <div className="vn-case-img vn-case-img-1" />
              <span className="vn-case-tag">E-commerce</span>
            </div>
            <div className="vn-case-copy">
              <h3>AVERA Wood Materials</h3>
              <p>
                Wood materials sold online. Product pages a builder can actually compare, and a catalogue that stays clean as
                it grows.
              </p>
              <a className="vn-link" href="https://www.averaeood.bg/" target="_blank" rel="noopener noreferrer">
                averaeood.bg
                <i aria-hidden="true" />
              </a>
            </div>
          </article>

          <article className="vn-case vn-case-flip vn-reveal" data-step>
            <div className="vn-case-art" aria-hidden="true">
              <div className="vn-case-img vn-case-img-2" />
              <span className="vn-case-tag">Fuel station</span>
            </div>
            <div className="vn-case-copy">
              <h3>BG OIL Vratsa</h3>
              <p>
                A fuel station with a shop, a hotel and a service bay, open around the clock. Prices and opening hours land
                first, on the phone in the driver&apos;s hand.
              </p>
              <a className="vn-link" href="https://bgoil.bg/" target="_blank" rel="noopener noreferrer">
                bgoil.bg
                <i aria-hidden="true" />
              </a>
            </div>
          </article>

          <article className="vn-case vn-reveal" data-step>
            <div className="vn-case-art" aria-hidden="true">
              <div className="vn-case-img vn-case-img-3" />
              <span className="vn-case-tag">Smart contract audits</span>
            </div>
            <div className="vn-case-copy">
              <h3>SB Security</h3>
              <p>
                Smart contract audits for Web3 protocols. The process, the numbers and the published reports sit where a
                serious client looks first.
              </p>
              <a className="vn-link" href="https://www.sbsecurity.net/" target="_blank" rel="noopener noreferrer">
                sbsecurity.net
                <i aria-hidden="true" />
              </a>
            </div>
          </article>
          </div>
          <p className="vn-scene-count" aria-hidden="true"><b data-scene-now>01</b> / 03</p>
          </div>
        </section>

        {/* ================= HOW IT GOES ================= */}
        <section className="vn-process vn-scene" id="process" aria-labelledby="process-h" data-scene="4" data-film="/hero/scene-process.mp4" data-film-webm="/hero/scene-process.webm">
          <div className="vn-scene-stage">
            <div className="vn-scene-film" aria-hidden="true"><video muted playsInline preload="none" tabIndex={-1} /></div>
          <header className="vn-sec-head vn-reveal">
            <p className="vn-chip">03 / How it goes</p>
            <h2 id="process-h">Plan. Build. Launch.</h2>
          </header>
          <div className="vn-track" id="track">
            <div className="vn-track-rail" aria-hidden="true">
              <span className="vn-track-fill" id="trackFill" />
            </div>
            <ol className="vn-steps">
              <li className="vn-step vn-reveal" data-step>
                <span className="vn-dot" aria-hidden="true" />
                <p className="vn-step-n">Step one</p>
                <h3>Call</h3>
                <p>Twenty minutes. What you sell, who buys it, what the site has to do.</p>
              </li>
              <li className="vn-step vn-reveal" data-step>
                <span className="vn-dot" aria-hidden="true" />
                <p className="vn-step-n">Step two</p>
                <h3>Plan</h3>
                <p>You see the structure and the price before anyone writes a line of code.</p>
              </li>
              <li className="vn-step vn-reveal" data-step>
                <span className="vn-dot" aria-hidden="true" />
                <p className="vn-step-n">Step three</p>
                <h3>Build</h3>
                <p>Design and build, with something real to look at every week.</p>
              </li>
              <li className="vn-step vn-reveal" data-step>
                <span className="vn-dot" aria-hidden="true" />
                <p className="vn-step-n">Step four</p>
                <h3>Launch</h3>
                <p>Live, fast, and yours. Every login handed over on day one.</p>
              </li>
            </ol>
          </div>
          <p className="vn-scene-count" aria-hidden="true"><b data-scene-now>01</b> / 04</p>
          </div>
        </section>

        {/* ================= THE HOLD ================= */}
        <section className="vn-strike" id="strike" aria-labelledby="strike-h">
          <div className="vn-strike-inner">
            <p className="vn-chip">04 / The promise</p>
            <h2 id="strike-h">Hold to strike.</h2>
            <p className="vn-strike-lede">Press and hold. A viper waits, then moves once.</p>

            <button className="vn-holder" id="holder" aria-describedby="strike-h">
              <span className="vn-holder-fill" aria-hidden="true" />
              <span className="vn-holder-label">Hold</span>
            </button>

            <ul className="vn-promises" id="promises">
              <li>
                <span aria-hidden="true" />
                You own it all. Code, domain, logins, from day one.
              </li>
              <li>
                <span aria-hidden="true" />
                One person answers you. Every working day.
              </li>
              <li>
                <span aria-hidden="true" />
                It launches. That is the whole job.
              </li>
            </ul>
          </div>
        </section>

        {/* ================= QUESTIONS ================= */}
        <section className="vn-faq" id="questions" aria-labelledby="faq-h">
          <header className="vn-sec-head vn-reveal">
            <p className="vn-chip">05 / Questions</p>
            <h2 id="faq-h">The things people ask first.</h2>
          </header>
          <div className="vn-faq-list" id="faqList">
            {[
              [
                "How long does it take?",
                "Weeks, not months. You get the timeline in writing before we start, and something to look at every week.",
              ],
              [
                "What does it cost?",
                "It depends on the number of pages and whether you sell online. You get a fixed price after a twenty minute call, before any work starts.",
              ],
              [
                "What if you go quiet on me?",
                "You get one person to talk to and an answer every working day. If a week ever passes without progress, you hear why from me first.",
              ],
              ["Who owns the site?", "You do. The domain, the code and every login are in your name from day one."],
              [
                "Something breaks at 9pm. Then what?",
                "You message me and I fix it. Hosting and support are part of the deal, not a separate adventure.",
              ],
              [
                "Will it actually bring me customers?",
                "No site can promise sales. This one loads fast, says the right thing in the first five seconds, and makes calling you easy. That is the part a site controls.",
              ],
            ].map(([question, answer]) => (
              <div className="vn-qa vn-reveal" key={question}>
                <button className="vn-q" aria-expanded="false">
                  {question}
                  <i aria-hidden="true" />
                </button>
                <div className="vn-a">
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= START ================= */}
        <section className="vn-start" id="start" aria-labelledby="start-h">
          <div className="vn-start-art" aria-hidden="true" />
          <div className="vn-start-inner">
            <div className="vn-start-copy vn-reveal">
              <p className="vn-chip">06 / Start</p>
              <h2 id="start-h">Tell me what you need.</h2>
              <p className="vn-lead">Twenty minutes on a call, a fixed price after it. That is the whole start.</p>
              <p className="vn-start-mail">
                Or write straight to{" "}
                <a className="vn-link" href="mailto:balakchiev09@gmail.com">
                  balakchiev09@gmail.com
                </a>
              </p>
            </div>
            <form className="vn-form vn-reveal" id="form" noValidate>
              <div className="vn-field">
                <label htmlFor="f-name">Name</label>
                <input id="f-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="vn-field">
                <label htmlFor="f-mail">Email</label>
                <input id="f-mail" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="vn-field">
                <label htmlFor="f-msg">What do you need?</label>
                <textarea id="f-msg" name="message" rows={4} placeholder="A new site, a shop, or a rescue job." required />
              </div>
              <button className="vn-btn vn-btn-accent vn-btn-wide" type="submit">
                Send it
              </button>
              <p className="vn-form-note" id="formNote" role="status" />
            </form>
          </div>
        </section>
      </main>

      <footer className="vn-foot">
        <div className="vn-foot-top">
          <a className="vn-brand" href="#top" aria-label="Viper Net, back to top">
            {brand}
          </a>
          <ul className="vn-foot-links">
            <li>
              <a href="https://x.com/e_balakchiev" target="_blank" rel="noopener noreferrer">
                X
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/ediz-balakchiev-87026b363/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/viperajs" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:balakchiev09@gmail.com">Email</a>
            </li>
          </ul>
        </div>
        <div className="vn-foot-bottom">
          <p>The artwork on this page is AI generated.</p>
          <p>&copy; {new Date().getFullYear()} Viper Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
