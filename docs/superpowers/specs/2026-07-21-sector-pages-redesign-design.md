# Sector pages redesign (Manufacturing / Oil & Gas / Large Scale Facilities / Utilities / Sanitario)

## Context
Industry sector pages currently render via [`IndustryDetail.astro`](../../../src/components/pages/IndustryDetail.astro) + the `industriesIt`/`industriesEn` content collections ([`content.config.ts`](../../../src/content.config.ts)): full-bleed photo hero → centered intro → 2-col icon feature-card grid → optional case-study band. Only 3 sectors exist (`manufacturing.mdx`, `oil-and-gas.mdx`, `large-scale-facilities.mdx`), documented as the "faithful rebuild of openeam.it" in [`docs/content-spec.md`](../../content-spec.md).

User supplied new copy for all 5 sectors (the 3 above + Utilities + Sanitario, which don't exist yet) plus 8 reference screenshots of a richer page structure than the current template: breadcrumb + text-only hero (no photo) → 2-col grid of 6 photo-overlay cards → dark CTA band with two blob shapes → a 2-slide list+photo carousel → grey closing CTA bar. This is a template replacement, not just new content — confirmed with user (see chat): build all 5 sectors, best-fit generic imagery where real photos don't exist, translate to EN too. **Follow the reference screenshots closely for visual fidelity** (spacing, blob shapes, card overlay treatment) — they are the source of truth over any component-reuse convenience.

## Goal
Replace the industry-page template with one matching the reference screenshots, ship all 5 sectors (IT + EN), reusing existing design-system primitives (`Section`, `Button`, colors/radius/shadow tokens) and component patterns already in the codebase where they fit.

## Components (new, in `src/components/`)

**`SectorHero.astro`** — `{ eyebrow: string; title: string; subtitle: string; intro: string }`. `Section bg="light"`, decorative bg (reuse `assets/img/pricing/blob-bg.svg`, same one `Azienda.astro`'s hero uses, absolutely positioned). Breadcrumb row (`eyebrow` muted + `›` + `title`), H1 = `title` (orange), H2 = `subtitle` (ink), then `intro` (HTML, rendered via `set:html`) as body paragraphs. No photo — matches screenshot 1.

**`SectorFeatureCard.astro`** — `{ image: ImageMetadata; imageAlt: string; heading: string; body: string }`. Trimmed variant of [`PlatformShowcaseCard.astro`](../../../src/components/PlatformShowcaseCard.astro): same photo + frosted-panel-overlap structure, drop `icon`/`iconName`/`tagline`/CTA (screenshots show none). Un-comment and adapt its currently-disabled `.psc__arc` teal quarter-circle CSS (already designed, just switched off) instead of inventing new decoration. Used 6× per page in a 2-col `sector-grid`.

**`BlobCtaBand.astro`** — `{ heading: string; body: string; ctaLabel: string; ctaHref: string }`. Dark (`ink`) section, two blob circles (teal bottom-left, orange right) — this is the exact `.statement__blob--teal`/`.statement__blob--orange` CSS being removed from `Azienda.astro` in the user's parallel uncommitted edit (git diff replaces it with a flat bg image + no button). Rehoming it here as a reusable component instead of losing it, and adding the button the screenshot has (Azienda's old version had none). Centered heading + body + `Button variant="primary"`.

**`ListPhotoCarousel.astro`** — `{ slides: { image: ImageMetadata; imageAlt: string; heading: string; items: string[] }[]; intervalMs?: number }`. Sibling of [`CaseStudyCarousel.astro`](../../../src/components/CaseStudyCarousel.astro): identical 1fr/3fr sliding layout and dot-pagination JS, but the text panel renders a heading + `<ul>` bullet list instead of stat+quote. 2 slides per page ("Cosa puoi gestire con Open EAM" / "Ambiti ..." — label varies per sector).

**Bottom grey CTA bar** — reuse existing [`CtaBand.astro`](../../../src/components/CtaBand.astro) `tone="sage"`, no `image` (already-supported "solo" variant). No new component.

Template: rewrite [`IndustryDetail.astro`](../../../src/components/pages/IndustryDetail.astro) in place (single template, no `v2` fork — old one is fully superseded) to compose the 5 sections in order: `SectorHero` → `sector-grid` of 6 `SectorFeatureCard` → `BlobCtaBand` → `ListPhotoCarousel` → `CtaBand`. `src/pages/industries/[slug].astro` (+ `en/` twin) keep working unchanged, they just pass `entry` through.

## Content schema (`src/content.config.ts`, `industriesIt`/`industriesEn`)

Replace the icon-card shape with:
```
title, subtitle, order,
intro: string,                                  // HTML, hero body
features: array of 6x { heading, body },        // feature grid copy
featureImages: [image, image],                  // exactly 2, card i uses featureImages[i % 2]
ctaHeading, ctaBody,                             // BlobCtaBand
capabilitiesHeading, capabilitiesItems: string[], capabilitiesImage: image(),   // carousel slide 1
scopesLabel, scopesItems: string[], scopesImage: image(),                       // carousel slide 2
closingHeading, closingBody,                     // bottom CtaBand
caseStudies: string[] (default []),              // kept as-is
seoDescription?: string
```
Drop `heroImage` (photo hero removed), `introTone`/`cardTone` (single fixed layout now), the `featureCard` icon enum (`gear`/`wrench`/.../`chart-2` — no longer referenced anywhere once this lands, safe to delete), `eyebrow` (replaced by the fixed "SETTORI"/"INDUSTRIES" breadcrumb prefix passed from `[slug].astro`, not per-entry).

Also add `'utilities'` and `'sanitario'` to the `sector` enum on `caseStudiesIt`/`caseStudiesEn` (future-proofing, harmless additive change; no existing case study currently uses either).

## Content plan (5 sectors × IT/EN)

IT copy for all 5 sectors (Manufacturing, Oil & Gas, Large Scale Facilities, Utilities, Sanitario) was provided verbatim by the user in chat — transcribed directly into the new schema shape per-sector during implementation, not duplicated here. EN is a first-pass translation authored at the same time, same structure — user will review wording after.

Slugs: `/industries/utilities` and `/industries/sanitario`, same slug both locales (matches existing `manufacturing`/`oil-and-gas`/`large-scale-facilities` convention — same slug, different content, per locale).

`src/config/site.ts` `industryLinks`: add `{ label: 'Utilities', href: '/industries/utilities' }` and `{ label: 'Healthcare', href: '/industries/sanitario' }`. Nav label is **"Healthcare"** not "Sanitario" — `industryLinks` is one shared array rendered on both locale navs (existing entries are already English-style: "Manufacturing", "Oil & Gas"), the page itself still titles "Sanitario" on the IT route via its own mdx `title`.

## Image plan (Asset export folder: `C:\Users\anton\OneDrive\Desktop\openeam.it\Asset`)

User chose "best-fit generic for now" given real per-sector photography doesn't exist beyond what's listed below — flagged for later swap-in, not blocking.

| Sector | featureImages[0] / [1] | capabilitiesImage (carousel slide 1) | scopesImage (slide 2) |
|---|---|---|---|
| Manufacturing | `industrial_control_panel.avif` / `man_working_in_industry.avif` | `Manufacturing.jpg` (existing real hero photo, repurposed — no longer needed as hero) | `presentazione_grafico_barre.avif` |
| Oil & Gas | `industrial_control_panel.avif` / `ingegnere-controlla-robot.avif` | `Oil and Gas.jpg` (existing real hero photo, repurposed) | `ingegneri-collaborazione-laptop.avif` |
| Large Scale Facilities | `man_working_in_industry.avif` / `ingegneri-collaborazione-laptop.avif` | `Large Scale Facilities.jpg` (existing real hero photo, repurposed) | `presentazione_grafico_barre.avif` |
| Utilities | `industrial_control_panel.avif` / `man_working_in_industry.avif` | `processo_manutenzione_standard-ui.avif` (workflow/ticketing screenshot — thematically fits "segnalazioni, ordini di lavoro") | `man_working_in_industry.avif` |
| Sanitario | `ingegneri-collaborazione-laptop.avif` / `man_working_in_industry.avif` | `presentazione_grafico_barre.avif` | `man_working_in_industry.avif` |

**Sanitario is the weakest fit** — nothing clinical/healthcare exists anywhere in the project or the Asset export, so it gets generic industrial/office photos as visible placeholders. Real photos should replace these when available.

## Out of scope
- Real photography for Utilities/Sanitario (flagged above, not blocking this pass).
- Updating `docs/content-spec.md`'s "Industry pages" section to match the new structure — worth doing as a quick follow-up once implementation lands, so the doc doesn't describe a superseded template.
- Any change to `Azienda.astro`'s own in-progress edit (unrelated, already in the user's working tree — not touched by this work).
- Editing the 3 existing case-study `.mdx` files (`st-microelectronics`, `sonatrach`, `sasol`, `sac`, `saras`) — only the `sector` enum gains 2 new allowed values, nothing existing changes.

## Testing
Visual check in browser per sector (IT + EN): hero renders text-only with breadcrumb, 6-card grid alternates the 2 images correctly, blob CTA band shows both blob colors + working demo link, carousel auto-plays and dot-click both slides, bottom bar renders. Confirm nav shows "Utilities"/"Healthcare" entries and both new routes resolve (`/industries/utilities`, `/industries/sanitario`, `en/` twins). `astro build` (or dev server type-check) to confirm the schema migration doesn't break the 3 existing sectors' content.
