import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clients, type ClientLogo } from '../../data/clients';
import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';

/** Every logo is drawn in one flat colour (its shape used as a mask), so mixed brands sit together calmly. */
function Logo({ client }: { client: ClientLogo }) {
  const mask = client.logo
    ? {
        WebkitMaskImage: `url(${client.logo})`,
        maskImage: `url(${client.logo})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }
    : undefined;
  return (
    <span className="flex items-center gap-2.5 text-foreground transition-colors duration-300 group-hover:text-accent">
      {mask && (
        <span
          aria-hidden="true"
          className="block h-7 bg-current md:h-8"
          style={{ ...mask, aspectRatio: String(client.ratio ?? 1) }}
        />
      )}
      {client.wordmark && <span className="text-2xl font-semibold tracking-[-0.04em] md:text-[1.7rem]">{client.wordmark}</span>}
      <span className="sr-only">{client.name}</span>
    </span>
  );
}

const cell = 'group relative flex h-28 items-center justify-center border-b border-r border-border md:h-36';

/** "Trusted by": the brands we've worked with, plus an open slot for the next one. */
export function TrustedBy() {
  // Fill the row to a multiple of four with open slots
  const open = Math.max(1, (4 - (clients.length % 4)) % 4 || 0);

  return (
    <section className="container-site section-space pt-0!" aria-label="Trusted by">
      <div className="grid-site gap-y-8">
        <p className="text-meta col-span-12 flex items-center gap-2 self-start text-muted md:col-span-3 md:pt-4">
          <SquareBullet /> Trusted by
        </p>
        <Reveal className="col-span-12 md:col-span-9">
          <ul className="grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
            {clients.map((c) => (
              <li key={c.name}>
                {c.slug ? (
                  <Link to={`/work/${c.slug}`} className={cell} data-cursor="Dig it" aria-label={`${c.name} case study`}>
                    <Logo client={c} />
                  </Link>
                ) : (
                  <div className={cell}>
                    <Logo client={c} />
                  </div>
                )}
              </li>
            ))}
            {Array.from({ length: open }, (_, i) => (
              <li key={`open-${i}`}>
                <Link to="/contact" className={`${cell} flex-col gap-2 text-muted hover:text-accent`}>
                  <span className="text-meta">{i === open - 1 ? 'Your brand next' : 'Open slot'}</span>
                  {i === open - 1 && <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 border border-dashed border-foreground/15 transition-colors group-hover:border-accent/60"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
