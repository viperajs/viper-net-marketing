"use client";

import { useEffect, useRef } from "react";
import "./cinematic-hero.css";

const VIDEO_URL = "/hero/hero-scrub.mp4";
const POSTER_URL = "/hero/hero-poster.jpg";
// the real byte size, used as the loading ring's fallback when a host or a
// proxy strips Content-Length
const VIDEO_BYTES = 5617821;

// the five static-hero gates. These must stay identical to the media query
// list at the bottom of cinematic-hero.css.
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

// Split one caption into words and characters so the entrances can move them
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
    if (mode === "drift" || mode === "rise") {
      w.style.setProperty("--th", (wi / Math.max(1, words.length)) * 0.5);
    } else if (mode === "punch") {
      w.style.setProperty("--th", (wi / Math.max(1, words.length)) * 0.46);
      if (/finished/i.test(word)) w.classList.add("vn-em");
    }
    for (let i = 0; i < word.length; i++) {
      const c = document.createElement("span");
      c.className = "vn-c";
      c.textContent = word[i];
      if (mode === "grid") {
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

export default function CinematicHero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const posterRef = useRef(null);
  const ringRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    const ring = ringRef.current;
    const cue = cueRef.current;
    if (!hero || !stage || !video) return;

    const rand = rng(20260820);
    const bands = [...hero.querySelectorAll(".vn-band")].map((el) => {
      const [a, b] = (el.dataset.band || "0,1").split(",").map(Number);
      const mode = el.dataset.entrance || "drift";
      el.querySelectorAll(".vn-split").forEach((s) => split(s, mode, parseFloat(el.dataset.spread) || 0.5, rand));
      return {
        el,
        a,
        b,
        ramp: parseFloat(el.dataset.ramp) || 0,
        settle: el.classList.contains("vn-settle"),
        op: -1,
        k: -1,
      };
    });

    let loadK = 0;
    let cueV = -1;

    // the caption drive, delta gated so converged bands cost nothing
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

    // gated seeks: one seek in flight at a time, the newest target wins
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
    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    };
    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
      failVideo();
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onVideoError);

    // the dt-normalized lerp that rests: no rAF once it has converged
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
      if (video.duration) requestSeek(shown * video.duration);
      updateCaptions(shown);
    }
    function onScroll() {
      target = heroProgress();
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
    }

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (es) => {
          heroOnScreen = es[0].isIntersecting;
          if (heroOnScreen && rafId === null && scrubOn) rafId = requestAnimationFrame(tick);
        },
        { rootMargin: "10px" }
      );
      io.observe(hero);
    }

    // the video, streamed as a Blob behind the loading ring: many hosts lack
    // HTTP Range support, and without it every seek clamps to zero
    let heroInited = false;
    let ramp = null;
    let ctrl = null;
    function initHeroOnce() {
      if (heroInited) return;
      heroInited = true;
      if (poster) poster.style.backgroundImage = `url('${POSTER_URL}')`;
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
      // band one opens settled: a one-time, time-based assembly that hands
      // over to scroll. An interval, so it cannot stall behind a throttled
      // frame loop.
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
              if (ring) ring.style.setProperty("--ld", Math.round(126 * (1 - frac)));
            }
            return pump();
          });
        return pump().then(() => {
          clearTimeout(watchdog);
          if (ring) ring.style.setProperty("--ld", 0);
          video.src = URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
          video.load();
          video.addEventListener(
            "canplay",
            () => {
              requestSeek(heroProgress() * video.duration);
              stage.classList.add("vn-video-ready");
            },
            { once: true }
          );
        });
      });
    }

    // the page is deliberately complete without the footage: poster plus the
    // dark stage, captions unchanged
    function failVideo() {
      if (stage.classList.contains("vn-video-failed")) return;
      stage.classList.add("vn-video-failed");
      if (ring) ring.style.display = "none";
    }

    // the gate is decided live, not once at load: a rotation, a resize past
    // 720px or a preference flip all re-evaluate it
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
      if (GATES.some((q) => matchMedia(q).matches)) disableScrub();
      else enableScrub();
    }

    const mqls = GATES.map((q) => matchMedia(q));
    mqls.forEach((m) => m.addEventListener("change", applyHeroMode));
    applyHeroMode();

    return () => {
      mqls.forEach((m) => m.removeEventListener("change", applyHeroMode));
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onVideoError);
      if (io) io.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (ramp) clearInterval(ramp);
      if (ctrl) ctrl.abort();
      if (video.src.startsWith("blob:")) URL.revokeObjectURL(video.src);
    };
  }, []);

  return (
    <section className="vn-hero" id="hero" ref={heroRef} aria-label="Viper Net introduction">
      <div className="vn-stage" ref={stageRef}>
        <div className="vn-poster" ref={posterRef} aria-hidden="true" />
        {/* decorative: kept out of the tab order so keyboard and screen reader
            users land on the captions instead */}
        <video className="vn-video" ref={videoRef} preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
        <div className="vn-scrim" aria-hidden="true" />

        <svg className="vn-ring" ref={ringRef} viewBox="0 0 48 48" aria-hidden="true">
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

        <div className="vn-bands">
          <div className="vn-band vn-band-1" data-band="0.00,0.20" data-entrance="drift" data-ramp="0.05">
            <p className="vn-chip vn-kicker">Viper Net</p>
            <h1 className="vn-split">Websites built to strike.</h1>
          </div>
          <div className="vn-band vn-band-2" data-band="0.25,0.46" data-entrance="grid" data-spread="0.5">
            <p className="vn-split vn-lead">No ghosting. No six month builds.</p>
          </div>
          <div className="vn-band vn-band-3" data-band="0.51,0.72" data-entrance="punch">
            <p className="vn-split vn-lead">Fast to load. Easy to find. Finished on time.</p>
          </div>
          <div className="vn-band vn-band-4 vn-settle" data-band="0.77,1.00" data-entrance="rise">
            <h2 className="vn-split">Your site. Live in weeks.</h2>
            <p className="vn-settle-sub">Design, build and launch, handled end to end by one team.</p>
            <div className="vn-settle-cta">
              <a className="vn-btn vn-btn-accent" href="#contact">
                Start your project
              </a>
              <a className="vn-btn vn-btn-ghost" href="#websites">
                See the work
              </a>
            </div>
          </div>
        </div>

        {/* the composed still hero: phones, short landscape, reduced motion */}
        <div className="vn-static-hero">
          <p className="vn-chip vn-kicker">Viper Net</p>
          <h1>Websites built to strike.</h1>
          <p className="vn-lead">Design, build and launch. Live in weeks, not months.</p>
          <div className="vn-settle-cta">
            <a className="vn-btn vn-btn-accent" href="#contact">
              Start your project
            </a>
            <a className="vn-btn vn-btn-ghost" href="#websites">
              See the work
            </a>
          </div>
        </div>

        <div className="vn-cue" ref={cueRef} aria-hidden="true">
          Scroll
          <i />
        </div>
      </div>
    </section>
  );
}
