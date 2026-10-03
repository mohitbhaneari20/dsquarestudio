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

/** The first colour in a project's palette that stays visible on the light page. */
export function visibleOnLight(tone: { bg: string; ink: string; accent?: string }): string {
  return [tone.bg, tone.accent, tone.ink].find((c): c is string => !!c && !isLight(c)) ?? tone.ink;
}
