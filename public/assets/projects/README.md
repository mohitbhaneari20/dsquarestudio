# Project assets

One folder per project, named after its `slug` in `src/data/projects.ts`.

    /public/assets/projects/rawset/hero.webp
    /public/assets/projects/rawset/thumb.webp

Then point the matching `MediaAsset` at it:

    heroImage: { src: '/assets/projects/rawset/hero.webp', alt: 'RAWSET wordmark on a woven label' }

- Prefer `.webp` or `.avif`, around 2400px wide for full-width images and 1600px for halves.
- For responsive images, add `srcSet: '/assets/projects/rawset/hero-1200.webp 1200w, /assets/projects/rawset/hero-2400.webp 2400w'`.
- For video, use `type: 'video'`, `src: '…/reel.mp4'` and a `poster` image. Keep clips short and muted.
- Any asset without `src` shows the neutral placeholder.
