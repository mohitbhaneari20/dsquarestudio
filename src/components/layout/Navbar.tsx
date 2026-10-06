import { motion } from 'framer-motion';
import { useReduceMotion } from '../../lib/motionPreference';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../lib/cn';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT } from '../../lib/motion';
import { BrandMark } from '../brand/Brand';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

const links = [
  { label: 'Work', to: '/work' },
  { label: 'Ongoing', to: '/ongoing' },
  { label: 'About D²', to: '/studio', hand: true },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

/** "About D²": "About" like the other links followed by the D² monogram; an orange loop is drawn around it on hover. */
function HandNavItem({ label, to }: { label: string; to: string }) {
  const [hover, setHover] = useState(false);
  const still = useReduceMotion();
  return (
    <li>
      <NavLink
        to={to}
        aria-label={label}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={({ isActive }) =>
          cn(
            'relative inline-flex items-center gap-1.5 px-1 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors',
            isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
          )
        }
      >
        {() => (
          <>
            {label.replace(/\s*D²$/, '')}
            {/* The D² monogram from the logo in place of the letters — always black */}
            <BrandMark title={null} copyright={false} className="size-[15px] text-black" />
            <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-[18%] -inset-y-[45%] h-[190%] w-[136%] overflow-visible" aria-hidden="true">
              <motion.path
                d="M18 44 C 20 14, 120 4, 176 22 C 204 32, 190 66, 120 72 C 60 77, 8 66, 14 40 C 18 26, 60 16, 104 14"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
                transition={still ? { duration: 0 } : { pathLength: { duration: 0.5, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.15 } }}
              />
            </svg>
          </>
        )}
      </NavLink>
    </li>
  );
}

function NavItem({ label, to }: { label: string; to: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            'relative inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors',
            isActive ? 'text-foreground hover:text-accent' : 'text-muted hover:text-accent',
          )
        }
      >
        {({ isActive }) => (
          <>
            <span className={cn('size-1.5 bg-accent transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
            {label}
          </>
        )}
      </NavLink>
    </li>
  );
}

/** Floating pill: logo on the left, links on the right. Collapses to logo + Menu on phones. */
export function Navbar() {
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  // Closing the menu (× or Escape) hands keyboard focus back to the Menu button
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButton.current?.focus());
  }, []);
  const ready = useIntroDone();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
        initial={{ opacity: 0, y: -24 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 0.1, ease: EASE_OUT_SOFT }}
      >
        <nav
          aria-label="Main"
          className={cn(
            'pointer-events-auto flex h-12 w-full max-w-[34rem] items-center justify-between rounded-[var(--radius-lg)] bg-surface px-4 transition-shadow duration-500 md:h-[3.25rem] md:max-w-[50rem] md:pl-5 md:pr-5',
            scrolled ? 'shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)]' : 'shadow-[0_1px_0_rgb(0_0_0/0.04)]',
          )}
        >
          <Logo />

          <div className="flex items-center gap-3 md:gap-6">
            <ul className="hidden items-center gap-6 md:flex lg:gap-7">
              {links.map((item) => (
                item.hand ? <HandNavItem key={item.to} {...item} /> : <NavItem key={item.to} {...item} />
              ))}
            </ul>

            <button
            type="button"
            ref={menuButton}
            onClick={() => setMenuOpen(true)}
            className="-mr-2 inline-flex h-11 items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.1em] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            Menu
            <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
