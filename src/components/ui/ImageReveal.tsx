import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT, REVEAL_VIEWPORT } from '../../lib/motion';
import { useReduceMotion } from '../../lib/motionPreference';

/**
 * Unmasks its child from the bottom while it settles from a slight zoom.
 * With motion off it simply shows. The same element is used either way, so turning
 * the Motion switch on or off never leaves an image stuck half-revealed.
 */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReduceMotion();
  const ready = useIntroDone();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const shown = reduce || (inView && ready);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { clipPath: 'inset(14% 0% 0% 0%)', opacity: 0.3 }}
      animate={shown ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : { clipPath: 'inset(14% 0% 0% 0%)', opacity: 0.3 }}
      transition={{ duration: reduce ? 0 : 1.3, ease: EASE_OUT_SOFT }}
    >
      <motion.div initial={reduce ? false : { scale: 1.08 }} animate={{ scale: shown ? 1 : 1.08 }} transition={{ duration: reduce ? 0 : 1.6, ease: EASE_OUT_SOFT }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
