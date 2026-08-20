# Design Package — Viper Net (Tier 1, single journey)

## 1. Brand premise

One word from the subject's own world: **strike**. A viper does not circle its target. It waits,
reads the room, then moves once, clean, and it is done. Viper Net sells the same shape of work:
one clear plan, one clean build, live. Every section teaches that one idea — the plan before the
code, the weekly progress, the launch, the ownership — and the page's signature element is the
strike line itself, running the whole height of the site.

## 2. Palette (direction; token values finalized from the approved footage)

```css
:root{
  --canvas:#0B0714;        /* violet-black, tinted toward the footage grade, never pure black */
  --canvas-2:#0E0A1B;
  --panel:#150E27;
  --accent:#3BE573;        /* venom green, sampled from the Viper Net mark */
  --accent-hover:#63F293;
  --accent-muted:rgba(59,229,115,.18);
  --text-secondary:#ABA0C6;
  --text-primary:#EFEBF7;
}
```

Green on near-black is a banned default look. It is earned here: the green is the client's own
logo colour, the tones come from the real footage, and the layout is not the stock dark template.
Deviation declared out loud to the user.

## 3. Type trio

- Display: **Syne** 700 / 800 (angular, art-directed, nothing like Inter)
- Body: **Manrope** 400 / 600
- Mono (small labels, HUD, kickers): **JetBrains Mono** 400 / 500

## 4. Band map (hero 560vh, scroll range 460vh)

| Band | Range (starting point) | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.20 | the fall begins along the single thread | kicker "Viper Net" / "Websites built to strike." | drift-down (echoes the fall) |
| 2 | 0.25 to 0.46 | sparks race down, the thread starts to branch | "No ghosting. No six month builds." | grid snap-align |
| 3 | 0.51 to 0.72 | the branches open into a lattice | "Fast to load. Easy to find. Finished on time." | word-punch with overshoot |
| 4 | 0.77 to 1.00 | the lattice assembles and settles into a lit frame | "Your site. Live in weeks." + "Design, build and launch, handled end to end by one team." + CTA row | word-by-word rise into a staged settle |

## 5. Static-hero copy block (phones, reduced motion)

- Headline: "Websites built to strike."
- Subline: "Design, build and launch. Live in weeks, not months."
- CTA: "Start your project" / secondary "See the work"

## 6. Below-fold outline (every line ships verbatim)

**Nav:** mark + Work, What we do, Process, Questions + button "Start a project". Skip link to #main.

**A. What we do** (numbered list on the strike line, no card grid)
1. Websites — "A site that looks expensive and loads like nothing. Built for the phone first, because that is where your customers already are."
2. Online stores — "Products, payments, delivery. A shop people finish, instead of abandoning at step three."
3. Getting found — "Search built in from the first line, so the people looking for what you sell land on you."
4. Hosting and support — "It stays up, it stays fast, and when something breaks you get a person, not a ticket number."

**B. The work** (alternating wide rows, real clients, real links, no invented quotes)
- AVERA Wood Materials, averaeood.bg — "Wood materials sold online. Product pages a builder can actually compare, and a catalogue that stays clean as it grows."
- BG OIL Vratsa, bgoil.bg — "A fuel station with a shop, a hotel and a service bay, open around the clock. Prices and opening hours land first, on the phone in the driver's hand."
- SB Security, sbsecurity.net — "Smart contract audits for Web3 protocols. The process, the numbers and the published reports sit where a serious client looks first."

**C. How it goes** (four nodes on the line, horizontal)
1. Call — "Twenty minutes. What you sell, who buys it, what the site has to do."
2. Plan — "You see the structure and the price before anyone writes a line of code."
3. Build — "Design and build, with something real to look at every week."
4. Launch — "Live, fast, and yours. Every login handed over on day one."

**D. The interactive moment: Hold to strike** (own section, centered stage)
Press and hold; a charge runs down the line; releasing early eases it back; completing it lights
three promises in sequence. Reduced motion gets the finished state with no hold.
- "You own it all. Code, domain, logins, from day one."
- "One person answers you. Every working day."
- "It launches. That is the whole job."

**E. Questions** (two-column accordion, the objections real buyers name)
- "How long does it take?" — "Weeks, not months. You get the timeline in writing before we start, and something to look at every week."
- "What does it cost?" — "It depends on the number of pages and whether you sell online. You get a fixed price after a twenty minute call, before any work starts."
- "What if you go quiet on me?" — "You get one person to talk to and an answer every working day. If a week ever passes without progress, you hear why from me first."
- "Who owns the site?" — "You do. The domain, the code and every login are in your name from day one."
- "Something breaks at 9pm. Then what?" — "You message me and I fix it. Hosting and support are part of the deal, not a separate adventure."
- "Will it actually bring me customers?" — "No site can promise sales. This one loads fast, says the right thing in the first five seconds, and makes calling you easy. That is the part a site controls."

**F. The call to action + form** (full bleed, over the ending frame)
- Headline: "Tell me what you need."
- Sub: "Twenty minutes on a call, a fixed price after it. That is the whole start."
- Labels: Name / Email / "What do you need?" placeholder "A new site, a shop, or a rescue job."
- Button: "Send it"
- Handling: **mailto** to balakchiev09@gmail.com, chosen by the owner. Success state: "Your email app is open with the message ready. Hit send and I answer on the next working day."

**Footer:** the mark, the three social links (X, LinkedIn, GitHub), "The artwork on this page is AI generated.", copyright line.

## 7. The vector layer plan

- **Signature element: the strike line.** One SVG spine down the whole page, drawing itself on
  scroll, with a lit node that rides the scroll position and a short tick branching into every
  section marker. Remove it and the page loses its spine, literally.
- Whisper-level particles drifting in the fixed background environment layer (60s+ cycle).
- Section markers: small diamond nodes that light as the line reaches them.
- Inline SVG favicon: the simplified viper diamond.
- All of it honours reduced motion: final drawn states shown, drives stopped.

## 8. The engineering list

Blob fetch with a loading ring, dt-normalized lerp, gated seeks, delta-gated DOM writes, band
pacing validated by the flick test, the four-layer legibility system, the five static-hero gates
kept live with change listeners, complete-without-video, `overflow-x: clip` on html and body,
reduced motion honoured live in both directions, one living element per section, entrances that
retire their stagger delays, and the whole-site-animated standard.

## 9. The copy gate

Every viewer-facing line above ships verbatim. The built page must pass the grep gate (zero em
dashes, zero stock words) plus the AI-tell sweep before anyone sees it. The deliberate triplets
("Fast to load. Easy to find. Finished on time.", "Plan. Build. Launch.") are designed brand
devices and stay.
