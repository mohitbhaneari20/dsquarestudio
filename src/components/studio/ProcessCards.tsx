import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { forwardRef, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useReduceMotion } from '../../lib/motionPreference';
import { StepArt, type StepArtHandle } from './StepArt';
import { processSteps, type ProcessStep } from '../../data/services';
import { pad } from '../../lib/format';

const Card = forwardRef<StepArtHandle, { step: ProcessStep; index: number }>(function Card({ step, index }, ref) {
  return (
    // Width from the content area: 1¼ cards on phones, 2¼ on larger screens (two whole, a quarter of the third)
    <article className="flex w-[calc((100cqw-var(--grid-gap))/1.25)] shrink-0 flex-col border border-border bg-surface md:w-[calc((100cqw-2*var(--grid-gap))/2.25)]">
      <div className="flex items-baseline justify-between border-b border-border px-5 py-4">
        <h3 className="text-h3">{step.title}</h3>
        <span className="text-meta text-accent">
          {pad(index + 1)} / {pad(processSteps.length)}
        </span>
      </div>
      {/* Edge to edge, so the orange line runs straight on into the next card */}
      <div className="aspect-[4/3] max-h-[44svh] w-full overflow-hidden border-b border-border">
        <StepArt ref={ref} index={index} label={`${step.title} — illustration`} />
      </div>
      <p className="px-5 pb-6 pt-5 text-muted">{step.body}</p>
    </article>
  );
});

/** Where the orange line enters (left edge) and leaves (right edge) each illustration, in its own 800 × 600 units. */
const LINE_Y = [
  [270, 330],
  [330, 290],
  [290, 340],
  [340, 300],
  [300, 260],
] as const;

type Pt = { x: number; y: number };
type Geometry = {
  /** Horizontal span of each illustration in track pixels */
  arts: { x0: number; x1: number }[];
  /** Line pieces bridging the gap between cards, in track pixels */
  links: { from: Pt; to: Pt }[];
  /** Pixels per illustration unit (for stroke widths) */
  scale: number;
  width: number;
  height: number;
};

/**
 * "How we work" as a sideways scroll: the heading and cards pin together while
 * you scroll down, the five step cards slide in from the right, and normal
 * scrolling resumes after the last one. The pinned stretch is exactly as long as
 * the track overflows.
 */
export function ProcessCards({ header }: { header?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [stickyH, setStickyH] = useState(0);
  const dims = useRef({ distance: 0 });
  dims.current.distance = distance;

  const reduce = useReduceMotion();
  const arts = useRef<(StepArtHandle | null)[]>([]);
  const links = useRef<(SVGGElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const geoRef = useRef<Geometry | null>(null);

  // Where each illustration and each gap sits along the track, and where the line crosses the gaps
  const measureLine = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const t = track.getBoundingClientRect();
    const toTrack = (svg: SVGSVGElement, x: number, y: number): Pt => {
      const m = svg.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const p = new DOMPoint(x, y).matrixTransform(m);
      return { x: p.x - t.left, y: p.y - t.top };
    };
    const svgs = arts.current.map((a) => a?.svg ?? null);
    if (svgs.some((v) => !v)) return;
    const next: Geometry = { arts: [], links: [], scale: 1, width: track.scrollWidth, height: track.offsetHeight };
    svgs.forEach((svg, i) => {
      const r = svg!.getBoundingClientRect();
      next.arts.push({ x0: r.left - t.left, x1: r.right - t.left });
      next.scale = svg!.getScreenCTM()?.a ?? 1;
      const next1 = svgs[i + 1];
      if (next1) next.links.push({ from: toTrack(svg!, 800, LINE_Y[i]![1]), to: toTrack(next1, 0, LINE_Y[i + 1]![0]) });
    });
    geoRef.current = next;
    setGeo(next);
  }, []);

  // Draws the line up to a tip that sweeps across the screen as the cards slide by
  const paint = useCallback(
    (p: number) => {
      const g = geoRef.current;
      if (!g) return;
      const tip = reduce ? Infinity : p * g.width;
      const amount = (x0: number, x1: number) => Math.min(1, Math.max(0, (tip - x0) / Math.max(1, x1 - x0)));
      g.arts.forEach((a, i) => arts.current[i]?.setDrawn(amount(a.x0, a.x1)));
      g.links.forEach((l, i) => {
        const off = String(1 - amount(l.from.x, l.to.x));
        links.current[i]?.querySelectorAll('line').forEach((el) => (el.style.strokeDashoffset = off));
      });
    },
    [reduce],
  );

  // How far the track has to travel so the last card ends at the right edge
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const view = viewportRef.current;
      if (!track || !view) return;
      const cs = getComputedStyle(view);
      const inner = view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setDistance(Math.max(0, track.scrollWidth - inner));
      if (stickyRef.current) setStickyH(stickyRef.current.offsetHeight);
      measureLine();
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (stickyRef.current) ro.observe(stickyRef.current);
    return () => ro.disconnect();
  }, [measureLine]);

  // Pinned from the moment the section's top reaches the top of the screen, for exactly
  // `distance` pixels of scrolling (the pinned block is only as tall as its content)
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) => {
    const el = sectionRef.current;
    const d = dims.current.distance;
    if (!el || d <= 0) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.min(1, Math.max(0, (y - top) / d));
  });
  const x = useTransform(progress, (p) => -p * dims.current.distance);
  const bar = progress;
  useMotionValueEvent(progress, 'change', paint);
  // Repaint once the geometry is known (and after any resize)
  useLayoutEffect(() => paint(progress.get()), [geo, paint, progress]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: stickyH + distance }} aria-label="How we work, step by step">
      <div ref={stickyRef} className="sticky top-0 overflow-hidden py-[var(--section-space)]">
        <div ref={viewportRef} className="container-site [container-type:inline-size]">
          {header && <div className="mb-8 md:mb-10">{header}</div>}
          <motion.div ref={trackRef} className="relative flex w-max gap-[var(--grid-gap)] will-change-transform" style={{ x }}>
            {processSteps.map((step, i) => (
              <Card
                key={step.title}
                step={step}
                index={i}
                ref={(h) => {
                  arts.current[i] = h;
                }}
              />
            ))}
            {/* The line carries on across the gaps between cards */}
            {geo && (
              <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={geo.width} height={geo.height} aria-hidden="true">
                {geo.links.map((l, i) => (
                  <g
                    key={i}
                    ref={(el) => {
                      links.current[i] = el;
                    }}
                  >
                    <line
                      x1={l.from.x}
                      y1={l.from.y}
                      x2={l.to.x}
                      y2={l.to.y}
                      stroke="#FA5C01"
                      strokeWidth={4.5 * geo.scale}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                    />
                  </g>
                ))}
              </svg>
            )}
          </motion.div>
          {/* Progress through the steps */}
          <div className="mt-8 h-px w-full bg-border">
            <motion.div className="h-[2px] origin-left bg-accent" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
