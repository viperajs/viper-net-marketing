# Design Package — Viper Net, second edition: Through the Glass

Supersedes `design-package.md` (the strike line edition) for the redesign. The copy is carried
over unchanged: it was approved, and the customer research done for this edition confirms it
answers the exact objections buyers raise. What changes is the world it lives in.

## 1. Research, and why the copy stays

Real buyer language, from reviews and forum threads about hiring web people:

- **Ghosting** is the number one complaint. "Went ghost", "no answer to calls, live chat or email",
  "flaky, unresponsive".
- **Time.** Projects that "dragged out for months", five minute fixes taking weeks.
- **Ownership.** Buyers are told to check the domain sits in an account they control, or someone
  else can hold it hostage.
- **Vague pricing** and 100% upfront are named red flags. Buyers want a fixed price before work.

The approved lines answer each one directly: "No ghosting. No six month builds.", "What if you go
quiet on me?", "Who owns the site?", "You get a fixed price after a twenty minute call, before any
work starts." Rewriting them would lose the research, so every viewer-facing line ships verbatim.

## 2. Brand premise

One word from the subject's own world: **focus**. A lens does one thing. It takes scattered light
and brings it to a single point, and the whole instrument exists to make that point sharp. Viper
Net sells the same shape of work: many vague ideas in, one clear site out. Every section is a
surface the light passes through on the way to being resolved.

This edition deliberately leaves the near-black plus acid-green look behind. That combination is
one of the tells this skill lists, and it was defended last time only because the green is the
Viper Net mark. Precision is a colder, quieter world.

## 3. Palette, sampled from the approved footage

```css
:root{
  --canvas:#080D14;      /* the frame's darkest field, blue-black, never pure black */
  --canvas-2:#0C131C;
  --panel:#131C27;       /* sampled from the haze */
  --panel-2:#19242F;
  --accent:#6FC3FF;      /* the focused beam, in rare doses only */
  --accent-hover:#99D6FF;
  --accent-muted:rgba(111,195,255,.18);
  --line:rgba(140,170,200,.20);
  --line-strong:rgba(160,190,215,.40);
  --text-primary:#EAF1F8;
  --text-secondary:#97A9BC;
}
```

The Viper Net green does not disappear from the business, it simply stops being the site's
accent. Final token values get re-sampled from the approved video, not the start frame.

## 4. Type trio

- Display: **Archivo** 700 / 800. An engineered grotesque, tight and machined, nothing like Syne.
- Body: **IBM Plex Sans** 400 / 600. Drawn for a hardware company, precise and quiet.
- Mono: **IBM Plex Mono** 400 / 500, for the small labels and the readouts.

Self-hosted woff2, latin subset, same as the first edition. No third-party font request.

## 5. The signature element: the depth-of-field rail

A vertical optical axis runs down the whole page. It is sharp only where the reader is, and blurs
away above and below, so the page is literally in focus at the point of attention. Section markers
are focus brackets that snap closed as the rail reaches them. Remove it and the page loses its
subject.

Test it against the bar: if the rail were deleted, the page would lose the one idea it is built on.
That is a signature, not decoration.

## 6. Band map (hero 560vh, scroll range 460vh)

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.20 | the fall begins down the optical axis | kicker "Viper Net" / "Websites built to strike." | focus pull, blur to sharp |
| 2 | 0.25 to 0.46 | passing the first glass, flare blooms | "No ghosting. No six month builds." | aperture wipe from the edge |
| 3 | 0.51 to 0.72 | the beam narrows to its focal waist | "Fast to load. Easy to find. Finished on time." | word-by-word snap into focus |
| 4 | 0.77 to 1.00 | the fall settles on the resolved rectangle of light | "Your site. Live in weeks." + "Design, build and launch, handled end to end by one team." + CTA row | rise into a staged settle |

Captions live in the calm side regions measured on the real footage, never over the beam.

## 7. Below-fold outline (every line ships verbatim, carried from the approved edition)

Unchanged from `design-package.md` sections A to F: What we do (four services), The work (AVERA,
BG OIL, SB Security with real links), How it goes (Call, Plan, Build, Launch), the interactive
moment, Questions (six), and the call to action with the form. The section shapes are re-cut for
this world so no two neighbours share a skeleton.

**The interactive moment, re-designed for this world:** "Bring it into focus." The visitor drags a
focus control and a blurred promise resolves into a sharp one. Reduced motion gets the resolved
state with no drag. Same three promises, verbatim.

## 8. The form

Posts to the existing `/api/contact`, so inquiries land in Supabase and the admin panel. The
visitor's own email app is the fallback if the request fails. Success state says what actually
happened.

## 9. The copy gate

Zero em dashes, zero stock words (leverage, seamless, empower, unlock, robust, actionable,
data-driven, solutions), plus the AI-tell sweep. The deliberate triplets are brand devices and
stay.
