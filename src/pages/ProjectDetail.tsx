import type { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { TestimonialCard } from '../components/home/Testimonials';
import { ProjectGallery } from '../components/projects/ProjectGallery';
import { ProjectHero } from '../components/projects/ProjectHero';
import { ProjectPager } from '../components/projects/ProjectPager';
import { CTA } from '../components/ui/CTA';
import { Reveal } from '../components/ui/Reveal';
import { Seo } from '../components/ui/Seo';
import { completedProjects, getNeighbours, getProject, projectNumber } from '../data/projects';
import type { Tone } from '../data/types';
import { visibleOnLight } from '../lib/color';
import { pad } from '../lib/format';
import NotFound from './NotFound';

function Palette({ tone }: { tone: Tone }) {
  const colours = [...new Set([tone.bg, tone.ink, tone.accent].filter((c): c is string => !!c))];
  return (
    <span className="flex gap-1.5" aria-label={`Palette: ${colours.join(', ')}`}>
      {colours.map((c) => (
        <span key={c} className="size-4 rounded-full border border-border" style={{ backgroundColor: c }} title={c} />
      ))}
    </span>
  );
}

/** Short labelled text block. `size` lets key moments read larger than supporting ones. */
function Note({ index, label, children, colour, size = 'lead' }: { index: string; label: string; children: ReactNode; colour: string; size?: 'lead' | 'h3' }) {
  return (
    <Reveal>
      <h2 className="text-meta flex gap-3 border-t border-border pt-4 text-muted">
        <span style={{ color: colour }}>{index}</span>
        <span>{label}</span>
      </h2>
      <div className={size === 'h3' ? 'text-h3 mt-6' : 'text-lead mt-6'}>{children}</div>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <NotFound />;
  if (project.status === 'Ongoing') return <Navigate to={`/ongoing/${project.slug}`} replace />;

  const { prev, next } = getNeighbours(completedProjects, project.slug);
  const colour = visibleOnLight(project.tone);
  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Category', value: project.categories.join(', ') },
    { label: 'Services', value: project.services.join(', ') },
    { label: 'Palette', value: <Palette tone={project.tone} /> },
  ];
  if (project.credit) {
    meta.splice(1, 0, { label: 'Made at', value: project.credit.agency }, { label: 'My role', value: `${project.credit.role}, ${project.credit.period}` });
  }
  if (project.website) meta.push({ label: 'Website', value: project.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') });

  // Text and visuals alternate: first spread, problem/approach, middle spreads, result, final spread.
  const [first, ...rest] = project.gallery;
  const last = rest.length > 1 ? rest[rest.length - 1] : undefined;
  const middle = last ? rest.slice(0, -1) : rest;
  const galleryProps = { tone: project.tone, label: project.title, slug: project.slug };

  return (
    <>
      <Seo title={project.title} description={`${project.title} — ${project.summary}`} type="article" image={project.heroImage.src} />
      <article>
        <ProjectHero
          project={project}
          eyebrow={`Project ${pad(projectNumber(project))}`}
          back={{ to: '/work', label: 'All work' }}
          meta={meta}
        />

        <div className="container-site section-space grid-site">
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <Note index="01" label="Overview" colour={colour} size="h3">
              <p>{project.description}</p>
            </Note>
            {project.credit && (
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-2xl border-l-2 pl-5 text-muted" style={{ borderColor: colour }}>
                  {project.credit.note}
                </p>
              </Reveal>
            )}
          </div>
        </div>

        {first && <ProjectGallery blocks={[first]} {...galleryProps} />}

        <div className="container-site section-space grid-site gap-y-16">
          <div className="col-span-12 md:col-span-5">
            <Note index="02" label="The problem" colour={colour}>
              <p>{project.challenge}</p>
            </Note>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 md:mt-32">
            <Note index="03" label="The approach" colour={colour}>
              <p>{project.approach}</p>
            </Note>
          </div>
        </div>

        <ProjectGallery blocks={middle} {...galleryProps} />

        <div className="container-site section-space grid-site">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <Note index="04" label="The result" colour={colour} size="h3">
              <p>{project.outcome}</p>
              {project.website && (
                <a href={project.website} target="_blank" rel="noreferrer" className="link-underline mt-6 inline-block text-base">
                  Visit the website ↗
                </a>
              )}
            </Note>
          </div>
        </div>

        {last && <ProjectGallery blocks={[last]} {...galleryProps} />}

        {project.testimonial && (
          <div className="container-site section-space pb-0! grid-site">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <Note index="05" label="In their words" colour={colour}>
                <TestimonialCard t={project.testimonial} large />
              </Note>
            </div>
          </div>
        )}
      </article>

      <div className="pt-[var(--section-space)]">
        <ProjectPager
          prev={prev && { to: `/work/${prev.slug}`, title: prev.title }}
          next={next && { to: `/work/${next.slug}`, title: next.title }}
          back={{ to: '/work', label: 'Back to all work' }}
        />
      </div>
      <CTA />
    </>
  );
}
