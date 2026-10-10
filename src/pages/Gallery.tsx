import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ImageIcon, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { Seo } from '../components/ui/Seo';
import { artworks, type Artwork } from '../data/gallery';
import { pad } from '../lib/format';
import { useReduceMotion } from '../lib/motionPreference';

const EASE = [0.22, 1, 0.36, 1] as const;
/** Distance between artworks along the flight path (px of depth) */
const GAP = 1500;
/** CSS perspective — how close the camera sits to the screen plane */
const PERSPECTIVE = 1000;

function Placeholder({ art, large = false }: { art: Artwork; large?: boolean }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#fafafa] text-center"
      style={{
        backgroundImage: 'linear-gradient(rgb(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / 0.06) 1px, transparent 1px)',
        backgroundSize: large ? '32px 32px' : '18px 18px',
      }}
      role="img"
      aria-label={`Artwork placeholder — ${art.title}`}
    >
      <ImageIcon size={large ? 28 : 16} strokeWidth={1.25} className="text-muted" aria-hidden="true" />
      {large && <span className="text-meta text-muted">Artwork</span>}
    </div>
  );
}

/**
 * Fades a piece in from the distance. On the way past it doesn't fade — it slides
 * off the side — and is only hidden once it's well out of view. `rel` is its depth relative to the camera.
 */
function depthOpacity(rel: number) {
  if (rel < -GAP * 3.2) return 0;
  if (rel < -GAP * 2.2) return (rel + GAP * 3.2) / GAP;
  if (rel > PERSPECTIVE * 0.85) return 0;
  return 1;
}

/** How fast a passing piece slides sideways for each pixel it comes closer */
const SLIDE = 1.35;

/** One artwork on the flight path: it straightens as it reaches you, then flies past. */
function Station({ art, index, cam, width, onOpen }: { art: Artwork; index: number; cam: MotionValue<number>; width: number; onOpen: (i: number) => void }) {
  const z = -(index + 1) * GAP;
  // Alternate a little left / right and up / down so the path isn't a straight line
  const ox = (index % 2 ? 1 : -1) * width * 0.08;
  const oy = (index % 3 === 1 ? -1 : 1) * width * 0.03;
  const rel = useTransform(cam, (c) => z + c);
  const opacity = useTransform(rel, depthOpacity);
  // Once it has arrived, it glides off to one side — left, then right, alternately
  const side = index % 2 ? 1 : -1;
  const x = useTransform(rel, (r) => ox + side * Math.max(0, r) * SLIDE);
  const visibility = useTransform(opacity, (o) => (o <= 0.001 ? 'hidden' : 'visible'));
  // Leans while far away, flat when it arrives
  const rotateY = useTransform(rel, (r) => (r < 0 ? Math.max(-1, r / GAP) * (index % 2 ? -18 : 18) : (r / PERSPECTIVE) * side * 22));
  const rotateX = useTransform(rel, (r) => Math.max(-1, Math.min(1, r / GAP)) * 8);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
      style={{ x, y: oy, z, opacity, visibility }}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(index)}
        className="group block -translate-x-1/2 -translate-y-1/2 border border-black/10 bg-[#fafafa] p-2 shadow-[0_50px_100px_-40px_rgb(0_0_0/0.5)]"
        style={{ width, rotateX, rotateY }}
        data-cursor="View"
        aria-label={`Open ${art.title}`}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(art.ratio) }}>
          {art.src ? <img src={art.src} alt={art.title} className="h-full w-full object-cover" draggable={false} loading="lazy" decoding="async" /> : <Placeholder art={art} large />}
        </div>
        <span className="text-meta mt-2 flex justify-between gap-3 px-1 text-left text-muted">
          <span className="min-w-0 truncate">
            <span className="text-accent-ink">{pad(index + 1)}</span> {art.title}
          </span>
          {/* Medium and year only where there's room for both on one line */}
          <span className="hidden shrink-0 sm:inline">
            {art.medium}, {art.year}
          </span>
        </span>
      </motion.button>
    </motion.div>
  );
}

/** The opened artwork, large in the centre, with its details beside it. */
function DetailPanel({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const art = artworks[index]!;
  return (
    <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button type="button" className="absolute inset-0 bg-[#e6e1d8]/70 backdrop-blur-md" onClick={onClose} aria-label="Close" />
      <motion.article
        key={index}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-title"
        className="relative grid max-h-full w-full max-w-5xl overflow-auto border border-border bg-[#fafafa] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.45)] md:grid-cols-[1.3fr_1fr]"
        initial={{ opacity: 0, scale: 0.85, rotateX: 12, y: 30 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ transformPerspective: 1200 }}
      >
        <div className="flex items-center justify-center bg-[#efebe4] p-6 md:p-10">
          <div className="w-full" style={{ aspectRatio: String(art.ratio), maxWidth: `min(32rem, calc(64svh * ${art.ratio}))` }}>
            {art.src ? <img src={art.src} alt={art.title} className="h-full w-full object-cover" /> : <Placeholder art={art} large />}
          </div>
        </div>
        <div className="flex flex-col p-6 md:p-10">
          <div className="text-meta flex items-center justify-between text-muted">
            <span>
              <span className="text-accent-ink">{pad(index + 1)}</span> / {pad(artworks.length)}
            </span>
            <button type="button" onClick={onClose} className="-mr-2 inline-flex size-10 items-center justify-center hover:text-accent" aria-label="Close">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <h2 id="artwork-title" className="text-h2 mt-8">
            {art.title}
          </h2>
          <p className="text-meta mt-4 text-muted">
            {art.medium}, {art.year}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">{art.description}</p>
          <div className="mt-auto flex gap-2 pt-10">
            <button type="button" onClick={() => onStep(-1)} className="text-meta h-11 flex-1 border border-border hover:border-foreground">
              ← Previous
            </button>
            <button type="button" onClick={() => onStep(1)} className="text-meta h-11 flex-1 border border-border hover:border-foreground">
              Next →
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

/** Every piece at once, after the flight: the image, its name and its details. */
function AllWorks({ onOpen }: { onOpen: (i: number) => void }) {
  const reduce = useReduceMotion();
  // Pulled up a full screen so it rises over the pinned stage as the last piece lands — no empty stage in between
  return (
    <section className="relative z-10 -mt-[100svh] border-t border-foreground/15 bg-background pb-24 pt-20 shadow-[0_-40px_80px_-40px_rgb(0_0_0/0.25)] md:pb-32 md:pt-28" aria-labelledby="all-works">
      <div className="container-site">
        <div className="flex flex-col gap-3 border-b border-foreground/15 pb-6 md:flex-row md:items-end md:justify-between">
          <h2 id="all-works" className="text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            All works.
          </h2>
          <p className="text-meta text-muted">{pad(artworks.length)} pieces</p>
        </div>
        {/* The pieces drop into place one after another */}
        <motion.ul
          className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          initial={reduce ? false : 'hidden'}
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ shown: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
        >
          {artworks.map((art, i) => (
            <motion.li
              key={art.title}
              variants={{ hidden: { opacity: 0, y: 60, scale: 0.94 }, shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE } } }}
            >
              <button type="button" onClick={() => onOpen(i)} className="group block w-full text-left" data-cursor="View" aria-label={`Open ${art.title}`}>
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#efebe4] p-6 md:p-8">
                  <div className="h-full max-w-full" style={{ aspectRatio: String(art.ratio) }}>
                    {art.src ? (
                      <img src={art.src} alt={art.title} className="h-full w-full object-cover shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                    ) : (
                      <Placeholder art={art} />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium leading-tight transition-colors group-hover:text-accent">
                    <span className="text-meta mr-2 text-accent-ink">{pad(i + 1)}</span>
                    {art.title}
                  </h3>
                  <span className="text-meta shrink-0 text-muted">{art.year}</span>
                </div>
                <p className="text-meta mt-1 text-muted">{art.medium}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{art.description}</p>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/**
 * Gallery as a flight through space: scrolling moves the camera forward past each
 * artwork in turn. Click the piece in front to open it.
 */
export default function Gallery() {
  const reduce = useReduceMotion();
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const count = artworks.length;
  // The grid of all works starts rising over the stage just after the last piece lands (it overlaps the final screen of the scroll)
  const travel = count * GAP + 300 + size.h;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // Camera depth: 0 at the start, past the last artwork at the end (smoothed a touch)
  const camRaw = useTransform(scrollYProgress, (p) => p * travel);
  const cam = useSpring(camRaw, { stiffness: 120, damping: 30, mass: 0.4 });

  // Which artwork is in front of you
  const [current, setCurrent] = useState(0);
  // Piece i arrives when the camera reaches (i + 1) × GAP; once it's a third of the way past, the next one takes over
  useMotionValueEvent(cam, 'change', (c) => setCurrent(Math.max(0, Math.min(count - 1, Math.ceil(c / GAP - 1.35)))));

  // The mouse tilts the view a little
  const tiltX = useSpring(0, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 });
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || reduce) return;
    tiltX.set((e.clientY / size.h - 0.5) * -6);
    tiltY.set((e.clientX / size.w - 0.5) * 8);
  };

  // Esc closes; arrow keys step through
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % count));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, count]);

  const small = size.w < 768;
  // Each frame takes its artwork's own shape: as wide as allowed, but never taller than the screen allows
  const maxW = small ? size.w * 0.82 : Math.min(size.w * 0.46, 760);
  const maxH = size.h * (small ? 0.42 : 0.5);
  const frameWidth = (art: Artwork) => Math.round(Math.min(maxW, maxH * art.ratio));

  return (
    <>
      <Seo />
      <section ref={sectionRef} className="relative" style={{ height: `calc(100svh + ${travel}px)` }} aria-label="Gallery">
        {/* The eye cursor shows anywhere on the stage; clicking opens the piece you're on */}
        <div
          className="sticky top-0 h-[100svh] cursor-pointer overflow-hidden bg-[#e6e1d8]"
          style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 60%" }}
          onPointerMove={onPointerMove}
          onClick={(e) => {
            if (!(e.target as Element).closest('button')) setOpen(current);
          }}
          data-cursor="View"
        >
          {/* Soft light in the middle */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgb(255 255 255 / 0.45), rgb(255 255 255 / 0) 70%)' }} aria-hidden="true" />

          {/* The space, moved toward you as you scroll */}
          <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: tiltX, rotateY: tiltY }}>
            {/* Centre of the flight sits lower, under the heading */}
            <motion.div className="absolute inset-x-0 bottom-0 top-[22svh] [transform-style:preserve-3d] md:top-[18svh]" style={{ z: cam }}>
              {artworks.map((art, i) => (
                <Station key={art.title} art={art} index={i} cam={cam} width={frameWidth(art)} onOpen={setOpen} />
              ))}
            </motion.div>
          </motion.div>

          {/* Page heading, pinned at the top; the artworks fly in beneath it */}
          <div className="container-site pointer-events-none absolute inset-x-0 top-0 z-[2] pt-24 md:pt-28">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h1 className="text-[clamp(2.75rem,6.5vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em]">Gallery.</h1>
              <p className="max-w-xs text-sm text-muted md:text-right">Personal work, made for no brief at all. Scroll to fly through, click a piece to open it.</p>
            </div>
          </div>

          {/* Where you are */}
          <div className="container-site pointer-events-none absolute inset-x-0 bottom-[4svh] flex items-center gap-6 pr-36 md:pr-40">
            <span className="text-meta tabular-nums">
              <span className="text-accent-ink">{pad(current + 1)}</span> / {pad(count)}
            </span>
            <span className="text-meta hidden truncate sm:inline">{artworks[current]?.title}</span>
            <div className="h-px flex-1 bg-foreground/15">
              <motion.div className="h-[2px] origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </section>

      <AllWorks onOpen={setOpen} />

      <AnimatePresence>
        {open !== null && (
          <DetailPanel
            index={open}
            onClose={() => setOpen(null)}
            onStep={(dir) => setOpen((i) => (i === null ? i : (i + dir + count) % count))}
          />
        )}
      </AnimatePresence>
    </>
  );
}
