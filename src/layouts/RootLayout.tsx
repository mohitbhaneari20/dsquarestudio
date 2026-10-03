import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { GridLines } from '../components/layout/GridLines';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { ProjectTransitionProvider } from '../components/layout/ProjectTransition';
import { DSquareLoader } from '../components/ui/DSquareLoader';
import { CustomCursor } from '../components/ui/CustomCursor';
import { SoundEffects } from '../components/ui/SoundEffects';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { useReduceMotion } from '../lib/motionPreference';
import { scrollToTop, startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll';

/** Freezes the outlet so the outgoing page can animate out with its own content. */
function AnimatedOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function RootLayout() {
  const { pathname } = useLocation();

  // Site-wide motion preference (system setting, or the footer's Motion switch)
  const reduce = useReduceMotion();

  // Inertial scrolling only when motion is on
  useEffect(() => {
    if (reduce) return;
    startSmoothScroll();
    return stopSmoothScroll;
  }, [reduce]);

  return (
    <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
      <ProjectTransitionProvider>
      <LoadingScreen>
      <div id="top" />
      <a
        href="#main"
        className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <GridLines />
      <ScrollProgress />
      <Navbar />

      {/* No initial={false}: the first page must start hidden so its reveals can play after the intro */}
      <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
        <PageTransition key={pathname}>
          {/* Content sits above the fixed grid lines */}
          <main id="main" tabIndex={-1} className="min-h-[70vh] outline-none">
            <Suspense fallback={<DSquareLoader />}>
              <AnimatedOutlet />
            </Suspense>
          </main>
          <Footer />
        </PageTransition>
      </AnimatePresence>

      <CustomCursor />
      <SoundEffects />
      </LoadingScreen>
      </ProjectTransitionProvider>
    </MotionConfig>
  );
}
