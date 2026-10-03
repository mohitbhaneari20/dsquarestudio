import { createContext, useContext, useEffect, type ReactNode } from 'react';

/**
 * Site-wide motion setting. Motion is always on — the site's animations are part
 * of the design, so they run regardless of the visitor's system setting.
 *
 * Everything that animates still reads `useReduceMotion()` (and CSS keys off
 * `html.reduce-motion`), so turning motion off again later is a one-line change here.
 */
const REDUCE_MOTION = false;

const MotionPreferenceContext = createContext(REDUCE_MOTION);

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', REDUCE_MOTION);
    // Forget the old on/off switch's saved choice
    try {
      localStorage.removeItem('dsq-motion');
    } catch {
      /* storage unavailable — nothing to clean up */
    }
  }, []);
  return <MotionPreferenceContext.Provider value={REDUCE_MOTION}>{children}</MotionPreferenceContext.Provider>;
}

/** True when animations should be reduced. Use this instead of Framer's useReducedMotion. */
export function useReduceMotion(): boolean {
  return useContext(MotionPreferenceContext);
}
