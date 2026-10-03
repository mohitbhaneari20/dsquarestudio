import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, type MouseEvent, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { projectHref } from '../../data/projects';
import type { MediaAsset, Project } from '../../data/types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/format';
import { useOpenProject } from '../layout/ProjectTransition';
import { ProjectVisual } from '../ui/ProjectVisual';
import { annotationsFor, labelSpotsFor, pickMedia, shapeFor, slotsFor, type Slot } from './composition';
import { useReduceMotion } from '../../lib/motionPreference';

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectShowcaseProps {
  projects: Project[];
  index: number;
  direction: 1 | -1;
  onNavigate: (index: number) => void;
}

/* ─── One layered image ─────────────────────────────────────── */

function ShowcaseItem({
  media,
  project,
  slot,
  order,
  mx,
  my,
  mainRef,
}: {
  media: MediaAsset;
  project: Project;
  slot: Slot;
  order: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  mainRef?: RefObject<HTMLDivElement | null>;
}) {
  const isMain = order === 0;
  const shape = shapeFor(media.kind, isMain);
  const width = slot.width * shape.scale;
  const left = slot.left + (slot.width - width) / 2;
  // 5–15px of drift depending on depth
  const x = useTransform(mx, (v) => v * slot.depth * -26);
  const y = useTransform(my, (v) => v * slot.depth * -18);

  return (
    <div className="absolute" style={{ left: `${left}%`, top: `${slot.top}%`, width: `${width}%`, zIndex: slot.z }}>
      <motion.div
        custom={order}
        variants={{
          enter: (o: number) => ({ opacity: 0, y: 50 + o * 14, rotate: slot.rotate + (o % 2 ? 7 : -7), scale: 0.92 }),
          center: (o: number) => ({
            opacity: 1,
            y: 0,
            rotate: slot.rotate,
            scale: 1,
            transition: { type: 'spring', stiffness: 120, damping: 20, delay: 0.08 + o * 0.07 },
          }),
          exit: (o: number) => ({ opacity: 0, y: -30, scale: 0.96, transition: { duration: 0.3, ease: EASE, delay: o * 0.03 } }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <motion.div style={{ x, y }}>
          <div
            ref={mainRef}
            className={cn(
              'shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out',
              isMain && 'group-hover:scale-[1.025]',
            )}
            style={{ aspectRatio: shape.ratio }}
          >
            <ProjectVisual media={media} tone={project.tone} label={project.title} className="h-full w-full rounded-sm" sizes="50vw" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Floating annotation ───────────────────────────────────── */

function Annotation({
  text,
  live,
  spot,
  order,
  mx,
  my,
}: {
  text: string;
  live?: boolean;
  spot: { left: number; top: number };
  order: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useTransform(mx, (v) => v * 14);
  const y = useTransform(my, (v) => v * 10);
  return (
    <motion.span
      className="text-meta absolute z-10 inline-flex items-center gap-1.5 whitespace-nowrap border border-border bg-background px-2 py-1"
      style={{ left: `${spot.left}%`, top: `${spot.top}%`, x, y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.35 + order * 0.06, duration: 0.4, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {live && <span className="animate-pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />}
      {text}
    </motion.span>
  );
}

/* ─── Showcase ──────────────────────────────────────────────── */

export function ProjectShowcase({ projects, index, direction, onNavigate }: ProjectShowcaseProps) {
  const project = projects[index];
  const sectionRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduce = useReduceMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const openProject = useOpenProject();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 90, damping: 20 });
  const my = useSpring(rawY, { stiffness: 90, damping: 20 });

  const count = projects.length;
  const go = (delta: number) => onNavigate((index + delta + count) % count);

  // Arrow keys while the showcase is on screen
  useEffect(() => {
    if (!inView || count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest('input, textarea, select, [role="tablist"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') onNavigate((index + 1) % count);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inView, index, count, onNavigate]);

  if (!project) return null;

  const href = projectHref(project);
  const media = pickMedia(project);
  const slots = slotsFor(index);
  const spots = labelSpotsFor(index);
  const notes = annotationsFor(project);
  const interactive = finePointer && !reduce;

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const onOpen = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = mainRef.current;
    if (!target) return;
    e.preventDefault();
    openProject({
      href,
      rect: target.getBoundingClientRect(),
      media: project.heroImage,
      tone: project.tone,
      title: project.title,
      slug: project.slug,
    });
  };

  // Swipe on touch screens (tablet); mouse drags are ignored
  const onPanEnd = (e: PointerEvent, info: PanInfo) => {
    if (e.pointerType !== 'touch') return;
    if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) go(info.offset.x < 0 ? 1 : -1);
  };

  const titleVariants = {
    enter: (d: number) => ({ y: d > 0 ? '100%' : '-100%' }),
    center: { y: '0%', transition: { duration: 0.6, ease: EASE } },
    exit: (d: number) => ({ y: d > 0 ? '-100%' : '100%', transition: { duration: 0.3, ease: EASE } }),
  };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Project showcase"
      className="container-site"
    >
      <p className="sr-only" aria-live="polite">
        Project {index + 1} of {count}: {project.title}, {project.discipline}, {project.year}
      </p>

      {/* Number / title / category */}
      <div className="grid grid-cols-[auto_1fr_auto] items-end gap-x-6 border-b border-border pb-5 md:gap-x-10">
        <div className="font-mono leading-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={project.slug}
              className="block text-2xl md:text-3xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {pad(index + 1)}
            </motion.span>
          </AnimatePresence>
          <span className="text-meta mt-2 block text-muted">/ {pad(count)}</span>
        </div>

        <div className="min-w-0 overflow-hidden pb-[0.06em]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.h2
              key={project.slug}
              custom={direction}
              variants={titleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-[clamp(2.75rem,7.5vw,8.5rem)] font-medium uppercase leading-[0.85] tracking-[-0.055em]"
            >
              {project.title}
            </motion.h2>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            className="text-meta hidden text-right sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p>{project.discipline}</p>
            <p className="mt-1 text-muted">{project.year}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layered composition */}
      <motion.div onPanEnd={onPanEnd} style={{ touchAction: 'pan-y' }} className="pt-10 md:pt-14">
        <Link
          to={href}
          onClick={onOpen}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          data-cursor="Dig it"
          aria-label={`Open ${project.title} — ${project.discipline}`}
          className="group relative block aspect-[2/1] w-full"
        >
          <AnimatePresence initial={false}>
            {media.map((m, i) => {
              const slot = slots[i];
              if (!slot) return null;
              return (
                <ShowcaseItem
                  key={`${project.slug}-${i}`}
                  media={m}
                  project={project}
                  slot={slot}
                  order={i}
                  mx={mx}
                  my={my}
                  mainRef={i === 0 ? mainRef : undefined}
                />
              );
            })}
            {notes.map((n, i) => {
              const spot = spots[i];
              if (!spot) return null;
              return <Annotation key={`${project.slug}-note-${i}`} text={n.text} live={n.live} spot={spot} order={i} mx={mx} my={my} />;
            })}
          </AnimatePresence>

          <span className="text-meta pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-3 rounded-full bg-foreground px-3 py-2 text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {project.status === 'Ongoing' ? 'Open journal →' : 'Open case study →'}
          </span>
        </Link>
      </motion.div>

      {/* Controls */}
      <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-border pt-5 md:mt-14">
        <button
          type="button"
          onClick={() => go(-1)}
          className="group inline-flex items-center gap-2 justify-self-start text-sm uppercase tracking-[0.02em]"
          aria-label="Previous project"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          Previous
        </button>

        <ol className="flex items-center gap-1.5" aria-label="Choose project">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => onNavigate(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === index ? 'true' : undefined}
                className="flex h-8 items-center px-0.5"
              >
                <span
                  className={cn(
                    'block h-px transition-all duration-500',
                    i === index ? 'w-10 bg-accent [height:2px]' : 'w-5 bg-foreground/30 hover:bg-foreground',
                  )}
                />
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => go(1)}
          className="group inline-flex items-center gap-2 justify-self-end text-sm uppercase tracking-[0.02em]"
          aria-label="Next project"
        >
          Next
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <p className="text-meta mt-4 hidden text-center text-muted md:block">Use ← → to browse</p>
    </section>
  );
}
