import { motion, useInView } from 'framer-motion';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useReduceMotion } from '../../lib/motionPreference';

/*
 * Illustrations for the five steps. Each is a "before → after" pair in the same
 * language: white points and lines on black, the key point in studio orange, and the
 * "after" lines drawing themselves in when the card comes into view.
 */

const WHITE = '#fafafa';
const ORANGE = '#FA5C01';
const L = 112; // centre of the left figure
const R = 288; // centre of the right figure
const CY = 132;

/** Whether the drawing should be shown, and whether to animate getting there. */
const DrawContext = createContext({ drawn: true, still: true });

function Dot({ x, y, hot = false, dim = false }: { x: number; y: number; hot?: boolean; dim?: boolean }) {
  return <circle cx={x} cy={y} r={hot ? 8 : 7} fill={hot ? ORANGE : WHITE} opacity={dim ? 0.3 : 1} />;
}

/** A static line (the "before" side). */
function Still({ d, dashed = false, dim = false, width = 2 }: { d: string; dashed?: boolean; dim?: boolean; width?: number }) {
  return <path d={d} fill="none" stroke={WHITE} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '3 7' : undefined} opacity={dim ? 0.3 : 0.9} />;
}

/** A line that draws itself in (the "after" side). `order` staggers it. */
function Draw({ d, order = 0, colour = WHITE, width = 2 }: { d: string; order?: number; colour?: string; width?: number }) {
  const { drawn, still } = useContext(DrawContext);
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={colour}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={still ? false : { pathLength: 0, opacity: 0 }}
      animate={drawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: still ? 0 : 0.5, delay: still ? 0 : 0.25 + order * 0.12, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

function Labels({ left, right }: { left: string; right: string }) {
  return (
    <g fill={WHITE} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em' }} textAnchor="middle">
      <text x={L} y={232}>
        {left}
      </text>
      <text x={R} y={232}>
        {right}
      </text>
    </g>
  );
}

const line = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;

/* ─── 01 Understand: the same five points, loose, then joined into a square ─── */
function Understand() {
  const h = 46;
  const pts = (cx: number) => ({ tl: [cx - h, CY - h], tr: [cx + h, CY - h], br: [cx + h, CY + h], bl: [cx - h, CY + h], c: [cx, CY] }) as const;
  const a = pts(L);
  const b = pts(R);
  const links: Array<[keyof typeof b, keyof typeof b]> = [
    ['tl', 'tr'], ['tr', 'br'], ['br', 'bl'], ['bl', 'tl'], ['tl', 'c'], ['c', 'br'], ['tr', 'c'], ['c', 'bl'],
  ];
  return (
    <>
      {(['tl', 'tr', 'br', 'bl', 'c'] as const).map((k) => <Dot key={`a${k}`} x={a[k][0]} y={a[k][1]} hot={k === 'c'} />)}
      {links.map(([p, q], i) => <Draw key={`${p}${q}`} d={line(b[p] as [number, number], b[q] as [number, number])} order={i} />)}
      {(['tl', 'tr', 'br', 'bl', 'c'] as const).map((k) => <Dot key={`b${k}`} x={b[k][0]} y={b[k][1]} hot={k === 'c'} />)}
      <Labels left="INFORMATION" right="UNDERSTANDING" />
    </>
  );
}

/* ─── 02 Explore: one question, then five directions from it ─── */
const FAN = [-56, -28, 0, 28, 56];
function Explore() {
  const o: [number, number] = [R - 52, CY];
  return (
    <>
      {/* A single point, with a faint ring of possibility around it */}
      <circle cx={L} cy={CY} r={30} fill="none" stroke={WHITE} strokeWidth={1.5} strokeDasharray="3 7" opacity={0.5} />
      <Dot x={L} y={CY} hot />
      {FAN.map((dy, i) => <Draw key={dy} d={`M${o[0]} ${o[1]} C${o[0] + 40} ${o[1]}, ${R + 12} ${CY + dy}, ${R + 52} ${CY + dy}`} order={i} />)}
      {FAN.map((dy) => <Dot key={`e${dy}`} x={R + 52} y={CY + dy} />)}
      <Dot x={o[0]} y={o[1]} hot />
      <Labels left="QUESTION" right="DIRECTIONS" />
    </>
  );
}

/* ─── 03 Design: five options, then one direction picked out ─── */
function Design() {
  const fan = (cx: number) => ({ o: [cx - 52, CY] as [number, number], ends: FAN.map((dy) => [cx + 52, CY + dy] as [number, number]) });
  const a = fan(L);
  const b = fan(R);
  const chosen = 1;
  const curve = (o: [number, number], e: [number, number]) => `M${o[0]} ${o[1]} C${o[0] + 40} ${o[1]}, ${e[0] - 40} ${e[1]}, ${e[0]} ${e[1]}`;
  return (
    <>
      {a.ends.map((e) => <Still key={`a${e[1]}`} d={curve(a.o, e)} />)}
      {a.ends.map((e) => <Dot key={`ad${e[1]}`} x={e[0]} y={e[1]} />)}
      <Dot x={a.o[0]} y={a.o[1]} hot />

      {b.ends.map((e, i) => (i === chosen ? null : <Still key={`b${e[1]}`} d={curve(b.o, e)} dim />))}
      <Draw d={curve(b.o, b.ends[chosen]!)} colour={ORANGE} width={3} />
      {b.ends.map((e, i) => <Dot key={`bd${e[1]}`} x={e[0]} y={e[1]} hot={i === chosen} dim={i !== chosen} />)}
      <Dot x={b.o[0]} y={b.o[1]} hot />
      <Labels left="OPTIONS" right="DIRECTION" />
    </>
  );
}

/* ─── 04 Build: a dashed sketch, then the same grid made solid ─── */
function Build() {
  const s = 46;
  const grid = (cx: number) => [-1, 0, 1].flatMap((r) => [-1, 0, 1].map((c) => [cx + c * s, CY + r * s] as [number, number]));
  const rows = (cx: number) => [-1, 0, 1].flatMap((k) => [line([cx - s, CY + k * s], [cx + s, CY + k * s]), line([cx + k * s, CY - s], [cx + k * s, CY + s])]);
  return (
    <>
      {rows(L).map((d) => <Still key={`a${d}`} d={d} dashed />)}
      {grid(L).map(([x, y], i) => <Dot key={`ad${i}`} x={x} y={y} hot={i === 4} />)}
      {rows(R).map((d, i) => <Draw key={`b${d}`} d={d} order={i} />)}
      {grid(R).map(([x, y], i) => <Dot key={`bd${i}`} x={x} y={y} hot={i === 4} />)}
      <Labels left="SKETCH" right="STRUCTURE" />
    </>
  );
}

/* ─── 05 Refine: a jagged first pass, then a smooth line through the same points ─── */
function Refine() {
  const xs = [-56, -28, 0, 28, 56];
  const rough = [24, -30, 14, -38, 6];
  const smooth = [26, 4, -10, -20, -30];
  const pts = (cx: number, ys: number[]) => xs.map((dx, i) => [cx + dx, CY + ys[i]!] as [number, number]);
  const a = pts(L, rough);
  const b = pts(R, smooth);
  // Catmull-Rom through the points, as cubic Béziers
  const curve = (p: [number, number][]) =>
    p.reduce((d, pt, i) => {
      if (i === 0) return `M${pt[0]} ${pt[1]}`;
      const p0 = p[i - 2] ?? p[i - 1]!;
      const p1 = p[i - 1]!;
      const p3 = p[i + 1] ?? pt;
      return `${d} C${p1[0] + (pt[0] - p0[0]) / 6} ${p1[1] + (pt[1] - p0[1]) / 6}, ${pt[0] - (p3[0] - p1[0]) / 6} ${pt[1] - (p3[1] - p1[1]) / 6}, ${pt[0]} ${pt[1]}`;
    }, '');
  return (
    <>
      <Still d={`M${a.map((p) => p.join(' ')).join(' L')}`} />
      {a.map(([x, y], i) => <Dot key={`a${i}`} x={x} y={y} hot={i === a.length - 1} />)}
      <Draw d={curve(b)} colour={ORANGE} width={3} />
      {b.map(([x, y], i) => <Dot key={`b${i}`} x={x} y={y} hot={i === b.length - 1} />)}
      <Labels left="FIRST PASS" right="REFINED" />
    </>
  );
}

const ART: Array<{ draw: () => ReactNode; label: string }> = [
  { draw: Understand, label: 'Understand — five loose points of information, then the same points joined into a square: understanding' },
  { draw: Explore, label: 'Explore — a single question, then five directions branching out from it' },
  { draw: Design, label: 'Design — five options, then one direction picked out in orange while the rest fade' },
  { draw: Build, label: 'Build — a dashed sketch of a grid, then the same grid made solid: structure' },
  { draw: Refine, label: 'Refine — a jagged first pass, then a smooth line through the same points' },
];

/** The illustration for step `index` (0–4), on a black panel. */
export function StepArt({ index }: { index: number }) {
  const reduce = useReduceMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const art = ART[index];
  if (!art) return null;
  const Draw = art.draw;
  return (
    <svg ref={ref} viewBox="0 0 400 300" className="block h-full w-full bg-black" role="img" aria-label={art.label}>
      <DrawContext.Provider value={{ drawn: reduce || inView, still: reduce }}>
        <Draw />
      </DrawContext.Provider>
    </svg>
  );
}
