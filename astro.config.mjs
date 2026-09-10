// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Static output (SSG) — deploys as plain files behind IIS (see public/web.config).
export default defineConfig({
  site: 'https://openeam.it',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it', en: 'en' },
      },
    }),
  ],
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Optimize local assets at build time (sharp). No remote sources needed.
    responsiveStyles: true,
  },
});
