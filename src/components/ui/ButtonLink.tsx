import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

interface ButtonLinkProps {
  children: ReactNode;
  /** Internal route */
  to?: string;
  /** External URL or mailto: */
  href?: string;
  variant?: 'primary' | 'outline' | 'text';
  size?: 'md' | 'lg';
  className?: string;
  /** Renders a <button> when neither `to` nor `href` is given */
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variants = {
  primary: 'bg-accent text-[var(--accent-foreground)] hover:bg-foreground hover:text-background',
  outline: 'border border-foreground/70 text-foreground hover:bg-foreground hover:text-background',
  text: 'text-foreground px-0! h-auto! link-underline rounded-none! font-sans normal-case text-base tracking-tight',
};

const sizes = {
  md: 'h-11 px-5 text-[12px]',
  lg: 'h-14 px-7 text-xs md:h-16 md:px-9',
};

/** Rectangular mono-label button with an arrow that nudges on hover. */
export function ButtonLink({ children, to, href, variant = 'primary', size = 'md', className, onClick, type = 'button', disabled }: ButtonLinkProps) {
  const external = !!href && /^https?:/.test(href);
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    'group inline-flex items-center gap-3 rounded-[var(--radius)] font-mono uppercase tracking-[0.12em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50',
    sizes[size],
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      <Icon
        size={size === 'lg' ? 20 : 16}
        strokeWidth={1.75}
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} data-cursor-cta>
        {content}
      </Link>
    );
  }
  if (!href) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={classes} data-cursor-cta>
        {content}
      </button>
    );
  }
  return (
    <a href={href} className={classes} data-cursor-cta {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {content}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
