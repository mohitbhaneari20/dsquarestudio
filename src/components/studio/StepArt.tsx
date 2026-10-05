import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import understand from '../../assets/steps/01-understand-sand.svg?raw';
import explore from '../../assets/steps/02-explore-sand.svg?raw';
import design from '../../assets/steps/03-design-sand.svg?raw';
import build from '../../assets/steps/04-build-sand.svg?raw';
import refine from '../../assets/steps/05-refine-sand.svg?raw';

/** One illustration per step, in order. Each one's orange line leaves the right edge at the height the next one enters. */
const ART = [understand, explore, design, build, refine];

/**
 * Prepares an illustration for inlining: unique ids (five sit on one page),
 * fills its box, and is cropped rather than stretched if the box isn't 4:3.
 */
function prepare(svg: string, prefix: string) {
  return svg
    .replace(/\sid="([^"]+)"/g, ` id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/<svg([^>]*?)\swidth="[^"]*"\s+height="[^"]*"/, '<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid slice"')
    .replace('class="dsq play"', 'class="dsq"');
}

export interface StepArtHandle {
  svg: SVGSVGElement | null;
  /** 0 → 1: how much of this illustration's orange line is drawn */
  setDrawn: (amount: number) => void;
}

/**
 * A step illustration, inlined so its orange line can be drawn by scroll.
 * Its own little animations start once it comes into view.
 */
export const StepArt = forwardRef<StepArtHandle, { index: number; label: string }>(function StepArt({ index, label }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const html = useMemo(() => prepare(ART[index % ART.length]!, `step${index}`), [index]);

  useImperativeHandle(ref, () => ({
    get svg() {
      return box.current?.querySelector('svg') ?? null;
    },
    setDrawn(amount: number) {
      box.current?.querySelectorAll<SVGElement>('.line').forEach((el) => {
        el.style.strokeDashoffset = String(1 - amount);
      });
    },
  }));

  // Start the scene's own movement when it's on screen
  useEffect(() => {
    const el = box.current;
    const svg = el?.querySelector('svg');
    if (!el || !svg) return;
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && svg.classList.add('play'), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [html]);

  return <div ref={box} className="step-art h-full w-full" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />;
});
