import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT, REVEAL_VIEWPORT } from '../../lib/motion';
import { useReduceMotion } from '../../lib/motionPreference';

/** Unmasks its child from the bottom while it settles from a slight zoom. */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReduceMotion();
  const ready = useIntroDone();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  if (reduce) return <div className={className}>{children}</div>;
  const shown = inView && ready;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(14% 0% 0% 0%)', opacity: 0.3 }}
      animate={shown ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : undefined}
      transition={{ duration: 1.3, ease: EASE_OUT_SOFT }}
    >
      <motion.div initial={{ scale: 1.08 }} animate={shown ? { scale: 1 } : undefined} transition={{ duration: 1.6, ease: EASE_OUT_SOFT }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
