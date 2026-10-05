export interface Artwork {
  title: string;
  year: string;
  /** e.g. 'Digital collage' */
  medium: string;
  /** A sentence or two, shown when the piece is opened */
  description: string;
  /** Image in /public/assets/gallery/. Leave out for a placeholder. */
  src?: string;
  /** The artwork's own shape, width ÷ height — its frame is sized to match */
  ratio: number;
}

/** Personal artworks for /gallery, in the order you fly past them. */
export const artworks: Artwork[] = [
  {
    title: 'Here’s to the Crazy Ones',
    year: '2026',
    medium: 'Digital collage',
    description: 'A man on a stool, traced in highlighter yellow and surrounded by scrawled notes and brush marks — a toast to the people who don’t follow the plan.',
    src: '/assets/gallery/heres-to-the-crazy-ones.webp',
    ratio: 1531 / 1402,
  },
  {
    title: 'Mirror Arch',
    year: '2026',
    medium: 'Digital collage',
    description: 'Two mirrored figures pose inside an ornate wrought-iron archway, set against flat teal.',
    src: '/assets/gallery/mirror-arch.webp',
    ratio: 1293 / 1800,
  },
  {
    title: 'Both Sides of the Sun',
    year: '2026',
    medium: 'Digital collage',
    description: 'A baroque altar of fruit, cherubs and a dove under a summer sky, around one line: to love and be loved is to feel the sun from both sides.',
    src: '/assets/gallery/both-sides-of-the-sun.webp',
    ratio: 1800 / 1251,
  },
  {
    title: 'The Decemberists',
    year: '2026',
    medium: 'Digital collage',
    description: 'A crest for The Decemberists — an all-seeing eye, cherubs and a fountain wrapped in gold scrollwork.',
    src: '/assets/gallery/the-decemberists.webp',
    ratio: 1800 / 1581,
  },
  {
    title: 'Gauchar, Uttarakhand',
    year: '2026',
    medium: 'Digital collage',
    description: 'Old family photographs from Gauchar, pinned and annotated by hand. The past can’t be lived again, but it can always be remembered.',
    src: '/assets/gallery/gauchar-uttarakhand.webp',
    ratio: 1800 / 1244,
  },
  {
    title: 'The Only Way Out Is Through',
    year: '2026',
    medium: 'Digital collage',
    description: 'A horse in grainy print, mid-gallop across a block of red.',
    src: '/assets/gallery/the-only-way-out-is-through.webp',
    ratio: 887 / 570,
  },
];
