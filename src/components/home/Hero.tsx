import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ongoingProjects } from '../../data/projects';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT } from '../../lib/motion';
import { BrandWordmark } from '../brand/Brand';
import { ButtonLink } from '../ui/ButtonLink';
import { StoneObject } from '../ui/StoneObject';
import { useReduceMotion } from '../../lib/motionPreference';

/**
 * Home hero: the full layout is there from the start — wordmark, the 3D
 * stone monogram (reacts to the cursor), intro line, CTA and what's being built.
 * Once the loader hands over, the pieces rise in with a short stagger.
 * With reduced motion it simply appears.
 */
export function Hero() {
  const reduce = !!useReduceMotion();
  const ready = useIntroDone();
  // From tablet up the stone is large and floats over the hero; on phones it sits in the flow
  const large = useMediaQuery('(min-width: 768px)');
  // Parallax: as the page scrolls, the stone rises a little faster than the content (so it moves
  // away from the text below instead of over it) and turns slightly
  const { scrollY } = useScroll();
  const stoneY = useTransform(scrollY, (y) => (reduce ? 0 : -y * 0.3));
  const stoneTurn = useTransform(scrollY, (y) => (reduce ? 0 : Math.min(y * 0.012, 10)));

  /** Fade + rise once the intro is done; `order` staggers the pieces. */
  const enter = (order: number, distance = 24) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          animate: ready ? { opacity: 1, y: 0 } : undefined,
          transition: { duration: 0.9, delay: 0.1 + order * 0.12, ease: EASE_OUT_SOFT },
        };

  return (
    <section className="relative">
      {/* Definite height: the mark's box sizes itself from it (container query units) */}
      <div className="relative h-[100svh] min-h-[32rem]">
        <div className="container-site flex h-full flex-col pb-8 pt-20 md:pt-24">
          <h1 className="sr-only">Dsquare Studio — an independent design and development studio</h1>

          {/* Heading: the brand wordmark at full width */}
          <motion.div {...enter(0, 40)}>
            <BrandWordmark title={null} className="block h-auto w-full" />
          </motion.div>

          {/* Phones: the stone takes whatever height is left (cqh = this box's height). Larger screens: just a spacer */}
          <div className="flex min-h-0 flex-1 items-center justify-center py-6 [container-type:size]">
            {!large && (
              <motion.div className="w-[min(71cqh,80vw)]" {...enter(1, 0)}>
                <motion.div style={{ y: stoneY, rotate: stoneTurn }}>
                  <StoneObject className="w-full" active={ready} />
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="relative z-10 grid-site items-end gap-y-8">
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <motion.div {...enter(2)}>
                <p className="text-[clamp(1.4rem,2.2vw,2rem)] font-medium leading-[1.1] tracking-[-0.03em]">Good design should do more than look good.</p>
                <p className="mt-4 text-base leading-snug text-muted md:text-lg">
                  Dsquare is an independent design + development studio creating brands, digital products and experiences that solve real problems.
                </p>
              </motion.div>
              <motion.div {...enter(3, 16)}>
                <ButtonLink to="/contact" className="mt-6">
                  Start a project
                </ButtonLink>
              </motion.div>
            </div>

            <motion.div {...enter(3, 16)} className="col-span-12 md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10">
              <div className="rounded-[var(--radius)] bg-surface p-4">
                <p className="text-meta flex items-center gap-2 text-muted">
                  <span className="animate-pulse-dot size-[7px] bg-accent" aria-hidden="true" />
                  Currently building
                </p>
                <ul className="mt-3 space-y-1">
                  {ongoingProjects.map((p) => (
                    <li key={p.slug} className="flex items-baseline justify-between gap-3">
                      <Link to={`/ongoing/${p.slug}`} className="link-underline text-sm">
                        {p.title}
                      </Link>
                      <span className="font-mono text-[11px] text-muted">{p.ongoing.progress}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Larger screens: a big stone (~¾ of the screen height) centred over the hero, in front of the
            wordmark; the intro text, CTA and "Currently building" stay on top at the sides */}
        {large && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[4svh] top-[18svh] flex items-center justify-center">
            <motion.div className="pointer-events-auto w-[min(52svh,40vw)]" {...enter(1, 0)}>
              <motion.div style={{ y: stoneY, rotate: stoneTurn }}>
                <StoneObject className="w-full" active={ready} />
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
