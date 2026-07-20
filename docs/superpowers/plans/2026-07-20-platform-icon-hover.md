# Platform Icon Hover Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On hover of any of the 4 platform-showcase cards on the home page, animate that card's icon with a motion matching its meaning (gear rotates, wrench swings, document lifts, chart pops).

**Architecture:** CSS-only. No JS, no new files, no inline-SVG conversion. Add an `iconName` prop to `PlatformShowcaseCard.astro` that maps to a CSS class on the icon wrapper; add `@keyframes`/transitions scoped under `.psc:hover .psc__icon--<name> img`; wrap in `prefers-reduced-motion: no-preference`.

**Tech Stack:** Astro 5 component (`.astro` scoped `<style>`), plain CSS (no Tailwind needed for this — file doesn't use Tailwind classes today).

## Global Constraints

- No inline SVG (per spec: icons stay `<Image>` from astro:assets).
- Trigger is the whole card (`.psc:hover`), not the icon alone.
- Must respect `prefers-reduced-motion: reduce` (no animation).
- Static site, no test runner in this repo — verification is manual via `npm run dev` + browser hover + DevTools reduced-motion emulation.

---

### Task 1: Add per-icon hover animation

**Files:**
- Modify: `src/components/PlatformShowcaseCard.astro:6-33` (props + markup), `:78-83` (styles)
- Modify: `src/components/pages/Home.astro:371-396` (`platformGridItems` array)

**Interfaces:**
- `PlatformShowcaseCard.astro` gains prop `iconName: "gear" | "wrench" | "document" | "chart"`.
- `platformGridItems` entries in `Home.astro` each gain `iconName: "gear" | "wrench" | "document" | "chart"` matching their existing `icon` import.

- [ ] **Step 1: Add `iconName` prop to `PlatformShowcaseCard.astro`**

In `src/components/PlatformShowcaseCard.astro`, update the `Props` interface and destructure (lines 6-16):

```astro
interface Props {
  icon: ImageMetadata;
  iconName: "gear" | "wrench" | "document" | "chart";
  image: ImageMetadata;
  imageAlt: string;
  heading: string;
  tagline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}
const { icon, iconName, image, imageAlt, heading, tagline, body, ctaLabel, ctaHref } = Astro.props;
```

- [ ] **Step 2: Apply the class in the markup**

Update line 26 (the icon span) to include the per-icon class:

```astro
      <span class={`psc__icon psc__icon--${iconName}`}><Image src={icon} alt="" width={28} height={28} /></span>
```

- [ ] **Step 3: Add hover animation CSS**

In the same file's `<style>` block, replace the existing `.psc__icon :global(img)` rule (currently line 83) with:

```css
  .psc__icon :global(img) {
    width: 26px;
    height: 26px;
    object-fit: contain;
    transform-origin: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    .psc:hover .psc__icon--gear :global(img) {
      animation: psc-spin 1.1s linear infinite;
    }
    .psc:hover .psc__icon--wrench :global(img) {
      animation: psc-wiggle 0.5s ease-in-out infinite;
    }
    .psc:hover .psc__icon--document :global(img) {
      transform: translateY(-3px) rotate(3deg);
      transition: transform 0.25s ease-out;
    }
    .psc:hover .psc__icon--chart :global(img) {
      transform: scale(1.12) translateY(-2px);
      transition: transform 0.25s ease-out;
    }
  }

  @keyframes psc-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes psc-wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
  }
```

Note: `document` and `chart` rules need a base (non-hover) `transition` too so they animate back out on mouse-leave — add `transition: transform 0.25s ease-out;` to the base `.psc__icon :global(img)` rule from Step 3 above (already included there via the shared base rule; the hover rules only need `transform`). Revise Step 3's base rule to:

```css
  .psc__icon :global(img) {
    width: 26px;
    height: 26px;
    object-fit: contain;
    transform-origin: center;
    transition: transform 0.25s ease-out;
  }
```

(then the hover blocks for `document`/`chart` only need the `transform` line, no repeated `transition`).

- [ ] **Step 4: Wire `iconName` into `Home.astro`**

In `src/components/pages/Home.astro`, update `platformGridItems` (lines 371-396) to add `iconName` matching each `icon`:

```ts
const platformGridItems = [
  {
    icon: iconGear,
    iconName: "gear",
    image: featAsset,
    href: l("/platform/asset-management"),
    ...t.platformGrid[0],
  },
  {
    icon: iconWrench,
    iconName: "wrench",
    image: workerIndustry,
    href: l("/platform/maintenance-operations"),
    ...t.platformGrid[1],
  },
  {
    icon: iconDocument,
    iconName: "document",
    image: featDoc,
    href: l("/platform/technical-documentation"),
    ...t.platformGrid[2],
  },
  {
    icon: iconChart,
    iconName: "chart",
    image: featAnalytics,
    href: l("/platform/asset-analytics"),
    ...t.platformGrid[3],
  },
];
```

- [ ] **Step 5: Pass `iconName` at the call site**

In the same file, where `platformGridItems.map` renders `<PlatformShowcaseCard>` (around line 454-465), add the `iconName` prop:

```astro
        platformGridItems.map((m) => (
          <PlatformShowcaseCard
            icon={m.icon}
            iconName={m.iconName}
            image={m.image}
            imageAlt={m.heading}
            heading={m.heading}
            tagline={m.tagline}
            body={m.body}
            ctaLabel={t.discoverCta}
            ctaHref={m.href}
          />
        ))
```

- [ ] **Step 6: Manual verification**

Run: `npm run dev`

Open the home page in a browser, scroll to the platform-showcase section (4 cards: Asset Management, Maintenance & Operations, Technical Documentation, Asset Analytics).

Expected:
- Hover "Asset Management" card → gear icon spins continuously while hovered, stops on mouse-leave.
- Hover "Maintenance & Operations" card → wrench icon wiggles while hovered.
- Hover "Technical Documentation" card → document icon lifts/tilts, eases back on mouse-leave.
- Hover "Asset Analytics" card → chart icon scales up slightly, eases back on mouse-leave.

Then in DevTools, emulate `prefers-reduced-motion: reduce` (Rendering tab → Emulate CSS media feature) and re-hover all 4 cards. Expected: no icon movement at all.

- [ ] **Step 7: Commit**

```bash
git add src/components/PlatformShowcaseCard.astro src/components/pages/Home.astro
git commit -m "feat: animate platform-grid icons on card hover"
```
