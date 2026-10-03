import { Link } from 'react-router-dom';
import { projectHref } from '../../data/projects';
import type { Project } from '../../data/types';
import { pad } from '../../lib/format';
import { ImageReveal } from '../ui/ImageReveal';
import { ProjectVisual } from '../ui/ProjectVisual';
import { pickMedia } from './composition';

/** Phone layout: one project per screen-ish, with a single small overlapping detail image. */
export function MobileProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol className="container-site space-y-16">
      {projects.map((p, i) => {
        const [main, detail] = pickMedia(p, 2);
        return (
          <li key={p.slug}>
            <Link to={projectHref(p)} className="block" data-cursor="Dig it">
              <div className="text-meta mb-3 flex justify-between text-muted">
                <span>
                  {pad(i + 1)} / {pad(projects.length)}
                </span>
                <span>{p.status === 'Ongoing' ? 'Ongoing' : 'Case study'}</span>
              </div>
              <div className="relative pb-10">
                <ImageReveal>
                  <ProjectVisual media={main ?? p.thumbnail} tone={p.tone} label={p.title} slug={p.slug} className="aspect-[4/3] rounded-[2px]" sizes="100vw" />
                </ImageReveal>
                {detail && (
                  <div className="absolute bottom-0 right-3 w-[38%] rotate-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)]">
                    <ProjectVisual media={detail} tone={p.tone} label={p.title} className="aspect-[3/4] rounded-sm" sizes="40vw" />
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-[clamp(2.5rem,12vw,4rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em]">{p.title}</h3>
              <p className="text-meta mt-3 flex justify-between text-muted">
                <span>{p.discipline}</span>
                <span>{p.year}</span>
              </p>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
