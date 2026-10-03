# Dsquare Studio

Website for Dsquare — an independent design + development studio. D² = Design × Development.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React Router and Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Where things live

```
src/
  config/site.ts         Studio name, URL, email, socials, nav  ← update before launch
  data/projects.ts       Every project (work + ongoing). Edit this to add work.
  data/services.ts       Services and the "How we work" steps
  data/types.ts          Types for the above (categories, phases, stages…)
  styles/index.css       Design tokens (colours, spacing, motion) + type scale
  components/
    layout/              Navbar, MobileMenu, Footer, PageTransition
    ui/                  Reusable pieces: ButtonLink, SectionHeader, Reveal, TextReveal,
                         ImageReveal, ProjectVisual, ProgressBar, StatusBadge, Marquee,
                         DSquareMark, CustomCursor, ScrollProgress, Seo, CTA…
    projects/            ProjectCard, ProjectGrid, ProjectHero, ProjectGallery,
                         OngoingProjectCard, ProjectPager, CaseSection
    work/                Work page: showcase, archive, still-building board, filter
    home/ services/ studio/ contact/   Section-specific components
  pages/                 One file per route
  layouts/RootLayout.tsx Shared chrome + page transitions
```

## Common edits

- **Accent colour** — change `--accent` in `src/styles/index.css`. Everything follows.
- **Add a project** — add an object to `projects` in `src/data/projects.ts`.
  `status: 'Completed'` appears under /work/:slug; `status: 'Ongoing'` plus an `ongoing` block appears under /ongoing/:slug with progress, phase and journal.
- **Real images** — see `public/assets/projects/README.md`. Without `src`, a placeholder in the project's `tone` is drawn instead.
- **Placeholder projects** — Project Three and Four have `placeholder: true` and say so on the page. Replace or delete them.
- **Project colours** — each project's `tone` (`bg`, `ink`, optional `accent`) colours its placeholders, tints the /work background while it's active, and marks its case study.
- **Media kinds** — tag assets with `kind` (`desktop`, `mobile`, `poster`, `logo`, `code`, `moodboard`…). The /work composition uses it to pick each image's shape and label.
- **Case-study layouts** — gallery blocks can be `full`, `pair`, `large-small`, `collage`, `text-image`, `video` or `statement` (big type between visuals). The /work showcase pulls its layered images from the hero, gallery and journal automatically.
- **Studio clock/location** — `site.location` in `src/config/site.ts`.
- **Progress numbers** — `ongoing.progress` is shown publicly; keep it honest.

## Contact form

No backend is required. Copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` to any endpoint that accepts a JSON POST (Formspree, Basin, your own API). Without it, submitting opens the visitor's email app with the inquiry pre-written to `site.email`. See `src/lib/inquiry.ts`.

## Before going live

- [ ] Set the real domain, email and social URLs in `src/config/site.ts`
- [ ] Update the same defaults in `index.html` (used by crawlers that don't run JS)
- [ ] Replace placeholder projects and images
- [ ] Optionally connect the contact form endpoint

## Deploying

It's a static SPA: build command `npm run build`, output folder `dist`. `vercel.json` (Vercel) and `public/_redirects` (Netlify) already send every route to `index.html`, so deep links like `/work/rawset` work on refresh.

**Vercel (recommended):** push this repo to GitHub → vercel.com → *Add New Project* → import the repo → Deploy. Vite is detected automatically. Every push to `main` redeploys.

**Netlify:** *Add new site → Import from Git* → pick the repo → build `npm run build`, publish `dist`.

If you use the contact form endpoint, add `VITE_FORM_ENDPOINT` in the host's environment variables (not in the repo).

## Accessibility & motion

Semantic landmarks, skip link, visible focus, keyboard-navigable menu (focus trap + Escape), tabs with arrow keys, labelled progress bars and form errors. `prefers-reduced-motion` (or the Motion switch in the header, remembered per browser) turns off transforms, marquee, rotation, the custom cursor and scroll-linked effects. The custom cursor only appears on fine-pointer devices.
