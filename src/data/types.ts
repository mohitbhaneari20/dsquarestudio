export const categories = [
  'Branding',
  'UI / UX',
  'Web',
  'Motion',
  'Development',
  'Experiments',
] as const;
export type Category = (typeof categories)[number];

export const phases = ['Research', 'Designing', 'Building', 'Testing', 'Launching'] as const;
export type Phase = (typeof phases)[number];

/** The broad milestones every ongoing project moves through. */
export const stages = ['Idea', 'Brand', 'Design', 'Development', 'Launch'] as const;
export type Stage = (typeof stages)[number];

/**
 * Visual motif used by the placeholder renderer when no real image exists yet.
 * Once `src` is set on a MediaAsset, the motif is ignored.
 */
export type Motif = 'type' | 'grid' | 'interface' | 'orbit' | 'mark' | 'lines' | 'mobile' | 'code';

/**
 * A project's colour atmosphere. Drives placeholders, the subtle
 * background tint on /work and accents inside the project's own pages.
 */
export interface Tone {
  /** Main project colour (placeholder background) */
  bg: string;
  /** Ink on top of `bg` (type, lines) */
  ink: string;
  /** Optional highlight colour (e.g. RAWSET's electric yellow) */
  accent?: string;
}

/** What an asset depicts — shown as a small annotation and used to pick its shape. */
export type MediaKind =
  | 'hero'
  | 'desktop'
  | 'mobile'
  | 'poster'
  | 'logo'
  | 'typography'
  | 'mockup'
  | 'motion'
  | 'moodboard'
  | 'wireframe'
  | 'code'
  | 'photo';

export interface MediaAsset {
  type?: 'image' | 'video';
  /**
   * Path to the real asset, e.g. '/assets/projects/rawset/hero.webp'.
   * Leave undefined to render the placeholder.
   */
  src?: string;
  /** Optional responsive sources: '/a-800.webp 800w, /a-1600.webp 1600w' */
  srcSet?: string;
  /** Video poster */
  poster?: string;
  alt: string;
  caption?: string;
  motif?: Motif;
  kind?: MediaKind;
  /** 'contain' shows the whole image on the project colour (logos, marks). Default 'cover'. */
  fit?: 'cover' | 'contain';
  /** Backdrop colour behind the image (defaults to the project's tone.bg) */
  background?: string;
  /**
   * Show the image small and centred at this CSS width, e.g. 'clamp(9rem, 18%, 17rem)'.
   * Used for minimal logo covers.
   */
  size?: string;
}

export type GalleryBlock =
  | { layout: 'full'; media: MediaAsset }
  | { layout: 'pair'; media: [MediaAsset, MediaAsset] }
  | { layout: 'text-image'; title: string; body: string; media: MediaAsset; reverse?: boolean }
  | { layout: 'video'; media: MediaAsset }
  /** One large image with a smaller one overlapping its corner */
  | { layout: 'large-small'; media: [MediaAsset, MediaAsset]; reverse?: boolean }
  /** Three or more images layered as a collage */
  | { layout: 'collage'; media: MediaAsset[] }
  /** Large typography between visuals */
  | { layout: 'statement'; text: string }
  /** Desktop screenshot in a minimal browser frame (natural 16:10, no crop) */
  | { layout: 'browser'; media: MediaAsset; url?: string }
  /** Mobile screens in phone frames, side by side */
  | { layout: 'phones'; media: MediaAsset[]; caption?: string }
  /** A row of images at a shared natural ratio, e.g. '3 / 4' posters or '9 / 16' mockups */
  | { layout: 'strip'; media: MediaAsset[]; ratio: string; caption?: string }
  /** One image or video, full width at its true proportions (no crop) — for design boards and clips */
  | { layout: 'board'; media: MediaAsset; ratio?: '16/10' | '16/9' | '4/3' };

export interface JournalEntry {
  id: string;
  /** e.g. 'The idea', 'Research', 'What changed' */
  title: string;
  date?: string;
  body: string;
  media?: MediaAsset[];
}

export interface OngoingDetails {
  phase: Phase;
  /** 0–100. Set honestly — this is shown publicly. */
  progress: number;
  /** ISO date, 'YYYY-MM-DD' */
  lastUpdated: string;
  currentStage: Stage;
  /** One-line status shown in the log */
  statusNote: string;
  journal: JournalEntry[];
  next: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Square photo, optional */
  photo?: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  categories: Category[];
  /** Human-readable discipline line, e.g. 'Brand Identity / Digital Experience' */
  discipline: string;
  type: 'Client Project' | 'Studio Project' | 'Self-initiated' | 'Agency Work';
  status: 'Completed' | 'Ongoing';
  /** True for dummy entries that should be replaced with real work. */
  placeholder?: boolean;
  /** One sentence for cards */
  summary: string;
  description: string;
  tone: Tone;
  thumbnail: MediaAsset;
  heroImage: MediaAsset;
  gallery: GalleryBlock[];
  services: string[];
  challenge: string;
  approach: string;
  outcome: string;
  website?: string;
  /**
   * Work made in-house at an agency before Dsquare: who it was made at and the role held.
   * Shown in the project meta and as a credit line, so the agency and team get their due.
   */
  credit?: { agency: string; role: string; period?: string; note: string };
  /** The client's words, exactly as given */
  testimonial?: Testimonial;
  featured: boolean;
  /**
   * Optional designed cover for the homepage project card (instead of the thumbnail).
   * 'logo-construction': the logo small and centred inside construction geometry.
   */
  cover?: { type: 'logo-construction'; src: string; alt: string; color: string };
  /** Optional cover for the top of the project's own page (instead of heroImage). */
  pageCover?: MediaAsset;
  ongoing?: OngoingDetails;
}
