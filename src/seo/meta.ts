/**
 * SEO for every route, in one place.
 *
 * Used twice:
 *  - at build time (vite.config.ts → prerender) to write a real HTML file per route with
 *    the right title, description, canonical, Open Graph / Twitter tags and JSON-LD, so
 *    crawlers see them without running JavaScript, plus sitemap.xml and 404.html;
 *  - in the browser by <Seo />, which keeps the head in sync on client-side navigation.
 *
 * Plain data and string helpers only — no React, no DOM — so it runs in Node too.
 */
import { site } from '../config/site';
import { ongoingProjects, projects } from '../data/projects';
import type { Project } from '../data/types';

/** The preferred domain: https, www, no trailing slash except the homepage. */
export const ORIGIN = 'https://www.dsquare.studio';
const DEFAULT_IMAGE = '/og-image.png';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** Path or absolute URL of a 1200 × 630 social image */
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  noIndex?: boolean;
  /** Main heading and short copy for the no-JavaScript fallback */
  h1: string;
  /** Extra JSON-LD for this page (the organisation and website graph is always added) */
  jsonLd?: Record<string, unknown>[];
  /** Sitemap hints */
  priority?: number;
  changefreq?: 'weekly' | 'monthly' | 'yearly';
}

export const absolute = (pathOrUrl: string) => (pathOrUrl.startsWith('http') ? pathOrUrl : `${ORIGIN}${pathOrUrl}`);
export const canonicalFor = (path: string) => (path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path.replace(/\/+$/, '')}`);

const ORG_ID = `${ORIGIN}/#organization`;

/** Who Dsquare Studio is — only facts that appear on the site. */
export function siteGraph(): Record<string, unknown>[] {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: site.name,
      url: `${ORIGIN}/`,
      logo: absolute('/brand/monogram.png'),
      image: absolute(DEFAULT_IMAGE),
      description: 'Independent design and development studio creating brands, digital products, websites and digital experiences.',
      email: site.email,
      founder: { '@type': 'Person', name: 'Mohit Bhandari', jobTitle: 'Design partner' },
      sameAs: site.socials.map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: site.name,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en',
    },
  ];
}

function caseStudyLd(p: Project, path: string, image: string, description: string): Record<string, unknown> {
  const agency = p.credit;
  return {
    '@type': 'CreativeWork',
    '@id': `${canonicalFor(path)}#work`,
    name: p.title,
    headline: p.seo?.title ?? p.title,
    description,
    url: canonicalFor(path),
    image: absolute(image),
    ...(p.year ? { dateCreated: p.year } : {}),
    genre: p.discipline,
    keywords: p.categories.join(', '),
    // Agency work is credited to the designer, not claimed by the studio
    creator: agency ? { '@type': 'Person', name: 'Mohit Bhandari', jobTitle: agency.role } : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(p.website ? { sameAs: p.website } : {}),
    ...(p.status === 'Ongoing' ? { creativeWorkStatus: 'In progress' } : {}),
  };
}

/** Pages that exist on the site, in sitemap order. */
const STATIC: RouteMeta[] = [
  {
    path: '/',
    title: 'Dsquare Studio — Design & Development Studio',
    description:
      'Dsquare Studio is an independent design and development studio creating brands, digital products, websites and experiences that solve real problems.',
    image: DEFAULT_IMAGE,
    imageAlt: 'Dsquare Studio logo — design and development studio',
    type: 'website',
    h1: 'Dsquare Studio — an independent design and development studio',
    priority: 1,
    changefreq: 'monthly',
  },
  {
    path: '/services',
    title: 'Design & Development Services — Dsquare Studio',
    description:
      'Explore Dsquare Studio’s design and development services, from UI/UX and branding to websites, digital products and no-code development.',
    image: DEFAULT_IMAGE,
    imageAlt: 'Dsquare Studio — design and development services',
    type: 'website',
    h1: 'What we can build together',
    priority: 0.9,
    changefreq: 'monthly',
  },
  {
    path: '/work',
    title: 'Selected Work — Dsquare Studio',
    description: 'Explore selected branding, UI/UX, web design and digital product projects created by Dsquare Studio.',
    image: DEFAULT_IMAGE,
    imageAlt: 'Selected work by Dsquare Studio',
    type: 'website',
    h1: 'Things we’ve made',
    priority: 0.9,
    changefreq: 'monthly',
  },
  {
    path: '/studio',
    title: 'About Dsquare Studio — Design & Development Studio',
    description:
      'Learn about Dsquare Studio, an independent design and development studio focused on thoughtful design, digital experiences and purposeful development.',
    image: DEFAULT_IMAGE,
    imageAlt: 'About Dsquare Studio',
    type: 'website',
    h1: 'Dsquare is a small studio with a big interest in making things better',
    priority: 0.8,
    changefreq: 'yearly',
  },
  {
    path: '/ongoing',
    title: 'Ongoing Projects & Studio Log — Dsquare Studio',
    description:
      'Projects Dsquare Studio is currently researching, designing and building — shared openly as a live studio log, from first idea to launch.',
    image: DEFAULT_IMAGE,
    imageAlt: 'Ongoing projects at Dsquare Studio',
    type: 'website',
    h1: 'Currently building',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/gallery',
    title: 'Gallery — Personal Artwork by Mohit Bhandari | Dsquare Studio',
    description:
      'Personal digital collages by Mohit Bhandari, the designer behind Dsquare Studio — work made outside client briefs, for no reason but the making.',
    image: '/og/gallery.jpg',
    imageAlt: 'Three digital collages from the Dsquare Studio gallery',
    type: 'website',
    h1: 'Gallery',
    priority: 0.5,
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    title: 'Contact Dsquare Studio — Start a Project',
    description:
      'Have a design, branding, website or digital product project? Get in touch with Dsquare Studio to discuss your next project.',
    image: DEFAULT_IMAGE,
    imageAlt: 'Start a project with Dsquare Studio',
    type: 'website',
    h1: 'Let’s make something',
    priority: 0.8,
    changefreq: 'yearly',
  },
];

function projectMeta(p: Project): RouteMeta {
  const ongoing = p.status === 'Ongoing';
  const path = ongoing ? `/ongoing/${p.slug}` : `/work/${p.slug}`;
  const title = p.seo?.title ?? `${p.title} — ${p.discipline}${ongoing ? ' (In Progress)' : ' Case Study'} | ${site.name}`;
  const description = p.seo?.description ?? p.summary;
  const image = `/og/${p.slug}.jpg`;
  return {
    path,
    title,
    description,
    image,
    imageAlt: p.heroImage.alt,
    type: 'article',
    h1: p.title,
    priority: 0.7,
    changefreq: ongoing ? 'weekly' : 'yearly',
    jsonLd: [caseStudyLd(p, path, image, description)],
  };
}

export const NOT_FOUND: RouteMeta = {
  path: '/404',
  title: `Page not found — ${site.name}`,
  description: 'This page doesn’t exist. Head back to the Dsquare Studio homepage, our work or get in touch.',
  image: DEFAULT_IMAGE,
  imageAlt: 'Dsquare Studio',
  type: 'website',
  noIndex: true,
  h1: 'Page not found',
};

/** Every indexable route on the site. Hidden projects are left out. */
export function allRoutes(): RouteMeta[] {
  const completed = projects.filter((p) => p.status === 'Completed');
  return [...STATIC, ...completed.map(projectMeta), ...ongoingProjects.map(projectMeta)];
}

/** Metadata for a pathname; unknown paths get the not-found page. */
export function metaFor(pathname: string): RouteMeta {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return allRoutes().find((r) => r.path === clean) ?? NOT_FOUND;
}

/** Full JSON-LD document for a route. */
export function jsonLdFor(meta: RouteMeta) {
  return { '@context': 'https://schema.org', '@graph': [...siteGraph(), ...(meta.jsonLd ?? [])] };
}

/** Main navigation, repeated in the no-JavaScript fallback so every page links onward. */
export const FALLBACK_LINKS = [
  { href: '/', label: 'Dsquare Studio home' },
  { href: '/work', label: 'Selected work' },
  { href: '/services', label: 'Design and development services' },
  { href: '/studio', label: 'About Dsquare Studio' },
  { href: '/ongoing', label: 'Ongoing projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Start a project' },
];
