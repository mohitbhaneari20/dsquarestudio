import type { Testimonial } from './types';

export type { Testimonial };

export interface ClientLogo {
  name: string;
  /** Logo with a transparent background — shown in one flat colour (the shape is used as a mask) */
  logo?: string;
  /** Logo aspect (width / height), so every mark sits at the same visual height */
  ratio?: number;
  /** Written next to the mark, for logos that are only a symbol */
  wordmark?: string;
  /** Links the logo to its case study */
  slug?: string;
}

/**
 * "Trusted by" strip. Only list brands you have actually worked with.
 * Add a logo as a transparent PNG / WebP / SVG in /public/assets/clients/.
 */
export const clients: ClientLogo[] = [
  { name: 'RAWSET', logo: '/assets/projects/rawset/logo-wordmark-black.webp', ratio: 1569 / 465, slug: 'rawset' },
  { name: 'Falance', logo: '/assets/projects/falance/mark.svg', ratio: 126 / 165, wordmark: 'Falance', slug: 'falance' },
];


/**
 * Extra client words, exactly as they were given. Never invent or polish a quote.
 * Quotes attached to a project (project.testimonial) are added automatically —
 * see `allTestimonials` in data/projects.ts.
 */
export const testimonials: Testimonial[] = [];
