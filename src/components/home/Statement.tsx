import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';
import { useReduceMotion } from '../../lib/motionPreference';

const words = ['Design', 'Develop', 'Deploy'];

/**
 * The three full-screen cards. Each plays a short looping motion clip (no text, objects only);
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
    tone: 'bg-black-soft text-[#fafafa]',
  },
];

/** Hand-drawn style loop around a word; draws itself in when scrolled into view. */
function Scribble({ children }: { children: string }) {
  const reduce = useReduceMotion();
  return (
    <span className="relative inline-block px-[0.15em]">
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute -inset-x-[12%] -inset-y-[22%] h-[144%] w-[124%]" aria-hidden="true">
        <motion.path
          d="M18 44 C 20 14, 120 4, 176 22 C 204 32, 190 66, 120 72 C 60 77, 8 66, 14 40 C 18 26, 60 16, 104 14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.4}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        />
      </svg>
    </span>
  );
}

/** Stand-in for a card's image until a real one is added. */
function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full min-h-56 w-full flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-current/30"
      style={{
        backgroundImage:
          'linear-gradient(color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
      role="img"
      aria-label={`${label} image placeholder`}
    >
      <span className="flex flex-col items-center gap-3 opacity-70">
        <ImageIcon size={28} strokeWidth={1.25} aria-hidden="true" />
        <span className="text-meta">Image placeholder — {label}</span>
      </span>
    </div>
  );
}

/**
 * Card clip that only downloads and plays when its panel is on (or next to) the screen,
 * so the home page doesn't fetch all three videos up front.
 */
function PanelVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: '0px 100% 0px 100%' });
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

function DisciplineCard({ d, index }: { d: (typeof disciplines)[number]; index: number }) {
  return (
    <article className={`relative flex h-full w-1/4 shrink-0 ${d.tone}`} aria-roledescription="slide" aria-label={`${index + 1} of 3: ${d.title}`}>
      <div className="container-site grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr] gap-6 pb-10 pt-24 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-10 md:pt-20">
        <div className="md:col-span-5">
          <p className="text-meta flex items-center gap-2 opacity-70">
            <SquareBullet /> {String(index + 1).padStart(2, '0')} / 03
          </p>
          <h3 className="text-condensed mt-4 text-[clamp(4rem,11vw,10rem)] leading-[0.9]">{d.title}</h3>
          <p className="mt-6 text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-0.02em]">{d.headline}</p>
          <p className="mt-4 max-w-md opacity-75">{d.body}</p>
        </div>
        <div className="min-h-0 md:col-span-7 md:h-[72svh]">
          {d.video ? (
            <PanelVideo src={d.video} />
          ) : d.image ? (
            <img src={d.image} alt={d.title} className="h-full w-full rounded-[var(--radius-lg)] object-cover" />
          ) : (
            <ImagePlaceholder label={d.title} />
          )}
        </div>
      </div>
    </article>
  );
}

/** First panel: the three condensed Ds and the one-liner, on black. */
function IntroPanel() {
  return (
    <div className="theme-inverse flex h-full w-1/4 shrink-0 items-center justify-center">
      <div className="container-site flex flex-col items-center text-center">
        <h2 className="text-condensed text-[min(15vw,21svh)] leading-[0.92]" aria-label="Design, develop, deploy">
          {words.map((w, i) => (
            <Reveal key={w} delay={i * 0.08}>
              <span className="block">{w}</span>
            </Reveal>
          ))}
        </h2>
        <Reveal delay={0.3}>
          <p className="mt-[4svh] text-[clamp(1.4rem,3vw,2.8rem)] font-medium leading-tight tracking-[-0.03em]">
            Three Ds. <Scribble>One</Scribble> studio.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/**
 * Design / Develop / Deploy as one sideways-scrolling run of full-screen panels:
 * the black intro, then the three cards. The section pins as soon as it reaches
 * the top of the screen, the panels slide left one after another while you scroll
 * down, and normal vertical scrolling resumes straight after the last card.
 */
function DisciplineCards() {
  const ref = useRef<HTMLElement>(null);
  const panels = disciplines.length + 1; // intro + cards
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Slide the track (all panels side by side) until the last panel fills the screen
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((panels - 1) / panels) * 100}%`]);

  return (
    <section ref={ref} className="relative z-10" style={{ height: `${panels * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="flex h-full w-[400%] will-change-transform" style={{ x }}>
          <IntroPanel />
          {disciplines.map((d, i) => (
            <DisciplineCard key={d.title} d={d} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function Statement() {
  return <DisciplineCards />;
}
