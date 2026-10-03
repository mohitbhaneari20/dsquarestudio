import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../lib/cn';
import { useIntroDone } from '../../lib/intro';
import { EASE_OUT_SOFT } from '../../lib/motion';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

const links = [
  { label: 'Work', to: '/work' },
  { label: 'Ongoing', to: '/ongoing' },
  { label: 'Studio', to: '/studio' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

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
  const closeMenu = useCallback(() => setMenuOpen(false), []);
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
                <NavItem key={item.to} {...item} />
              ))}
            </ul>

            <button
            type="button"
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
