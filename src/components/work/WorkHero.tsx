import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Project } from '../../data/types';
import { pad } from '../../lib/format';
import { ProjectVisual } from '../ui/ProjectVisual';
import { TextReveal } from '../ui/TextReveal';
import { StudioClock } from './EdgeDetails';
import { useReduceMotion } from '../../lib/motionPreference';
import { InlineMonogram } from '../brand/Brand';

const disciplines = ['Brand identities.', 'Digital products.', 'Websites.', 'Experiments.'];

/** How long each card stays on top before the stack shuffles (ms). */
const SHUFFLE_EVERY = 2800;

/**
 * Small fanned stack of project covers — the offset visual next to the headline.
 * Every few seconds the top card lifts off and tucks in at the back, so each
 * project gets its turn in front. Pauses on hover; still with reduced motion.
 */
function CoverStack({ projects }: { projects: Project[] }) {
  const reduce = useReduceMotion();
  const covers = projects.slice(0, 3);
  const fan = [
    { x: -40, y: 10, rotate: -9 },
    { x: 0, y: -6, rotate: 2 },
    { x: 44, y: 14, rotate: 11 },
  ];
  // order[slot] = index of the cover sitting in that slot; the last slot is on top
  const [cycles, setCycles] = useState(0);
  const [order, setOrder] = useState(() => covers.map((_, i) => i));
  const [paused, setPaused] = useState(false);
  const shuffled = cycles > 0;

  useEffect(() => {
    if (reduce || paused || covers.length < 2) return;
    const id = window.setInterval(() => {
      setOrder((o) => [o[o.length - 1]!, ...o.slice(0, -1)]);
      setCycles((c) => c + 1);
    }, SHUFFLE_EVERY);
    return () => window.clearInterval(id);
  }, [reduce, paused, covers.length]);

  return (
    <div
      className="relative mx-auto aspect-[4/3] w-52 xl:w-64"
      aria-hidden="true"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {covers.map((p, i) => {
        const slot = order.indexOf(i);
        const f = fan[slot] ?? fan[0]!;
        // The card going from the top to the back lifts up and out first
        const toBack = cycles > 0 && slot === 0 && covers.length > 1;
        return (
          <motion.div
            key={p.slug}
            className="absolute inset-0 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
            initial={reduce ? false : { x: 0, y: 40, rotate: 0, opacity: 0 }}
            animate={
              toBack && !reduce
                ? { x: [null, f.x + 90, f.x], y: [null, f.y - 70, f.y], rotate: [null, f.rotate + 14, f.rotate], zIndex: [covers.length, covers.length, 0], opacity: 1 }
                : { ...f, zIndex: slot, opacity: 1 }
            }
            whileHover={reduce ? undefined : { y: f.y - 10 }}
            transition={
              toBack
                ? { duration: 0.9, ease: [0.65, 0, 0.35, 1], times: [0, 0.45, 1] }
                : { type: 'spring', stiffness: 120, damping: 18, delay: shuffled ? 0.15 : 0.5 + i * 0.08 }
            }
          >
            <ProjectVisual media={p.thumbnail} tone={p.tone} label={p.title} className="h-full w-full rounded-sm" />
          </motion.div>
        );
      })}
      <span className="text-meta absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted">
        <InlineMonogram className="text-accent" /> — index
      </span>
    </div>
  );
}

export function WorkHero({ projects }: { projects: Project[] }) {
  return (
    <section className="container-site relative pt-28 md:pt-36">
      <div className="grid-site border-t border-border pt-4">
        <p className="text-meta col-span-8 md:col-span-4">Selected work / 2024—2026</p>
        <StudioClock className="text-meta hidden text-muted md:col-span-5 md:block" />
        <p className="text-meta col-span-4 text-right text-muted md:col-span-3">{pad(projects.length)} projects</p>
      </div>

      <div className="grid-site mt-10 items-end gap-y-12 md:mt-14">
        <TextReveal
          as="h1"
          immediate
          lines={['Things', 'we’ve', 'made.']}
          className="col-span-12 text-[clamp(4.5rem,17vw,19rem)] font-medium uppercase leading-[0.8] tracking-[-0.065em] lg:col-span-8"
        />

        <div className="col-span-12 flex items-end justify-between gap-10 lg:col-span-4 lg:flex-col lg:items-stretch lg:gap-24 lg:pb-4">
          <div className="hidden lg:block">
            <CoverStack projects={projects} />
          </div>
          <motion.ul
            className="text-lead space-y-0.5 lg:self-end lg:text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="mt-14 flex items-center justify-between border-b border-border pb-4 md:mt-20">
        <a href="#showcase" className="text-meta group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
          Scroll to explore
          <ArrowDown size={12} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
        </a>
        <p className="text-meta hidden text-muted sm:block">Somewhere between Figma and production.</p>
      </div>
    </section>
  );
}
