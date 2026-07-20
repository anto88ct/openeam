# Platform grid icon hover animation

## Context
Home page "platform showcase" section (`Manutenzione, asset management, documenti e analytics...`) renders 4 cards via [PlatformShowcaseCard.astro](../../../src/components/PlatformShowcaseCard.astro), each with a small (26px) monocolor SVG icon: gear, wrench, document, chart. Icons currently render as opaque `<Image>` (astro:assets), no hover feedback.

## Goal
Animate each icon on card hover, with motion matching the icon's meaning.

## Approach
CSS-only, no JS, no new files, no inline-SVG conversion.

- Add `iconName: "gear" | "wrench" | "document" | "chart"` prop to `PlatformShowcaseCard.astro`. Render as a class on `.psc__icon` (e.g. `psc__icon--gear`).
- Set `iconName` per entry in `platformGridItems` in [Home.astro](../../../src/components/pages/Home.astro) (line ~371), matching existing `icon` (imported SVG) assignment.
- Trigger: `.psc:hover` (card already has this hover boundary via existing `article.psc`).
- Per-icon motion, applied via CSS `transition`/`@keyframes` on `.psc__icon img`, `transform-origin: center`:

| iconName | Motion |
|---|---|
| gear | continuous rotate 360° for duration of hover |
| wrench | swing/wiggle ±15° (tighten gesture) |
| document | lift + slight tilt (`translateY(-3px) rotate(3deg)`) |
| chart | pop/grow (`scale(1.12) translateY(-2px)`) |

- Wrap all animation rules in `@media (prefers-reduced-motion: no-preference)` so reduced-motion users get no motion.

## Why not inline SVG
Checked gear.svg, wrench.svg, chart.svg source: gear has 3 paths (outline + fill + inner circle), wrench and chart's individual paths aren't cleanly separable into independently-animatable sub-parts (e.g. wrench head vs handle) without redrawing. Inlining would only enable whole-icon transforms — same as keeping `<Image>` — while adding SVG `<mask>` id-collision risk (gear.svg has one) and losing Astro's image optimization. Not worth it for this scope.

## Out of scope
- Icon-only hover trigger (user chose whole-card trigger).
- Redrawing/splitting SVG paths for sub-element animation.
- Other homepage sections.

## Testing
Visual check in browser: hover each of the 4 cards, confirm correct motion per icon, confirm reduced-motion disables it (via DevTools emulation).
