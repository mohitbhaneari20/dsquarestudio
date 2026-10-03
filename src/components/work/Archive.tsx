import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { projectHref } from '../../data/projects';
import type { Project } from '../../data/types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { pad } from '../../lib/format';
import { ProjectVisual } from '../ui/ProjectVisual';
import { Reveal } from '../ui/Reveal';
import { TextReveal } from '../ui/TextReveal';
import { useReduceMotion } from '../../lib/motionPreference';

/** Compact, always-usable list of every project, with a preview that trails the cursor. */
export function Archive({ projects }: { projects: Project[] }) {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReduceMotion();
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });
  const showPreview = finePointer && !reduce;

  const onMove = (e: PointerEvent) => {
    x.set(e.clientX + 28);
    y.set(e.clientY - 90);
  };

  return (
    <section className="container-site section-space" aria-label="The archive">
      <div className="grid-site gap-y-8 border-t border-border pt-4">
        <p className="text-meta col-span-12 text-muted lg:col-span-3">
          (D<sup>2</sup>/02) Index
        </p>
        <div className="col-span-12 lg:col-span-9">
          <TextReveal as="h2" lines={['The archive']} className="text-h1 uppercase" />
          <Reveal delay={0.1}>
            <p className="text-lead mt-6 max-w-xl text-muted">
              A collection of completed projects, experiments and things that were never supposed to become projects.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-14 md:mt-20" onPointerMove={showPreview ? onMove : undefined} onPointerLeave={() => setHovered(null)}>
        <div className="text-meta hidden grid-cols-[4rem_1fr_1fr_6rem_2rem] gap-x-6 border-b border-border pb-3 text-muted md:grid">
          <span>No.</span>
          <span>Project</span>
          <span>Category</span>
          <span>Year</span>
          <span />
        </div>
        <ul>
          <AnimatePresence initial={false}>
            {projects.map((p, i) => (
              <motion.li
                key={p.slug}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="border-b border-border"
              >
                <Link
                  to={projectHref(p)}
                  onPointerEnter={() => setHovered(p)}
                  onFocus={() => setHovered(null)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 transition-[padding] duration-500 ease-out hover:py-7 md:grid-cols-[4rem_1fr_1fr_6rem_2rem] md:gap-x-6"
                >
                  <span className="text-meta text-muted transition-colors group-hover:text-accent">{pad(i + 1)}</span>
                  <span className="text-2xl font-medium uppercase tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-4xl">
                    {p.title}
                    {p.status === 'Ongoing' && (
                      <span className="text-meta ml-3 inline-flex items-center gap-1.5 align-middle font-normal tracking-[0.06em] text-muted">
                        <span className="animate-pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
                        Ongoing
                      </span>
                    )}
                  </span>
                  <span className="text-meta col-start-2 row-start-2 mt-2 text-muted md:col-start-auto md:row-start-auto md:mt-0 md:text-sm md:normal-case md:tracking-normal">
                    {p.discipline}
                  </span>
                  <span className="text-meta col-start-3 row-start-1 text-muted md:col-start-auto md:row-start-auto md:text-sm md:tracking-normal">{p.year}</span>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="hidden transition-transform duration-500 group-hover:rotate-45 md:block"
                  />
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {showPreview && (
        <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={hovered.slug}
                className="absolute w-64 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] xl:w-80"
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <ProjectVisual media={hovered.thumbnail} tone={hovered.tone} label={hovered.title} className="aspect-[4/3] rounded-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
