import { cn } from '../../lib/cn';
import { ButtonLink } from './ButtonLink';
import { SquareBullet } from './SquareBullet';
import { Reveal } from './Reveal';
import { TextReveal } from './TextReveal';

interface CTAProps {
  index?: string;
  title?: string[];
  body?: string;
  eyebrow?: string;
  secondary?: { to: string; label: string };
  /** Extra classes for the headline, e.g. uppercase */
  titleClassName?: string;
}

/** Closing call to action used at the bottom of most pages. */
export function CTA({
  index,
  title = ['Have something', 'worth building?'],
  body = 'Let’s turn the idea into something people can actually use.',
  eyebrow = 'Start a project',
  secondary = { to: '/work', label: 'See the work' },
  titleClassName,
}: CTAProps) {
  return (
    <section className="container-site section-space">
      <div className="grid-site border-t border-border pt-4">
        <p className="text-meta col-span-12 flex gap-3 text-muted">
          <SquareBullet className="self-center" />
          {index && <span>{index}</span>}
          <span>{eyebrow}</span>
        </p>
      </div>
      <TextReveal lines={title} className={cn('text-display mt-12 md:mt-20', titleClassName)} />
      <Reveal delay={0.15} className="grid-site mt-12 items-end gap-y-8 md:mt-16">
        <p className="text-lead col-span-12 max-w-md text-muted md:col-span-5">{body}</p>
        <div className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-7 md:justify-end">
          <ButtonLink to="/contact" size="lg">
            Start a project
          </ButtonLink>
          <ButtonLink to={secondary.to} variant="text">
            {secondary.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
