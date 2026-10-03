import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReduceMotion } from '../../lib/motionPreference';

type Mode = 'default' | 'link' | 'cta' | 'label';
type CursorState = { mode: Mode; label?: string };

/** How strongly the ring is pulled toward the centre of a hovered CTA (0–1). */
const MAGNET = 0.35;

/**
 * Desktop-only cursor: a precise dot plus a trailing ring with a rotating arc.
 *
 * - default: small dot + ring
 * - link / button: ring grows, dot shrinks
 * - CTA (`data-cursor-cta`): ring fills with the accent, shows an arrow and is pulled toward the button
 * - `data-cursor="View"`: accent bubble with that label
 *
 * Disabled for touch devices and reduced-motion users.
 */
export function CustomCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReduceMotion();
  const enabled = finePointer && !reduce;

  // Dot tracks the pointer tightly, ring lags behind for the trailing feel.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringTargetX = useMotionValue(-100);
  const ringTargetY = useMotionValue(-100);
  const dx = useSpring(dotX, { stiffness: 1200, damping: 60, mass: 0.2 });
  const dy = useSpring(dotY, { stiffness: 1200, damping: 60, mass: 0.2 });
  const rx = useSpring(ringTargetX, { stiffness: 220, damping: 24, mass: 0.6 });
  const ry = useSpring(ringTargetY, { stiffness: 220, damping: 24, mass: 0.6 });

  const [state, setState] = useState<CursorState>({ mode: 'default' });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [accent, setAccent] = useState('#fa5c01');

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    setAccent(getComputedStyle(root).getPropertyValue('--accent').trim() || '#fa5c01');

    let ctaEl: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (ctaEl) {
        const r = ctaEl.getBoundingClientRect();
        ringTargetX.set(e.clientX + (r.left + r.width / 2 - e.clientX) * MAGNET);
        ringTargetY.set(e.clientY + (r.top + r.height / 2 - e.clientY) * MAGNET);
      } else {
        ringTargetX.set(e.clientX);
        ringTargetY.set(e.clientY);
      }
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      ctaEl = target?.closest<HTMLElement>('[data-cursor-cta]') ?? null;
      if (ctaEl) return setState({ mode: 'cta' });
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (labelled) return setState({ mode: 'label', label: labelled.dataset.cursor });
      if (target?.closest('input, textarea, select')) return setVisible(false);
      if (target?.closest('a, button, [role="tab"], label')) return setState({ mode: 'link' });
      setState({ mode: 'default' });
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerover', onOver);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerover', onOver);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, dotX, dotY, ringTargetX, ringTargetY]);

  if (!enabled) return null;

  const { mode } = state;
  const filled = mode === 'cta' || mode === 'label';
  const ringSize = { default: 38, link: 60, cta: 88, label: 92 }[mode];
  const spring = { type: 'spring', stiffness: 380, damping: 28 } as const;
  // Multiply on CTAs keeps the button label readable through the accent fill.
  const blend = { default: 'mix-blend-difference', link: 'mix-blend-difference', cta: 'mix-blend-multiply', label: 'mix-blend-normal' }[mode];

  return (
    <>
      {/* Ring — blend mode sits on the fixed layer itself so it blends with the page */}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] ${blend}`}
        style={{ x: rx, y: ry }}
      >
        <motion.div
          className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
            backgroundColor: filled ? accent : 'rgba(255,255,255,0)',
          }}
          transition={spring}
        >
          {/* Thin outline + a rotating arc that speeds up on links */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            animate={{ opacity: filled ? 0 : 1, rotate: 360 }}
            transition={{
              opacity: { duration: 0.2 },
              rotate: { duration: mode === 'link' ? 1.6 : 4, ease: 'linear', repeat: Infinity },
            }}
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="60 242"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>

          <AnimatePresence mode="wait">
            {mode === 'cta' && (
              <motion.span
                key="cta"
                className="text-[var(--accent-foreground)]"
                initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowUpRight size={26} strokeWidth={1.75} />
              </motion.span>
            )}
            {mode === 'label' && (
              <motion.span
                key={state.label}
                className="text-meta font-medium text-[var(--accent-foreground)]"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] mix-blend-difference"
        style={{ x: dx, y: dy }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            width: mode === 'default' ? 6 : 4,
            height: mode === 'default' ? 6 : 4,
            opacity: visible && !filled ? 1 : 0,
          }}
          transition={spring}
        />
      </motion.div>
    </>
  );
}
