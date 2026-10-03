import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { OngoingDetails, Project } from '../../data/types';
import { cn } from '../../lib/cn';
import { formatDate, pad } from '../../lib/format';
import { ButtonLink } from '../ui/ButtonLink';
import { ImageReveal } from '../ui/ImageReveal';
import { PhaseTimeline } from '../ui/PhaseTimeline';
import { ProgressBar } from '../ui/ProgressBar';
import { ProjectVisual } from '../ui/ProjectVisual';
import { Reveal } from '../ui/Reveal';
import { StatusBadge } from '../ui/StatusBadge';

type OngoingProject = Project & { ongoing: OngoingDetails };

interface OngoingProjectCardProps {
  project: OngoingProject;
  index: number;
  /** 'row' = compact log line (home), 'feature' = large block (/ongoing) */
  variant?: 'row' | 'feature';
}

export function OngoingProjectCard({ project, index, variant = 'row' }: OngoingProjectCardProps) {
  const { ongoing } = project;
  const href = `/ongoing/${project.slug}`;

  if (variant === 'row') {
    return (
      <Reveal as="li" className="border-t border-border">
        <Link to={href} className="group grid-site items-center gap-y-5 py-8 md:py-10" data-cursor="Open">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <ProjectVisual
              media={project.thumbnail}
              tone={project.tone}
              label={project.title}
              slug={project.slug}
              className="aspect-[4/3] rounded-[2px]"
              sizes="(min-width: 768px) 25vw, 100vw"
              hoverZoom
            />
          </div>

          <div className="col-span-12 md:col-span-8 lg:col-span-4">
            <div className="flex items-baseline gap-3">
              <span className="text-meta text-muted">{pad(index)}</span>
              <h3 className="text-h3 uppercase transition-transform duration-500 group-hover:translate-x-1.5">{project.title}</h3>
            </div>
            <p className="text-meta mt-2 text-muted">{project.discipline}</p>
            <p className="mt-3 max-w-md text-sm text-muted">{ongoing.statusNote}</p>
          </div>

          <div className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-3 lg:col-start-auto">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge label={ongoing.phase} />
              <span className="text-meta text-muted">
                <span className="sr-only">Last updated </span>
                {formatDate(ongoing.lastUpdated)}
              </span>
            </div>
            <ProgressBar value={ongoing.progress} label={`${project.title} progress`} className="mt-4" />
          </div>

          <div className="col-span-12 flex md:col-span-8 md:col-start-5 lg:col-span-2 lg:col-start-auto lg:justify-end">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="link-underline group-hover:bg-[length:100%_1px]">View project</span>
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <article className="grid-site gap-y-8 border-t border-border pt-6">
      <div className="col-span-12 lg:col-span-7">
        <Link to={href} className="group block" data-cursor="Open" aria-label={`Open ${project.title} journal`} tabIndex={-1}>
          <ImageReveal>
            <ProjectVisual
              media={project.heroImage}
              tone={project.tone}
              label={project.title}
              slug={project.slug}
              className="aspect-[4/3] rounded-sm"
              sizes="(min-width: 1200px) 58vw, 100vw"
              hoverZoom
            />
          </ImageReveal>
        </Link>
      </div>

      <Reveal className="col-span-12 flex flex-col lg:col-span-5 lg:pl-6" delay={0.1}>
        <div className="flex items-center justify-between">
          <span className="text-meta text-muted">({pad(index)})</span>
          <StatusBadge label={ongoing.phase} />
        </div>
        <h2 className="text-h2 mt-6 uppercase">{project.title}</h2>
        <p className="text-meta mt-3 text-muted">{project.discipline}</p>
        <p className="text-lead mt-6">{project.summary}</p>

        <dl className="mt-10 space-y-6">
          <div>
            <dt className="text-meta mb-3 text-muted">Progress</dt>
            <dd>
              <ProgressBar value={ongoing.progress} label={`${project.title} progress`} />
            </dd>
          </div>
          <div>
            <dt className="text-meta mb-3 text-muted">Stage</dt>
            <dd>
              <PhaseTimeline current={ongoing.currentStage} />
            </dd>
          </div>
          <div className={cn('grid grid-cols-2 gap-6 border-t border-border pt-5')}>
            <div>
              <dt className="text-meta mb-2 text-muted">Last update</dt>
              <dd className="text-sm">{formatDate(ongoing.lastUpdated)}</dd>
            </div>
            <div>
              <dt className="text-meta mb-2 text-muted">Right now</dt>
              <dd className="text-sm">{ongoing.statusNote}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-10">
          <ButtonLink to={href}>Open project journal</ButtonLink>
        </div>
      </Reveal>
    </article>
  );
}
