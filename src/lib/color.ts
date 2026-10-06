function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mix `color` into `base` by `amount` (0–1). Returns rgb() so it can be animated. */
export function mix(color: string, base: string, amount: number): string {
  const [r1, g1, b1] = parseHex(color);
  const [r2, g2, b2] = parseHex(base);
  const m = (a: number, b: number) => Math.round(b + (a - b) * amount);
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`;
}

/** Rough perceived lightness check (0–1 luminance > 0.7). */
export function isLight(hex: string): boolean {
  const [r, g, b] = parseHex(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.7;
}

function luminance([r, g, b]: [number, number, number]) {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

const toHex = (rgb: number[]) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/**
 * A project's palette colour that reads as small text on the light page: the first
 * non-light colour, deepened step by step (same hue) until it reaches 4.5:1 on sand.
 */
export function visibleOnLight(tone: { bg: string; ink: string; accent?: string }, page = '#e6e1d8'): string {
  const base = [tone.bg, tone.accent, tone.ink].find((c): c is string => !!c && !isLight(c)) ?? tone.ink;
  let rgb = parseHex(base) as number[];
  for (let i = 0; i < 30 && contrast(toHex(rgb), page) < 4.5; i++) rgb = rgb.map((v) => v * 0.94);
  return toHex(rgb);
}
