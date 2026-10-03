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
    slug: 'ui-ux-design',
    title: 'UI / UX Design',
    short: 'Interfaces that are easy to understand and enjoyable to use.',
    description:
      'We start with what people are trying to do, then design the shortest, clearest way to do it. Pretty comes after useful — but it does come.',
    included: ['User flows', 'Wireframes', 'Interface design', 'Interactive prototypes', 'Usability checks'],
    deliverables: ['Figma files', 'Clickable prototype', 'Annotated handoff'],
    relatedProjects: ['project-three', 'dsquare-studio'],
    motif: 'interface',
  },
  {
    slug: 'branding',
    title: 'Branding',
    short: 'Visual identities that create recognition and consistency.',
    description:
      'An identity is a set of decisions people can recognise. We design the logo, but mostly we design the system around it so it holds up everywhere.',
    included: ['Positioning workshop', 'Logo & wordmark', 'Typography & colour', 'Brand applications'],
    deliverables: ['Logo suite', 'Brand guidelines', 'Templates', 'Source files'],
    relatedProjects: ['rawset', 'project-four'],
    motif: 'type',
  },
  {
    slug: 'design-systems',
    title: 'Design Systems',
    short: 'Reusable visual and interface systems that keep products consistent.',
    description:
      'Components, tokens and rules that let a product grow without falling apart — designed to be used by designers and developers alike.',
    included: ['Audit of existing UI', 'Design tokens', 'Component library', 'Usage guidelines'],
    deliverables: ['Figma library', 'Token files', 'Documentation'],
    relatedProjects: ['project-three'],
    motif: 'grid',
  },
  {
    slug: 'motion-design',
    title: 'Motion Design',
    short: 'Motion that communicates, explains and adds personality.',
    description:
      'Movement with a reason: transitions that explain where you are, animations that show how something works, and the occasional detail that just feels good.',
    included: ['Interface motion', 'Logo animation', 'Product explainers', 'Social assets'],
    deliverables: ['Motion specs', 'Lottie / video files', 'Animated prototypes'],
    relatedProjects: ['project-six'],
    motif: 'orbit',
  },
  {
    slug: 'no-code-development',
    title: 'No-code Development',
    short: 'Turning designs into responsive, functional websites.',
    description:
      'Webflow, Framer and similar tools — built properly, with clean structure and a CMS you can actually update yourself.',
    included: ['Responsive build', 'CMS setup', 'Interactions', 'SEO basics', 'Handover session'],
    deliverables: ['Live website', 'CMS collections', 'Editing guide'],
    relatedProjects: ['project-five'],
    motif: 'lines',
  },
  {
    slug: 'digital-experiences',
    title: 'Websites & Digital Experiences',
    short: 'Websites and digital products designed around real user needs.',
    description:
      'From a studio portfolio to a product launch — designed and coded in-house, so the idea survives all the way to the browser.',
    included: ['Content structure', 'Design', 'Front-end development', 'Performance & accessibility'],
    deliverables: ['Production website', 'Source code', 'Deployment'],
    relatedProjects: ['dsquare-studio', 'project-five', 'rawset'],
    motif: 'interface',
  },
];

export interface ProcessStep {
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Understand',
    body: 'Questions before pixels. What is this for, who is it for, and what does good look like?',
  },
  {
    title: 'Explore',
    body: 'Several directions, sketched quickly. Bad ideas get thrown out early, while they’re still cheap.',
  },
  {
    title: 'Design',
    body: 'One direction, taken all the way. Real content, real sizes, real states.',
  },
  {
    title: 'Build',
    body: 'Designs become working things. Because we build too, nothing gets lost in handoff.',
  },
  {
    title: 'Refine',
    body: 'Test, adjust, test again. Launch is a checkpoint, not the end.',
  },
];
