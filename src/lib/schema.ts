/** Typed JSON-LD (schema.org) builders. Rendered via components/JsonLd.astro. */
import { company } from '../config/site';

export const SITE_URL = 'https://openeam.it';

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');

/** Absolute URL with trailing slash, matching the site's canonical/hreflang format (Astro `build.format: "directory"`). */
const absUrl = (path: string) => `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`;

/** Site-wide Organization schema. Rendered globally by BaseLayout.
 * `extra` merges in page-specific additions (e.g. `employee` on the Azienda page)
 * without producing a second, duplicate Organization node on that page. */
export function organizationSchema(extra: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    alternateName: 'OpenEAM',
    url: absUrl(''),
    logo: `${SITE_URL}/webclip.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Barletta 9',
      postalCode: '95125',
      addressLocality: 'Catania',
      addressCountry: 'IT',
    },
    vatID: '05728230870',
    sameAs: [
      'https://www.instagram.com/openeam_seedma/',
      'https://www.linkedin.com/search/results/all/?keywords=OpenEAM&origin=RICH_QUERY_SUGGESTION&heroEntityKey=urn%3Ali%3Aorganization%3A104333450&position=0',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: company.contactEmail,
      contactType: 'customer support',
    },
    ...extra,
  };
}

export function faqPageSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: stripTags(f.q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
    })),
  };
}

export function breadcrumbSchema(items: readonly { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  };
}

export function softwareApplicationSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    brand: { '@type': 'Brand', name: company.name },
    url: absUrl(opts.url),
  };
}

export function articleSchema(opts: { headline: string; description: string; url: string; clientName: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: absUrl(opts.url),
    about: { '@type': 'Organization', name: opts.clientName },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/webclip.png` },
    },
  };
}
