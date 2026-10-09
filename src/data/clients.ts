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
  /** The brand's own colour — the logo turns this colour on hover */
  color?: string;
  /** Tile colour on hover, for brands whose colour needs its own ground (e.g. RAWSET's yellow on black) */
  hoverBg?: string;
}

/**
 * "Brands we've built" strip on the homepage. Only real brands Dsquare has made or worked on.
 * Add a logo as a transparent PNG / WebP / SVG in /public/assets/clients/.
 */
export const clients: ClientLogo[] = [
  { name: 'RAWSET', logo: '/assets/projects/rawset/logo-wordmark-black.webp', ratio: 1569 / 465, slug: 'rawset', color: '#FEEF24', hoverBg: '#000000' },
  { name: 'Falance', logo: '/assets/projects/falance/mark.svg', ratio: 126 / 165, wordmark: 'Falance', slug: 'falance', color: '#588157' },
  { name: 'MAKVO', logo: '/assets/clients/makvo.png', ratio: 800 / 154, slug: 'makvo', color: '#001F3F', hoverBg: '#DBE64C' },
  { name: 'Whistle', logo: '/assets/clients/whistle.png', ratio: 781 / 216, slug: 'whistle', color: '#4A19E4' },
];


/**
 * Extra client words, exactly as they were given. Never invent or polish a quote.
 * Quotes attached to a project (project.testimonial) are added automatically —
 * see `allTestimonials` in data/projects.ts.
 */
export const testimonials: Testimonial[] = [];
