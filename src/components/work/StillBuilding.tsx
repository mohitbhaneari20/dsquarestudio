import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { MediaAsset, OngoingDetails, Project } from '../../data/types';
import { formatShortDate } from '../../lib/format';
import { ButtonLink } from '../ui/ButtonLink';
import { ProjectVisual } from '../ui/ProjectVisual';
import { Reveal } from '../ui/Reveal';
import { TextReveal } from '../ui/TextReveal';
import { InlineMonogram } from '../brand/Brand';

type OngoingProject = Project & { ongoing: OngoingDetails };

/** Pinned-to-the-desk placements for work-in-progress visuals (percent of the board). */
const pins = [
  { left: 6, top: 10, width: 54, rotate: -3 },
  { left: 48, top: 6, width: 44, rotate: 4 },
  { left: 14, top: 50, width: 38, rotate: 2 },
  { left: 56, top: 48, width: 36, rotate: -5 },
];

/** Journal visuals first (wireframes, code, moodboards), then the polished ones. */
function deskMedia(p: OngoingProject): MediaAsset[] {
  const journal = p.ongoing.journal.flatMap((e) => e.media ?? []);
  const gallery = p.gallery.flatMap((b) => ('media' in b ? (Array.isArray(b.media) ? b.media : [b.media]) : []));
  const seen = new Set<string>();
  return [...journal, ...gallery, p.heroImage].filter((m) => (seen.has(m.alt) ? false : (seen.add(m.alt), true))).slice(0, 4);
}

function DeskCard({ project }: { project: OngoingProject }) {
  const { ongoing } = project;
  return (
    <Link to={`/ongoing/${project.slug}`} className="group block" data-cursor="View">
      {/* The board */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          aria-hidden="true"
        />
        {deskMedia(project).map((m, i) => {
          const pin = pins[i];
          if (!pin) return null;
          return (
            <motion.div
              key={m.alt}
              className="absolute shadow-[0_16px_30px_-16px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-out"
              style={{ left: `${pin.left}%`, top: `${pin.top}%`, width: `${pin.width}%`, rotate: pin.rotate, zIndex: i }}
              whileHover={{ scale: 1.04, zIndex: 10 }}
            >
              <ProjectVisual media={m} tone={project.tone} label={project.title} className="aspect-[4/3] rounded-[2px]" sizes="25vw" />
            </motion.div>
          );
        })}
        <span className="text-meta absolute bottom-3 left-3 z-20 bg-accent px-2 py-1 text-[var(--accent-foreground)]">
          WIP
        </span>
      </div>

      {/* The label */}
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-h3 uppercase transition-transform duration-500 group-hover:translate-x-1">{project.title}</h3>
        <span className="text-meta inline-flex items-center gap-1.5">
          <span className="animate-pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {ongoing.phase}
        </span>
      </div>
      <div
        className="relative mt-4 h-px bg-border"
        role="progressbar"
        aria-label={`${project.title} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ongoing.progress}
      >
        <motion.span
          className="absolute inset-y-0 left-0 -top-px h-[3px] bg-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${ongoing.progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="text-meta mt-3 flex justify-between text-muted">
        <span>{ongoing.progress}%</span>
        <span>Last updated {formatShortDate(ongoing.lastUpdated)}</span>
      </div>
    </Link>
  );
}

export function StillBuilding({ projects }: { projects: OngoingProject[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.6, behavior: 'smooth' });

  if (projects.length === 0) return null;

  return (
    <section className="theme-inverse section-space overflow-hidden" aria-label="Still building">
      <div className="container-site">
        <div className="grid-site gap-y-8 border-t border-border pt-4">
          <p className="text-meta col-span-12 text-muted lg:col-span-3 lg:tag-top-display">
            (<InlineMonogram />/03) Work in progress
          </p>
          <div className="col-span-12 lg:col-span-9">
            <TextReveal as="h2" lines={['Still', 'building.']} className="text-display uppercase" />
            <Reveal delay={0.1} className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="text-lead max-w-md text-muted">
                <p>Not everything here is finished.</p>
                <p className="mt-3">Some projects are still being researched, designed, coded, tested and changed.</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden gap-2 md:flex">
                  <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll left" className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground">
                    <ArrowLeft size={16} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll right" className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground">
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
                <ButtonLink to="/ongoing" variant="text">
                  Studio log
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="mt-14 flex snap-x snap-mandatory gap-[var(--grid-gap)] overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] md:mt-20"
      >
        {projects.map((p) => (
          <div key={p.slug} className="w-[85vw] shrink-0 snap-start md:w-[46vw] xl:w-[38vw]">
            <DeskCard project={p} />
          </div>
        ))}
        <div className="flex w-[60vw] shrink-0 snap-start items-center justify-center border border-dashed border-border md:w-[24vw]">
          <p className="text-meta max-w-[16ch] text-center text-muted">Design it. Build it. Break it. Make it better.</p>
        </div>
      </div>
    </section>
  );
}
