import { motion, useScroll, useTransform } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { processSteps, type ProcessStep } from '../../data/services';
import { pad } from '../../lib/format';

function MemePlaceholder({ step }: { step: ProcessStep }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-foreground/25 p-6 text-center"
      style={{
        backgroundImage:
          'linear-gradient(color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      role="img"
      aria-label={`Meme placeholder — ${step.title}`}
    >
      <ImageIcon size={26} strokeWidth={1.25} className="text-muted" aria-hidden="true" />
      <p className="text-meta text-muted">Meme — {step.title}</p>
      <p className="max-w-[16rem] text-sm text-muted">{step.memeIdea}</p>
    </div>
  );
}

function Card({ step, index }: { step: ProcessStep; index: number }) {
  return (
    // Width from the content area: 1¼ cards on phones, 2¼ on larger screens (two whole, a quarter of the third)
    <article className="flex w-[calc((100cqw-var(--grid-gap))/1.25)] shrink-0 flex-col border border-border bg-surface md:w-[calc((100cqw-2*var(--grid-gap))/2.25)]">
      <div className="flex items-baseline justify-between border-b border-border px-5 py-4">
        <h3 className="text-h3">{step.title}</h3>
        <span className="text-meta text-accent">
          {pad(index + 1)} / {pad(processSteps.length)}
        </span>
      </div>
      <div className="aspect-[16/9] max-h-[36svh] p-5 pb-0">
        {step.meme ? (
          <img src={step.meme} alt={`${step.title} meme`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <MemePlaceholder step={step} />
        )}
      </div>
      <p className="px-5 pb-6 pt-5 text-muted">{step.body}</p>
    </article>
  );
}

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
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (stickyRef.current) ro.observe(stickyRef.current);
    return () => ro.disconnect();
  }, []);

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

  return (
    <section ref={sectionRef} className="relative" style={{ height: stickyH + distance }} aria-label="How we work, step by step">
      <div ref={stickyRef} className="sticky top-0 overflow-hidden py-[var(--section-space)]">
        <div ref={viewportRef} className="container-site [container-type:inline-size]">
          {header && <div className="mb-8 md:mb-10">{header}</div>}
          <motion.div ref={trackRef} className="flex w-max gap-[var(--grid-gap)] will-change-transform" style={{ x }}>
            {processSteps.map((step, i) => (
              <Card key={step.title} step={step} index={i} />
            ))}
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
