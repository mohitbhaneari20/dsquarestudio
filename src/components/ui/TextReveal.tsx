import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '../../lib/cn';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT, REVEAL_VIEWPORT } from '../../lib/motion';
import { useReduceMotion } from '../../lib/motionPreference';

interface TextRevealProps {
  /** Each item is rendered as its own masked line. */
  lines: string[];
  as?: 'h1' | 'h2' | 'p';
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate as soon as the page is ready (above-the-fold headings) rather than on scroll. */
  immediate?: boolean;
}

/**
 * Headline lines slide up from behind a mask, one after another.
 * Screen readers get one plain string. Waits for the intro screen.
 */
export function TextReveal({ lines, as = 'h2', className, lineClassName, delay = 0, immediate }: TextRevealProps) {
  const reduce = useReduceMotion();
  const ready = useIntroDone();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, REVEAL_VIEWPORT);
  const Tag = as;
  const shown = ready && (immediate || inView);

  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      <motion.span ref={ref} className="block" initial="hidden" animate={shown ? 'shown' : 'hidden'} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
            <motion.span
              className={cn('block will-change-transform', lineClassName)}
              variants={{
                // Each state sets every property, so flipping the Motion switch mid-page
                // can't leave a line half-way (e.g. faded in but still below its mask)
                hidden: reduce ? { opacity: 0, y: '0%', rotate: 0 } : { opacity: 1, y: '110%', rotate: 2 },
                shown: { opacity: 1, y: '0%', rotate: 0 },
              }}
              transition={{ duration: reduce ? 0.25 : 1.15, delay: delay + i * 0.09, ease: EASE_OUT_SOFT }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
