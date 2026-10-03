import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

interface PagerLink {
  to: string;
  title: string;
}

interface ProjectPagerProps {
  prev?: PagerLink;
  next?: PagerLink;
  back: { to: string; label: string };
}

/** Previous / next project links plus a way back to the index. */
export function ProjectPager({ prev, next, back }: ProjectPagerProps) {
  const item = (link: PagerLink, dir: 'prev' | 'next') => (
    <Link
      to={link.to}
      className={cn('group flex flex-col gap-4 py-10 md:py-14', dir === 'next' && 'md:items-end md:text-right')}
      data-cursor={dir === 'next' ? 'Next' : 'Prev'}
    >
      <span className="text-meta inline-flex items-center gap-2 text-muted">
        {dir === 'prev' && <ArrowLeft size={12} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />}
        {dir === 'prev' ? 'Previous project' : 'Next project'}
        {dir === 'next' && <ArrowRight size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="text-h2 uppercase transition-colors duration-300 group-hover:text-accent">{link.title}</span>
    </Link>
  );

  return (
    <nav aria-label="More projects" className="container-site">
      <div className="grid border-y border-border md:grid-cols-2 md:divide-x md:divide-border">
        <div className="border-b border-border md:border-b-0 md:pr-8">{prev && item(prev, 'prev')}</div>
        <div className="md:pl-8">{next && item(next, 'next')}</div>
      </div>
      <div className="flex justify-center py-10">
        <Link to={back.to} className="text-meta link-underline text-muted hover:text-foreground">
          {back.label}
        </Link>
      </div>
    </nav>
  );
}
