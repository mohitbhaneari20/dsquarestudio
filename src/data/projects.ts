import { testimonials as extraTestimonials } from './clients';
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
/** Every project, including hidden ones. Use `projects` everywhere on the site. */
const allProjects: Project[] = [
  {
    slug: 'rawset',
    seo: {
      title: 'RAWSET — Streetwear Brand & E-commerce Build | Dsquare Studio',
      description:
        'Follow Dsquare Studio building RAWSET, a limited-run streetwear label: pixel brand identity, poster campaign and the Drop 01 storefront, shared as it’s made.',
    },
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
    slug: 'falance',
    seo: {
      title: 'Falance — Mobile App UI/UX Design Case Study | Dsquare Studio',
      description:
        'How Dsquare Studio designed and built Falance, a calm, pixel-drawn productivity and life-balance app — onboarding, focus mode, goals and a working prototype.',
    },
    title: 'Falance',
    client: 'Self-initiated',
    year: '2026',
    categories: ['UI / UX', 'Development'],
    discipline: 'Mobile App / UX Case Study',
    type: 'Self-initiated',
    status: 'Completed',
    summary: 'A calm, pixel-drawn mobile app that helps people decide what matters today, focus on it, and find their balance.',
    description:
      'Falance helps people stop juggling everything and start with one thing. It brings together a daily focus screen, goals broken into small steps, a gentle look at life balance and a small library of books — five tabs, 31 screens and states, 22 custom pixel icons and six pixel avatars, built as a working prototype with real subscriptions.',
    tone: { bg: '#F3F3F0', ink: '#0E0E0E', accent: '#588157' },
    thumbnail: { src: '/assets/projects/falance/cover.webp', alt: 'Falance — Goals, Today and Focus mode screens', kind: 'mobile' },
    heroImage: { src: '/assets/projects/falance/hero.webp', alt: 'Falance — five screens from onboarding to plans', kind: 'hero' },
    gallery: [
      {
        layout: 'phones',
        caption: 'Onboarding — under a minute: three quiet lines, a name and a face, a focus area and one goal',
        media: [
          { src: '/assets/projects/falance/screens/ob-1.webp', alt: 'Life gets busy', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/ob-3.webp', alt: 'What matters', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/ob-4-name.webp', alt: 'Name + avatar', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/ob-6-goal.webp', alt: 'First goal', kind: 'mobile' },
        ],
      },
      { layout: 'statement', text: 'One question a day: what matters today?' },
      {
        layout: 'phones',
        caption: 'Today — one focus card, one check-in, three priorities',
        media: [
          { type: 'video', src: '/assets/projects/falance/video/flow.webm', poster: '/assets/projects/falance/screens/ob-1.webp', alt: 'End-to-end flow', kind: 'motion' },
          { src: '/assets/projects/falance/screens/today.webp', alt: 'Home', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/today-checkin.webp', alt: 'After check-in', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/today-all-done.webp', alt: 'All three done', kind: 'mobile' },
        ],
      },
      {
        layout: 'phones',
        caption: 'Focus mode — the screen goes dark and quiet; a ring of 60 pixels fills as time passes',
        media: [
          { src: '/assets/projects/falance/screens/focus-ready.webp', alt: 'Ready', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/focus-running.webp', alt: 'Running', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/focus-done.webp', alt: 'Done', kind: 'mobile' },
        ],
      },
      {
        layout: 'phones',
        caption: 'Goals read like chapters, with progress as stars — and balance as a shape, not a score',
        media: [
          { src: '/assets/projects/falance/screens/goals.webp', alt: 'Goals', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/goal-detail.webp', alt: 'Goal detail', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/sheet-new-goal.webp', alt: 'New goal', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/balance.webp', alt: 'Balance', kind: 'mobile' },
        ],
      },
      { layout: 'statement', text: 'Calm, not colourful. Monochrome, one green accent, and every icon drawn pixel by pixel.' },
      {
        layout: 'phones',
        caption: '22 icons on a 12 × 12 grid, animated in stepped frames like sprites',
        media: [
          { type: 'video', src: '/assets/projects/falance/video/icons-lab.webm', alt: 'Icon set in motion', kind: 'motion' },
          { type: 'video', src: '/assets/projects/falance/video/motion.webm', poster: '/assets/projects/falance/screens/today.webp', alt: 'Icons, tabs and checkboxes', kind: 'motion' },
        ],
      },
      {
        layout: 'strip',
        ratio: '1 / 1',
        caption: 'Design system — buttons, chips and tags · stars, dot meter and pixel ring · inputs',
        media: [
          { src: '/assets/projects/falance/components/buttons.webp', alt: 'Buttons, chips, tags', kind: 'mockup', fit: 'contain', background: '#FFFFFF' },
          { src: '/assets/projects/falance/components/progress.webp', alt: 'Progress', kind: 'mockup', fit: 'contain', background: '#FFFFFF' },
          { src: '/assets/projects/falance/components/forms.webp', alt: 'Inputs', kind: 'mockup', fit: 'contain', background: '#FFFFFF' },
        ],
      },
      {
        layout: 'phones',
        caption: 'Books — the price lives on the cover, so you always know what’s free',
        media: [
          { src: '/assets/projects/falance/screens/books.webp', alt: 'Library', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/book-detail-locked.webp', alt: 'Locked book', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/sheet-buy.webp', alt: 'Buy sheet', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/reader.webp', alt: 'Reader', kind: 'mobile' },
        ],
      },
      { layout: 'statement', text: 'A calm brand needs a calm paywall. Ask once, never pressure.' },
      {
        layout: 'phones',
        caption: 'Plans — one decision at a time: tier, then billing, then one clear button',
        media: [
          { src: '/assets/projects/falance/screens/plans-plus.webp', alt: 'Plus', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/plans-pro.webp', alt: 'Pro', kind: 'mobile' },
          { type: 'video', src: '/assets/projects/falance/video/scroll-plans.webm', poster: '/assets/projects/falance/screens/plans-plus.webp', alt: 'Scrolling the plans page', kind: 'motion' },
          { src: '/assets/projects/falance/screens/plans-subscribed.webp', alt: 'Subscribed', kind: 'mobile' },
        ],
      },
      {
        layout: 'phones',
        caption: 'Full-length screens, scrolled',
        media: [
          { type: 'video', src: '/assets/projects/falance/video/scroll-today.webm', poster: '/assets/projects/falance/screens/today.webp', alt: 'Today', kind: 'motion' },
          { type: 'video', src: '/assets/projects/falance/video/scroll-goals.webm', poster: '/assets/projects/falance/screens/goals.webp', alt: 'Goals', kind: 'motion' },
          { type: 'video', src: '/assets/projects/falance/video/scroll-balance.webm', poster: '/assets/projects/falance/screens/balance.webp', alt: 'Balance', kind: 'motion' },
          { type: 'video', src: '/assets/projects/falance/video/scroll-books.webm', poster: '/assets/projects/falance/screens/books.webp', alt: 'Books', kind: 'motion' },
          { type: 'video', src: '/assets/projects/falance/video/scroll-me.webm', poster: '/assets/projects/falance/screens/me.webp', alt: 'Me', kind: 'motion' },
        ],
      },
      {
        layout: 'phones',
        caption: 'Before → after: from a warm, Kindle-like first version to a monochrome, pixel-drawn system',
        media: [
          { src: '/assets/projects/falance/before/today.webp', alt: 'Before · Today', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/today.webp', alt: 'After · Today', kind: 'mobile' },
          { src: '/assets/projects/falance/before/focus-running.webp', alt: 'Before · Focus', kind: 'mobile' },
          { src: '/assets/projects/falance/screens/focus-running.webp', alt: 'After · Focus', kind: 'mobile' },
        ],
      },
    ],
    services: ['Product & UX Design', 'Visual & Icon Design', 'Interaction Design', 'Front-end Prototyping'],
    challenge:
      'People have goals but struggle to stay focused and consistent — and most productivity apps add dashboards, charts and badges that become one more thing to maintain.',
    approach:
      'Remove instead of add. One question per screen, three priorities a day, progress shown as patterns rather than percentages, and warm microcopy instead of guilt. A monochrome, pixel-drawn system gives it a voice without noise.',
    outcome:
      'A working mobile prototype across five tabs — onboarding, Today, focus mode, goals, balance, books and a calm Plus/Pro paywall with real Razorpay payments verified on the server. Usability testing with five participants is planned next.',
    featured: true,
  },
  {
    slug: 'dsquare-studio',
    seo: {
      title: 'Dsquare Studio — Brand Identity & Website Design Case Study',
      description:
        'How Dsquare Studio designed and built its own brand identity, design system and website.',
    },
    // Private for now: not shown anywhere on the site
    hidden: true,
    title: 'Dsquare Studio',
    client: 'Dsquare (ourselves)',
    year: '2026',
    categories: ['Branding', 'UI / UX', 'Web', 'Motion', 'Development'],
    discipline: 'Brand Identity / Website Design & Build',
    type: 'Studio Project',
    status: 'Completed',
    summary: 'The studio’s own identity and website — designed and built in-house. You’re looking at it.',
    description:
      'Designing for yourself is the hardest brief. Dsquare is D²: design and development, done by the same hands. The identity, the design system and this website were all made in-house — from the first sketch of the monogram to the code that runs the site.',
    tone: { bg: '#E6E1D8', ink: '#000000', accent: '#FA5C01' },
    thumbnail: { src: '/assets/projects/dsquare-studio/cover.webp', alt: 'Dsquare Studio website on desktop and mobile', kind: 'desktop' },
    heroImage: { src: '/assets/projects/dsquare-studio/hero.webp', alt: 'Dsquare Studio website — menu, About D² and Services', kind: 'hero' },
    gallery: [
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/ideation.webp', alt: 'Ideation — D + D = D², the brand words and three logo directions', kind: 'moodboard' } },
      { layout: 'statement', text: 'Design and development, done by the same hands — so nothing gets lost between the idea and the browser.' },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/logo.webp', alt: 'Logo system — primary lockup, monogram and wordmark', kind: 'logo' } },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/usage.webp', alt: 'Logo usage — clear space, minimum sizes and don’ts', kind: 'logo' } },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/colour.webp', alt: 'Colour — sand, off-white, black and taupe, with one loud orange', kind: 'mockup' } },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/type.webp', alt: 'Typography — Geist, Geist Mono and Anton', kind: 'typography' } },
      { layout: 'browser', url: '/', media: { src: '/assets/projects/dsquare-studio/screens/d-home-hero.webp', alt: 'Home — the stone monogram hero', kind: 'desktop' } },
      { layout: 'board', ratio: '16/9', media: { type: 'video', src: '/brand/loader.mp4', alt: 'Intro — the logo plays in, then the orange splits open over the hero', kind: 'motion' } },
      { layout: 'browser', url: '/#work', media: { src: '/assets/projects/dsquare-studio/screens/d-home-work.webp', alt: 'Home — selected work', kind: 'desktop' } },
      {
        layout: 'strip',
        ratio: '4 / 3',
        caption: 'Design · Develop · Deploy — three looping clips, objects only, no text',
        media: [
          { type: 'video', src: '/assets/home/design.mp4', alt: 'Design', kind: 'motion' },
          { type: 'video', src: '/assets/home/develop.mp4', alt: 'Develop', kind: 'motion' },
          { type: 'video', src: '/assets/home/deploy.mp4', alt: 'Deploy', kind: 'motion' },
        ],
      },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/ui.webp', alt: 'UI components — buttons, tags, navigation, cards, progress, form fields', kind: 'mockup' } },
      { layout: 'board', media: { src: '/assets/projects/dsquare-studio/boards/icons.webp', alt: 'Iconography — line icons plus the brand glyphs and custom cursor', kind: 'mockup' } },
      { layout: 'statement', text: 'Mostly calm. One loud colour. Sharp corners everywhere.' },
      { layout: 'browser', url: '/studio', media: { src: '/assets/projects/dsquare-studio/screens/d-about-hero.webp', alt: 'About D² — the founder and the studio', kind: 'desktop' } },
      { layout: 'browser', url: '/studio', media: { src: '/assets/projects/dsquare-studio/screens/d-about-name.webp', alt: 'About D² — the name, with the 3D concrete monogram', kind: 'desktop' } },
      { layout: 'browser', url: '/studio', media: { src: '/assets/projects/dsquare-studio/screens/d-about-process.webp', alt: 'About D² — five steps as sideways-scrolling cards', kind: 'desktop' } },
      {
        layout: 'phones',
        caption: 'Mobile — every page reflows to one column; the menu becomes a full-screen index',
        media: [
          { src: '/assets/projects/dsquare-studio/screens/m-home.webp', alt: 'Home', kind: 'mobile' },
          { src: '/assets/projects/dsquare-studio/screens/m-menu.webp', alt: 'Menu', kind: 'mobile' },
          { src: '/assets/projects/dsquare-studio/screens/m-about.webp', alt: 'About D²', kind: 'mobile' },
          { src: '/assets/projects/dsquare-studio/screens/m-services.webp', alt: 'Services', kind: 'mobile' },
          { src: '/assets/projects/dsquare-studio/screens/m-work.webp', alt: 'Work', kind: 'mobile' },
        ],
      },
      { layout: 'browser', url: '/services', media: { src: '/assets/projects/dsquare-studio/screens/d-services-row.webp', alt: 'Services — each service with its own looping animation', kind: 'desktop' } },
      { layout: 'browser', url: '/work', media: { src: '/assets/projects/dsquare-studio/screens/d-work-archive.webp', alt: 'Work — the archive', kind: 'desktop' } },
      { layout: 'browser', url: '/contact#book', media: { src: '/assets/projects/dsquare-studio/screens/d-contact-book.webp', alt: 'Contact — book a call straight from the site', kind: 'desktop' } },
    ],
    services: ['Brand Identity', 'Design System', 'UI / UX Design', 'Motion Design', 'Front-end Development'],
    challenge:
      'Show what the studio does without saying too much about it. A small studio’s site has to do the job of a pitch deck, a portfolio and a first conversation — and it has to prove “we design and we build” rather than just claim it.',
    approach:
      'Make the site the portfolio piece. A two-square monogram for D², a calm palette with one loud orange, Geist for everything and mono labels for the details, sharp corners throughout. Then build it ourselves — a stone monogram that tilts toward the cursor, a video loader that splits open over the hero, sideways-scrolling sections, and small animations for every service — so the craft shows in the details.',
    outcome:
      'A complete identity and design system, and a fast React site that the studio runs on: projects and case studies come from one data file, the booking calendar is built in, and every page works from phone to desktop. New work goes live by editing content, not components.',
    featured: true,
  },
  {
    slug: 'whistle',
    seo: {
      title: 'Whistle — B2B Website UI & Design System Case Study | Dsquare Studio',
      description:
        'How Mohit Bhandari designed the website UI and design system for Whistle, a B2B lead-generation and outsourced SDR company, as Senior UI Designer at One Metric.',
    },
    title: 'Whistle',
    client: 'Whistle',
    year: '2025',
    categories: ['UI / UX', 'Web'],
    discipline: 'Website UI / Design System',
    type: 'Agency Work',
    status: 'Completed',
    summary: 'The website and design system for Whistle, a B2B lead-generation and outsourced SDR company — designed during my time as Senior UI Designer at One Metric.',
    description:
      'Whistle builds sales pipelines for B2B companies: outsourced SDR teams, cold email, LinkedIn outreach and calling. Their website has to do the same job — turn a visitor into a booked meeting. I designed the interface and the design system behind it: one confident violet, clear proof at every scroll, and a set of components that let the team publish new pages without starting from scratch.',
    credit: {
      agency: 'One Metric',
      role: 'Senior UI Designer',
      note: 'Made during my time as Senior UI Designer at One Metric. The visual design and design system are my work; content, strategy and design decisions were shaped together with the agency team and the Whistle team. Shown here with thanks — Whistle is their client, not Dsquare’s.',
    },
    tone: { bg: '#4A19E4', ink: '#FFFFFF', accent: '#140F3A' },
    thumbnail: { src: '/assets/projects/whistle/cover.webp', alt: 'Whistle website — homepage on desktop and mobile', kind: 'desktop' },
    heroImage: { src: '/assets/projects/whistle/hero.webp', alt: 'Whistle website — homepage, About and mobile screens', kind: 'hero' },
    gallery: [
      { layout: 'browser', url: '/', media: { src: '/assets/projects/whistle/screens/d-home-hero.webp', alt: 'Whistle homepage — “More Meetings” hero with proof cards', kind: 'desktop' } },
      { layout: 'board', media: { src: '/assets/projects/whistle/boards/logo.webp', alt: 'Whistle logo on white, violet and midnight', kind: 'logo' } },
      { layout: 'board', media: { src: '/assets/projects/whistle/boards/colour.webp', alt: 'Whistle colour palette — violet, midnight, periwinkle, lilac, paper and white', kind: 'moodboard' } },
      { layout: 'board', media: { src: '/assets/projects/whistle/boards/type.webp', alt: 'Whistle typography — Poppins headings, DM Sans body', kind: 'typography' } },
      { layout: 'statement', text: 'Every scroll answers one question: can they actually get us meetings?' },
      { layout: 'browser', url: '/', media: { src: '/assets/projects/whistle/screens/d-home-sdr.webp', alt: 'Homepage — No SDR function? and vetted SDR talent', kind: 'desktop' } },
      { layout: 'browser', url: '/', media: { src: '/assets/projects/whistle/screens/d-home-trust.webp', alt: 'Homepage — client stories and review ratings', kind: 'desktop' } },
      { layout: 'board', media: { src: '/assets/projects/whistle/boards/ui.webp', alt: 'Whistle components — buttons, stat chips, SDR cards, reviews, case-study card and FAQ', kind: 'mockup' } },
      {
        layout: 'phones',
        caption: 'Mobile — the same proof, stacked: headline, stats, SDR cards, client words',
        media: [
          { src: '/assets/projects/whistle/screens/m-home.webp', alt: 'Mobile home hero', kind: 'mobile' },
          { src: '/assets/projects/whistle/screens/m-home-sdr.webp', alt: 'Mobile vetted SDRs', kind: 'mobile' },
          { src: '/assets/projects/whistle/screens/m-home-trust.webp', alt: 'Mobile trust section', kind: 'mobile' },
          { src: '/assets/projects/whistle/screens/m-home-proof.webp', alt: 'Mobile reviews', kind: 'mobile' },
          { src: '/assets/projects/whistle/screens/m-about.webp', alt: 'Mobile About', kind: 'mobile' },
        ],
      },
      { layout: 'statement', text: 'One system, every page: home, about, services, team, blog.' },
      { layout: 'browser', url: '/about', media: { src: '/assets/projects/whistle/screens/d-about.webp', alt: 'About — the founders and trusted-by logos', kind: 'desktop' } },
      { layout: 'browser', url: '/outsourced-sdr', media: { src: '/assets/projects/whistle/screens/d-service.webp', alt: 'Service page — Outsourced SDR', kind: 'desktop' } },
      { layout: 'browser', url: '/our-experts', media: { src: '/assets/projects/whistle/screens/d-experts.webp', alt: 'Our experts', kind: 'desktop' } },
      { layout: 'browser', url: '/blog', media: { src: '/assets/projects/whistle/screens/d-blog.webp', alt: 'Blog', kind: 'desktop' } },
      { layout: 'browser', url: '/book-a-meeting', media: { src: '/assets/projects/whistle/screens/d-book.webp', alt: 'Book a meeting', kind: 'desktop' } },
    ],
    services: ['UI Design', 'Design System', 'Responsive Web Design', 'Component Library'],
    challenge:
      'Lead generation is a crowded, sceptical market — every agency promises meetings. Whistle needed a site that earns trust fast, explains several services and many industries clearly, and keeps pointing to one action: book a call. It also had to grow, with new pages added often.',
    approach:
      'Calm first, loud where it counts. A warm off-white page, midnight headings in Poppins and readable DM Sans body text, with Whistle violet saved for buttons and key words — so the next step is always obvious. Proof sits in every section: real people, numbers on glassy stat chips, client words and review ratings. Underneath, a small component set — buttons, stat chips, SDR cards, reviews, case-study cards, FAQ rows — builds every page type the same way.',
    outcome:
      'A consistent, responsive website across the homepage, about, services, team, blog and booking pages, all running on one design system the team can keep extending. The site is live at whistle.ltd.',
    website: 'https://www.whistle.ltd/',
    testimonial: {
      quote:
        'We were incredibly happy with our website design. Mohit was really able to take our vision and run with it. His lead time and quality of work was of the highest caliber!',
      name: 'Kayla du Plessis',
      role: 'Head of GTM',
      company: 'Whistle',
      photo: '/assets/projects/whistle/kayla-du-plessis.webp',
    },
    featured: true,
  },
];

/** What the site shows: hidden projects are left out of every list, page and link. */
export const projects = allProjects.filter((p) => !p.hidden);

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

/** Every client quote: those attached to projects first, then any extra ones. */
export const allTestimonials = [
  ...projects.flatMap((p) => (p.testimonial ? [{ ...p.testimonial, slug: p.slug }] : [])),
  ...extraTestimonials,
];
