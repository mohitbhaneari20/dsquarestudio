import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../data/types';
import { ImageReveal } from '../ui/ImageReveal';
import { ProjectVisual } from '../ui/ProjectVisual';
import { Reveal } from '../ui/Reveal';
import { TextReveal } from '../ui/TextReveal';
import { ProjectMeta, type MetaItem } from './ProjectMeta';

interface ProjectHeroProps {
  project: Project;
  eyebrow: string;
  back: { to: string; label: string };
  meta: MetaItem[];
  /** Extra content under the description (status, progress…) */
  children?: ReactNode;
}

export function ProjectHero({ project, eyebrow, back, meta, children }: ProjectHeroProps) {
  return (
    <section className="container-site pt-32 md:pt-40">
      <Reveal>
        <Link to={back.to} className="text-meta group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
          <ArrowLeft size={12} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          {back.label}
        </Link>
      </Reveal>

      <div className="grid-site mt-10 gap-y-10 md:mt-16">
        <div className="col-span-12">
          <p className="text-meta mb-6 text-muted">{eyebrow}</p>
          <TextReveal as="h1" immediate lines={[project.title]} className="text-display break-words uppercase" />
          <Reveal delay={0.15}>
            <p className="text-meta mt-6 flex flex-wrap gap-x-6 gap-y-1">
              <span>{project.discipline}</span>
              <span className="text-muted">{project.year}</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="col-span-12 lg:col-span-6 lg:col-start-7">
          <p className="text-lead">{project.summary}</p>
          {project.placeholder && (
            <p className="text-meta mt-4 inline-block rounded-full border border-dashed border-border px-3 py-1 normal-case tracking-normal text-muted">
              Placeholder project — replace in src/data/projects.ts
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>

        <Reveal delay={0.3} className="col-span-12">
          <ProjectMeta items={meta} />
        </Reveal>
      </div>

      <ImageReveal className="mt-12 md:mt-20">
        <ProjectVisual
          media={project.pageCover ?? project.heroImage}
          tone={project.tone}
          label={project.title}
          slug={project.slug}
          className="aspect-[4/5] rounded-sm md:aspect-[16/8]"
          priority
        />
      </ImageReveal>
    </section>
  );
}
