export interface Artwork {
  title: string;
  year: string;
  /** e.g. 'Digital', 'Ink on paper', '3D' */
  medium: string;
  /** A sentence or two shown on the wall label when you hover the piece */
  description: string;
  /** Image path, e.g. '/assets/gallery/untitled-01.webp'. Leave out for the placeholder. */
  src?: string;
  /** Shape of the frame — match it to the artwork */
  ratio: '1/1' | '3/4' | '4/5' | '4/3' | '16/9';
}

/**
 * Personal artworks for /gallery, shown in this order.
 * Add an image to /public/assets/gallery/ and set `src`; replace titles, years, media and descriptions.
 */
export const artworks: Artwork[] = [
  { title: 'Untitled 01', year: '2026', medium: 'Digital', ratio: '4/5', description: 'A quiet study of light falling across a plain wall.' },
  { title: 'Untitled 02', year: '2026', medium: 'Digital', ratio: '1/1', description: 'Shapes stacked until they started to balance.' },
  { title: 'Untitled 03', year: '2026', medium: 'Ink on paper', ratio: '3/4', description: 'Lines drawn fast, kept even when they wobble.' },
  { title: 'Untitled 04', year: '2025', medium: '3D', ratio: '4/3', description: 'A small object, modelled and lit like a still life.' },
  { title: 'Untitled 05', year: '2025', medium: 'Digital', ratio: '4/5', description: 'Colour first, form later — an experiment in order.' },
  { title: 'Untitled 06', year: '2025', medium: 'Digital', ratio: '16/9', description: 'A wide view, mostly empty on purpose.' },
  { title: 'Untitled 07', year: '2025', medium: 'Ink on paper', ratio: '3/4', description: 'Ink, water and a bit of patience.' },
  { title: 'Untitled 08', year: '2024', medium: 'Digital', ratio: '1/1', description: 'A square that refused to stay square.' },
  { title: 'Untitled 09', year: '2024', medium: '3D', ratio: '4/5', description: 'Soft forms, hard light — a test of materials.' },
];
