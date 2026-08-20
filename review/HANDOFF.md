# Handoff: the Viper Net cinematic site (10K Websites skill)

## Where the build stands

- Deploy folder: `viper-net-site/` (`index.html` + `assets/`). Plain HTML, CSS, vanilla JS, no build step.
- The full design package, with every line of approved copy, is in `review/design-package.md`. Copy ships verbatim.
- The page is finished and browser-tested EXCEPT the hero footage. Missing files, both referenced by
  `assets/app.js`: `assets/hero-scrub.mp4` and `assets/hero-poster.jpg`. The page is deliberately complete
  without them (static hero + dark stage), which is the skill's complete-without-video requirement.

## Decisions already approved by the owner (Ediz Balakchiev, Viper Net)

- Subject: Viper Net itself. Feeling: dark, cinematic, high end.
- Hero concept, "The Strike Line": the camera falls through a violet-black void along one thread of
  venom-green light; the thread branches into a circuit lattice that assembles and settles into a lit
  frame in the middle of the dark, with calm space on both sides for the captions. Tier 1, one 6s shot.
- Footer discloses that the artwork is AI generated (line already in `index.html`).
- Form: mailto to balakchiev09@gmail.com. Client work shown with links: AVERA, BG OIL Vratsa, SB Security.

## What is blocked and why

This container's network policy (Trusted level) refuses `d8j0ntlcm91z4.cloudfront.net`, the host Higgsfield
serves finished generations from, and also refuses the three client sites. The start frame was generated
successfully (2 credits, job `221f1f3f-ef56-454d-97bb-5c8f70689086`) and can be downloaded once the
environment's Network access is set to Full, or to Custom including `*.cloudfront.net`.

## The remaining steps, in order

1. Download the start frame, inspect it (trademarks, composition, the calm side regions), show the owner.
2. Preflight the SAME 6s image-to-video shot across the top two or three video models, present real prices
   plus about 6 credits for three supporting stills, let the owner choose. Balance was 61.78 credits.
3. Generate at 1080p, 6s, no audio. Inspect start/mid/end frames. Run the VIDEO GATE with the owner before
   building anything around the footage.
4. Process per the skill's ffmpeg recipes: scrub encode `-crf 18 -preset slow -g 8 -keyint_min 8
   -pix_fmt yuv420p -movflags +faststart -an`, then poster (first frame) and ending frame (`-sseof -0.1`).
   Raws stay in `review/`, never in `viper-net-site/`.
5. Drop `hero-scrub.mp4`, `hero-poster.jpg` into `assets/`, set `VIDEO_BYTES` in `app.js` to the real size,
   sample the real palette from the footage into the CSS tokens, wire the ending frame into `.start-art`,
   and the three stills into `.case-img-1/2/3`.
6. Re-run the audits: `node review/audit.js`, `node review/flick.js`, `node review/interact.js` (they drive
   the machine's own Chromium over the DevTools protocol; start `python3 -m http.server 8081` inside
   `viper-net-site/` first). Then the worst-frame legibility audit against the real footage.
7. Copy gate before showing anyone: zero em dashes, zero stock words (leverage, seamless, empower, unlock,
   robust, actionable, data-driven, solutions), plus the AI-tell sweep.

## Verified already (real browser, not assumed)

Flick test at 120/240/360px, hold interaction press and release, FAQ open and close, form validation,
reduced motion flipped live in both directions, phone static-hero gate (no video or poster requested),
zero horizontal overflow, zero console errors apart from the two expected 404s for the missing footage.
