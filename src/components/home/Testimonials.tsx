import { Quote } from 'lucide-react';
import { clients, type Testimonial } from '../../data/clients';
import { allTestimonials as testimonials } from '../../data/projects';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

export function TestimonialCard({ t, large = false }: { t: Testimonial; large?: boolean }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-12 border border-border bg-surface p-6 md:p-8">
      <div>
        <Quote size={26} strokeWidth={1.25} className="text-accent-ink" aria-hidden="true" />
        <blockquote className={large ? 'text-h3 mt-8' : 'mt-6 text-xl leading-snug tracking-[-0.02em] md:text-2xl'}>“{t.quote}”</blockquote>
      </div>
      <figcaption className="flex items-center gap-4 border-t border-border pt-5">
        {t.photo && <img src={t.photo} alt="" className={large ? 'size-14 object-cover' : 'size-11 object-cover'} loading="lazy" />}
        <div>
          <p className="font-medium">{t.name}</p>
          <p className="text-meta text-muted">
            {t.role}, {t.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Shown until real quotes are added to data/clients.ts */
function Placeholder({ company }: { company: string }) {
  return (
    <div
      className="flex h-full min-h-72 flex-col justify-between gap-12 border border-dashed border-foreground/25 p-6 md:p-8"
      style={{
        backgroundImage:
          'linear-gradient(color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      role="img"
      aria-label={`Testimonial placeholder — ${company}`}
    >
      <div>
        <Quote size={26} strokeWidth={1.25} className="text-muted" aria-hidden="true" />
        <div className="mt-6 space-y-3" aria-hidden="true">
          <span className="block h-3 w-11/12 bg-foreground/10" />
          <span className="block h-3 w-4/5 bg-foreground/10" />
          <span className="block h-3 w-3/5 bg-foreground/10" />
        </div>
      </div>
      <div className="border-t border-dashed border-foreground/25 pt-5">
        <p className="text-meta text-muted">Testimonial — {company}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  const empty = testimonials.length === 0;
  const single = testimonials.length === 1;

  return (
    <section className="container-site section-space pt-0!">
      <SectionHeader
        eyebrow="Kind words"
        title={['In their', 'own words.']}
        intro="What it’s like to work with us, from the people who did."
      />
      <ul className={cn('mt-16 grid gap-[var(--grid-gap)] md:mt-24', single ? 'lg:ml-[25%]' : 'md:grid-cols-2 xl:grid-cols-3')}>
        {empty
          ? clients.map((c, i) => (
              <Reveal as="li" key={c.name} delay={i * 0.06}>
                <Placeholder company={c.name} />
              </Reveal>
            ))
          : testimonials.map((t, i) => (
              <Reveal as="li" key={t.name + t.company} delay={i * 0.06}>
                <TestimonialCard t={t} large={single} />
              </Reveal>
            ))}
      </ul>
    </section>
  );
}
