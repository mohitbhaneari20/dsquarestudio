import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { navigation, site } from '../../config/site';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/format';
import { BrandMark } from '../brand/Brand';
import { Logo } from './Logo';
import { useReduceMotion } from '../../lib/motionPreference';

const links = [...navigation, { label: 'Contact', to: '/contact' }];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  useFocusTrap(ref, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="theme-inverse fixed inset-0 z-[70] flex flex-col overflow-y-auto"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="container-site flex h-[var(--nav-height)] shrink-0 items-center justify-between">
            <Logo onClick={onClose} />
            <button type="button" onClick={onClose} className="-mr-2 inline-flex h-11 items-center gap-2 px-2 text-sm font-medium">
              Close
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <nav className="container-site flex flex-1 flex-col justify-center py-10" aria-label="Mobile">
            <ul className="border-t border-border">
              {links.map((item, i) => (
                <motion.li
                  key={item.to}
                  className="border-b border-border"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn('flex items-baseline justify-between py-4 text-[clamp(2.5rem,12vw,4.5rem)] font-medium leading-none tracking-[-0.045em] transition-colors hover:text-accent', isActive && 'text-accent-ink')
                    }
                  >
                    {/D²$/.test(item.label) ? (
                      // "About" followed by the D² monogram from the logo, like the desktop nav
                      <span className="inline-flex items-baseline gap-[0.22em]" aria-label={item.label}>
                        {item.label.replace(/\s*D²$/, '')}
                        <BrandMark title={null} copyright={false} className="size-[0.72em] self-center" />
                      </span>
                    ) : (
                      item.label
                    )}
                    <span className="text-meta text-muted">{pad(i + 1)}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="container-site flex shrink-0 flex-wrap gap-x-6 gap-y-3 pb-8 text-sm text-muted">
            <a href={`mailto:${site.email}`} className="text-foreground">
              {site.email}
            </a>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                {s.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
