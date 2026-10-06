import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ButtonLink } from '../components/ui/ButtonLink';
import { CTA } from '../components/ui/CTA';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { Seo } from '../components/ui/Seo';
import { CategoryFilter } from '../components/work/CategoryFilter';
import { EdgeDetails } from '../components/work/EdgeDetails';
import { StillBuilding } from '../components/work/StillBuilding';
import { WorkHero } from '../components/work/WorkHero';
import { completedProjects, ongoingProjects } from '../data/projects';
import { categories, type Category } from '../data/types';

const toParam = (c: Category) => c.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const fromParam = (value: string | null) => categories.find((c) => toParam(c) === value);

export default function Work() {
  const [params, setParams] = useSearchParams();
  const active = fromParam(params.get('filter'));
  // The grid shows finished work; work in progress has its own section below
  const visible = useMemo(() => (active ? completedProjects.filter((p) => p.categories.includes(active)) : completedProjects), [active]);

  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c, completedProjects.filter((p) => p.categories.includes(c)).length])),
    [],
  );

  const select = (category?: Category) =>
    setParams(category ? { filter: toParam(category) } : {}, { replace: true, preventScrollReset: true });

  return (
    <>
      <Seo />
      <EdgeDetails section="Work" />

      <WorkHero projects={completedProjects} />

      <div className="container-site mt-8 md:mt-12">
        <CategoryFilter active={active} counts={counts} total={completedProjects.length} onChange={select} />
      </div>

      <section id="showcase" aria-label="Projects" className="container-site scroll-mt-20 pb-[var(--section-space)] pt-10 md:pt-16">
        {visible.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border-t border-border py-24">
            <p className="text-h3 max-w-lg">Nothing in {active} yet. Still figuring it out.</p>
            <ButtonLink variant="outline" onClick={() => select()}>
              Show everything
            </ButtonLink>
          </div>
        ) : (
          <ul className="grid gap-x-[var(--grid-gap)] gap-y-16 md:grid-cols-2 md:gap-y-24">
            {visible.map((p, i) => (
              <ScrollReveal as="li" key={p.slug} delay={(i % 2) * 0.08} className={i % 2 === 1 ? 'md:mt-24' : undefined}>
                <ProjectCard project={p} />
              </ScrollReveal>
            ))}
          </ul>
        )}
      </section>

      <StillBuilding projects={ongoingProjects} />
      <CTA
        eyebrow="Have an idea?"
        title={['Let’s', 'make', 'it real.']}
        titleClassName="uppercase"
        body="Tell us what you’re making. We’ll help you design it and build it."
        secondary={{ to: '/', label: 'Back to home' }}
      />
    </>
  );
}
