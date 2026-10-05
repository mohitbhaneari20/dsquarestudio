import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navigation, site } from '../../config/site';
import { BrandMark, BrandWordmark } from '../brand/Brand';
import { Reveal } from '../ui/Reveal';

// Gallery is linked from the footer only, not the main navigation
const footerNav = [...navigation, { label: 'Gallery', to: '/gallery' }, { label: 'Contact', to: '/contact' }];

export function Footer() {
  return (
    <footer className="theme-inverse overflow-hidden pb-6 pt-20 md:pt-28">
      <div className="container-site">
        <div className="grid-site gap-y-12">
          <Reveal className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-h3 max-w-md">
              Have an idea? <br />
              <a href={`mailto:${site.email}`} className="link-underline text-muted transition-colors hover:text-foreground">
                {site.email}
              </a>
            </p>
          </Reveal>

          <Reveal delay={0.08} className="col-span-6 md:col-span-3 lg:col-start-8 lg:col-span-2">
          <nav aria-label="Footer">
            <h2 className="text-meta mb-5 text-muted">Navigation</h2>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-underline transition-colors hover:text-accent" aria-label={item.label}>
                    {/D²$/.test(item.label) ? (
                      // "About" followed by the D² monogram, like the main navigation
                      <span className="inline-flex items-center gap-1.5">
                        {item.label.replace(/\s*D²$/, '')}
                        <BrandMark title={null} copyright={false} className="size-[0.95em]" />
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </Reveal>

          <Reveal delay={0.16} className="col-span-6 md:col-span-3 lg:col-span-3">
            <h2 className="text-meta mb-5 text-muted">Elsewhere</h2>
            <ul className="space-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1">
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRight size={14} aria-hidden="true" className="opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="link-underline">
                  Email
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex items-end justify-between border-t border-border pt-6 md:mt-28">
          <p className="text-meta flex items-center gap-3 text-muted">
            <BrandMark title={null} className="size-8 text-accent" />
            {site.tagline}
          </p>
          <a href="#top" className="text-meta inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground">
            Back to top <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
        {/* Oversized brand wordmark, exactly the container width */}
        <Reveal y={60}>
          <BrandWordmark title={null} className="mt-6 block h-auto w-full text-accent" />
        </Reveal>
      </div>

      <div className="relative z-10 border-t border-border bg-background">
        <div className="container-site text-meta flex flex-col gap-2 py-5 text-muted sm:flex-row sm:justify-between">
          <span>© {site.year} {site.name}</span>
          <span>Made with curiosity + too many iterations.</span>
        </div>
      </div>
    </footer>
  );
}
