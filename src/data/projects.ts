import type { MediaAsset, Project } from './types';

/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS
 *  The single source of truth for every project on the site.
 *
 *  • Order here = order on the site.
 *  • Real images go in /public/assets/projects/<slug>/ and are
 *    referenced as '/assets/projects/<slug>/<file>'. Any MediaAsset
 *    without `src` renders a neutral placeholder instead.
 *  • `placeholder: true` marks dummy projects (shown with a small tag).
 *  • Dsquare copy is a first draft — edit freely.
 * ─────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: 'rawset',
    title: 'RAWSET',
    client: 'Self-initiated',
    year: '2026',
    categories: ['Branding', 'Web', 'Development'],
    discipline: 'Brand Identity / E-commerce',
    type: 'Self-initiated',
    status: 'Ongoing',
    summary: 'A limited-run streetwear label — identity, campaign and storefront, designed and built in-house.',
    description:
      'RAWSET is a limited-run streetwear label: made raw, worn different. We are building the whole thing ourselves — the pixel identity, the poster campaign and the Drop 01 storefront — so the brand gets tested in the store as it is designed, not after.',
    tone: { bg: '#141413', ink: '#F2F1EE', accent: '#E4FF3A' },
    thumbnail: { src: '/assets/projects/rawset/site-desktop-home.webp', alt: 'RAWSET website — Winter Arc homepage', kind: 'desktop' },
    heroImage: { src: '/assets/projects/rawset/site-desktop-drop-hero.webp', alt: 'RAWSET website — Drop 01 mosaic hero', kind: 'hero' },
    // Project page cover: the wordmark, small and centred on Rawset yellow
    pageCover: {
      src: '/assets/projects/rawset/logo-wordmark-black.webp',
      alt: 'RAWSET wordmark on Rawset yellow',
      background: '#FEEF24',
      size: 'clamp(9rem, 18%, 17rem)',
    },
    // Homepage card: the star monogram in its construction geometry, in Rawset yellow
    cover: { type: 'logo-construction', src: '/assets/projects/rawset/logo-monogram.webp', alt: 'RAWSET star monogram', color: '#FEEF24' },
    gallery: [
      // Website — desktop
      {
        layout: 'browser',
        url: 'index.html',
        media: { src: '/assets/projects/rawset/site-desktop-home.webp', alt: 'Homepage — Winter Arc, North Star hoodie', kind: 'desktop' },
      },
      // Website — mobile
      {
        layout: 'phones',
        caption: 'The store on mobile',
        media: [
          { src: '/assets/projects/rawset/site-mobile-home.webp', alt: 'Home', kind: 'mobile' },
          { src: '/assets/projects/rawset/site-mobile-drop-hero.webp', alt: 'Drop 01', kind: 'mobile' },
          { src: '/assets/projects/rawset/site-mobile-shop.webp', alt: 'Shop', kind: 'mobile' },
          { src: '/assets/projects/rawset/site-mobile-manifesto.webp', alt: 'Manifesto', kind: 'mobile' },
        ],
      },
      {
        layout: 'browser',
        url: 'index.html#drop',
        media: { src: '/assets/projects/rawset/site-desktop-drop-hero.webp', alt: 'Drop 01 — the pixel mosaic hero', kind: 'desktop' },
      },
      { layout: 'statement', text: 'Unfinished, on purpose.' },
      {
        layout: 'browser',
        url: 'index.html#products',
        media: { src: '/assets/projects/rawset/site-desktop-shop.webp', alt: 'Shop — Drop 01 product grid', kind: 'desktop' },
      },
      // Campaign + print
      {
        layout: 'strip',
        ratio: '9 / 16',
        caption: 'Poster mockups — Drop 01 campaign',
        media: [
          { src: '/assets/projects/rawset/mockup-poster-01.webp', alt: 'Poster mockup — 2026, this isn’t for everyone', kind: 'mockup' },
          { src: '/assets/projects/rawset/mockup-poster-02.webp', alt: 'Poster mockup — If you know, you know', kind: 'mockup' },
          { src: '/assets/projects/rawset/mockup-poster-03.webp', alt: 'Poster mockup — Made for those who know', kind: 'mockup' },
          { src: '/assets/projects/rawset/mockup-poster-04.webp', alt: 'Poster mockup — Never played the same game', kind: 'mockup' },
          { src: '/assets/projects/rawset/mockup-poster-05.webp', alt: 'Poster mockup — You see it, we live it', kind: 'mockup' },
        ],
      },
      {
        layout: 'browser',
        url: 'index.html#manifesto',
        media: { src: '/assets/projects/rawset/site-desktop-manifesto.webp', alt: 'Manifesto — the street already knew', kind: 'desktop' },
      },
      {
        layout: 'strip',
        ratio: '3 / 4',
        caption: 'Campaign posters',
        media: [
          { src: '/assets/projects/rawset/poster-if-you-know.webp', alt: 'If you know, you know', kind: 'poster' },
          { src: '/assets/projects/rawset/poster-never-played.webp', alt: 'Never played the same game', kind: 'poster' },
          { src: '/assets/projects/rawset/poster-you-see-it.webp', alt: 'You see it, we live it', kind: 'poster' },
          { src: '/assets/projects/rawset/poster-made-for.webp', alt: 'Made for those who know', kind: 'poster' },
          { src: '/assets/projects/rawset/poster-street-knew.webp', alt: 'The street already knew', kind: 'poster' },
          { src: '/assets/projects/rawset/poster-2026.webp', alt: '2026 — this isn’t for everyone', kind: 'poster' },
        ],
      },
      {
        layout: 'phones',
        media: [
          { src: '/assets/projects/rawset/site-mobile-lookbook.webp', alt: 'Lookbook', kind: 'mobile' },
          { src: '/assets/projects/rawset/site-mobile-join.webp', alt: 'Early access + footer', kind: 'mobile' },
        ],
      },
      {
        layout: 'browser',
        url: 'index.html#lookbook',
        media: { src: '/assets/projects/rawset/site-desktop-lookbook.webp', alt: 'Lookbook', kind: 'desktop' },
      },
      {
        layout: 'strip',
        ratio: '4 / 5',
        caption: 'Lookbook — Drop 01',
        media: [
          { src: '/assets/projects/rawset/lookbook-01.webp', alt: 'Lookbook 01', kind: 'photo' },
          { src: '/assets/projects/rawset/lookbook-02.webp', alt: 'Lookbook 02', kind: 'photo' },
          { src: '/assets/projects/rawset/lookbook-03.webp', alt: 'Lookbook 03', kind: 'photo' },
          { src: '/assets/projects/rawset/lookbook-04.webp', alt: 'Lookbook 04', kind: 'photo' },
        ],
      },
      // Identity
      {
        layout: 'strip',
        ratio: '1 / 1',
        caption: 'Identity — wordmark, star monogram, pixel mark',
        media: [
          { src: '/assets/projects/rawset/logo-wordmark.webp', alt: 'RAWSET wordmark', kind: 'logo', fit: 'contain' },
          { src: '/assets/projects/rawset/logo-monogram.webp', alt: 'Star monogram', kind: 'logo', fit: 'contain' },
          { src: '/assets/projects/rawset/logo-pixel-rs.webp', alt: 'Pixel RS mark', kind: 'logo', fit: 'contain' },
        ],
      },
      {
        layout: 'browser',
        url: 'index.html#email',
        media: { src: '/assets/projects/rawset/site-desktop-join.webp', alt: 'Early access sign-up and footer', kind: 'desktop' },
      },
    ],
    services: ['Brand Identity', 'Art Direction', 'E-commerce Design', 'Development'],
    challenge:
      'Streetwear drops are a sea of the same black hoodie. A new label with no budget for noise needed a look you could spot in one frame, and a store that felt like the brand rather than a template.',
    approach:
      'A strict system: black, white and one acid yellow; a pixel typeface for the voice and a mono for the details. The pixel idea runs everywhere — the mosaic that reveals the hero, the posters, the logo — and the store is hand-built so every interaction can carry it.',
    outcome: 'Storefront feature-complete ahead of launch — checkout opens with the first drop. Follow it in the build journal.',
    featured: true,
    ongoing: {
      phase: 'Building',
      progress: 80,
      lastUpdated: '2026-09-26',
      currentStage: 'Development',
      statusNote: 'Store built end to end; checkout switches on at launch.',
      journal: [
        {
          id: 'idea',
          title: 'The idea',
          date: '2026-03-04',
          body: 'Small runs, no restocks, nothing made for everyone. The name says it: a raw set of pieces per drop, not a seasonal collection. The line we kept coming back to became the tagline — made raw, worn different.',
        },
        {
          id: 'why',
          title: 'Why we’re building it',
          date: '2026-03-10',
          body: 'A self-initiated project where the same people design the brand and write the code. No handover, no “that’s not possible in Shopify”. If the identity breaks in the store, we fix the identity.',
        },
        {
          id: 'research',
          title: 'Research',
          date: '2026-04-02',
          body: 'Low-res game screens, barcodes, swing tags and drop-day queue culture. The common thread was pixels: blunt, readable at any size, and slightly out of place on clothing — which is exactly why they stand out.',
          media: [{ src: '/assets/projects/rawset/research-mosaic.webp', alt: 'Pixel mosaic and barcode study', kind: 'moodboard' }],
        },
        {
          id: 'exploration',
          title: 'Design exploration',
          date: '2026-05-18',
          body: 'The wordmark carries the ©, a star monogram works as a stamp, and a pixel RS mark lives on the store. Every piece of the identity had to survive at favicon size and across a full poster.',
          media: [
            { src: '/assets/projects/rawset/logo-wordmark.webp', alt: 'RAWSET wordmark', kind: 'logo', fit: 'contain' },
            { src: '/assets/projects/rawset/logo-monogram.webp', alt: 'Star monogram', kind: 'logo', fit: 'contain' },
          ],
        },
        {
          id: 'decisions',
          title: 'Decisions',
          date: '2026-06-20',
          body: 'Black, white and one acid yellow, nothing else. Press Start 2P for headlines, DM Mono for prices, sizes and fabric. Campaign lines written like captions — “If you know, you know”, “The street already knew” — and set as posters before they went on the site.',
        },
        {
          id: 'development',
          title: 'Development',
          date: '2026-08-12',
          body: 'Plain HTML, CSS and JavaScript, no framework and no build step. The Winter Arc hero reveals itself through a scroll-driven pixel mosaic; Drop 01 is a filterable grid; one product template powers every piece with a six-view gallery, zoom, size chart, delivery check and a cart that remembers you.',
          media: [
            { src: '/assets/projects/rawset/site-desktop-shop.webp', alt: 'Store build — Drop 01 product grid', kind: 'desktop' },
            { src: '/assets/projects/rawset/site-mobile-shop.webp', alt: 'Store build — shop on mobile', kind: 'mobile' },
          ],
        },
        {
          id: 'changed',
          title: 'What changed',
          date: '2026-09-26',
          body: 'Instead of six separate shots per item, each product page now frames its six views from a single photo using set focal points. We also added a Motion switch for anyone who prefers a still page, and an optional lo-fi background beat.',
        },
      ],
      next: [
        'Switch on checkout and payments',
        'Shoot the full Drop 01 on-body set',
        'Accessibility and performance pass',
        'Launch to the early-access list',
      ],
    },
  },
  {
    slug: 'dsquare-studio',
    title: 'Dsquare Studio',
    client: 'Dsquare (ourselves)',
    year: '2026',
    categories: ['Branding', 'Web', 'Development'],
    discipline: 'Brand / Website',
    type: 'Studio Project',
    status: 'Ongoing',
    summary: 'The studio’s own identity and website. You’re looking at it.',
    description:
      'Designing for yourself is the hardest brief. This is the Dsquare identity and the site you are on right now — designed and built in-house, and still changing.',
    // The studio's own colours: the mark in accent orange with near-black ink
    tone: { bg: '#FA5C01', ink: '#000000' },
    thumbnail: { alt: 'Dsquare D² mark', motif: 'mark', kind: 'logo' },
    heroImage: { alt: 'Dsquare D² mark', motif: 'mark', kind: 'hero' },
    gallery: [
      { layout: 'full', media: { alt: 'Dsquare homepage', motif: 'interface', kind: 'desktop' } },
      {
        layout: 'pair',
        media: [
          { alt: 'Type scale', motif: 'type', kind: 'typography' },
          { alt: 'Site on mobile', motif: 'mobile', kind: 'mobile' },
        ],
      },
    ],
    services: ['Brand Identity', 'Web Design', 'Front-end Development'],
    challenge: 'Show what the studio does without saying too much about it.',
    approach: 'Let the site be the portfolio piece: typography, grid, motion and code doing the talking.',
    outcome: 'In progress — see the build journal.',
    featured: false,
    ongoing: {
      phase: 'Testing',
      progress: 85,
      lastUpdated: '2026-10-02',
      currentStage: 'Development',
      statusNote: 'Site is live in testing. Real project imagery coming next.',
      journal: [
        {
          id: 'idea',
          title: 'The idea',
          date: '2026-06-01',
          body: 'Dsquare comes from Double D — design and development. D². Two disciplines that are usually split across two teams, done by the same hands.',
        },
        {
          id: 'decisions',
          title: 'Decisions',
          date: '2026-07-14',
          body: 'Mostly monochrome, one accent colour, one typeface family. The work brings the colour. An “Ongoing” section so unfinished projects get a home instead of waiting to be perfect.',
        },
        {
          id: 'development',
          title: 'Development',
          date: '2026-09-02',
          body: 'Built with React, TypeScript, Vite and Tailwind. Projects live in one data file, so adding work means editing content, not components.',
          media: [
            { alt: 'Component structure of the site', motif: 'code', kind: 'code' },
            { alt: 'Early wireframe of /work', motif: 'interface', kind: 'wireframe' },
          ],
        },
        {
          id: 'changed',
          title: 'What changed',
          date: '2026-10-02',
          body: 'Service rows started as an accordion. It made the page jump around, so hovering now reveals detail in a fixed panel instead.',
        },
      ],
      next: [
        'Replace placeholders with real project imagery',
        'Write the first full case studies',
        'Connect the contact form to an inbox',
      ],
    },
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    client: 'Placeholder client',
    year: '2026',
    categories: ['UI / UX'],
    discipline: 'UI / UX — Product Interface',
    type: 'Client Project',
    status: 'Completed',
    placeholder: true,
    summary: 'Placeholder — a product interface redesigned around what people actually do.',
    description:
      'Placeholder case study. Replace with a real UI / UX project: what the product is, who uses it and what changed.',
    tone: { bg: '#2440F0', ink: '#F4F5FF' },
    thumbnail: { alt: 'Project Three interface preview', motif: 'interface', kind: 'desktop' },
    heroImage: { alt: 'Project Three interface preview', motif: 'interface', kind: 'hero' },
    gallery: [
      { layout: 'full', media: { alt: 'Main dashboard screen', motif: 'interface', kind: 'desktop' } },
      {
        layout: 'large-small',
        reverse: true,
        media: [
          { alt: 'Flow overview', motif: 'grid', kind: 'wireframe' },
          { alt: 'Mobile app', motif: 'mobile', kind: 'mobile' },
        ],
      },
      {
        layout: 'text-image',
        title: 'Fewer screens, clearer steps',
        body: 'Placeholder. Describe a key design decision here and show the screen that proves it.',
        media: { alt: 'Onboarding flow', motif: 'interface', kind: 'desktop' },
      },
      { layout: 'statement', text: 'Placeholder — one line that sums up the design idea.' },
      { layout: 'video', media: { type: 'video', alt: 'Prototype walkthrough', motif: 'lines', kind: 'motion' } },
    ],
    services: ['UX Research', 'Interface Design', 'Prototyping', 'Design System'],
    challenge: 'Placeholder. What problem did users have? What made it hard?',
    approach: 'Placeholder. How did you research, explore and decide?',
    outcome: 'Placeholder. What was delivered? Describe it — avoid invented numbers.',
    featured: true,
  },
  {
    slug: 'project-four',
    title: 'Project Four',
    client: 'Placeholder client',
    year: '2025',
    categories: ['Branding'],
    discipline: 'Brand Identity',
    type: 'Client Project',
    status: 'Completed',
    placeholder: true,
    summary: 'Placeholder — a visual identity built to be recognised from across the room.',
    description: 'Placeholder case study. Replace with a real branding project.',
    tone: { bg: '#E9E2CC', ink: '#1F4A2C', accent: '#1F4A2C' },
    thumbnail: { alt: 'Project Four identity preview', motif: 'grid', kind: 'logo' },
    heroImage: { alt: 'Project Four identity preview', motif: 'grid', kind: 'hero' },
    gallery: [
      { layout: 'full', media: { alt: 'Logo and wordmark', motif: 'type', kind: 'logo' } },
      {
        layout: 'collage',
        media: [
          { alt: 'Colour system', motif: 'grid', kind: 'mockup' },
          { alt: 'Poster', motif: 'lines', kind: 'poster' },
          { alt: 'Type specimen', motif: 'type', kind: 'typography' },
        ],
      },
      {
        layout: 'text-image',
        title: 'A system, not a logo',
        body: 'Placeholder. Explain how the identity flexes across formats.',
        media: { alt: 'Identity applied to signage', motif: 'grid', kind: 'photo' },
        reverse: true,
      },
    ],
    services: ['Brand Strategy', 'Visual Identity', 'Guidelines'],
    challenge: 'Placeholder. What did the brand need to communicate?',
    approach: 'Placeholder. Which ideas were explored and why did one win?',
    outcome: 'Placeholder. What does the identity system include?',
    featured: true,
  },
  {
    slug: 'project-five',
    title: 'Project Five',
    client: 'Placeholder client',
    year: '2025',
    categories: ['Web', 'Development'],
    discipline: 'Website / Development',
    type: 'Client Project',
    status: 'Completed',
    placeholder: true,
    summary: 'Placeholder — a fast, editorial website designed and built end to end.',
    description: 'Placeholder case study. Replace with a real web design + development project.',
    tone: { bg: '#CFE3F7', ink: '#0D1B2A' },
    thumbnail: { alt: 'Project Five website preview', motif: 'lines', kind: 'desktop' },
    heroImage: { alt: 'Project Five website preview', motif: 'lines', kind: 'hero' },
    gallery: [
      { layout: 'full', media: { alt: 'Homepage', motif: 'interface', kind: 'desktop' } },
      {
        layout: 'large-small',
        media: [
          { alt: 'CMS components', motif: 'code', kind: 'code' },
          { alt: 'Mobile navigation', motif: 'mobile', kind: 'mobile' },
        ],
      },
      {
        layout: 'text-image',
        title: 'Designed in the browser',
        body: 'Placeholder. Describe how design and development informed each other.',
        media: { alt: 'Responsive layouts', motif: 'interface', kind: 'desktop' },
      },
      { layout: 'full', media: { alt: 'Article template', motif: 'lines', kind: 'desktop' } },
    ],
    services: ['Web Design', 'Development', 'CMS Setup'],
    challenge: 'Placeholder. What was wrong with the old site, or what was missing?',
    approach: 'Placeholder. How was it designed and built?',
    outcome: 'Placeholder. What launched?',
    website: undefined,
    featured: true,
  },
  {
    slug: 'project-six',
    title: 'Project Six',
    client: 'Studio experiment',
    year: '2025',
    categories: ['Motion', 'Experiments'],
    discipline: 'Motion / Experiment',
    type: 'Self-initiated',
    status: 'Completed',
    placeholder: true,
    summary: 'Placeholder — a small motion study about rhythm, timing and type.',
    description: 'Placeholder case study. Replace with a motion piece or experiment.',
    tone: { bg: '#E3E1EC', ink: '#22203A', accent: '#6A4BFF' },
    thumbnail: { alt: 'Project Six motion still', motif: 'orbit', kind: 'motion' },
    heroImage: { type: 'video', alt: 'Project Six motion study', motif: 'orbit', kind: 'motion' },
    gallery: [
      { layout: 'video', media: { type: 'video', alt: 'Full motion study', motif: 'orbit', kind: 'motion' } },
      {
        layout: 'collage',
        media: [
          { alt: 'Frame 01', motif: 'orbit', kind: 'motion' },
          { alt: 'Frame 02', motif: 'lines', kind: 'motion' },
          { alt: 'Frame 03', motif: 'grid', kind: 'motion' },
        ],
      },
    ],
    services: ['Motion Design', 'Art Direction'],
    challenge: 'Placeholder. What question was the experiment asking?',
    approach: 'Placeholder. What tools and constraints were used?',
    outcome: 'Placeholder. What did it teach?',
    featured: true,
  },
];

/* ─── Selectors ─────────────────────────────────────────────── */

export const completedProjects = projects.filter((p) => p.status === 'Completed');
export const ongoingProjects = projects.filter(
  (p): p is Project & { ongoing: NonNullable<Project['ongoing']> } =>
    p.status === 'Ongoing' && p.ongoing !== undefined,
);
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Ongoing projects live under /ongoing, finished ones under /work. */
export function projectHref(project: Project): string {
  return project.status === 'Ongoing' ? `/ongoing/${project.slug}` : `/work/${project.slug}`;
}

/** Previous / next within a list, wrapping around. */
export function getNeighbours<T extends { slug: string }>(list: T[], slug: string) {
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1 || list.length < 2) return { prev: undefined, next: undefined };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

/** 1-based position of a project in the master list — used for "Project 01" labels. */
export function projectNumber(project: Project): number {
  return projects.indexOf(project) + 1;
}

/**
 * Every visual a project has, in order: hero, gallery, then journal media.
 * Used by the layered compositions on /work.
 */
export function getProjectMedia(project: Project): MediaAsset[] {
  const fromGallery = project.gallery.flatMap((block) => {
    switch (block.layout) {
      case 'pair':
      case 'large-small':
      case 'collage':
      case 'phones':
      case 'strip':
        return block.media;
      case 'statement':
        return [];
      default:
        return [block.media];
    }
  });
  const fromJournal = project.ongoing?.journal.flatMap((e) => e.media ?? []) ?? [];
  return [project.heroImage, ...fromGallery, ...fromJournal, project.thumbnail];
}

/** Every journal entry across ongoing projects, newest first. */
export const studioLog = ongoingProjects
  .flatMap((p) =>
    p.ongoing.journal
      .filter((e) => e.date)
      .map((entry) => ({ project: p, entry, date: entry.date as string })),
  )
  .sort((a, b) => b.date.localeCompare(a.date));
