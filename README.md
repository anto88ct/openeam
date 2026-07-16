# openeam.it

Static marketing site for **Open EAM** — the modular asset-management & maintenance
platform. Built with **Astro** (SSG), **Tailwind CSS v4**, **Astro Content
Collections**, **lottie-web** and **EmailJS**. Ships as plain static files behind
**IIS** (Windows Server).

A product of **Seedma SRL** — Via Barletta 9, 95125 Catania — P.IVA 05728230870.

---

## Requirements

- **Node.js ≥ 18.20.8** (or 20.3+ / 22+). Astro 5 will not build on older 18.x.
- npm 9+

## Quick start

```bash
npm install          # install dependencies
npm run dev          # local dev server → http://localhost:4321
npm run build        # produce the static site in ./dist
npm run preview      # serve ./dist locally to verify the production build
```

## Environment variables (EmailJS)

The demo form (`/demo`) submits client-side via [EmailJS](https://www.emailjs.com/).
Copy `.env.example` to `.env` and fill in the three **public** identifiers from your
EmailJS dashboard:

```dotenv
PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

1. Create a free EmailJS account and add an **Email Service** → note the *Service ID*.
2. Add an **Email Template** whose variables match the form field `name`s: `nome`,
   `cognome`, `azienda`, `ruolo`, `email`. Note the *Template ID*.
3. Copy your account **Public Key**.

If the variables are missing, the form validates input but shows a configuration
notice instead of sending — the build still succeeds.

> `PUBLIC_`-prefixed vars are exposed to the browser by design; never put secrets here.

## Project structure

```
src/
  assets/
    animations/     Lottie JSON (loaded lazily by LottiePlayer)
    img/            photos, logos (img/logos), case images (img/cases), pricing
    icons/          SVG feature icons (gear, wrench, document, chart, …)
  components/        LottiePlayer, Nav, Footer, FeatureSplit, CtaBand, Faq, …
  config/site.ts     nav links, footer, company/legal details
  content/
    industries/     *.mdx  (Industry pages — data-driven)
    case-studies/   *.mdx  (Case studies — narrative + metrics)
  content.config.ts  Zod schemas for the two collections
  layouts/           BaseLayout, PageTemplate/LegalLayout
  lib/icons.ts       icon-name → asset resolver
  pages/             routes (index, platform/*, industries/[slug], case-studies/*, pricing, demo, 404, legal)
  styles/global.css  Tailwind import + design tokens (@theme) + utilities
public/
  web.config         IIS config (MIME types, URL rewrite, security headers, caching)
  webclip.png        favicon
docs/content-spec.md  full extracted content & design spec (source of truth)
```

## Lottie animations

`src/components/LottiePlayer.astro` renders any animation from
`src/assets/animations/` by filename (no extension):

```astro
<LottiePlayer animationName="dashboard_MTBF_tempi_intervento_costi_fermo" />
<LottiePlayer animationName="albero_P01_S08_A15_L30" loop={false} ariaLabel="Rete di asset" />
```

The JSON is emitted as a separate hashed file and fetched only when the element
nears the viewport (`IntersectionObserver`, `rootMargin: 200px`). Animations pause
off-screen and freeze on the first frame for users with *prefers-reduced-motion*, so
they never block the main thread. Uses the svg-only `lottie_light` build.

## Managing content

**Add a case study** — create `src/content/case-studies/<slug>.mdx`:

```mdx
---
title: Nome Cliente
client: Cliente SpA
industry: Settore
order: 7
heroImage: ../../assets/img/cases/<file>.avif
sector: manufacturing        # manufacturing | oil-and-gas | large-scale-facilities
excerpt: Frase breve mostrata nelle card.
metrics:
  - { value: "30%", label: "riduzione fermi" }
modules: [Manutenzione, Asset Management]
---

## La sfida
…

## La soluzione
…
```

It appears automatically on `/case-studies` and at `/case-studies/<slug>`. Reference
it from an industry page by adding its slug to that page's `caseStudies:` list.

**Add / edit an industry** — edit `src/content/industries/<slug>.mdx`; the schema is
in `src/content.config.ts`. `title` fields in cards may contain
`<span class="hl">…</span>` to highlight a phrase in orange.

## Deployment (IIS / Windows Server)

1. `npm run build` → static output in `./dist` (includes `web.config`).
2. Copy the **contents of `dist/`** into the site root (e.g. `C:\inetpub\wwwroot\openeam`).
3. In IIS point the site/app to that folder. `web.config` provides:
   - MIME types for `.json`, `.svg`, `.avif`, `.webp`, `.woff2`, `.webmanifest`
   - URL Rewrite: extensionless URLs → `…/index.html`
   - Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
     Permissions-Policy, HSTS) and static gzip compression
   - Custom `404` → `/404.html`
4. Ensure the **URL Rewrite** module is installed on the server (required for the
   rewrite rule). Static compression is built into IIS.

No Node runtime is needed on the server — the site is 100% static.
