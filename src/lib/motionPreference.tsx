import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';

/**
 * Site-wide motion setting. It follows the visitor's system (prefers-reduced-motion) until
 * they use the Motion On / Off switch, whose choice is remembered and wins from then on.
 * With motion off the loader, parallax, pinned scroll effects and drifting objects calm
 * down and content shows straight away.
 *
 * Everything that animates reads `useReduceMotion()` (and CSS keys off `html.reduce-motion`).
 */
const QUERY = '(prefers-reduced-motion: reduce)';
const KEY = 'dsq-motion';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

function readChoice(): 'on' | 'off' | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

const MotionPreferenceContext = createContext(false);
const MotionSwitchContext = createContext<(on: boolean) => void>(() => {});

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const systemReduce = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [choice, setChoice] = useState(readChoice);
  const reduce = choice ? choice === 'off' : systemReduce;

  const setMotion = useCallback((on: boolean) => {
    const v = on ? 'on' : 'off';
    setChoice(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* storage unavailable — the choice lasts for this visit */
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }, [reduce]);

  return (
    <MotionSwitchContext.Provider value={setMotion}>
      <MotionPreferenceContext.Provider value={reduce}>{children}</MotionPreferenceContext.Provider>
    </MotionSwitchContext.Provider>
  );
}

/** True when animations should be reduced. Use this instead of Framer's useReducedMotion. */
export function useReduceMotion(): boolean {
  return useContext(MotionPreferenceContext);
}

/** Turns motion on or off for this visitor (remembered). */
export function useSetMotion(): (on: boolean) => void {
  return useContext(MotionSwitchContext);
}
