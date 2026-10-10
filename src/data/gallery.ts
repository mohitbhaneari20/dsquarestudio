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
    description: 'A cut-out figure on a stool, traced in highlighter yellow and surrounded by handwritten notes and brush strokes in green, purple and red.',
    src: '/assets/gallery/heres-to-the-crazy-ones.webp',
    ratio: 1531 / 1402,
  },
  {
    title: 'Mirror Arch',
    year: '2026',
    medium: 'Digital collage',
    description: 'Two mirrored figures inside an ornate wrought-iron arch, set against flat teal.',
    src: '/assets/gallery/mirror-arch.webp',
    ratio: 1293 / 1800,
  },
  {
    title: 'Both Sides of the Sun',
    year: '2026',
    medium: 'Digital collage',
    description: 'Fruit, cherubs and a dove arranged like an altar under a bright sky, around a banner that reads “to love & be loved is to feel the sun from both sides”.',
    src: '/assets/gallery/both-sides-of-the-sun.webp',
    ratio: 1800 / 1251,
  },
  {
    title: 'The Decemberists',
    year: '2026',
    medium: 'Digital collage',
    description: 'A crest built around the band’s name: an all-seeing eye, two cherubs and a fountain in gold scrollwork, on black.',
    src: '/assets/gallery/the-decemberists.webp',
    ratio: 1800 / 1581,
  },
  {
    title: 'The Only Way Out Is Through',
    year: '2026',
    medium: 'Digital collage',
    description: 'A galloping horse in grainy black print over a block of red, with the line “the only way out is through”.',
    src: '/assets/gallery/the-only-way-out-is-through.webp',
    ratio: 887 / 570,
  },
];
