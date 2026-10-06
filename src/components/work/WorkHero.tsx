import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { Project } from '../../data/types';
import { pad } from '../../lib/format';
import { TextReveal } from '../ui/TextReveal';
import { StudioClock } from './EdgeDetails';

const disciplines = ['Brand identities.', 'Digital products.', 'Websites.', 'Experiments.'];

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

        <div className="col-span-12 flex items-end justify-between gap-10 lg:col-span-4 lg:flex-col lg:items-end lg:pb-4">
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
