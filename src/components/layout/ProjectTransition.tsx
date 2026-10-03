import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MediaAsset, Tone } from '../../data/types';
import { BrandMark } from '../brand/Brand';
import { ProjectVisual } from '../ui/ProjectVisual';
import { useReduceMotion } from '../../lib/motionPreference';

export interface OpenProjectArgs {
  href: string;
  /** Where the clicked image currently sits on screen */
  rect: DOMRect;
  media: MediaAsset;
  tone: Tone;
  title: string;
  slug: string;
}

type OpenProject = (args: OpenProjectArgs) => void;

const ProjectTransitionContext = createContext<OpenProject | null>(null);

/**
 * Opens a project by expanding its image to fill the viewport, then
 * navigating underneath it and fading the overlay out (≈600ms total
 * before the new page is visible). Falls back to plain navigation with
 * reduced motion.
 */
export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const reduce = useReduceMotion();
  const [active, setActive] = useState<OpenProjectArgs | null>(null);
  const navigated = useRef(false);

  const open = useCallback<OpenProject>(
    (args) => {
      if (reduce) {
        navigate(args.href);
        return;
      }
      navigated.current = false;
      setActive(args);
    },
    [navigate, reduce],
  );

  const onExpanded = () => {
    if (!active || navigated.current) return;
    navigated.current = true;
    navigate(active.href);
    // Let the outgoing page finish its exit before revealing the new one
    window.setTimeout(() => setActive(null), 320);
  };

  return (
    <ProjectTransitionContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.slug}
            aria-hidden="true"
            className="pointer-events-none fixed z-[90] overflow-hidden"
            initial={{
              top: active.rect.top,
              left: active.rect.left,
              width: active.rect.width,
              height: active.rect.height,
              borderRadius: 4,
            }}
            animate={{ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={onExpanded}
          >
            <ProjectVisual media={active.media} tone={active.tone} label={active.title} className="h-full w-full" priority />
            <motion.div
              className="text-meta absolute inset-x-0 bottom-8 flex items-center justify-center gap-3"
              style={{ color: active.tone.ink }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <BrandMark title={null} copyright={false} className="size-3.5" />
              <span>Opening {active.title}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectTransitionContext.Provider>
  );
}

/** Returns a function that opens a project with the expand transition. */
export function useOpenProject(): OpenProject {
  const ctx = useContext(ProjectTransitionContext);
  const navigate = useNavigate();
  return ctx ?? ((args) => navigate(args.href));
}
