# i18n IT/EN — Design

Date: 2026-07-16

## Goal

Add English translation to the whole site. Italian stays default at root URLs. English lives under `/en/*`. A flag switcher in the navbar lets visitors toggle language on the current page.

## Routing

- `astro.config.mjs` gets an `i18n` block:
  ```js
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: false },
  }
  ```
- IT pages stay at their current paths (`/`, `/pricing`, `/platform/asset-management`, ...).
- EN pages are new files mirrored under `src/pages/en/...` with the same path shape (`/en/`, `/en/pricing`, `/en/platform/asset-management`, ...).
- No redirects needed — existing IT URLs are unchanged.

## Shared UI strings

- `src/i18n/ui.ts` — dictionary of non-page-specific strings (nav labels, footer column titles, "Richiedi una demo" CTA, 404 copy, skip-link, aria-labels, `og:locale` value) keyed by `it` / `en`.
- `src/i18n/utils.ts`:
  - `getLangFromUrl(url: URL): 'it' | 'en'` — reads the `/en` prefix.
  - `useTranslations(lang)` — returns a `t(key)` lookup into `ui.ts`.
  - `getLocalizedPath(lang, pathname)` — given the current pathname and a target lang, returns the equivalent path in that lang (adds/strips `/en`).

## Navbar language switcher

- New `LangSwitch.astro` component, rendered inside `Nav.astro`.
- Shows both flags (🇮🇹 IT / 🇬🇧 EN); the active language is visually marked (e.g. bold/underlined), the other is a link.
- Target href computed with `getLocalizedPath(otherLang, Astro.url.pathname)`.
- For dynamic content pages (`industries/[slug]`, `case-studies/[slug]`), the switch assumes the same slug exists in both locale's content — this is a stated assumption, not auto-detected.

`Nav.astro`, `Footer.astro`, `BaseLayout.astro` become lang-aware:
- Read `Astro.currentLocale` (fallback to `'it'`).
- Pull labels from `ui.ts` instead of hardcoded Italian strings.
- `BaseLayout`: `<html lang={lang}>`, `og:locale` set to `it_IT` or `en_US`, adds reciprocal `<link rel="alternate" hreflang="...">` tags pointing at the IT and EN versions of the current page.
- Internal links inside these three files (nav items, footer columns, CTA) are built through `getLocalizedPath` so an EN page's nav points to `/en/...` targets.

## Page template pattern

For each existing page, copy is extracted into a `copy` object with `it`/`en` variants; the markup/logic that doesn't change between languages stays in one place.

Two concrete shapes depending on complexity:
- **Static pages with no logic** (404, privacy-policy, cookies-policy): the whole page becomes `{ it: {...}, en: {...} }` text passed to the existing template inline — no separate component needed, just duplicate the thin page file and swap the text block.
- **Pages with real structure/loops** (index, pricing, demo, platform/*, case-studies/index): the current `.astro` file's template becomes a shared component (e.g. `src/pages/index.astro` template logic moves into `src/components/pages/Home.astro` taking `lang` + `copy` props); `src/pages/index.astro` and `src/pages/en/index.astro` become thin wrappers that import `Home.astro` and pass their respective copy object.

Files in scope (root = existing IT file, mirrored EN file created under `en/`):
- `index.astro`
- `pricing.astro`
- `demo.astro` (includes `ContactForm.astro`: field labels, select options, consent text, validation messages, and status messages become lang-aware via props from the page)
- `404.astro`
- `privacy-policy.astro` + `cookies-policy.astro` (and `LegalLayout.astro` wrapper)
- `platform/asset-management.astro`, `platform/maintenance-operations.astro`, `platform/technical-documentation.astro`, `platform/asset-analytics.astro`
- `case-studies/index.astro`

Components that receive copy as props (`Section`, `SectionHeading`, `ModuleCard`, `Testimonial`, `CtaBand`, `Faq`, `CaseStudyCard`, `FeatureCard`, `FeatureSplit`, `PlatformHero`) need no internal changes — they already take text via props; only the callers (pages) change.

## Content collections (MDX)

- `src/content/industries/*.mdx` (3 files) and `src/content/case-studies/*.mdx` (6 files) move into locale subfolders: `src/content/industries/it/*.mdx` + `src/content/industries/en/*.mdx`, same pattern for case-studies.
- Same filename/slug used in both locale folders for a given entry.
- `src/content.config.ts` defines four collections (`industriesIt`, `industriesEn`, `caseStudiesIt`, `caseStudiesEn`), each a `glob` loader pointed at its own locale subfolder. Keeps each `[slug].astro`'s `getStaticPaths` a plain single-collection query.
- `src/pages/industries/[slug].astro` filters the `it` subset; `src/pages/en/industries/[slug].astro` (new) filters the `en` subset. Same split for `case-studies/[slug].astro`.

## Out of scope

- No sitemap.xml changes (none exists today).
- No language auto-detection (browser `Accept-Language` / geo redirect) — manual switcher only.
- No third language, no locale-based currency/date formatting beyond the copy text itself.
- Translated slugs (e.g. `/en/industries/manufacturing` keeping the English word) are NOT pursued — same slug in both locales, only the page content differs.

## Testing / verification

- `npm run build` succeeds with no broken links (Astro's static build fails on unresolved internal links if `build.assets` checks are on — verify manually otherwise via a link crawl of the two homepages).
- Manual check in browser preview: toggle flag on home, pricing, one platform page, one industry page, one case study — confirm URL swaps to/from `/en/...` and copy changes language, nav/footer relink correctly.
- Confirm IT root URLs are byte-identical in behavior to before (no accidental regression from the refactor into shared templates).
