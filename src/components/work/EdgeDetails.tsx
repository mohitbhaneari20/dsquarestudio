import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site } from '../../config/site';

export function useClock(timeZone: string) {
  const format = () =>
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

/** Studio time + location, e.g. "11:12 AM IST — India / 30°N / 78°E". */
export function StudioClock({ className }: { className?: string }) {
  const { location } = site;
  const time = useClock(location.timeZone);
  return (
    <span className={className}>
      <time>{time}</time> {location.tzLabel} — {location.label} / {location.coords}
    </span>
  );
}

/**
 * A tiny vertical annotation in the right gutter (desktop only).
 * Fades out near the footer so it never collides with it.
 */
export function EdgeDetails({ section }: { section: string }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.9, 0.96], [1, 1, 0]);

  return (
    <motion.div aria-hidden="true" style={{ opacity }} className="text-meta pointer-events-none fixed inset-0 z-30 hidden text-white mix-blend-difference lg:block">
      <span className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap [writing-mode:vertical-rl]">
        {section} / {site.year} — Design × Development
      </span>
    </motion.div>
  );
}
