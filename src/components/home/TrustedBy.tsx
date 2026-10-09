import { Link } from 'react-router-dom';
import { clients, type ClientLogo } from '../../data/clients';
import { getProject, projectHref } from '../../data/projects';

/** A client's case study — /ongoing/… while it's still in progress, /work/… once finished. */
const hrefFor = (slug: string) => {
  const p = getProject(slug);
  return p ? projectHref(p) : `/work/${slug}`;
};
import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';

/** Every logo sits inside a fixed padding and scales down to fit its tile. It is drawn in one flat colour (its shape used as a mask), so mixed brands sit together calmly; on hover it takes its own brand colour. */
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
    <span className="flex min-w-0 max-w-full items-center gap-2.5 text-foreground transition-colors duration-300 group-hover:text-[var(--brand)]">
      {mask && (
        <span
          aria-hidden="true"
          className="block h-6 min-w-0 max-w-full shrink bg-current xl:h-8"
          style={{ ...mask, aspectRatio: String(client.ratio ?? 1) }}
        />
      )}
      {client.wordmark && <span className="text-xl font-semibold tracking-[-0.04em] xl:text-[1.7rem]">{client.wordmark}</span>}
      <span className="sr-only">{client.name}</span>
    </span>
  );
}

const cell = 'group relative flex h-24 items-center justify-center border-b border-r border-border px-5 transition-colors duration-300 hover:bg-[var(--brand-bg)] md:h-28';

/**
 * "Brands we've built": the studio's own brands, linked to their case studies.
 * Only real work goes here — no placeholder slots, and no implying clients that aren't.
 */
export function TrustedBy() {
  return (
    <section className="container-site section-space pt-0!" aria-label="Brands we’ve built">
      <div className="grid-site gap-y-8">
        <p className="text-meta col-span-12 flex items-center gap-2 self-start text-muted md:col-span-3 md:pt-4">
          <SquareBullet /> Brands we’ve built
        </p>
        <Reveal className="col-span-12 md:col-span-9">
          {/* Two per row on phones and tablets, all in one row from laptops up */}
          <ul
            className="grid grid-cols-2 border-l border-t border-border lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
            style={{ '--n': clients.length } as React.CSSProperties}
          >
            {clients.map((c) => (
              <li key={c.name} style={{ '--brand': c.color ?? 'var(--accent)', '--brand-bg': c.hoverBg ?? 'transparent' } as React.CSSProperties}>
                {c.slug ? (
                  <Link to={hrefFor(c.slug)} className={cell} data-cursor="View" aria-label={`${c.name} case study`}>
                    <Logo client={c} />
                  </Link>
                ) : (
                  <div className={cell}>
                    <Logo client={c} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
