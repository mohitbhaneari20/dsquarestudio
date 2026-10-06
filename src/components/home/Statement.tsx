import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { SquareBullet } from '../ui/SquareBullet';
import { useReduceMotion } from '../../lib/motionPreference';

/**
 * The three discipline cards. Each plays a short looping motion clip (no text, objects only);
 * set `image` instead of `video` to use a still, or leave both out for the placeholder.
 * `tone` picks the card's colours from the palette.
 */
const disciplines: Array<{ title: string; headline: string; body: string; image?: string; video?: string; tone: string }> = [
  {
    title: 'Design',
    headline: 'Work out what it should be.',
    body: 'Brand, interface and experience — shaped around what people need to understand and do.',
    video: '/assets/home/design.mp4',
    tone: 'bg-accent text-black',
  },
  {
    title: 'Develop',
    headline: 'Make it real, not just pretty.',
    body: 'Responsive, accessible builds in code or no-code, made from the same decisions as the design.',
    video: '/assets/home/develop.mp4',
    tone: 'bg-sand text-black',
  },
  {
    title: 'Deploy',
    headline: 'Ship it, then keep improving.',
    body: 'Launch is a checkpoint. We test, adjust and keep the work moving after it goes live.',
    video: '/assets/home/deploy.mp4',
    tone: 'bg-black-soft text-[#fafafa] ring-1 ring-inset ring-white/15',
  },
];

/**
 * Card clip that only downloads and plays when its panel is on (or next to) the screen,
 * so the home page doesn't fetch all three videos up front.
 */
function PanelVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: '50% 0px 50% 0px' });
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (near) setLoad(true);
    const v = ref.current;
    if (!v) return;
    if (near) v.play().catch(() => {});
    else v.pause();
  }, [near, load]);
  return (
    <video
      ref={ref}
      src={load ? src : undefined}
      className="h-full w-full rounded-[var(--radius-lg)] border border-current/15 object-cover"
      muted
      loop
      playsInline
      preload={load ? 'auto' : 'none'}
      aria-hidden="true"
    />
  );
}

/** One discipline as a floating card: the looping clip on top, then number, title and two lines. */
function DisciplineCard({ d, index }: { d: (typeof disciplines)[number]; index: number }) {
  return (
    <article
      className={`flex flex-col p-4 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45)] md:p-5 ${d.tone}`}
      aria-label={`${index + 1} of 3: ${d.title}`}
    >
      <div className="aspect-[4/3] max-h-[32svh] w-full overflow-hidden">{d.video && <PanelVideo src={d.video} />}</div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h3 className="text-condensed text-[clamp(2.25rem,3.6vw,3.75rem)] uppercase leading-[0.9]">{d.title}</h3>
        <span className="text-condensed text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[0.9]" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <p className="mt-3 text-lg font-medium leading-tight tracking-[-0.02em]">{d.headline}</p>
      <p className="mt-2 text-sm opacity-80">{d.body}</p>
    </article>
  );
}

/** The big type behind the cards: three lines, the Ds picked out in orange. */
function Heading({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-meta flex items-center justify-center gap-2 text-muted">
        <SquareBullet /> Design · Develop · Deploy
      </p>
      <h2
        className="text-condensed mt-4 text-[min(19vw,24svh)] uppercase leading-[0.96] tracking-[-0.01em]"
        aria-label="Three Ds, one studio."
      >
        <span aria-hidden="true" className="block">
          Three <span className="text-accent">D<span className="normal-case">s</span>,</span>
        </span>
        <span aria-hidden="true" className="block">one</span>
        <span aria-hidden="true" className="block">studio.</span>
      </h2>
    </div>
  );
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Where each card comes to rest — a slightly untidy stack, like cards dropped on a table. */
const REST = [
  { rotate: -7, x: '-14%' },
  { rotate: 5, x: '12%' },
  { rotate: -1.5, x: '0%' },
];

/** A card floating up from below and settling on the stack in the middle of the screen. */
function FloatingCard({ d, index, progress }: { d: (typeof disciplines)[number]; index: number; progress: MotionValue<number> }) {
  // Cards arrive in turn: 0.18–0.4, 0.42–0.64, 0.66–0.88 of the pinned stretch
  const start = 0.18 + index * 0.24;
  const end = start + 0.22;
  const rest = REST[index]!;
  const y = useTransform(progress, [start, end], ['115svh', '0svh'], { ease: easeOut });
  const rotate = useTransform(progress, [start, end], [index % 2 ? -14 : 14, rest.rotate], { ease: easeOut });
  // Settled cards sink back a touch as the next one lands on top
  const next = start + 0.24;
  const scale = useTransform(progress, [next, next + 0.22], [1, index < 2 ? 0.94 : 1]);
  return (
    <motion.li className="absolute inset-0 flex items-center justify-center" style={{ y }}>
      <motion.div className="w-[min(70vw,22rem)] lg:w-[min(28vw,26rem)]" style={{ rotate, scale, x: rest.x }}>
        <DisciplineCard d={d} index={index} />
      </motion.div>
    </motion.li>
  );
}

/**
 * Design / Develop / Deploy. The section pins: the big heading sinks back and blurs,
 * then the three cards float up one after another and stack in the middle of the
 * screen. After the third lands the page carries on. Reduced motion shows the
 * heading and the cards in a simple grid.
 */
function DisciplineCards() {
  const reduce = useReduceMotion();
  if (reduce) {
    return (
      <section className="theme-inverse relative z-10 py-[var(--section-space)]" aria-label="Design, develop, deploy">
        <div className="container-site">
          <Heading />
          <ul className="mt-12 grid gap-[var(--grid-gap)] md:grid-cols-3">
            {disciplines.map((d, i) => (
              <li key={d.title}>
                <DisciplineCard d={d} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  return <PinnedDisciplines />;
}

/** The pinned version. Kept separate so its scroll tracking starts fresh whenever motion is switched on. */
function PinnedDisciplines() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The heading steps back: smaller, softer, quieter
  const headScale = useTransform(scrollYProgress, [0.02, 0.2], [1, 0.9]);
  const headBlur = useTransform(scrollYProgress, [0.02, 0.2], ['blur(0px)', 'blur(14px)']);
  const headOpacity = useTransform(scrollYProgress, [0.02, 0.2], [1, 0.4]);

  return (
    <section ref={ref} className="theme-inverse relative z-10 h-[420svh]" aria-label="Design, develop, deploy">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden pt-[var(--nav-height)]">
        <motion.div className="container-site will-change-[filter,transform]" style={{ scale: headScale, filter: headBlur, opacity: headOpacity }}>
          <Heading />
        </motion.div>
        <ul className="absolute inset-0 top-[var(--nav-height)]">
          {disciplines.map((d, i) => (
            <FloatingCard key={d.title} d={d} index={i} progress={scrollYProgress} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Statement() {
  return <DisciplineCards />;
}
