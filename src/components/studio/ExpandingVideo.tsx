import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';

/** Scroll timeline (0 → 1 across the pinned stretch): grow, hold full screen, shrink back. */
const GROW = [0.0, 0.3] as const;
const SHRINK = [0.7, 1.0] as const;

/**
 * A video panel that sits in the page at its normal size. As you scroll, the
 * section pins and the panel grows to cover the whole screen, stays there while
 * the video plays, then shrinks back into its place and the page scrolls on.
 * Leave out `src` to show a placeholder.
 */
export function ExpandingVideo({
  src,
  poster,
  label = 'Video',
  gap = 80,
  gapBelow = 80,
}: {
  src?: string;
  poster?: string;
  label?: string;
  /** Visible space (px) between whatever sits above and the panel at rest */
  gap?: number;
  /** Visible space (px) between the panel at rest and whatever comes next */
  gapBelow?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, vw: 0, vh: 0 });
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // The panel's resting size (the content column) and the screen size it grows to
  useLayoutEffect(() => {
    const measure = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const w = slot.clientWidth;
      setSize({ w, h: (w * 9) / 16, vw: window.innerWidth, vh: window.innerHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (slotRef.current) ro.observe(slotRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // 0 at rest → 1 at full screen; eased so the grow and shrink feel smooth
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  const amount = (p: number) => {
    if (p <= GROW[0] || p >= SHRINK[1]) return 0;
    if (p < GROW[1]) return ease((p - GROW[0]) / (GROW[1] - GROW[0]));
    if (p <= SHRINK[0]) return 1;
    return ease(1 - (p - SHRINK[0]) / (SHRINK[1] - SHRINK[0]));
  };
  // Read live measurements on every frame, so a resize never leaves stale sizes
  const width = useTransform(scrollYProgress, (p) => {
    const { w, vw } = sizeRef.current;
    return w + (vw - w) * amount(p);
  });
  const height = useTransform(scrollYProgress, (p) => {
    const { h, vh } = sizeRef.current;
    return h + (vh - h) * amount(p);
  });
  // Re-apply once measured (before any scroll)
  useLayoutEffect(() => {
    const p = scrollYProgress.get();
    width.set(sizeRef.current.w + (sizeRef.current.vw - sizeRef.current.w) * amount(p));
    height.set(sizeRef.current.h + (sizeRef.current.vh - sizeRef.current.h) * amount(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    // The panel rests centred in the screen-tall pinned area; trimming that centring offset
    // above and below makes the visible space exactly `gap` / `gapBelow`
    <section ref={sectionRef} className="relative h-[300svh]" style={{ marginTop: gap - Math.max(0, (size.vh - size.h) / 2), marginBottom: gapBelow - Math.max(0, (size.vh - size.h) / 2) }} aria-label={label}>
      {/* Click-through outside the panel, since the pinned area overlaps the text above */}
      <div className="pointer-events-none sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Invisible slot that defines the resting size, aligned with the page's content column */}
        <div className="container-site pointer-events-none absolute inset-x-0">
          <div ref={slotRef} className="w-full" />
        </div>
        <motion.div className="pointer-events-auto relative z-10 overflow-hidden bg-black" style={{ width, height }}>
          {src ? (
            <video src={src} poster={poster} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" aria-label={label} />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-4 text-[#fafafa]"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(250 250 250 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(250 250 250 / 0.06) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
              role="img"
              aria-label={`${label} placeholder`}
            >
              <span className="flex size-16 items-center justify-center bg-accent">
                <Play size={22} strokeWidth={1.75} className="ml-0.5 text-[#fafafa]" aria-hidden="true" />
              </span>
              <span className="text-meta text-[#fafafa]/60">Video placeholder</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
