import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT } from '../../lib/motion';
import { useReduceMotion } from '../../lib/motionPreference';

export type RevealDirection = 'up' | 'left' | 'right' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Use small steps (0.08–0.12) to stagger siblings. */
  delay?: number;
  direction?: RevealDirection;
  /** Travel distance in px */
  distance?: number;
  as?: 'div' | 'li' | 'section' | 'p' | 'article';
  /** @deprecated alias of `distance` (kept for older call sites) */
  y?: number;
}

const offset = (direction: RevealDirection, d: number) =>
  direction === 'up' ? { y: d } : direction === 'left' ? { x: -d } : direction === 'right' ? { x: d } : {};

/**
 * Reveals its content once, when ~20% of it enters the viewport.
 * One IntersectionObserver per element (via Framer's useInView) — no scroll listeners.
 * Waits for the loading screen, and falls back to a plain fade with reduced motion.
 */
export function ScrollReveal({ children, className, delay = 0, direction = 'up', distance, y, as = 'div' }: ScrollRevealProps) {
  const travel = distance ?? y ?? 30;
  const reduce = useReduceMotion();
  const ready = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, ...(reduce ? {} : offset(direction, travel)) }}
      animate={inView && ready ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: reduce ? 0.3 : 0.8, delay: reduce ? 0 : delay, ease: EASE_OUT_SOFT }}
    >
      {children}
    </Tag>
  );
}
