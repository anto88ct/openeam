# Sector Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the industry-page template (currently photo-hero + icon-card grid) with the richer structure from the user's reference screenshots — text hero w/ breadcrumb, 6-card photo-overlay grid, dark blob CTA band, list+photo carousel, grey closing bar — and ship all 5 sectors (Manufacturing, Oil & Gas, Large Scale Facilities, Utilities, Sanitario/Healthcare) in IT + EN.

**Architecture:** 4 new shared Astro components (`SectorHero`, `SectorFeatureCard`, `BlobCtaBand`, `ListPhotoCarousel`) + 1 reused (`CtaBand`), composed by a rewritten `IndustryDetail.astro` template driven by a new content-collection schema. Existing dynamic routes (`src/pages/industries/[slug].astro` + `en/` twin) need no changes — they already just pass `entry` through.

**Tech Stack:** Astro 5 (content collections, `astro:assets` `Image`), no test framework in this repo — verification is `npm run build` (validates Zod schemas + type-checks) plus manual browser check.

## Global Constraints
- No new dependencies — everything uses existing Astro/`astro:assets` primitives already in the codebase.
- Reuse design tokens from `src/styles/global.css` (`--color-orange #ff5b04`, `--color-teal #075056`, `--color-ink #233038`, `--radius-card 24px`, `--shadow-card`) — no new hardcoded colors.
- IT copy is verbatim from the user's message (do not paraphrase); EN is a first-pass translation, same structure, same tone as existing `src/content/industries/en/*.mdx`.
- Nav (`src/config/site.ts` `industryLinks`) is a single array shared by both locale navs — new entries use English-style labels ("Utilities", "Healthcare") like the existing three, even on the IT site.
- Do not touch `Azienda.astro`, `Footer.astro`, or the case-study `.mdx` files — those are the user's own in-progress/unrelated edits or explicitly out of scope.

---

### Task 1: Copy the one missing image asset

**Files:**
- Create: `src/assets/img/industries-process-ui.avif` (copied binary, not authored)

**Interfaces:**
- Produces: an importable image at `../../assets/img/industries-process-ui.avif` for later tasks (Utilities `capabilitiesImage`).

- [ ] **Step 1: Verify the other 8 needed images are already bundled and byte-identical to the Webflow export**

Run:
```bash
for f in control-panel.avif worker-industry.avif engineer-robot.avif engineers-laptop.avif bar-chart-presentation.avif hero-manufacturing.jpg hero-oil-gas.jpg hero-large-scale.jpg; do
  a=$(stat -c%s "src/assets/img/$f")
  echo "$f: $a bytes"
done
```
Expected (already confirmed during planning — this step is a safety re-check, not new information):
```
control-panel.avif: 14379 bytes
worker-industry.avif: 129528 bytes
engineer-robot.avif: 22602 bytes
engineers-laptop.avif: 22058 bytes
bar-chart-presentation.avif: 19709 bytes
hero-manufacturing.jpg: 2925046 bytes
hero-oil-gas.jpg: 1155002 bytes
hero-large-scale.jpg: 2976818 bytes
```
If any size doesn't match, stop and re-copy that file from `C:\Users\anton\OneDrive\Desktop\openeam.it\Asset` before continuing (do not trust the bundled copy — see [[feedback_asset_sourcing]] memory).

- [ ] **Step 2: Copy the missing 9th image**

Run:
```bash
cp "/c/Users/anton/OneDrive/Desktop/openeam.it/Asset/68c2d17cedbae5796e7bd306_processo_manutenzione_standard-ui.avif" "src/assets/img/industries-process-ui.avif"
```

- [ ] **Step 3: Verify the copy**

Run: `stat -c%s "src/assets/img/industries-process-ui.avif"`
Expected: `6632` (matches the source file's size)

- [ ] **Step 4: Commit**

```bash
git add src/assets/img/industries-process-ui.avif
git commit -m "assets: add process-UI screenshot for Utilities sector page"
```

---

### Task 2: `SectorFeatureCard.astro` component

**Files:**
- Create: `src/components/SectorFeatureCard.astro`

**Interfaces:**
- Produces: `SectorFeatureCard` with props `{ image: ImageMetadata; imageAlt: string; heading: string; body: string }`, default-exported as an Astro component. Consumed by Task 7 (`IndustryDetail.astro`).

- [ ] **Step 1: Create the component**

```astro
---
import { Image } from 'astro:assets';

/** Photo card with a teal arc accent and a frosted panel overlapping the bottom, holding heading + body only (no icon/CTA — trimmed sibling of PlatformShowcaseCard for the sector feature grid). */
interface Props {
  image: ImageMetadata;
  imageAlt: string;
  heading: string;
  body: string;
}
const { image, imageAlt, heading, body } = Astro.props;
---

<article class="sfc">
  <div class="sfc__media">
    <Image src={image} alt={imageAlt} width={640} height={520} loading="lazy" />
    <div class="sfc__arc" aria-hidden="true"></div>
  </div>
  <div class="sfc__panel">
    <h3 class="sfc__heading">{heading}</h3>
    <p class="sfc__body">{body}</p>
  </div>
</article>

<style>
  .sfc {
    position: relative;
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    background: #fff;
  }
  .sfc__media {
    position: relative;
    aspect-ratio: 4 / 3.1;
    overflow: hidden;
  }
  .sfc__media :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sfc__arc {
    position: absolute;
    z-index: 1;
    width: 55%;
    aspect-ratio: 1;
    left: -12%;
    bottom: -24%;
    background: var(--color-teal);
    opacity: 0.85;
    border-radius: 50%;
  }
  .sfc__panel {
    position: relative;
    z-index: 2;
    margin-top: -30%;
    background: rgb(255 255 255 / 0.82);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border-radius: 20px 20px 0 0;
    padding: clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 3vw, 2rem) clamp(1.75rem, 3vw, 2.25rem);
    display: grid;
    gap: 0.65rem;
  }
  .sfc__heading { font-size: clamp(1.15rem, 1.8vw, 1.4rem); color: var(--color-ink); }
  .sfc__body { color: var(--color-slate-muted); font-size: 0.98rem; line-height: 1.6; }

  @media (max-width: 480px) {
    .sfc__media { aspect-ratio: 16 / 11; }
    .sfc__panel { margin-top: -20%; }
  }
</style>
```

- [ ] **Step 2: Verify it type-checks / builds in isolation**

Run: `npm run build`
Expected: build succeeds (component isn't referenced by any page yet, so Astro just confirms the file itself has no syntax/type errors — it won't be exercised until Task 7 wires it in).

- [ ] **Step 3: Commit**

```bash
git add src/components/SectorFeatureCard.astro
git commit -m "feat: add SectorFeatureCard component for sector page feature grid"
```

---

### Task 3: `BlobCtaBand.astro` component

**Files:**
- Create: `src/components/BlobCtaBand.astro`

**Interfaces:**
- Consumes: `Button` from `./Button.astro` (`variant?: 'primary' | 'teal' | 'dark' | 'outline' | 'outline-ink'`, existing).
- Produces: `BlobCtaBand` with props `{ heading: string; body: string; ctaLabel: string; ctaHref: string }`. Consumed by Task 7.

- [ ] **Step 1: Create the component**

```astro
---
import Button from './Button.astro';

/** Dark CTA band with two translucent blob circles (teal + orange) — same values as the blob CSS `Azienda.astro`'s statement section used before being replaced by a flat background image (see git history), rehomed here with a CTA button added. */
interface Props {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}
const { heading, body, ctaLabel, ctaHref } = Astro.props;
---

<section class="blob-cta">
  <div class="blob-cta__blob blob-cta__blob--teal" aria-hidden="true"></div>
  <div class="blob-cta__blob blob-cta__blob--orange" aria-hidden="true"></div>
  <div class="container-page blob-cta__content">
    <h2 class="blob-cta__heading">{heading}</h2>
    <p class="blob-cta__body">{body}</p>
    <Button href={ctaHref} variant="primary">{ctaLabel}</Button>
  </div>
</section>

<style>
  .blob-cta {
    position: relative;
    overflow: hidden;
    background: var(--color-ink);
    text-align: center;
    padding-block: clamp(3.5rem, 7vw, 6rem);
  }
  .blob-cta__blob {
    position: absolute;
    width: 40%;
    aspect-ratio: 1;
    border-radius: 50%;
    pointer-events: none;
  }
  .blob-cta__blob--teal { bottom: -12%; left: -10%; background: var(--color-teal); opacity: 0.55; }
  .blob-cta__blob--orange { bottom: -14%; right: -10%; background: var(--color-orange); opacity: 0.55; }
  .blob-cta__content {
    position: relative;
    z-index: 1;
    max-width: 42rem;
    margin-inline: auto;
    display: grid;
    gap: 1.4rem;
    justify-items: center;
  }
  .blob-cta__heading { color: #fff; font-size: clamp(1.7rem, 3.4vw, 2.6rem); }
  .blob-cta__body { color: rgb(255 255 255 / 0.9); font-size: 1.1rem; line-height: 1.7; }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — expect success (same isolation caveat as Task 2).

- [ ] **Step 3: Commit**

```bash
git add src/components/BlobCtaBand.astro
git commit -m "feat: add BlobCtaBand component for sector page mid-page CTA"
```

---

### Task 4: `ListPhotoCarousel.astro` component

**Files:**
- Create: `src/components/ListPhotoCarousel.astro`

**Interfaces:**
- Produces: `ListPhotoCarousel` with props `{ slides: { image: ImageMetadata; imageAlt: string; heading: string; items: string[] }[]; intervalMs?: number }`. Consumed by Task 7.

- [ ] **Step 1: Create the component**

```astro
---
import { Image } from 'astro:assets';

/** Sibling of CaseStudyCarousel.astro: same 1fr/3fr sliding layout and dot-pagination JS, but the text panel is a heading + bullet list instead of a stat + quote. */
interface Slide {
  image: ImageMetadata;
  imageAlt: string;
  heading: string;
  items: string[];
}
interface Props {
  slides: Slide[];
  intervalMs?: number;
}
const { slides, intervalMs = 6000 } = Astro.props;
---

<div class="lpcarousel" data-carousel data-interval={intervalMs}>
  <div class="lpcarousel__row">
    <div class="lpcarousel__text">
      {
        slides.map((s, i) => (
          <div class:list={['lpcarousel__panel', { 'is-active': i === 0 }]} data-panel={i}>
            <h3 class="lpcarousel__heading">{s.heading}</h3>
            <ul class="lpcarousel__list">
              {s.items.map((item) => <li>{item}</li>)}
            </ul>
          </div>
        ))
      }
    </div>
    <div class="lpcarousel__media">
      {
        slides.map((s, i) => (
          <Image
            src={s.image}
            alt={s.imageAlt}
            width={1200}
            height={675}
            loading={i === 0 ? 'eager' : 'lazy'}
            class:list={['lpcarousel__img', { 'is-active': i === 0 }]}
            data-slide={i}
          />
        ))
      }
    </div>
  </div>
  <div class="lpcarousel__dots" role="tablist" aria-label="Slide">
    {
      slides.map((_, i) => (
        <button
          type="button"
          class:list={['lpcarousel__dot', { 'is-active': i === 0 }]}
          data-dot={i}
          role="tab"
          aria-selected={i === 0}
          aria-label={`Slide ${i + 1}`}
        />
      ))
    }
  </div>
</div>

<script>
  function initCarousels() {
    document.querySelectorAll<HTMLElement>('[data-carousel]:not([data-lpc-inited])').forEach((root) => {
      root.dataset.lpcInited = 'true';

      const images = Array.from(root.querySelectorAll<HTMLElement>('.lpcarousel__img'));
      const panels = Array.from(root.querySelectorAll<HTMLElement>('.lpcarousel__panel'));
      const dots = Array.from(root.querySelectorAll<HTMLElement>('.lpcarousel__dot'));
      const total = images.length;
      if (total < 2) return;

      const interval = Number(root.dataset.interval) || 6000;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let index = 0;
      let timer: ReturnType<typeof setInterval> | null = null;

      const show = (next: number) => {
        images[index]?.classList.remove('is-active');
        panels[index]?.classList.remove('is-active');
        dots[index]?.classList.remove('is-active');
        dots[index]?.setAttribute('aria-selected', 'false');
        index = next;
        images[index]?.classList.add('is-active');
        panels[index]?.classList.add('is-active');
        dots[index]?.classList.add('is-active');
        dots[index]?.setAttribute('aria-selected', 'true');
      };

      const advance = () => show((index + 1) % total);

      const start = () => {
        if (timer || reduceMotion) return;
        timer = setInterval(advance, interval);
      };
      const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
      };

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          if (i === index) return;
          show(i);
          stop();
          start();
        });
      });

      start();
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', start);
    });
  }

  document.addEventListener('astro:page-load', initCarousels);
  initCarousels();
</script>

<style>
  .lpcarousel__row {
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: stretch;
    gap: clamp(1.5rem, 3vw, 2.5rem);
  }
  .lpcarousel__text { position: relative; display: grid; }
  .lpcarousel__panel {
    grid-area: 1 / 1;
    display: grid;
    gap: 1rem;
    align-content: start;
    background: rgb(35 48 56 / 0.07);
    border-radius: var(--radius-card);
    padding: clamp(1.5rem, 3vw, 2rem);
    opacity: 0;
    visibility: hidden;
    transform: translateY(6px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .lpcarousel__panel.is-active { opacity: 1; visibility: visible; transform: translateY(0); }
  .lpcarousel__heading { color: var(--color-ink); font-size: 1.3rem; }
  .lpcarousel__list { display: grid; gap: 0.55rem; }
  .lpcarousel__list li {
    color: var(--color-slate);
    font-size: 1rem;
    line-height: 1.5;
    padding-left: 1.1rem;
    position: relative;
  }
  .lpcarousel__list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-orange);
  }

  .lpcarousel__media {
    position: relative;
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    aspect-ratio: 16 / 9;
  }
  .lpcarousel__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .lpcarousel__img.is-active { opacity: 1; position: relative; }

  .lpcarousel__dots { display: flex; justify-content: center; gap: 0.6rem; margin-top: 1.75rem; }
  .lpcarousel__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    padding: 0;
    background: rgb(35 48 56 / 0.18);
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }
  .lpcarousel__dot:hover { background: rgb(35 48 56 / 0.32); }
  .lpcarousel__dot.is-active { background: var(--color-ink); transform: scale(1.15); }

  @media (prefers-reduced-motion: reduce) {
    .lpcarousel__img, .lpcarousel__panel { transition: none; }
  }
  @media (max-width: 820px) {
    .lpcarousel__row { grid-template-columns: 1fr; }
    .lpcarousel__text { min-height: 320px; }
    .lpcarousel__media { aspect-ratio: 16 / 11; }
  }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — expect success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ListPhotoCarousel.astro
git commit -m "feat: add ListPhotoCarousel component for sector page capabilities/scopes slides"
```

---

### Task 5: `SectorHero.astro` component

**Files:**
- Create: `src/components/SectorHero.astro`

**Interfaces:**
- Consumes: `Section` from `./Section.astro` (`bg?: 'white'|'light'|'panel'|'ink'|'teal'`, existing), `assets/img/pricing/blob-bg.svg` (existing asset, already used by `Azienda.astro`'s hero).
- Produces: `SectorHero` with props `{ eyebrow: string; title: string; subtitle: string; intro: string }` (`intro` is an HTML string with the two `<p>` paragraphs already embedded). Consumed by Task 7.

- [ ] **Step 1: Create the component**

```astro
---
import { Image } from 'astro:assets';
import Section from './Section.astro';
import blobBg from '../assets/img/pricing/blob-bg.svg';

/** Text-only sector hero: breadcrumb + orange H1 + ink H2 sub + intro paragraphs, over the same decorative blob Azienda.astro's hero uses. No photo (unlike PhotoHero). */
interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
}
const { eyebrow, title, subtitle, intro } = Astro.props;
---

<Section bg="light" class="sector-hero">
  <Image src={blobBg} alt="" class="sector-hero__blob" aria-hidden="true" />
  <div class="sector-hero__content">
    <p class="sector-hero__crumb">{eyebrow} <span class="sector-hero__crumb-sep">&rsaquo;</span> {title}</p>
    <h1 class="sector-hero__title">{title}</h1>
    <h2 class="sector-hero__subtitle">{subtitle}</h2>
    <div class="sector-hero__intro rich" set:html={intro} />
  </div>
</Section>

<style>
  .sector-hero { position: relative; overflow: hidden; }
  .sector-hero__blob {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(120%, 1400px);
    height: auto;
    transform: translate(-50%, -50%) scale(1.4);
    pointer-events: none;
    z-index: 0;
  }
  .sector-hero__content {
    position: relative;
    z-index: 1;
    max-width: 52rem;
    display: grid;
    gap: 1rem;
  }
  .sector-hero__crumb {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-slate-muted);
  }
  .sector-hero__crumb-sep { opacity: 0.6; }
  .sector-hero__title { color: var(--color-orange); font-size: clamp(2.4rem, 5vw, 3.6rem); }
  .sector-hero__subtitle { color: var(--color-ink); font-size: clamp(1.3rem, 2.6vw, 1.9rem); }
  .sector-hero__intro { display: grid; gap: 1.1rem; margin-top: 0.5rem; }
  .sector-hero__intro :global(p) { color: var(--color-slate); font-size: 1.08rem; line-height: 1.75; }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — expect success.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectorHero.astro
git commit -m "feat: add SectorHero component (breadcrumb + text-only hero) for sector pages"
```

---

### Task 6: Migrate content schema

**Files:**
- Modify: `src/content.config.ts` (full file — both `industriesIt`/`industriesEn` collection schemas, plus the `sector` enum on `caseStudiesIt`/`caseStudiesEn`)

**Interfaces:**
- Produces: the new `industriesIt`/`industriesEn` schema shape that Tasks 8–12 (content authoring) and Task 7 (`IndustryDetail.astro`) both depend on:
```ts
z.object({
  title: z.string(),
  subtitle: z.string(),
  order: z.number().default(0),
  intro: z.string(),                                   // HTML, hero body (2 <p> already embedded)
  features: z.array(z.object({ heading: z.string(), body: z.string() })).length(6),
  featureImages: z.tuple([image(), image()]),
  ctaHeading: z.string(),
  ctaBody: z.string(),
  capabilitiesItems: z.array(z.string()),
  capabilitiesImage: image(),
  scopesLabel: z.string(),
  scopesItems: z.array(z.string()),
  scopesImage: image(),
  closingHeading: z.string(),
  closingBody: z.string(),
  caseStudies: z.array(z.string()).default([]),
  seoDescription: z.string().optional(),
})
```

**Note:** this task alone will break `npm run build` — the 3 existing `.mdx` files (IT + EN) still use the old shape until Tasks 8–10 rewrite them. That's expected; do not treat the build failure after this task as a bug to fix here.

- [ ] **Step 1: Replace the collection definitions**

Replace the full contents of `src/content.config.ts` with:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Sector page feature-grid card (title/body only — image comes from the entry's featureImages tuple, alternating by index). */
const sectorFeature = z.object({
  heading: z.string(),
  body: z.string(),
});

const industrySchema = ({ image }: { image: () => z.ZodType }) =>
  z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number().default(0),
    intro: z.string(),
    features: z.array(sectorFeature).length(6),
    featureImages: z.tuple([image(), image()]),
    ctaHeading: z.string(),
    ctaBody: z.string(),
    capabilitiesItems: z.array(z.string()),
    capabilitiesImage: image(),
    scopesLabel: z.string(),
    scopesItems: z.array(z.string()),
    scopesImage: image(),
    closingHeading: z.string(),
    closingBody: z.string(),
    caseStudies: z.array(z.string()).default([]),
    seoDescription: z.string().optional(),
  });

const industriesIt = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/industries/it' }),
  schema: industrySchema,
});

const industriesEn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/industries/en' }),
  schema: industrySchema,
});

const caseStudiesIt = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies/it' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      industry: z.string(),
      order: z.number().default(0),
      heroImage: image(),
      excerpt: z.string(),
      sector: z
        .enum(['manufacturing', 'oil-and-gas', 'large-scale-facilities', 'utilities', 'sanitario'])
        .optional(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      modules: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      seoDescription: z.string().optional(),
    }),
});

const caseStudiesEn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies/en' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      industry: z.string(),
      order: z.number().default(0),
      heroImage: image(),
      excerpt: z.string(),
      sector: z
        .enum(['manufacturing', 'oil-and-gas', 'large-scale-facilities', 'utilities', 'sanitario'])
        .optional(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      modules: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      seoDescription: z.string().optional(),
    }),
});

export const collections = { industriesIt, industriesEn, caseStudiesIt, caseStudiesEn };
```

- [ ] **Step 2: Confirm the expected (temporary) build failure**

Run: `npm run build`
Expected: FAIL — Zod validation errors on `manufacturing.mdx`, `oil-and-gas.mdx`, `large-scale-facilities.mdx` (both locales) for missing `features`/`featureImages`/etc. This confirms the schema is wired up; Tasks 8–10 fix it.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: migrate industries content schema to sector-page template shape"
```

---

### Task 7: Rewrite `IndustryDetail.astro`

**Files:**
- Modify: `src/components/pages/IndustryDetail.astro` (full rewrite)

**Interfaces:**
- Consumes: `SectorHero` (Task 5), `SectorFeatureCard` (Task 2), `BlobCtaBand` (Task 3), `ListPhotoCarousel` (Task 4), existing `CtaBand`/`CaseStudyCard`/`SectionHeading`/`Section`, `getLocalizedPath` from `../../i18n/utils`, and the Task 6 schema shape.
- Produces: nothing new consumed downstream — this is the render target for Tasks 8–12's content.

- [ ] **Step 1: Replace the full file**

```astro
---
import { getEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Section from '../Section.astro';
import SectionHeading from '../SectionHeading.astro';
import SectorHero from '../SectorHero.astro';
import SectorFeatureCard from '../SectorFeatureCard.astro';
import BlobCtaBand from '../BlobCtaBand.astro';
import ListPhotoCarousel from '../ListPhotoCarousel.astro';
import CtaBand from '../CtaBand.astro';
import CaseStudyCard from '../CaseStudyCard.astro';
import { getLocalizedPath } from '../../i18n/utils';

interface Props {
  lang: 'it' | 'en';
  entry: any;
}
const { lang, entry } = Astro.props;
const l = (href: string) => getLocalizedPath(lang, href);
const caseStudiesCollection = lang === 'en' ? 'caseStudiesEn' : 'caseStudiesIt';
const demoCta = lang === 'en' ? 'Request a demo' : 'Richiedi una demo';
const expertCta = lang === 'en' ? 'Talk to an expert' : 'Parla con un esperto';
const caseCtaLabel = lang === 'en' ? 'Learn more' : 'Scopri di più';
const eyebrow = lang === 'en' ? 'INDUSTRIES' : 'SETTORI';
const capabilitiesHeading = lang === 'en' ? 'What you can manage with Open EAM' : 'Cosa puoi gestire con Open EAM';

const data = entry.data;

const featured = (
  await Promise.all(
    data.caseStudies.map((slug: string) => getEntry(caseStudiesCollection, slug)),
  )
).filter((c: any): c is NonNullable<typeof c> => !!c && !c.data.draft);
---
<BaseLayout
  title={`${data.title} — OpenEAM Industries`}
  description={data.seoDescription ?? data.intro.replace(/<[^>]+>/g, '').slice(0, 155)}
>
  <SectorHero eyebrow={eyebrow} title={data.title} subtitle={data.subtitle} intro={data.intro} />

  <Section bg="light">
    <div class="sector-grid">
      {data.features.map((f: any, i: number) => (
        <SectorFeatureCard
          image={data.featureImages[i % 2]}
          imageAlt={f.heading}
          heading={f.heading}
          body={f.body}
        />
      ))}
    </div>
  </Section>

  <BlobCtaBand heading={data.ctaHeading} body={data.ctaBody} ctaLabel={demoCta} ctaHref={l('/demo')} />

  <Section bg="light">
    <ListPhotoCarousel
      slides={[
        {
          image: data.capabilitiesImage,
          imageAlt: capabilitiesHeading,
          heading: capabilitiesHeading,
          items: data.capabilitiesItems,
        },
        {
          image: data.scopesImage,
          imageAlt: data.scopesLabel,
          heading: data.scopesLabel,
          items: data.scopesItems,
        },
      ]}
    />
  </Section>

  {featured.length > 0 && (
    <section class="cs-band">
      <div class="container-page">
        <SectionHeading heading="Case studies" align="center" class="cs-band__head" />
        <div class:list={['cs-grid', { 'cs-grid--single': featured.length === 1 }]}>
          {featured.map((c: any) => (
            <CaseStudyCard
              title={c.data.title}
              href={l(`/case-studies/${c.id}`)}
              image={c.data.heroImage}
              imageAlt={c.data.title}
              body={c.data.excerpt}
              ctaLabel={caseCtaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  )}

  <Section bg="light">
    <CtaBand
      heading={data.closingHeading}
      body={data.closingBody}
      tone="sage"
      ctaLabel={expertCta}
      ctaHref={l('/demo')}
    />
  </Section>
</BaseLayout>

<style>
  .sector-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 720px) { .sector-grid { grid-template-columns: 1fr; } }

  .cs-band {
    padding-block: clamp(3.5rem, 7vw, 6rem);
    background: linear-gradient(120deg, var(--color-ink) 0%, #3a2a20 45%, var(--color-orange) 100%);
  }
  .cs-band__head :global(.sh__title) { color: #fff; }
  .cs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }
  .cs-grid--single { max-width: 34rem; margin-inline: auto; grid-template-columns: 1fr; }
  @media (max-width: 720px) { .cs-grid { grid-template-columns: 1fr; } }
</style>
```

Note: `PhotoHero` and `FeatureCard` imports are dropped (no longer used by this template) — do not delete those component files themselves, `PhotoHero` may still be reused elsewhere later and `FeatureCard` is out of scope to remove in this plan.

- [ ] **Step 2: Confirm build is still red for the expected reason**

Run: `npm run build`
Expected: FAIL — same Zod errors as Task 6 (content not yet migrated). If you see a *different* error (e.g. a typo in this file), fix it now.

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/IndustryDetail.astro
git commit -m "feat: rewrite IndustryDetail template to compose new sector-page components"
```

---

### Task 8: Migrate Manufacturing content (IT + EN)

**Files:**
- Modify: `src/content/industries/it/manufacturing.mdx` (full rewrite)
- Modify: `src/content/industries/en/manufacturing.mdx` (full rewrite)

**Interfaces:**
- Consumes: the Task 6 schema shape exactly — field names must match or the build fails.

- [ ] **Step 1: Replace `src/content/industries/it/manufacturing.mdx`**

```mdx
---
title: Manufacturing
subtitle: Efficienza produttiva, dal primo all'ultimo asset
order: 1
intro: >-
  <p>In produzione, ogni fermo macchina pesa su tempi, costi, qualità e continuità del lavoro. Dall'industria manifatturiera a quella alimentare, chimica, farmaceutica e di trasformazione, ogni stabilimento deve coordinare linee, impianti, tecnici, fornitori, ricambi, documenti e dati senza rallentare i processi che funzionano già.</p>
  <p>Open EAM parte dalla realtà del tuo impianto — layout, logiche operative, flussi di manutenzione e priorità produttive — e si configura sulle modalità già presenti, senza costringerti a modificare ciò che funziona. Così puoi ridurre downtime, garantire qualità e migliorare le performance con un sistema coerente con i processi del tuo stabilimento.</p>
features:
  - heading: Riduci fermi macchina e rallentamenti produttivi
    body: >-
      Quando un asset critico si ferma, non si blocca solo una macchina: si rallentano linee, consegne, qualità e pianificazione. Open EAM ti aiuta a monitorare lo stato degli asset, programmare interventi e individuare anomalie prima che diventino guasti.
  - heading: Pianifica manutenzioni preventive e predittive
    body: >-
      Open EAM consente di gestire manutenzioni programmate, interventi correttivi e logiche predittive in un unico flusso operativo. Puoi assegnare attività, seguire lo stato di avanzamento e mantenere uno storico affidabile degli interventi eseguiti.
  - heading: Collega ordini di lavoro, ricambi e storico interventi
    body: >-
      Ordini di lavoro, ricambi, costi, attività svolte e documenti tecnici devono essere sempre collegati all'asset corretto. Con Open EAM ogni informazione resta tracciabile e consultabile, rendendo più semplice coordinare tecnici, fornitori e responsabili di manutenzione.
  - heading: Integra dati da ERP, MES, SCADA e IoT
    body: >-
      ERP, MES, sistemi IoT, SCADA e altre fonti aziendali generano dati preziosi, ma spesso restano separati. Open EAM collega informazioni operative, performance degli asset, interventi e costi in un'unica vista, aiutandoti a individuare priorità, anomalie e aree di miglioramento.
  - heading: Tieni documenti tecnici e audit sempre in ordine
    body: >-
      Manuali, schemi elettrici, piani di manutenzione, disegni CAD e normative di riferimento devono essere disponibili quando servono. Con Open EAM ogni documento è collegato all'asset di competenza, aggiornato e accessibile alle persone autorizzate durante interventi, controlli e audit.
  - heading: Monitora consumi, sprechi e costi di gestione
    body: >-
      Negli impianti produttivi, consumi energetici, manutenzione e performance degli asset sono strettamente collegati. Open EAM collega dati tecnici, attività manutentive e informazioni energetiche, aiutandoti a individuare inefficienze, ridurre sprechi e migliorare il controllo complessivo sull'impianto.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Vuoi ridurre fermi, dispersioni e passaggi manuali nel tuo stabilimento?
ctaBody: >-
  Open EAM si configura intorno ai tuoi processi produttivi, collegando asset, manutenzioni, dati tecnici e sistemi già presenti in impianto.
capabilitiesItems:
  - Asset produttivi, linee e impianti
  - Ordini di lavoro e manutenzioni programmate
  - Interventi correttivi, preventivi e predittivi
  - Ricambi, costi e storico interventi
  - Documentazione tecnica, audit e normative
  - Dati da ERP, MES, SCADA e IoT
  - Consumi energetici, sprechi e performance
capabilitiesImage: ../../../assets/img/hero-manufacturing.jpg
scopesLabel: Ambiti produttivi
scopesItems:
  - Industria manifatturiera
  - Industria alimentare
  - Industria chimica
  - Industria farmaceutica
  - Processi di trasformazione
  - Stabilimenti multi-linea
  - Impianti produttivi complessi
scopesImage: ../../../assets/img/bar-chart-presentation.avif
closingHeading: Porta più controllo nei processi produttivi
closingBody: >-
  Ogni stabilimento ha logiche, priorità e sistemi diversi. Open EAM si adatta al tuo modo di lavorare per rendere manutenzione, asset e dati più coordinati.
caseStudies:
  - st-microelectronics
seoDescription: >-
  OpenEAM per il Manufacturing: ottimizza asset e processi produttivi, riduci i fermi macchina e integra i dati di ERP, MES e IoT.
---
```

- [ ] **Step 2: Replace `src/content/industries/en/manufacturing.mdx`**

```mdx
---
title: Manufacturing
subtitle: Production efficiency, from the first asset to the last
order: 1
intro: >-
  <p>In production, every machine stoppage weighs on time, cost, quality, and continuity of work. From manufacturing to food, chemical, pharmaceutical, and processing industries, every plant has to coordinate lines, equipment, technicians, suppliers, spare parts, documents, and data without slowing down the processes that already work.</p>
  <p>Open EAM starts from the reality of your plant — layout, operating logic, maintenance flows, and production priorities — and configures itself around the ways you already work, without forcing you to change what's working. That way you can reduce downtime, ensure quality, and improve performance with a system that's consistent with your plant's processes.</p>
features:
  - heading: Reduce machine downtime and production slowdowns
    body: >-
      When a critical asset stops, it's not just one machine that halts: lines, deliveries, quality, and planning all slow down. Open EAM helps you monitor asset condition, schedule interventions, and spot anomalies before they become failures.
  - heading: Plan preventive and predictive maintenance
    body: >-
      Open EAM lets you manage scheduled maintenance, corrective interventions, and predictive logic in a single operational flow. You can assign tasks, track progress, and keep a reliable history of completed interventions.
  - heading: Link work orders, spare parts, and intervention history
    body: >-
      Work orders, spare parts, costs, completed activities, and technical documents all need to stay linked to the right asset. With Open EAM, every piece of information stays traceable and searchable, making it easier to coordinate technicians, suppliers, and maintenance managers.
  - heading: Integrate data from ERP, MES, SCADA, and IoT
    body: >-
      ERP, MES, IoT systems, SCADA, and other company sources generate valuable data, but it often stays siloed. Open EAM connects operational information, asset performance, interventions, and costs into a single view, helping you spot priorities, anomalies, and areas for improvement.
  - heading: Keep technical documents and audits always in order
    body: >-
      Manuals, wiring diagrams, maintenance plans, CAD drawings, and reference standards need to be available whenever they're needed. With Open EAM, every document is linked to the relevant asset, kept up to date, and accessible to authorized people during interventions, inspections, and audits.
  - heading: Monitor consumption, waste, and management costs
    body: >-
      In production plants, energy consumption, maintenance, and asset performance are closely linked. Open EAM connects technical data, maintenance activity, and energy information, helping you spot inefficiencies, cut waste, and improve overall control of the plant.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Want to reduce downtime, waste, and manual handoffs at your plant?
ctaBody: >-
  Open EAM configures itself around your production processes, connecting assets, maintenance, technical data, and the systems already in place at your plant.
capabilitiesItems:
  - Production assets, lines, and plants
  - Work orders and scheduled maintenance
  - Corrective, preventive, and predictive interventions
  - Spare parts, costs, and intervention history
  - Technical documentation, audits, and regulations
  - Data from ERP, MES, SCADA, and IoT
  - Energy consumption, waste, and performance
capabilitiesImage: ../../../assets/img/hero-manufacturing.jpg
scopesLabel: Production sectors
scopesItems:
  - Manufacturing industry
  - Food industry
  - Chemical industry
  - Pharmaceutical industry
  - Processing operations
  - Multi-line plants
  - Complex production facilities
scopesImage: ../../../assets/img/bar-chart-presentation.avif
closingHeading: Bring more control to your production processes
closingBody: >-
  Every plant has its own logic, priorities, and systems. Open EAM adapts to the way you work, making maintenance, assets, and data more coordinated.
caseStudies:
  - st-microelectronics
seoDescription: >-
  OpenEAM for Manufacturing: optimize assets and production processes, reduce downtime, and integrate ERP, MES, and IoT data.
---
```

- [ ] **Step 3: Verify Manufacturing builds and renders**

Run: `npm run build`
Expected: Manufacturing's Zod errors are gone from the output (Oil & Gas / Large Scale Facilities errors still present — expected until Tasks 9–10).

- [ ] **Step 4: Visual check against the reference screenshots**

Start dev server (`npm run dev`), open `/industries/manufacturing`, compare section-by-section against the 8 reference screenshots from the original request: breadcrumb reads "SETTORI › Manufacturing", hero has no photo, 6-card grid alternates control-panel/worker photos with teal arc + frosted panel, dark CTA band shows both blob colors + "Richiedi una demo" button, carousel shows "Cosa puoi gestire con Open EAM" list + repurposed hero photo with 2 dots, second dot shows "Ambiti produttivi" list, grey closing bar shows "Porta più controllo..." + "Parla con un esperto".

- [ ] **Step 5: Commit**

```bash
git add src/content/industries/it/manufacturing.mdx src/content/industries/en/manufacturing.mdx
git commit -m "content: migrate Manufacturing sector page to new template and copy"
```

---

### Task 9: Migrate Oil & Gas content (IT + EN)

**Files:**
- Modify: `src/content/industries/it/oil-and-gas.mdx` (full rewrite)
- Modify: `src/content/industries/en/oil-and-gas.mdx` (full rewrite)

**Interfaces:**
- Consumes: same Task 6 schema shape as Task 8.

- [ ] **Step 1: Replace `src/content/industries/it/oil-and-gas.mdx`**

```mdx
---
title: Oil & Gas
subtitle: Efficienza e sicurezza in ogni fase operativa
order: 2
intro: >-
  <p>Nel settore Oil &amp; Gas, ogni attività deve essere sicura, tracciabile e verificabile. Raffinerie, impianti offshore, stabilimenti petrolchimici e reti di distribuzione richiedono procedure rigorose, documenti aggiornati, interventi tempestivi e coordinamento tra team interni, fornitori e responsabili operativi.</p>
  <p>Open EAM ti aiuta a mantenere il controllo su manutenzione, ispezioni, asset critici e flussi autorizzativi, offrendo uno strumento di Technical Asset Management a supporto delle decisioni di impianto. Una gestione più strutturata permette di garantire continuità operativa, conformità e rapidità d'intervento anche nei contesti più complessi.</p>
features:
  - heading: Pianifica manutenzioni e ispezioni sugli asset critici
    body: >-
      Manutenzione e ispezioni sono processi chiave per garantire sicurezza, conformità e continuità operativa. Con Open EAM puoi pianificare attività programmate, ispezioni periodiche, interventi straordinari e manutenzioni su chiamata, mantenendo ogni passaggio tracciato.
  - heading: Gestisci procedure, responsabilità e flussi autorizzativi
    body: >-
      Ogni intervento deve seguire procedure chiare, responsabilità definite e informazioni sempre disponibili. Open EAM permette di configurare workflow coerenti con le regole operative del sito, rendendo più ordinati approvazioni, assegnazioni e controlli.
  - heading: Collega manuali operativi e documenti agli asset
    body: >-
      Manuali tecnici, procedure di sicurezza, piani operativi e documenti d'impianto devono essere sempre aggiornati e collegati all'asset corretto. Con Open EAM tecnici, operatori e responsabili possono accedere rapidamente alle informazioni necessarie per interventi, verifiche e audit.
  - heading: Rileva le anomalie in anticipo e supporta la manutenzione predittiva
    body: >-
      L'integrazione con sensori e sistemi di monitoraggio aiuta a individuare anomalie in anticipo e a intervenire prima che una criticità generi fermi o rischi operativi. Open EAM supporta interventi preventivi e logiche di manutenzione predittiva sugli asset più critici.
  - heading: Dai a tecnici e management una vista unica sugli impianti
    body: >-
      Informazioni, segnalazioni, attività e priorità devono essere leggibili sia da chi opera sul campo sia da chi prende decisioni di gestione. Open EAM centralizza i dati provenienti da siti, impianti, reti e terminal, migliorando tracciabilità del lavoro tecnico e controllo strategico da parte del management.
  - heading: Rendi più chiari handover e passaggi di consegne
    body: >-
      Il passaggio di consegne tra turni o team è un momento critico nei contesti ad alto rischio. Open EAM permette di registrare, condividere e archiviare in modo strutturato le informazioni operative, mantenendo una cronologia chiara, tracciabile e ricostruibile nel tempo.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/engineer-robot.avif
ctaHeading: Vuoi gestire asset critici, ispezioni e manutenzioni con processi più tracciabili?
ctaBody: >-
  Open EAM supporta contesti Oil & Gas complessi, dove sicurezza, conformità e continuità operativa richiedono informazioni sempre disponibili e procedure verificabili.
capabilitiesItems:
  - Asset critici e infrastrutture tecniche
  - Manutenzioni programmate e interventi straordinari
  - Ispezioni periodiche e verifiche operative
  - Workflow autorizzativi e responsabilità
  - Manuali operativi e documenti d'impianto
  - Anomalie, sensori e manutenzione predittiva
  - Handover e passaggi di consegne
  - Dati per tecnici, responsabili e management
capabilitiesImage: ../../../assets/img/hero-oil-gas.jpg
scopesLabel: Ambiti operativi
scopesItems:
  - Raffinerie
  - Impianti offshore
  - Impianti onshore
  - Stabilimenti petrolchimici
  - Terminal e depositi
  - Reti di distribuzione
  - Asset critici e infrastrutture tecniche
scopesImage: ../../../assets/img/engineers-laptop.avif
closingHeading: Rendi più governabili impianti, procedure e decisioni operative
closingBody: >-
  Open EAM collega manutenzione, ispezioni, documenti e dati di impianto in un ambiente configurabile sulle regole operative del tuo sito.
caseStudies:
  - sonatrach
  - sasol
seoDescription: >-
  OpenEAM per l'Oil &amp; Gas: manutenzione sicura, gestione documentale d'impianto e visione centralizzata di asset distribuiti su più siti.
---
```

- [ ] **Step 2: Replace `src/content/industries/en/oil-and-gas.mdx`**

```mdx
---
title: Oil & Gas
subtitle: Efficiency and safety at every stage of operations
order: 2
intro: >-
  <p>In the Oil &amp; Gas sector, every activity has to be safe, traceable, and verifiable. Refineries, offshore platforms, petrochemical plants, and distribution networks all require rigorous procedures, up-to-date documents, timely interventions, and coordination between internal teams, suppliers, and operations managers.</p>
  <p>Open EAM helps you stay in control of maintenance, inspections, critical assets, and authorization workflows, offering a Technical Asset Management tool that supports plant-level decisions. More structured management means you can guarantee operational continuity, compliance, and rapid response even in the most complex contexts.</p>
features:
  - heading: Plan maintenance and inspections on critical assets
    body: >-
      Maintenance and inspections are key processes for ensuring safety, compliance, and operational continuity. With Open EAM you can plan scheduled activities, periodic inspections, extraordinary interventions, and on-call maintenance, with every step tracked.
  - heading: Manage procedures, responsibilities, and authorization workflows
    body: >-
      Every intervention has to follow clear procedures, defined responsibilities, and always-available information. Open EAM lets you configure workflows consistent with your site's operating rules, keeping approvals, assignments, and checks more orderly.
  - heading: Link operating manuals and documents to assets
    body: >-
      Technical manuals, safety procedures, operating plans, and plant documents need to always be up to date and linked to the right asset. With Open EAM, technicians, operators, and managers can quickly access the information they need for interventions, checks, and audits.
  - heading: Spot anomalies early and support predictive maintenance
    body: >-
      Integration with sensors and monitoring systems helps you spot anomalies early and act before an issue causes downtime or operational risk. Open EAM supports preventive interventions and predictive maintenance logic on your most critical assets.
  - heading: Give technicians and management a single view of your plants
    body: >-
      Information, reports, activities, and priorities need to be readable both by people working on the ground and by those making management decisions. Open EAM centralizes data from sites, plants, networks, and terminals, improving traceability of technical work and strategic oversight for management.
  - heading: Make handovers and shift changes clearer
    body: >-
      Handovers between shifts or teams are a critical moment in high-risk contexts. Open EAM offers dedicated tools to record, share, and archive operational information in a structured way, keeping a clear, traceable, and reconstructable history over time.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/engineer-robot.avif
ctaHeading: Want to manage critical assets, inspections, and maintenance with more traceable processes?
ctaBody: >-
  Open EAM supports complex Oil & Gas contexts, where safety, compliance, and operational continuity require information that's always available and procedures that are verifiable.
capabilitiesItems:
  - Critical assets and technical infrastructure
  - Scheduled maintenance and extraordinary interventions
  - Periodic inspections and operational checks
  - Authorization workflows and responsibilities
  - Operating manuals and plant documents
  - Anomalies, sensors, and predictive maintenance
  - Handovers and shift changes
  - Data for technicians, managers, and leadership
capabilitiesImage: ../../../assets/img/hero-oil-gas.jpg
scopesLabel: Operating contexts
scopesItems:
  - Refineries
  - Offshore platforms
  - Onshore plants
  - Petrochemical facilities
  - Terminals and depots
  - Distribution networks
  - Critical assets and technical infrastructure
scopesImage: ../../../assets/img/engineers-laptop.avif
closingHeading: Make your plants, procedures, and operational decisions easier to govern
closingBody: >-
  Open EAM connects maintenance, inspections, documents, and plant data in an environment configurable around your site's operating rules.
caseStudies:
  - sonatrach
  - sasol
seoDescription: >-
  OpenEAM for Oil & Gas: safe maintenance, plant document management, and centralized visibility of assets distributed across multiple sites.
---
```

- [ ] **Step 3: Verify build (Manufacturing + Oil & Gas clean, Large Scale still red)**

Run: `npm run build`

- [ ] **Step 4: Visual check** — `/industries/oil-and-gas`, same checklist as Task 8 step 4.

- [ ] **Step 5: Commit**

```bash
git add src/content/industries/it/oil-and-gas.mdx src/content/industries/en/oil-and-gas.mdx
git commit -m "content: migrate Oil & Gas sector page to new template and copy"
```

---

### Task 10: Migrate Large Scale Facilities content (IT + EN)

**Files:**
- Modify: `src/content/industries/it/large-scale-facilities.mdx` (full rewrite)
- Modify: `src/content/industries/en/large-scale-facilities.mdx` (full rewrite)

**Interfaces:**
- Consumes: same Task 6 schema shape.

- [ ] **Step 1: Replace `src/content/industries/it/large-scale-facilities.mdx`**

```mdx
---
title: Large Scale Facilities
subtitle: Gestione integrata di strutture complesse e multi-sito
order: 3
intro: >-
  <p>Dagli aeroporti ai musei, dalla GDO alle strutture ricettive, fino a campus, poli commerciali e complessi multi-sede, Open EAM offre a gestori e operatori uno strumento unico per coordinare asset, manutenzioni, documentazione e dati operativi.</p>
  <p>In contesti dove ogni fermo, ritardo o informazione mancante può generare disservizi, costi e problemi di conformità, la piattaforma aiuta a mantenere visibilità sulle attività, velocizzare gli interventi e garantire continuità anche su più siti e con team distribuiti.</p>
features:
  - heading: Gestisci richieste, segnalazioni e interventi da un unico flusso
    body: >-
      In una grande struttura, la manutenzione non può dipendere da telefonate, email o passaggi informali. Open EAM permette di raccogliere richieste, segnalazioni, urgenze e attività programmate in un unico ambiente, trasformandole in interventi assegnabili, monitorabili e tracciabili.
  - heading: Coordina tecnici, fornitori e attività multi-sede
    body: >-
      Impianti tecnici, aree comuni, spazi operativi e servizi interni richiedono responsabilità chiare e aggiornamenti continui. Con Open EAM puoi assegnare attività a tecnici e fornitori, seguire lo stato di avanzamento e mantenere una vista coerente anche su strutture distribuite.
  - heading: Monitora tempi, scadenze e qualità del servizio
    body: >-
      Tempi di risposta, scadenze normative, controlli periodici e livelli di servizio devono essere monitorati con precisione. Open EAM aiuta a tenere sotto controllo priorità, stati di avanzamento e responsabilità, migliorando la qualità del servizio e riducendo ritardi o attività non presidiate.
  - heading: Collega documenti, planimetrie e procedure agli asset
    body: >-
      Certificazioni, schemi di impianto, regolamenti tecnici, manuali, planimetrie e procedure operative devono essere aggiornati e facilmente reperibili. Con Open EAM ogni documento può essere collegato all'asset, all'area o all'impianto di riferimento, rendendo più rapide verifiche, audit e attività sul campo.
  - heading: Pianifica manutenzioni, verifiche e ispezioni
    body: >-
      Interventi ordinari, manutenzioni programmate, verifiche tecniche e ispezioni devono essere pianificati senza perdere visibilità su risorse, priorità e scadenze. Open EAM ti permette di organizzare le attività in anticipo, assegnarle alle persone giuste e seguirne l'esecuzione fino alla chiusura.
  - heading: Previeni disservizi su impianti e asset tecnici
    body: >-
      Un guasto circoscritto può generare rallentamenti, disservizi o problemi di sicurezza. Open EAM collega impianti elettrici, HVAC, antincendio, accessi, ascensori e altri asset tecnici allo storico degli interventi, alla documentazione e alle attività manutentive, migliorando affidabilità e continuità operativa.
featureImages:
  - ../../../assets/img/worker-industry.avif
  - ../../../assets/img/engineers-laptop.avif
ctaHeading: Vuoi coordinare strutture, fornitori e interventi senza perdere visibilità?
ctaBody: >-
  Open EAM aiuta a gestire richieste, manutenzioni, documenti e asset tecnici in strutture complesse, multi-sede o ad alta continuità di servizio.
capabilitiesItems:
  - Richieste, segnalazioni e interventi
  - Tecnici, fornitori e attività multi-sede
  - Tempi di risposta, scadenze e qualità del servizio
  - Manutenzioni programmate, verifiche e ispezioni
  - Impianti elettrici, HVAC, antincendio e accessi
  - Documenti, planimetrie e procedure operative
  - Storico interventi e stato degli asset tecnici
capabilitiesImage: ../../../assets/img/hero-large-scale.jpg
scopesLabel: Ambiti applicativi
scopesItems:
  - Aeroporti
  - Musei e complessi culturali
  - GDO e punti vendita
  - Strutture ricettive
  - Campus
  - Poli commerciali
  - Complessi multi-sede
scopesImage: ../../../assets/img/bar-chart-presentation.avif
closingHeading: Trasforma la gestione tecnica in un flusso più ordinato
closingBody: >-
  Open EAM centralizza attività, asset, documenti e responsabilità, aiutando gestori e operatori a migliorare continuità, qualità del servizio e capacità di intervento.
caseStudies:
  - sac
  - siam
seoDescription: >-
  OpenEAM per grandi infrastrutture: aeroporti, reti idriche, campus e poli commerciali. Interventi tracciati, documentazione a norma e supervisione multi-sito.
---
```

- [ ] **Step 2: Replace `src/content/industries/en/large-scale-facilities.mdx`**

```mdx
---
title: Large Scale Facilities
subtitle: Integrated management for complex, multi-site facilities
order: 3
intro: >-
  <p>From airports to museums, from retail chains to hospitality venues, all the way to campuses, shopping centers, and multi-site complexes, Open EAM gives managers and operators a single tool to coordinate assets, maintenance, documentation, and operational data.</p>
  <p>In contexts where every stoppage, delay, or missing piece of information can create service disruptions, costs, and compliance issues, the platform helps maintain visibility over activities, speed up interventions, and ensure continuity even across multiple sites and distributed teams.</p>
features:
  - heading: Manage requests, reports, and interventions from a single flow
    body: >-
      In a large facility, maintenance can't depend on phone calls, emails, or informal handoffs. Open EAM lets you collect requests, reports, urgent issues, and scheduled activities in one environment, turning them into interventions that are assignable, trackable, and traceable.
  - heading: Coordinate technicians, suppliers, and multi-site activities
    body: >-
      Technical systems, common areas, operational spaces, and internal services all require clear responsibilities and constant updates. With Open EAM you can assign activities to technicians and suppliers, track progress, and maintain a consistent view even across distributed facilities.
  - heading: Monitor response times, deadlines, and service quality
    body: >-
      Response times, regulatory deadlines, periodic checks, and service levels all need precise monitoring. Open EAM helps you keep priorities, progress, and responsibilities under control, improving service quality and reducing delays or unattended activities.
  - heading: Link documents, floor plans, and procedures to assets
    body: >-
      Certifications, plant schematics, technical regulations, manuals, floor plans, and operating procedures need to stay up to date and easy to find. With Open EAM, every document can be linked to the relevant asset, area, or plant, speeding up checks, audits, and on-site activities.
  - heading: Plan maintenance, checks, and inspections
    body: >-
      Routine interventions, scheduled maintenance, technical checks, and inspections need to be planned without losing visibility over resources, priorities, and deadlines. Open EAM lets you organize activities in advance, assign them to the right people, and track execution through to close-out.
  - heading: Prevent service disruptions on plants and technical assets
    body: >-
      A localized failure can create slowdowns, service disruptions, or safety issues. Open EAM links electrical systems, HVAC, fire safety, access control, elevators, and other technical assets to intervention history, documentation, and maintenance activity, improving reliability and operational continuity.
featureImages:
  - ../../../assets/img/worker-industry.avif
  - ../../../assets/img/engineers-laptop.avif
ctaHeading: Want to coordinate facilities, suppliers, and interventions without losing visibility?
ctaBody: >-
  Open EAM helps manage requests, maintenance, documents, and technical assets in complex, multi-site, or high-continuity facilities.
capabilitiesItems:
  - Requests, reports, and interventions
  - Technicians, suppliers, and multi-site activities
  - Response times, deadlines, and service quality
  - Scheduled maintenance, checks, and inspections
  - Electrical systems, HVAC, fire safety, and access control
  - Documents, floor plans, and operating procedures
  - Intervention history and technical asset status
capabilitiesImage: ../../../assets/img/hero-large-scale.jpg
scopesLabel: Application areas
scopesItems:
  - Airports
  - Museums and cultural venues
  - Retail chains and stores
  - Hospitality venues
  - Campuses
  - Shopping centers
  - Multi-site complexes
scopesImage: ../../../assets/img/bar-chart-presentation.avif
closingHeading: Turn technical management into a more organized flow
closingBody: >-
  Open EAM centralizes activities, assets, documents, and responsibilities, helping managers and operators improve continuity, service quality, and response capacity.
caseStudies:
  - sac
  - siam
seoDescription: >-
  OpenEAM for large infrastructure: airports, water networks, campuses, and shopping centers. Tracked interventions, compliant documentation, and multi-site oversight.
---
```

- [ ] **Step 3: Verify full build is green**

Run: `npm run build`
Expected: SUCCESS — all 3 existing sectors (IT + EN) now match the new schema. This is the first point since Task 6 where the build is expected to fully pass.

- [ ] **Step 4: Visual check** — `/industries/large-scale-facilities`, same checklist as Task 8 step 4.

- [ ] **Step 5: Commit**

```bash
git add src/content/industries/it/large-scale-facilities.mdx src/content/industries/en/large-scale-facilities.mdx
git commit -m "content: migrate Large Scale Facilities sector page to new template and copy"
```

---

### Task 11: Author Utilities content (IT + EN, new sector)

**Files:**
- Create: `src/content/industries/it/utilities.mdx`
- Create: `src/content/industries/en/utilities.mdx`

**Interfaces:**
- Consumes: same Task 6 schema shape. `caseStudies: []` (no case study currently tagged to this sector).

- [ ] **Step 1: Create `src/content/industries/it/utilities.mdx`**

```mdx
---
title: Utilities
subtitle: Reti, manutenzioni e interventi sempre sotto controllo
order: 4
intro: >-
  <p>Quando gestisci servizi essenziali sul territorio, ogni segnalazione, manutenzione o intervento deve essere preso in carico senza dispersioni. Reti, impianti distribuiti, squadre operative e ditte esterne devono lavorare in modo coordinato, con informazioni sempre aggiornate e attività tracciabili.</p>
  <p>Open EAM aiuta utilities e multiutilities a gestire segnalazioni, sopralluoghi, ordini di lavoro, manutenzioni e consuntivi in un unico ambiente digitale. Così puoi mantenere il controllo sulle attività, velocizzare gli interventi e garantire continuità del servizio anche su reti e asset distribuiti.</p>
features:
  - heading: Trasforma segnalazioni e sopralluoghi in ordini di lavoro
    body: >-
      Quando una segnalazione arriva dal pubblico, dal call center o da un operatore sul territorio, non può restare isolata in telefonate, email o passaggi manuali. Con Open EAM può diventare un ordine di lavoro assegnabile, monitorabile e tracciabile fino alla chiusura.
  - heading: Coordina squadre interne e ditte esterne sul territorio
    body: >-
      Nelle utilities, molte attività coinvolgono sia personale interno sia imprese manutentrici esterne. Open EAM permette di assegnare interventi, aggiornare stati di avanzamento e condividere informazioni operative con accessi dedicati, rendendo più ordinati responsabilità, comunicazioni e passaggi di consegne.
  - heading: Pianifica manutenzioni e interventi su reti distribuite
    body: >-
      Su reti e infrastrutture distribuite, la manutenzione coinvolge asset diffusi sul territorio, attività periodiche, urgenze, sopralluoghi, verifiche e interventi correttivi. Open EAM ti aiuta a pianificare le attività, seguire l'avanzamento e consultare lo storico degli interventi svolti.
  - heading: Collega asset, documenti e storico interventi
    body: >-
      Reti e impianti distribuiti richiedono dati aggiornati e facilmente consultabili. Open EAM collega informazioni tecniche, documentazione, segnalazioni e attività manutentive, aiutandoti a ricostruire cosa è stato fatto, dove, quando e da chi.
  - heading: Individua criticità e priorità sul territorio
    body: >-
      Quando segnalazioni, manutenzioni e dati tecnici restano separati, diventa più difficile capire dove intervenire prima. Open EAM offre una vista più chiara sulle attività in corso e sulle criticità ricorrenti, supportando decisioni operative più rapide e interventi più mirati.
  - heading: Gestisci listini, consuntivi e rendicontazione
    body: >-
      Il controllo non finisce con la chiusura dell'intervento. Le attività svolte devono essere verificate, collegate ai listini concordati e rendicontate in modo chiaro, soprattutto quando sono coinvolte ditte esterne e manutenzioni ricorrenti. Open EAM semplifica consuntivi, controllo economico e rendicontazione di fine periodo.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Vuoi gestire segnalazioni, sopralluoghi e interventi sul territorio in modo più ordinato?
ctaBody: >-
  Open EAM collega reti, asset distribuiti, squadre operative e ditte esterne in un unico ambiente digitale, dalla richiesta iniziale alla rendicontazione finale.
capabilitiesItems:
  - Segnalazioni da utenti, call center e operatori
  - Sopralluoghi e ordini di lavoro
  - Squadre interne e ditte esterne
  - Manutenzioni programmate e interventi correttivi
  - Asset distribuiti sul territorio
  - Documentazione tecnica e storico interventi
  - Listini, consuntivi e rendicontazione
  - Criticità ricorrenti e priorità operative
capabilitiesImage: ../../../assets/img/industries-process-ui.avif
scopesLabel: Ambiti applicativi
scopesItems:
  - Reti idriche
  - Reti gas
  - Infrastrutture distribuite
  - Impianti tecnici sul territorio
  - Servizi pubblici locali
  - Multiutilities
  - Squadre operative e ditte manutentrici
scopesImage: ../../../assets/img/worker-industry.avif
closingHeading: Mantieni il controllo sulle attività distribuite
closingBody: >-
  Open EAM ti aiuta a trasformare segnalazioni, sopralluoghi e manutenzioni in processi tracciabili, migliorando coordinamento, continuità del servizio e controllo economico.
caseStudies: []
seoDescription: >-
  OpenEAM per le utilities: segnalazioni, sopralluoghi, ordini di lavoro e manutenzioni su reti distribuite in un unico ambiente digitale.
---
```

- [ ] **Step 2: Create `src/content/industries/en/utilities.mdx`**

```mdx
---
title: Utilities
subtitle: Networks, maintenance, and interventions always under control
order: 4
intro: >-
  <p>When you manage essential services across a territory, every report, maintenance job, or intervention needs to be handled without anything falling through the cracks. Networks, distributed plants, field teams, and external contractors all need to work in a coordinated way, with information that's always up to date and activities that are traceable.</p>
  <p>Open EAM helps utilities and multi-utilities manage reports, site visits, work orders, maintenance, and cost reporting in a single digital environment. That way you can stay in control of activities, speed up interventions, and ensure service continuity even across distributed networks and assets.</p>
features:
  - heading: Turn reports and site visits into work orders
    body: >-
      When a report comes in from the public, a call center, or a field operator, it can't stay isolated in phone calls, emails, or manual handoffs. With Open EAM it becomes a work order that's assignable, trackable, and traceable through to close-out.
  - heading: Coordinate internal teams and external contractors across the territory
    body: >-
      In utilities, many activities involve both internal staff and external maintenance firms. Open EAM lets you assign interventions, update progress, and share operational information with dedicated access, keeping responsibilities, communication, and handovers more orderly.
  - heading: Plan maintenance and interventions on distributed networks
    body: >-
      On distributed networks and infrastructure, maintenance involves assets spread across the territory, periodic activities, urgent issues, site visits, checks, and corrective interventions. Open EAM helps you plan activities, track progress, and consult the history of completed interventions.
  - heading: Link assets, documents, and intervention history
    body: >-
      Distributed networks and plants require data that's up to date and easy to consult. Open EAM links technical information, documentation, reports, and maintenance activity, helping you reconstruct what was done, where, when, and by whom.
  - heading: Spot critical issues and priorities across the territory
    body: >-
      When reports, maintenance, and technical data stay siloed, it becomes harder to know where to intervene first. Open EAM offers a clearer view of ongoing activities and recurring critical issues, supporting faster operational decisions and more targeted interventions.
  - heading: Manage price lists, cost reports, and reporting
    body: >-
      Control doesn't end when an intervention closes. Completed activities need to be verified, linked to agreed price lists, and reported clearly — especially when external contractors and recurring maintenance are involved. Open EAM simplifies cost reporting, financial control, and end-of-period reporting.
featureImages:
  - ../../../assets/img/control-panel.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Want to manage reports, site visits, and field interventions in a more organized way?
ctaBody: >-
  Open EAM connects networks, distributed assets, field teams, and external contractors in a single digital environment, from the initial request through to final reporting.
capabilitiesItems:
  - Reports from users, call centers, and operators
  - Site visits and work orders
  - Internal teams and external contractors
  - Scheduled maintenance and corrective interventions
  - Assets distributed across the territory
  - Technical documentation and intervention history
  - Price lists, cost reports, and reporting
  - Recurring critical issues and operational priorities
capabilitiesImage: ../../../assets/img/industries-process-ui.avif
scopesLabel: Application areas
scopesItems:
  - Water networks
  - Gas networks
  - Distributed infrastructure
  - Technical systems across the territory
  - Local public services
  - Multi-utilities
  - Field teams and maintenance contractors
scopesImage: ../../../assets/img/worker-industry.avif
closingHeading: Stay in control of distributed activities
closingBody: >-
  Open EAM helps you turn reports, site visits, and maintenance into traceable processes, improving coordination, service continuity, and financial control.
caseStudies: []
seoDescription: >-
  OpenEAM for utilities: reports, site visits, work orders, and maintenance across distributed networks in a single digital environment.
---
```

- [ ] **Step 3: Verify build**

Run: `npm run build` — expect success (this is a net-new sector, no prior schema to conflict with).

- [ ] **Step 4: Visual check** — `/industries/utilities` (route works purely from the content file existing — `[slug].astro` already generates paths from `getStaticPaths` over the collection, no route file change needed). Note the featureImages/scopesImage repeats a photo used elsewhere on the same page — expected per the "best-fit generic" image plan, not a bug.

- [ ] **Step 5: Commit**

```bash
git add src/content/industries/it/utilities.mdx src/content/industries/en/utilities.mdx
git commit -m "content: add Utilities sector page"
```

---

### Task 12: Author Sanitario/Healthcare content (IT + EN, new sector)

**Files:**
- Create: `src/content/industries/it/sanitario.mdx`
- Create: `src/content/industries/en/sanitario.mdx`

**Interfaces:**
- Consumes: same Task 6 schema shape. `caseStudies: []`.

- [ ] **Step 1: Create `src/content/industries/it/sanitario.mdx`**

```mdx
---
title: Sanitario
subtitle: Strutture più efficienti, impianti più affidabili
order: 5
intro: >-
  <p>In ospedali, cliniche, RSA e altre strutture sanitarie, la gestione tecnica incide sulla continuità dei servizi, sull'efficienza degli spazi e sulla qualità percepita da utenti, operatori e personale interno. Patrimonio immobiliare e impiantistico, apparecchiature, manutenzioni, consumi energetici e documentazione devono essere coordinati con precisione, senza dispersioni tra uffici tecnici, reparti, fornitori e responsabili di struttura.</p>
  <p>Open EAM ti aiuta a gestire patrimonio immobiliare e impiantistico, processi manutentivi, spazi, dati tecnici, consumi energetici e apparecchiature in un unico ambiente digitale, aumentando l'affidabilità degli impianti, la qualità del servizio verso l'utente finale e il controllo sui costi fissi.</p>
features:
  - heading: Gestisci richieste da reparti, ambulatori e aree tecniche
    body: >-
      Le richieste di intervento possono arrivare da reparti, ambulatori, aree comuni, uffici tecnici o fornitori. Open EAM permette di raccoglierle, organizzarle e trasformarle in attività assegnabili e tracciabili, evitando passaggi informali, informazioni incomplete e rallentamenti nella presa in carico.
  - heading: Tieni sotto controllo impianti, spazi e apparecchiature
    body: >-
      Edifici, reparti, locali tecnici, impianti, apparecchiature e dotazioni infrastrutturali devono essere censiti, aggiornati e facilmente consultabili. Con Open EAM puoi collegare asset, spazi, documenti e attività manutentive, mantenendo una vista ordinata del patrimonio tecnico della struttura.
  - heading: Pianifica manutenzioni, verifiche e attività dei fornitori
    body: >-
      Interventi programmati, verifiche, urgenze e attività dei fornitori devono essere pianificati, assegnati e monitorati senza dispersioni tra uffici, reparti e operatori esterni. Open EAM ti aiuta a seguire ogni attività dalla richiesta alla chiusura, con responsabilità e stati di avanzamento sempre tracciabili.
  - heading: Collega documenti tecnici, certificazioni e audit agli asset
    body: >-
      Manuali, certificazioni, schemi impiantistici, planimetrie, procedure, documenti tecnici e fascicoli collegati ad asset e apparecchiature devono essere aggiornati e accessibili quando servono. Con Open EAM ogni documento può essere collegato all'asset, allo spazio, all'impianto o all'apparecchiatura di riferimento.
  - heading: Monitora consumi, costi fissi e affidabilità degli impianti
    body: >-
      Consumi energetici, impianti tecnici, apparecchiature e manutenzioni sono aspetti strettamente collegati. Open EAM collega dati tecnici, processi manutentivi e informazioni energetiche, aiutandoti a individuare inefficienze, migliorare il controllo sui costi e aumentare l'affidabilità delle infrastrutture.
  - heading: Migliora continuità dei servizi e qualità percepita
    body: >-
      In una struttura sanitaria, anche un ritardo tecnico può incidere sull'organizzazione interna e sull'esperienza di utenti e operatori. Open EAM rende più ordinati processi, responsabilità, interventi e documentazione, aiutando la struttura a lavorare con maggiore continuità, efficienza e controllo.
featureImages:
  - ../../../assets/img/engineers-laptop.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Vuoi rendere più ordinata la gestione tecnica della tua struttura sanitaria?
ctaBody: >-
  Open EAM collega richieste, impianti, apparecchiature, documenti e manutenzioni, aiutando uffici tecnici e responsabili di struttura a lavorare con dati più chiari e processi tracciabili.
capabilitiesItems:
  - Richieste da reparti, ambulatori e aree tecniche
  - Impianti, spazi e apparecchiature
  - Manutenzioni programmate, verifiche e urgenze
  - Attività dei fornitori e stati di avanzamento
  - Documenti tecnici, certificazioni e audit
  - Consumi energetici e costi fissi
  - Storico interventi e patrimonio tecnico della struttura
  - Continuità dei servizi e qualità percepita
capabilitiesImage: ../../../assets/img/bar-chart-presentation.avif
scopesLabel: Strutture e ambiti gestiti
scopesItems:
  - Ospedali
  - Cliniche
  - RSA
  - Poliambulatori
  - Centri diagnostici
  - Reparti e aree tecniche
  - Impianti e apparecchiature
  - Strutture sanitarie multi-sede
scopesImage: ../../../assets/img/worker-industry.avif
closingHeading: Migliora continuità, controllo e affidabilità della struttura
closingBody: >-
  Ogni struttura sanitaria ha spazi, impianti, priorità e responsabilità diverse. Open EAM aiuta a coordinare la gestione tecnica con processi più chiari, documentati e tracciabili.
caseStudies: []
seoDescription: >-
  OpenEAM per il settore sanitario: gestione di impianti, apparecchiature, manutenzioni e documentazione tecnica in ospedali, cliniche e RSA.
---
```

**Note:** this sector's images are the weakest fit in the whole plan — nothing clinical exists anywhere in the project or the Webflow export, so it reuses the same generic industrial/office photos as other sectors. Flagged already in the spec; do not treat as a defect to silently "fix" with an unrelated stock photo — surface it to the user when real photography is available.

- [ ] **Step 2: Create `src/content/industries/en/sanitario.mdx`**

```mdx
---
title: Healthcare
subtitle: More efficient facilities, more reliable systems
order: 5
intro: >-
  <p>In hospitals, clinics, long-term care facilities, and other healthcare settings, technical management affects service continuity, space efficiency, and the quality perceived by patients, staff, and internal personnel. Real estate and technical assets, equipment, maintenance, energy consumption, and documentation all need precise coordination, without anything falling through the cracks between technical offices, departments, suppliers, and facility managers.</p>
  <p>Open EAM helps you manage real estate and technical assets, maintenance processes, spaces, technical data, energy consumption, and equipment in a single digital environment, increasing system reliability, end-user service quality, and control over fixed costs.</p>
features:
  - heading: Manage requests from departments, outpatient clinics, and technical areas
    body: >-
      Intervention requests can come from departments, outpatient clinics, common areas, technical offices, or suppliers. Open EAM lets you collect, organize, and turn them into activities that are assignable and traceable, avoiding informal handoffs, incomplete information, and delays in taking them on.
  - heading: Keep systems, spaces, and equipment under control
    body: >-
      Buildings, departments, technical rooms, systems, equipment, and infrastructure assets all need to be logged, kept up to date, and easy to consult. With Open EAM you can link assets, spaces, documents, and maintenance activity, maintaining an organized view of the facility's technical assets.
  - heading: Plan maintenance, checks, and supplier activities
    body: >-
      Scheduled interventions, checks, urgent issues, and supplier activities need to be planned, assigned, and monitored without anything falling through the cracks between offices, departments, and external operators. Open EAM helps you track every activity from request to close-out, with responsibilities and progress always traceable.
  - heading: Link technical documents, certifications, and audits to assets
    body: >-
      Manuals, certifications, plant schematics, floor plans, procedures, technical documents, and files linked to assets and equipment need to stay up to date and accessible when needed. With Open EAM, every document can be linked to the relevant asset, space, system, or piece of equipment.
  - heading: Monitor consumption, fixed costs, and system reliability
    body: >-
      Energy consumption, technical systems, equipment, and maintenance are all closely linked. Open EAM connects technical data, maintenance processes, and energy information, helping you spot inefficiencies, improve cost control, and increase infrastructure reliability.
  - heading: Improve service continuity and perceived quality
    body: >-
      In a healthcare facility, even a technical delay can affect internal organization and the experience of patients and staff. Open EAM brings more order to processes, responsibilities, interventions, and documentation, helping the facility work with greater continuity, efficiency, and control.
featureImages:
  - ../../../assets/img/engineers-laptop.avif
  - ../../../assets/img/worker-industry.avif
ctaHeading: Want to make technical management at your healthcare facility more organized?
ctaBody: >-
  Open EAM connects requests, systems, equipment, documents, and maintenance, helping technical offices and facility managers work with clearer data and traceable processes.
capabilitiesItems:
  - Requests from departments, outpatient clinics, and technical areas
  - Systems, spaces, and equipment
  - Scheduled maintenance, checks, and urgent interventions
  - Supplier activities and progress tracking
  - Technical documents, certifications, and audits
  - Energy consumption and fixed costs
  - Intervention history and the facility's technical assets
  - Service continuity and perceived quality
capabilitiesImage: ../../../assets/img/bar-chart-presentation.avif
scopesLabel: Facilities and areas managed
scopesItems:
  - Hospitals
  - Clinics
  - Long-term care facilities
  - Outpatient clinics
  - Diagnostic centers
  - Departments and technical areas
  - Systems and equipment
  - Multi-site healthcare facilities
scopesImage: ../../../assets/img/worker-industry.avif
closingHeading: Improve continuity, control, and facility reliability
closingBody: >-
  Every healthcare facility has different spaces, systems, priorities, and responsibilities. Open EAM helps coordinate technical management with clearer, documented, and traceable processes.
caseStudies: []
seoDescription: >-
  OpenEAM for healthcare: managing systems, equipment, maintenance, and technical documentation in hospitals, clinics, and long-term care facilities.
---
```

- [ ] **Step 3: Verify build**

Run: `npm run build` — expect success.

- [ ] **Step 4: Visual check** — `/industries/sanitario` and `/en/industries/sanitario`.

- [ ] **Step 5: Commit**

```bash
git add src/content/industries/it/sanitario.mdx src/content/industries/en/sanitario.mdx
git commit -m "content: add Sanitario/Healthcare sector page"
```

---

### Task 13: Nav entries for the 2 new sectors

**Files:**
- Modify: `src/config/site.ts:17-21` (`industryLinks` array)

**Interfaces:**
- Consumes: nothing new.
- Produces: nav entries consumed by `src/components/Nav.astro` and `src/components/Footer.astro` (both already iterate `industryLinks`, no changes needed there).

- [ ] **Step 1: Edit `industryLinks`**

Change:
```ts
export const industryLinks = [
  { label: 'Manufacturing', href: '/industries/manufacturing' },
  { label: 'Oil & Gas', href: '/industries/oil-and-gas' },
  { label: 'Large scale facilities', href: '/industries/large-scale-facilities' },
];
```
to:
```ts
export const industryLinks = [
  { label: 'Manufacturing', href: '/industries/manufacturing' },
  { label: 'Oil & Gas', href: '/industries/oil-and-gas' },
  { label: 'Large scale facilities', href: '/industries/large-scale-facilities' },
  { label: 'Utilities', href: '/industries/utilities' },
  { label: 'Healthcare', href: '/industries/sanitario' },
];
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — expect success.

- [ ] **Step 3: Visual check**

Dev server: open any page, confirm the "By Industry" nav dropdown and the footer's "By Industry" column both list 5 entries now, and that "Utilities"/"Healthcare" links resolve to the new pages (both `/industries/...` and `en/industries/...`).

- [ ] **Step 4: Commit**

```bash
git add src/config/site.ts
git commit -m "feat: add Utilities and Healthcare to industry nav links"
```

---

### Task 14: Update `docs/content-spec.md`

**Files:**
- Modify: `docs/content-spec.md` (the "Industry pages" section, currently starting at line 85)

**Interfaces:** none (documentation only).

- [ ] **Step 1: Replace the "Industry pages" section**

Replace the block starting at `## Industry pages (shared template: full-bleed photo hero...)` through the end of the Large Scale Facilities entry (originally lines 85–97) with:

```markdown
## Industry pages (shared template: text hero w/ breadcrumb → 6-card photo-overlay feature grid → dark blob CTA band → capabilities/scopes photo carousel → grey closing CTA bar)

Superseded 2026-07-21 the original photo-hero + icon-card template (see git history for the prior version). 5 sectors: Manufacturing, Oil & Gas, Large Scale Facilities, Utilities, Sanitario (Healthcare in EN). Full copy lives in each sector's `.mdx` under `src/content/industries/{it,en}/`; see `docs/superpowers/plans/2026-07-21-sector-pages-redesign.md` for the schema shape and full content. Utilities/Sanitario currently use generic placeholder photography pending real per-sector images (flagged in that plan).
```

- [ ] **Step 2: Commit**

```bash
git add docs/content-spec.md
git commit -m "docs: update content-spec for the sector-page template redesign"
```

---

### Task 15: Full verification pass

**Files:** none modified — verification only.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: SUCCESS, no Zod/type errors, all 10 industry routes (5 sectors × 2 locales) + all other existing pages generated.

- [ ] **Step 2: Route smoke check**

Start dev server, confirm all 10 routes return 200 and render the new template: `/industries/manufacturing`, `/industries/oil-and-gas`, `/industries/large-scale-facilities`, `/industries/utilities`, `/industries/sanitario`, and the `en/industries/...` twin of each.

- [ ] **Step 3: Visual comparison against the reference screenshots**

For `/industries/manufacturing` specifically (the sector with real reference screenshots), do a side-by-side check of: breadcrumb wording/position, hero heading colors (orange title / ink subtitle), 6-card grid alternation and teal-arc treatment, blob CTA band colors/positions and button, carousel dot pagination on both slides, closing grey bar. Fix any drift from the screenshots directly in the relevant component (Tasks 2–5) or content file (Task 8), not with page-specific overrides.

- [ ] **Step 4: Reduced-motion check**

Dev server, DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload `/industries/manufacturing`, confirm the `ListPhotoCarousel` no longer auto-advances (dots still clickable).

- [ ] **Step 5: No commit needed** (verification-only task) — if any fix was required, that fix gets its own commit per the task it belongs to.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-21-sector-pages-redesign.md`.

Given ultracode is active this session, execution will run via the Workflow tool rather than the two options this skill normally offers: Tasks 1–5 (new components + asset copy) fan out in parallel since they touch disjoint files; Task 6 (schema) then Task 7 (template) run sequentially since each depends on the previous; Tasks 8–12 (content authoring per sector) then fan out in parallel since each touches only its own 2 files; Tasks 13–14 (nav + docs) run after; Task 15 (verification) runs last, in the main session so screenshots/build output are visible directly.
