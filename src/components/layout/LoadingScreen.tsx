import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IntroContext } from '../../lib/intro';
import { lockScroll, scrollToTop } from '../../lib/smoothScroll';
import { useReduceMotion } from '../../lib/motionPreference';

const VIDEO_SRC = '/brand/loader.mp4';
/** The video's own background, shown behind it so there's no flash before the first frame. */
const VIDEO_BG = '#ff6600';
/** The video ends with an off-white wipe (from ~2.6s); cut on the plain-orange stretch before it. */
const VIDEO_END_S = 2.4;
/** If the video hasn't started by now (autoplay blocked, slow network), skip it. */
const START_TIMEOUT_MS = 1500;
/** The split-open reveal. */
const OPEN_S = 1;
const OPEN_EASE = [0.76, 0, 0.24, 1] as const;
/** Hard cap for the whole loader, whatever happens. */
const MAX_MS = 6000;

const SEEN_KEY = 'dsq-intro-seen';

/**
 * The intro is the homepage's opening: it plays when a visit starts on the homepage,
 * once per browsing session. Deep links and later visits open the page straight away.
 * (index.html makes the same decision before first paint.)
 */
function decideIntro(): boolean {
  if (typeof window === 'undefined' || window.location.pathname !== '/') return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage blocked — play it, it's still skippable */
  }
  return true;
}
// Decided once per page load (not per render — React may render twice in development)
const PLAY_INTRO = decideIntro();
const shouldPlayIntro = () => PLAY_INTRO;

/** Resolves when fonts and the window have loaded (so the layout is final). */
function pageReady(): Promise<void> {
  const loaded =
    document.readyState === 'complete' ? Promise.resolve() : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
  // The font stylesheet loads asynchronously (index.html) — wait for it, then for the fonts themselves
  const sheet = document.querySelector<HTMLLinkElement>('link[as="style"][href*="fonts.googleapis"]');
  const sheetLoaded =
    sheet && sheet.rel === 'preload'
      ? new Promise<void>((r) => {
          sheet.addEventListener('load', () => r(), { once: true });
          sheet.addEventListener('error', () => r(), { once: true });
          window.setTimeout(r, 3000);
        })
      : Promise.resolve();
  const fonts = sheetLoaded.then(() => document.fonts?.ready).then(() => undefined);
  return Promise.all([loaded, fonts]).then(() => undefined);
}

/**
 * Full-screen intro that plays the Dsquare loader video when a visit starts on the
 * homepage — once per browsing session (in-app navigation never shows it).
 * When the video reaches VIDEO_END_S (just before its own off-white wipe) and the
 * page is ready, the orange splits open from the middle — the left half slides left,
 * the right half slides right — revealing the hero inside the opening. If the video
 * can't play it is skipped; with reduced motion there is no loader at all. Any click, tap,
 * key, scroll or swipe skips straight to the reveal, so nobody is held by the intro.
 * `useIntroDone()` flips to true as the opening starts, so the hero rises in through it.
 */
export function LoadingScreen({ children }: { children: ReactNode }) {
  const reduce = !!useReduceMotion();
  // playing → opening (halves slide apart over the hero) → gone
  const [phase, setPhase] = useState<'playing' | 'opening' | 'gone'>(() => (reduce || !shouldPlayIntro() ? 'gone' : 'playing'));
  const videoRef = useRef<HTMLVideoElement>(null);
  const playing = phase === 'playing';
  const active = phase !== 'gone';

  // Until the right half has fully slid off, keep the page locked and orange — including
  // the scrollbar gutter, which a fixed overlay can't cover. Releasing both only at the end
  // means the strip on the right never flashes sand or a scrollbar mid-reveal.
  // (index.html adds the class before first paint.)
  useEffect(() => {
    if (!active) {
      // Safety net: never leave the page painted loader-orange
      document.documentElement.classList.remove('intro-pending');
      return;
    }
    // Start at the top so the hero is in its scroll-0 state when revealed
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    scrollToTop();
    lockScroll(true);
    document.documentElement.classList.add('intro-pending');
    return () => {
      lockScroll(false);
      document.documentElement.classList.remove('intro-pending');
    };
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    const timers: number[] = [];
    const skipCleanups: Array<() => void> = [];

    const video = videoRef.current;
    let frame = 0;
    const videoDone = new Promise<void>((resolve) => {
      if (!video) return resolve();
      // Any click, tap, key, scroll or swipe skips the rest of the intro
      const skip = () => {
        video.pause();
        resolve();
      };
      for (const type of ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const) {
        window.addEventListener(type, skip, { once: true, passive: true });
        skipCleanups.push(() => window.removeEventListener(type, skip));
      }
      // Watch the playhead every frame and cut at VIDEO_END_S
      const watch = () => {
        if (video.currentTime >= VIDEO_END_S) {
          video.pause();
          resolve();
        } else frame = requestAnimationFrame(watch);
      };
      frame = requestAnimationFrame(watch);
      video.addEventListener('ended', () => resolve(), { once: true });
      video.addEventListener('error', () => resolve(), { once: true });
      // Autoplay can be refused (e.g. iOS Low Power Mode) — don't wait on a frozen frame
      timers.push(window.setTimeout(() => video.currentTime === 0 && video.paused && resolve(), START_TIMEOUT_MS));
      video.play().catch(() => resolve());
    });
    const cap = new Promise<void>((r) => timers.push(window.setTimeout(r, MAX_MS)));

    Promise.race([Promise.all([videoDone, pageReady()]), cap]).then(() => {
      if (cancelled) return;
      setPhase('opening');
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      skipCleanups.forEach((off) => off());
      cancelAnimationFrame(frame);
    };
  }, [playing]);

  // Turning motion off mid-intro skips the rest of it
  useEffect(() => {
    if (reduce && phase !== 'gone') {
      setPhase('gone');
    }
  }, [reduce, phase]);

  const opening = phase === 'opening';
  const half = (side: 'left' | 'right') => (
    <motion.div
      className={`absolute inset-y-0 w-1/2 ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={{ backgroundColor: VIDEO_BG }}
      initial={false}
      animate={{ x: opening ? (side === 'left' ? '-100%' : '100%') : '0%' }}
      transition={{ duration: OPEN_S, ease: OPEN_EASE }}
      onAnimationComplete={side === 'right' && opening ? () => setPhase('gone') : undefined}
    />
  );

  return (
    <IntroContext.Provider value={phase !== 'playing'}>
      {children}
      {phase !== 'gone' && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading Dsquare Studio"
          className={`fixed left-0 top-0 z-[1000] h-screen w-screen overflow-hidden ${opening ? 'pointer-events-none' : ''}`}
        >
          {half('left')}
          {half('right')}
          {/* The video plays over the halves; it ends on plain orange, so hiding it is seamless */}
          {playing && (
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </IntroContext.Provider>
  );
}
