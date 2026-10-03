import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Site-wide motion preference.
 *
 * Defaults to the visitor's system setting (prefers-reduced-motion). The footer's
 * "Motion" switch lets anyone override it either way; the choice is remembered
 * in localStorage. Everything that animates reads `useReduceMotion()` — never the
 * media query directly — and CSS keys off `html.reduce-motion`.
 */
const STORAGE_KEY = 'dsq-motion';
const HTML_CLASS = 'reduce-motion';

type Choice = 'on' | 'off' | null;

interface MotionPreference {
  /** True when motion should be reduced (system setting or the visitor's choice). */
  reduce: boolean;
  /** The visitor's explicit choice, or null when following the system. */
  choice: Choice;
  /** What the system asks for, regardless of the override. */
  systemReduce: boolean;
  setMotionEnabled: (enabled: boolean) => void;
}

const MotionPreferenceContext = createContext<MotionPreference>({
  reduce: false,
  choice: null,
  systemReduce: false,
  setMotionEnabled: () => {},
});

function readChoice(): Choice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const systemReduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [choice, setChoice] = useState<Choice>(readChoice);
  const reduce = choice === 'off' || (choice === null && systemReduce);

  // Keep the <html> class in sync so CSS-only animations follow the same rule
  useEffect(() => {
    document.documentElement.classList.toggle(HTML_CLASS, reduce);
  }, [reduce]);

  const setMotionEnabled = useCallback((enabled: boolean) => {
    const next: Choice = enabled ? 'on' : 'off';
    setChoice(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice lasts for this page view only */
    }
  }, []);

  const value = useMemo(() => ({ reduce, choice, systemReduce, setMotionEnabled }), [reduce, choice, systemReduce, setMotionEnabled]);
  return <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>;
}

/** True when animations should be reduced. Use this instead of Framer's useReducedMotion. */
export function useReduceMotion(): boolean {
  return useContext(MotionPreferenceContext).reduce;
}

export function useMotionPreference(): MotionPreference {
  return useContext(MotionPreferenceContext);
}
