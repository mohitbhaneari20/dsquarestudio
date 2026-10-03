import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectHref } from '../../data/projects';
import type { Project } from '../../data/types';
import { cn } from '../../lib/cn';
import { ImageReveal } from '../ui/ImageReveal';
import { ProjectVisual } from '../ui/ProjectVisual';
import { LogoConstructionCover } from './LogoConstructionCover';

interface ProjectCardProps {
  project: Project;
  /** Responsive image sizes hint */
  sizes?: string;
  className?: string;
  /** Show the one-line summary under the title */
  showSummary?: boolean;
}

/**
 * Editorial project card: 4:3 image (cover), title, discipline and year.
 * Hover (pointer devices only, and not with reduced motion): image zooms to 1.04,
 * title nudges, arrow moves, a 5% veil appears. The whole card is one link.
 */
export function ProjectCard({ project, sizes = '(min-width: 768px) 50vw, 100vw', className, showSummary = true }: ProjectCardProps) {
  return (
    <Link
      to={projectHref(project)}
      data-cursor={project.status === 'Ongoing' ? 'Open' : 'View'}
      className={cn('group block rounded-[2px] focus-visible:outline-offset-4', className)}
    >
      <ImageReveal>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
          {project.cover?.type === 'logo-construction' ? (
            <LogoConstructionCover
              src={project.cover.src}
              alt={project.cover.alt}
              color={project.cover.color}
              background={project.tone.bg}
            />
          ) : (
            <ProjectVisual
              media={project.thumbnail}
              tone={project.tone}
              label={project.title}
              slug={project.slug}
              className="h-full w-full"
              sizes={sizes}
              hoverZoom
            />
          )}
          {/* Barely-there veil on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-ok:group-hover:opacity-[0.05]"
          />
        </div>
      </ImageReveal>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-ok:group-hover:translate-x-1.5">
          <h3 className="text-h3">{project.title}</h3>
          <p className="text-meta mt-2 text-muted">
            {project.discipline} · {project.year}
          </p>
          {showSummary && <p className="mt-3 max-w-md text-muted">{project.summary}</p>}
        </div>
        <ArrowUpRight
          size={22}
          strokeWidth={1.5}
          aria-hidden="true"
          className="mt-1 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-ok:group-hover:-translate-y-1.5 motion-ok:group-hover:translate-x-1.5 motion-ok:group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
