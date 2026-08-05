import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Sector page feature-grid card (title/body only — image comes from the entry's featureImages array, one per card). */
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
    featureImages: z.array(image()).length(6),
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
