import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ButtonLink } from '../components/ui/ButtonLink';
import { CTA } from '../components/ui/CTA';
import { Seo } from '../components/ui/Seo';
import { Archive } from '../components/work/Archive';
import { CategoryFilter } from '../components/work/CategoryFilter';
import { EdgeDetails } from '../components/work/EdgeDetails';
import { MobileProjectList } from '../components/work/MobileProjectList';
import { ProjectShowcase } from '../components/work/ProjectShowcase';
import { StillBuilding } from '../components/work/StillBuilding';
import { WorkHero } from '../components/work/WorkHero';
import { ongoingProjects, projects } from '../data/projects';
import { categories, type Category } from '../data/types';
import { mix } from '../lib/color';

const toParam = (c: Category) => c.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const fromParam = (value: string | null) => categories.find((c) => toParam(c) === value);

/** How much the active project's colour tints the page (0–1). Keep it subtle. */
const TINT = 0.1;

export default function Work() {
  const [params, setParams] = useSearchParams();
  const active = fromParam(params.get('filter'));
  const visible = useMemo(() => (active ? projects.filter((p) => p.categories.includes(active)) : projects), [active]);

  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c, projects.filter((p) => p.categories.includes(c)).length])),
    [],
  );

  const [slide, setSlide] = useState<{ index: number; direction: 1 | -1 }>({ index: 0, direction: 1 });
  useEffect(() => setSlide({ index: 0, direction: 1 }), [active]);
  const index = Math.min(slide.index, Math.max(visible.length - 1, 0));
  const current = visible[index];

  const onNavigate = useCallback(
    (next: number) =>
      setSlide((s) => {
        const n = visible.length;
        // Wrapping Next/Previous keep their direction; jumping via the ticks uses position
        const forward =
          next === (s.index + 1) % n ? true : next === (s.index - 1 + n) % n ? false : next > s.index;
        return { index: next, direction: forward ? 1 : -1 };
      }),
    [visible.length],
  );

  const select = (category?: Category) =>
    setParams(category ? { filter: toParam(category) } : {}, { replace: true, preventScrollReset: true });

  const base = useMemo(
    () => getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#e6e1d8',
    [],
  );
  const tint = current ? mix(current.tone.bg, base, TINT) : base;

  return (
    <>
      <Seo
        title="Work"
        description="Selected identities, interfaces, websites and experiments by Dsquare Studio — plus things still taking shape."
      />
      <EdgeDetails section="Work" />

      <motion.div animate={{ backgroundColor: tint }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <WorkHero projects={projects} />

        <div className="container-site mt-8 md:mt-12">
          <CategoryFilter active={active} counts={counts} total={projects.length} onChange={select} />
        </div>

        <div id="showcase" className="scroll-mt-20 pb-[var(--section-space)] pt-10 md:pt-16">
          {visible.length === 0 ? (
            <div className="container-site flex flex-col items-start gap-6 border-t border-border py-24">
              <p className="text-h3 max-w-lg">Nothing in {active} yet. Still figuring it out.</p>
              <ButtonLink variant="outline" onClick={() => select()}>
                Show everything
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <ProjectShowcase projects={visible} index={index} direction={slide.direction} onNavigate={onNavigate} />
              </div>
              <div className="md:hidden">
                <MobileProjectList projects={visible} />
              </div>
            </>
          )}
        </div>
      </motion.div>

      <Archive projects={visible} />
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
