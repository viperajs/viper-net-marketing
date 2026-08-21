# Handoff prompt: finish wiring the cinematic hero into the Next.js site

Paste everything below into a fresh session on `viperajs/viper-net-marketing`, branch
`claude/try-now-4vgcpv`.

---

You are picking up a half-finished job on `viperajs/viper-net-marketing`, branch
`claude/try-now-4vgcpv`. The repo has TWO sites in it, and that matters:

- **The real site**: a Next.js 14 App Router app at the repo root (`app/`, `components/`).
  This is what ships.
- **A standalone static build** in `viper-net-site/` (plain `index.html` + `assets/`, no build
  step), produced earlier by the `10k-websites` skill. It is now the **reference copy** for the
  hero's CSS and JS, not a deploy target. Do not delete it, do not deploy it.

The design decisions, approved by the owner (Ediz Balakchiev), are in `review/design-package.md`.
Every viewer-facing line there ships **verbatim**. The earlier handoff is `review/HANDOFF.md`
(now mostly done, read it for context).

## What is already finished, in the working tree, UNCOMMITTED

Run `git status` first: all of the following is uncommitted work sitting on the branch.

**The hero footage exists and is approved.** The owner passed the video gate on it.

- Start frame: `review/raw/hero-start.png` (Higgsfield job `221f1f3f-ef56-454d-97bb-5c8f70689086`).
- Raw video: `review/raw/hero-kling.mp4`, Kling v3.0 pro, 6.04s, 1928x1076, 24fps, silent,
  job `8e1b5269-71f7-422a-a8c3-c4dab033b578`, 10.5 credits.
  The shot: the camera falls along a venom-green thread through violet-black void, the thread
  branches, a lattice assembles and settles into a lit frame dead centre. Motion curve confirms
  it rests (peaks 1.44 at the assembly, settles to 0.86, below its own 1.01 opening), so no tail
  trim is needed.
- Encoded scrub: `viper-net-site/assets/hero-scrub.mp4`, **5,617,821 bytes**, `-crf 18 -preset slow
  -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an`, PSNR 52.2 dB (visually lossless).
  Plus `hero-poster.jpg` (first frame) and `hero-ending.jpg` (`-sseof -0.1`).
- `VIDEO_BYTES` in `viper-net-site/assets/app.js` is set to the real 5617821.
- Palette tokens in `viper-net-site/assets/styles.css` re-sampled from the real footage
  (darkest field #07070F, mid haze #151723): `--canvas:#090711`, `--canvas-2:#0E0C1A`,
  `--panel:#151225`, `--panel-2:#1A162E`. `--accent:#3BE573` stays, it is the Viper Net mark's own green.
- `.start-art` now uses `hero-ending.jpg`.

**A legibility failure was found and fixed.** With real footage behind the captions (the earlier
build was verified against a dark stage, which could not show this), band 1 and band 3 ran their
words straight across the lit thread: worst contrast **1.05:1** on band 3, 2.68:1 on band 1. The fix
was to narrow the caption columns into the calm side regions the footage actually leaves free
(measured: on a 1440px stage, band 1 is calm left of x=529, band 2 right of x=919, band 3 left of
x=416). Current values, in both the static CSS and the ported CSS:

- `h1`: `font-size:clamp(2.6rem,5.4vw,4.2rem); max-width:9ch`
- `h2`: `font-size:clamp(2.3rem,5.2vw,4rem); max-width:13ch`
- `.lead`: `max-width:11ch`

Worst-frame contrast after the fix, text shadow deliberately ignored so the number is a floor:
**band 1 = 11.45:1, band 2 = 7.53:1, band 3 = 7.09:1, band 4 = 4.67:1**. All clear WCAG AA.
**If you change any caption's font size, width, or position, re-run the audit.**

**New audit tooling** (keep it working):

- `review/legibility.sh` runs the whole thing. It needs `python3 -m http.server 8081` running
  inside `viper-net-site/`, plus Pillow (`pip install pillow`) and footage frames extracted to a
  scratch dir with `ffmpeg -i viper-net-site/assets/hero-scrub.mp4 -vf "fps=12,scale=964:-2" <dir>/%03d.png`.
- `review/legibility.js` measures the real glyph rects in a browser (per-character, not the
  element block). `review/legibility.py` maps them onto the real footage through the video's
  `object-fit: cover` mapping, composites the global scrim and each band's local scrim exactly as
  the CSS does, and reports the WORST frame per band.
- The older audits still pass: `review/audit.js`, `review/flick.js`, `review/interact.js`
  (same local server on 8081). Console errors are now empty; the two 404s for the missing footage
  are gone.

**The port into the Next.js app is written and builds, but is NOT verified in a real browser.**

- `components/CinematicHero.jsx` — a client component. Ports the whole scrub system: blob fetch
  with the loading ring, dt-normalized lerp that rests, gated seeks, delta-gated DOM writes, the
  four caption bands with their entrances (drift / grid / punch / rise), the five static-hero
  gates evaluated live via `matchMedia` change listeners, complete-without-video fallback, and a
  full cleanup on unmount.
- `components/cinematic-hero.css` — every class and token prefixed `vn-` and scoped under
  `.vn-hero`, because `app/globals.css` already defines a clashing `--accent` and the site uses
  Tailwind. Imported by the component, matching the repo's existing `ProfileCard.css` pattern.
- Assets: `public/hero/hero-scrub.mp4`, `public/hero/hero-poster.jpg`,
  `public/fonts/syne.woff2`, `public/fonts/jetbrains-mono.woff2` (self-hosted, no third-party request).
- `app/page.jsx` now renders `<CinematicHero />` where `<TuringLanding />` used to be. Everything
  else on the homepage (Header, Services, Advantages, OurProcess, Websites, Reviews, Contact,
  Footer) is untouched, as the owner asked.
- `npm run build` passes. It needs dummy env vars or `/api/contact` throws at module scope:
  `RESEND_API_KEY=re_dummy NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SUPABASE_SERVICE_ROLE_KEY=dummy NOTIFICATION_EMAIL=a@b.c npm run build`

## What is left to do

1. **Verify the hero in the real app, in a real browser.** Start it
   (`npm run start` with those env vars, or `npm run dev`) and check: the poster shows instantly,
   the ring fills while the blob streams, the video takes over, scrubbing is smooth at the top,
   middle and bottom of the hero and under fast flicks, all four captions reach full opacity and
   hold a plateau, the CTA buttons work (`#contact`, `#websites`), and there are zero console
   errors and zero horizontal overflow. Then flip reduced motion on and off mid-session and
   rotate/resize past 720px, and confirm the static hero swaps in and out both ways.
   **Caveat you will hit:** the Chromium at `/opt/pw-browsers/chromium` is built without H.264,
   so headless playback reports `vn-video-failed` and falls back to the poster. That is the test
   browser, not the page. Verify playback on a real Chrome/Safari, or at minimum confirm the
   failure mode is only the missing codec.
2. **Check how the hero sits against the existing `LightPillar` background.** `app/page.jsx`
   still renders a fixed full-viewport `LightPillar` at `z-0` behind everything, and the hero is
   a 560vh section with a sticky stage over it. Confirm there is no bleed at the seams and no
   wasted GPU work behind an opaque hero; if it fights, gate the pillar so it starts below the hero.
3. **Wire the three case stills.** They are generated and paid for but not downloaded and not
   wired. Fetch them with `job_display` or straight from CloudFront, inspect them (trademarks,
   composition, palette), then put them into `.case-img-1/2/3` in the static build. Decide with
   the owner whether the Next.js `Websites` component should use them too.
   - `7868f031-015e-455b-b794-cecce405a22b` — timber edges, for AVERA (E-commerce)
   - `90f318d0-229c-46e4-aeac-57f8f41bbaef` — fuel canopy at night, for BG OIL (Fuel station)
   - `2eacbb1d-302a-4237-acfb-0beb83957934` — green lattice shield, for SB Security (Smart contract audits)
   Note these came back from `nano_banana_flash`, not the `nano_banana_2` that was priced at 2
   credits each. Check the balance and confirm what they actually cost.
4. **Copy gate before anyone sees it**: zero em dashes, zero stock words (leverage, seamless,
   empower, unlock, robust, actionable, data-driven, solutions), plus the AI-tell sweep. The
   deliberate triplets ("Fast to load. Easy to find. Finished on time.", "Plan. Build. Launch.")
   are designed brand devices and stay.
5. **Commit and push to `claude/try-now-4vgcpv`.** Do not open a PR unless the owner asks.
   Keep raws out of the deploy path: `.gitignore` already excludes `/review/shots/`,
   `/review/*.mp4` and `/review/*.png`, so `review/raw/` stays local. `public/hero/hero-scrub.mp4`
   (5.4 MB) is meant to be committed, it has to ship.

## Environment traps, so you do not lose an hour to them

- **ffmpeg is not preinstalled.** `apt-get update -qq && apt-get install -y -qq ffmpeg`. Pillow
  is not either: `pip install pillow`.
- **Headless Chromium cannot reach the public internet through the agent proxy.** Every external
  navigation dies with `ERR_CONNECTION_RESET` even though `curl` to the same host returns 200, and
  the proxy logs no CONNECT failure. Disabling post-quantum TLS, ECH and HTTP/2 in Chromium does
  not help. Consequence: `review/capture-clients.js` cannot capture the three client sites from
  this container. It runs, but writes three byte-identical screenshots of Chrome's
  "This site can't be reached" page. Do not ship those. `curl` and the MCP tools work fine.
- **CloudFront (`d8j0ntlcm91z4.cloudfront.net`, where Higgsfield serves finished generations)
  is reachable now** via curl. It was the blocker in the previous session; the network policy has
  since been widened.
- `npm run lint` is broken independently of this work: `eslint.config.mjs` imports
  `@eslint/eslintrc`, which is not in `package.json`. Either add it as a devDependency or say
  plainly that lint could not run. Do not silently skip it.

## Rules that hold for this job

- Copy from `review/design-package.md` ships verbatim. Do not rewrite approved lines.
- The footage is approved. Do not regenerate it without asking.
- Anything that spends the owner's credits gets priced with `get_cost: true` first and put to
  the owner before you spend.
- Keep the static build in `viper-net-site/` and the ported component in sync, or say explicitly
  which one is now authoritative.
