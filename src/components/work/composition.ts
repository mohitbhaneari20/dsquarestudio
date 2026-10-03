import { getProjectMedia } from '../../data/projects';
import type { MediaAsset, MediaKind, Project } from '../../data/types';

/**
 * Art-directed placements for the layered project composition.
 * Values are percentages of the stage (left/width of its width, top of its height).
 * `depth` scales the mouse parallax, `z` is stacking order.
 */
export interface Slot {
  left: number;
  top: number;
  width: number;
  rotate: number;
  depth: number;
  z: number;
}

const BASE_SLOTS: Slot[] = [
  { left: 24, top: 6, width: 48, rotate: -1, depth: 0.4, z: 2 }, // main
  { left: 3, top: 40, width: 24, rotate: 3, depth: 1, z: 3 },
  { left: 73, top: 3, width: 23, rotate: -4, depth: 0.7, z: 1 },
  { left: 66, top: 56, width: 18, rotate: 2.5, depth: 1.2, z: 4 },
];

const BASE_LABELS = [
  { left: 25, top: 0 },
  { left: 76, top: 49 },
  { left: 5, top: 90 },
  { left: 64, top: 93 },
];

/** Alternate projects mirror the layout so consecutive slides don't feel identical. */
export function slotsFor(index: number): Slot[] {
  if (index % 2 === 0) return BASE_SLOTS;
  return BASE_SLOTS.map((s) => ({ ...s, left: 100 - s.left - s.width, rotate: -s.rotate }));
}

export function labelSpotsFor(index: number) {
  if (index % 2 === 0) return BASE_LABELS;
  return BASE_LABELS.map((l) => ({ ...l, left: 100 - l.left - 14 }));
}

/** Shape of an asset inside the composition, by what it depicts. */
export function shapeFor(kind: MediaKind | undefined, isMain: boolean): { ratio: string; scale: number } {
  switch (kind) {
    case 'mobile':
      return { ratio: '9 / 16', scale: 0.5 };
    case 'poster':
      return { ratio: '3 / 4', scale: 0.8 };
    case 'logo':
      return { ratio: '1 / 1', scale: isMain ? 0.75 : 0.8 };
    default:
      return { ratio: isMain ? '16 / 10' : '4 / 3', scale: 1 };
  }
}

/** Up to `count` distinct visuals for a project. */
export function pickMedia(project: Project, count = 4): MediaAsset[] {
  const seen = new Set<string>();
  return getProjectMedia(project)
    .filter((m) => (seen.has(m.alt) ? false : (seen.add(m.alt), true)))
    .slice(0, count);
}

/** Editorial annotations for a project: categories, status and year. */
export function annotationsFor(project: Project): Array<{ text: string; live?: boolean }> {
  return [
    { text: project.categories[0] ?? project.discipline },
    { text: project.categories[1] ?? project.type },
    project.status === 'Ongoing' ? { text: 'Ongoing', live: true } : { text: 'Case study' },
    { text: project.year },
  ];
}
