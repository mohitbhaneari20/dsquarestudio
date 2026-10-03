import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { Project } from '../../data/types';
import { pad } from '../../lib/format';
import { ProjectVisual } from '../ui/ProjectVisual';
import { TextReveal } from '../ui/TextReveal';
import { StudioClock } from './EdgeDetails';
import { useReduceMotion } from '../../lib/motionPreference';

const disciplines = ['Brand identities.', 'Digital products.', 'Websites.', 'Experiments.'];

/** Small fanned stack of project covers — the offset visual next to the headline. */
function CoverStack({ projects }: { projects: Project[] }) {
  const reduce = useReduceMotion();
  const fan = [
    { x: -40, y: 10, rotate: -9 },
    { x: 0, y: -6, rotate: 2 },
    { x: 44, y: 14, rotate: 11 },
  ];
  return (
    <div className="relative mx-auto h-44 w-36 xl:h-56 xl:w-44" aria-hidden="true">
      {projects.slice(0, 3).map((p, i) => {
        const f = fan[i] ?? fan[0]!;
        return (
          <motion.div
            key={p.slug}
            className="absolute inset-0 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.45)]"
            initial={reduce ? false : { x: 0, y: 40, rotate: 0, opacity: 0 }}
            animate={{ ...f, opacity: 1 }}
            whileHover={reduce ? undefined : { y: f.y - 10 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.5 + i * 0.08 }}
          >
            <ProjectVisual media={p.thumbnail} tone={p.tone} label={p.title} className="h-full w-full rounded-sm" />
          </motion.div>
        );
      })}
      <span className="text-meta absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-muted">
        D<sup className="text-accent">2</sup> — index
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
