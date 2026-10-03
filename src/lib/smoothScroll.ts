import Lenis from 'lenis';

/**
 * One shared Lenis instance for inertial page scrolling.
 * Everything that scrolls programmatically goes through these helpers so
 * Lenis and the native scroll position never disagree.
 */
let lenis: Lenis | null = null;

export function startSmoothScroll(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.085, // lower = softer glide
    smoothWheel: true,
    anchors: { offset: -80 }, // in-page #links glide too, clearing the floating nav
    // The site decides when to run Lenis (see RootLayout), so it shouldn't second-guess that
    respectReducedMotion: false,
    // Let horizontally scrolling rows and open dialogs handle their own scroll
    prevent: (node) => node.closest('[data-lenis-prevent], [role="dialog"]') !== null,
  });
  return lenis;
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

/** Jump to the top with no animation (used between pages). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

/** Glide to an element, leaving room for the floating navbar. */
export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Freeze / release page scrolling (intro screen, overlays). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
