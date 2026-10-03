import { featuredProjects } from '../../data/projects';
import { cn } from '../../lib/cn';
import { ButtonLink } from '../ui/ButtonLink';
import { ProjectCard } from '../projects/ProjectCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { SquareBullet } from '../ui/SquareBullet';
import { TextReveal } from '../ui/TextReveal';

/** "Our work": the section title reveals first, then 4:3 project cards alternating left and right. */
export function HomeWork() {
  return (
    <section className="container-site pb-[var(--section-space)]">
      <SquareBullet className="mb-8 block" />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <TextReveal as="h2" lines={['Our work']} className="text-display" />
        <ButtonLink to="/work" variant="text">
          All work
        </ButtonLink>
      </div>

      <div className="grid-site mt-16 gap-y-20 md:mt-24 md:gap-y-16">
        {featuredProjects.map((p, i) => {
          const right = i % 2 === 1;
          return (
            <ScrollReveal
              as="article"
              key={p.slug}
              // Cards side by side enter 100ms apart
              delay={right ? 0.1 : 0}
              className={cn('col-span-12 md:col-span-6', right && 'md:col-start-7 md:mt-32')}
            >
              <ProjectCard project={p} />
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
