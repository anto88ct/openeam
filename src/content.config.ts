import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Feature card as shown on Industry pages (title may contain <span class="hl">). */
const featureCard = z.object({
  title: z.string(),
  body: z.string(),
  icon: z
    .enum(['gear', 'wrench', 'document', 'chart', 'jack', 'lens', 'labyrinth', 'chart-2'])
    .default('gear'),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/industries' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      order: z.number().default(0),
      heroImage: image(),
      /** background of the intro band under the hero */
      introTone: z.enum(['light', 'teal', 'ink']).default('light'),
      eyebrow: z.string().optional(),
      intro: z.string(),
      /** background/lens for the feature-card grid */
      cardTone: z.enum(['light', 'teal', 'ink']).default('light'),
      cards: z.array(featureCard),
      /** slugs from the case-studies collection to feature in the closing band */
      caseStudies: z.array(z.string()).default([]),
      seoDescription: z.string().optional(),
    }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      industry: z.string(),
      order: z.number().default(0),
      heroImage: image(),
      /** short blurb used on cards/grids */
      excerpt: z.string(),
      sector: z.enum(['manufacturing', 'oil-and-gas', 'large-scale-facilities']).optional(),
      metrics: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .default([]),
      modules: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      seoDescription: z.string().optional(),
    }),
});

export const collections = { industries, caseStudies };
