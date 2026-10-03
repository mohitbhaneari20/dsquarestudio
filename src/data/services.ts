import type { Motif } from './types';

export interface Service {
  slug: string;
  title: string;
  /** One-liner used on the homepage rows */
  short: string;
  description: string;
  included: string[];
  deliverables: string[];
  /** Slugs from projects.ts */
  relatedProjects: string[];
  motif: Motif;
}

export const services: Service[] = [
  {
    slug: 'branding-design-systems',
    title: 'Branding & Design Systems',
    short: 'Identities people recognise, and the systems that keep them consistent.',
    description:
      'An identity is a set of decisions people can recognise. We design the logo, but mostly the system around it — type, colour, components and tokens — so the brand holds up everywhere, from a business card to a product interface.',
    included: ['Positioning workshop', 'Logo & wordmark', 'Typography & colour', 'Design tokens', 'Component library', 'Usage guidelines'],
    deliverables: ['Logo suite', 'Brand guidelines', 'Figma library', 'Token files', 'Templates'],
    relatedProjects: ['rawset'],
    motif: 'type',
  },
  {
    slug: 'ui-ux-web-design',
    title: 'UI / UX & Web Design',
    short: 'Interfaces and websites that are easy to understand and enjoyable to use.',
    description:
      'We start with what people are trying to do, then design the shortest, clearest way to do it — for apps, products and websites, at every screen size. Pretty comes after useful, but it does come.',
    included: ['User flows', 'Wireframes', 'Interface design', 'Responsive web design', 'Interactive prototypes', 'Usability checks'],
    deliverables: ['Figma files', 'Clickable prototype', 'Responsive layouts', 'Annotated handoff'],
    relatedProjects: ['falance', 'dsquare-studio'],
    motif: 'interface',
  },
  {
    slug: 'web-development',
    title: 'Web & No-code Development',
    short: 'Designs turned into fast, responsive websites — in code or no-code.',
    description:
      'Hand-coded front ends when the project needs it; Webflow, Framer and similar tools when that’s the better fit. Either way, built properly, with clean structure and a CMS you can actually update yourself.',
    included: ['Front-end development', 'Webflow / Framer builds', 'CMS setup', 'Interactions', 'SEO basics', 'Performance & accessibility'],
    deliverables: ['Live website', 'Source code or CMS', 'Editing guide', 'Deployment'],
    relatedProjects: ['dsquare-studio', 'rawset'],
    motif: 'lines',
  },
  {
    slug: 'motion-graphic-design',
    title: 'Motion & Graphic Design',
    short: 'Logos, decks, packaging and motion — designed to be noticed and understood.',
    description:
      'The everyday pieces a brand lives on, still and moving: a logo that works small and large, a deck that makes the point in fewer slides, packaging that stands out on the shelf, and motion that explains, guides and adds personality.',
    included: ['Logo design', 'Presentation & pitch decks', 'Packaging & labels', 'Print & social graphics', 'Interface motion', 'Logo animation & explainers'],
    deliverables: ['Logo files (SVG, PNG, PDF)', 'Editable deck templates', 'Print-ready artwork', 'Lottie / video files'],
    relatedProjects: ['rawset'],
    motif: 'orbit',
  },
  {
    slug: 'digital-experiences',
    title: 'Digital Experiences',
    short: 'Products and experiences that work across every screen people use.',
    description:
      'From a launch microsite to a full product — the idea, the design and the build in one place, connected across phone, tablet and desktop so the experience feels like one thing wherever people meet it.',
    included: ['Product strategy', 'Experience design', 'Cross-device design', 'Prototyping', 'Build & launch'],
    deliverables: ['Working product', 'Design & code source', 'Launch plan'],
    relatedProjects: ['falance', 'dsquare-studio'],
    motif: 'mobile',
  },
];

export interface ProcessStep {
  title: string;
  body: string;
  /** Meme for this step's card, e.g. '/assets/studio/meme-understand.webp'. Leave out for the placeholder. */
  meme?: string;
  /** Shown in the placeholder until a meme is added — a suggestion for what to use. */
  memeIdea: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Understand',
    body: 'Questions before pixels. What is this for, who is it for, and what does good look like?',
    memeIdea: 'The ‘but why?’ face — asking questions before pixels',
  },
  {
    title: 'Explore',
    body: 'Several directions, sketched quickly. Bad ideas get thrown out early, while they’re still cheap.',
    memeIdea: 'Distracted boyfriend — us, glancing at idea number six',
  },
  {
    title: 'Design',
    body: 'One direction, taken all the way. Real content, real sizes, real states.',
    memeIdea: 'Two buttons, sweating — 12px or 13px?',
  },
  {
    title: 'Build',
    body: 'Designs become working things. Because we build too, nothing gets lost in handoff.',
    memeIdea: '‘It works on my machine’',
  },
  {
    title: 'Refine',
    body: 'Test, adjust, test again. Launch is a checkpoint, not the end.',
    memeIdea: 'Drake — ‘ship it’ ✗ / ‘test it once more’ ✓',
  },
];
