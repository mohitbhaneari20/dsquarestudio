import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReduceMotion } from '../../lib/motionPreference';

/** Short fade/slide between routes (≈400ms). */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReduceMotion();
  return (
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.25, ease: [0.65, 0, 0.35, 1] } }}
    >
      {children}
    </motion.div>
  );
}
