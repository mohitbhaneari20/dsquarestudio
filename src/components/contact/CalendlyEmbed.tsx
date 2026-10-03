import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { site } from '../../config/site';

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
  }
}

/** Load Calendly's widget script once, on demand. */
function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
  return new Promise((resolve, reject) => {
    const s = existing ?? Object.assign(document.createElement('script'), { src: SCRIPT, async: true });
    s.addEventListener('load', () => resolve(), { once: true });
    s.addEventListener('error', () => reject(new Error('Calendly failed to load')), { once: true });
    if (!existing) document.body.appendChild(s);
  });
}

/** Calendly booking page with the site's colours (background, text, accent). */
function bookingUrl() {
  const params = new URLSearchParams({
    hide_gdpr_banner: '1',
    // Skip Calendly's own title block — the section already says what this is
    hide_event_type_details: '1',
    background_color: 'eeebe6',
    text_color: '000000',
    primary_color: 'fa5c01',
  });
  return `${site.calendly}?${params}`;
}

/**
 * Inline Calendly calendar. The script only loads when the section is near the
 * screen, so it doesn't slow the rest of the page. If it can't load, a plain
 * link to the booking page is shown instead.
 */
export function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '400px 0px' });
  const [failed, setFailed] = useState(false);
  // Calendly reports its content height; sizing the frame to it means no inner scrollbar
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      const data = e.data as { event?: string; payload?: { height?: string } } | undefined;
      if (data?.event === 'calendly.page_height' && data.payload?.height) {
        const h = parseInt(data.payload.height, 10);
        if (h > 0) setHeight(h);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!near || !el) return;
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled || !window.Calendly) return;
        el.innerHTML = '';
        window.Calendly.initInlineWidget({ url: bookingUrl(), parentElement: el });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [near]);

  return (
    // Sits against the right edge of its column
    <div className="flex flex-col items-end">
      <div
        ref={ref}
        // Calendly's free plan ignores the colour settings above, so the frame is re-tinted here:
        // its blue turns to the brand orange and its white warms slightly. Neutrals stay as they are.
        className="w-full max-w-[36rem] overflow-hidden border border-border bg-[#fdfcfa] [&_iframe]:!h-full [&_iframe]:[filter:hue-rotate(167deg)_saturate(1.35)_sepia(0.08)]"
        style={{ height: height ?? 560 }}
        aria-label="Booking calendar"
      >
        {/* Shown until the calendar appears */}
        <div className="flex h-full items-center justify-center">
          <p className="text-meta text-muted">{failed ? 'The calendar couldn’t load.' : 'Loading calendar…'}</p>
        </div>
      </div>
      <a href={site.calendly} target="_blank" rel="noreferrer" className="text-meta mt-4 inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent">
        Open in Calendly <ArrowUpRight size={12} aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
