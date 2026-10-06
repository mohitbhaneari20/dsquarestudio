import { Navigate, useParams } from 'react-router-dom';
import { ProjectGallery } from '../components/projects/ProjectGallery';
import { ProjectHero } from '../components/projects/ProjectHero';
import { ProjectPager } from '../components/projects/ProjectPager';
import { CTA } from '../components/ui/CTA';
import { ImageReveal } from '../components/ui/ImageReveal';
import { PhaseTimeline } from '../components/ui/PhaseTimeline';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProjectVisual } from '../components/ui/ProjectVisual';
import { Reveal } from '../components/ui/Reveal';
import { Seo } from '../components/ui/Seo';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useHashScroll } from '../hooks/useHashScroll';
import { getNeighbours, getProject, ongoingProjects, projectNumber } from '../data/projects';
import { cn } from '../lib/cn';
import { formatDate, pad } from '../lib/format';
import NotFound from './NotFound';

export default function OngoingDetail() {
  const { slug } = useParams();
  const project = getProject(slug);
  // Deep links from the studio log (/ongoing/rawset#research)
  useHashScroll();

  if (!project) return <NotFound />;
  if (!project.ongoing) return <Navigate to={`/work/${project.slug}`} replace />;

  const { ongoing } = project;
  const { prev, next } = getNeighbours(ongoingProjects, project.slug);

  return (
    <>
      <Seo />
      <article>
        <ProjectHero
          project={project}
          eyebrow={`Project ${pad(projectNumber(project))} — Journal`}
          back={{ to: '/ongoing', label: 'All ongoing projects' }}
          meta={[
            { label: 'Phase', value: <StatusBadge label={ongoing.phase} /> },
            { label: 'Last updated', value: formatDate(ongoing.lastUpdated) },
            { label: 'Type', value: project.type },
            { label: 'Services', value: project.services.join(', ') },
          ]}
        >
          <div className="space-y-5">
            <ProgressBar value={ongoing.progress} label={`${project.title} progress`} />
            <PhaseTimeline current={ongoing.currentStage} />
          </div>
        </ProjectHero>

        {/* The work so far — visuals from the project's gallery */}
        {project.gallery.length > 0 && (
          <section aria-labelledby="work-so-far" className="pt-[var(--section-space)]">
            <div className="container-site">
              <div className="grid-site gap-y-6 border-t border-border pt-4">
                <p className="text-meta col-span-12 text-muted lg:col-span-3 lg:tag-top-h2">Visuals</p>
                <div className="col-span-12 lg:col-span-9">
                  <h2 id="work-so-far" className="text-h2">
                    The work so far.
                  </h2>
                  <p className="text-lead mt-4 max-w-xl text-muted">Website, mobile, campaign and identity — as they stand today.</p>
                </div>
              </div>
            </div>
            <ProjectGallery blocks={project.gallery} tone={project.tone} label={project.title} slug={project.slug} className="mt-16 md:mt-24" />
          </section>
        )}

        {/* Journal */}
        <div className="container-site section-space">
          <div className="grid-site gap-y-12">
            <nav aria-label="Journal sections" className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="text-meta mb-4 border-t border-border pt-4 text-muted">Journal</p>
                <ol className="flex flex-wrap gap-x-4 gap-y-2 lg:block lg:space-y-2">
                  {ongoing.journal.map((entry, i) => (
                    <li key={entry.id}>
                      <a href={`#${entry.id}`} className="group inline-flex gap-3 text-sm text-muted transition-colors hover:text-foreground">
                        <span className="font-mono text-[11px]">{pad(i + 1)}</span>
                        <span className="link-underline">{entry.title}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#status" className="inline-flex gap-3 text-sm text-muted transition-colors hover:text-foreground">
                      <span className="font-mono text-[11px] text-accent-ink">●</span>
                      <span className="link-underline">Current status</span>
                    </a>
                  </li>
                </ol>
              </div>
            </nav>

            <div className="col-span-12 space-y-20 md:space-y-28 lg:col-span-8 lg:col-start-5">
              {ongoing.journal.map((entry, i) => (
                <section key={entry.id} id={entry.id} className="scroll-mt-28">
                  <Reveal>
                    <div className="text-meta flex items-center justify-between border-t border-border pt-4 text-muted">
                      <span>Entry {pad(i + 1)}</span>
                      {entry.date && <time dateTime={entry.date}>{formatDate(entry.date)}</time>}
                    </div>
                    <h2 className="text-h2 mt-8">{entry.title}</h2>
                    <p className="text-lead mt-6 max-w-2xl text-muted">{entry.body}</p>
                  </Reveal>
                  {entry.media && entry.media.length > 0 && (
                    <div className={cn('mt-10 grid gap-[var(--grid-gap)]', entry.media.length > 1 && 'md:grid-cols-2')}>
                      {entry.media.map((media, j) => (
                        <figure key={j}>
                          <ImageReveal>
                            <ProjectVisual
                              media={media}
                              tone={project.tone}
                              label={project.title}
                              slug={project.slug}
                              className={cn('rounded-sm', entry.media && entry.media.length > 1 ? 'aspect-[4/5]' : 'aspect-[16/10]')}
                              sizes="(min-width: 1200px) 60vw, 100vw"
                            />
                          </ImageReveal>
                          <figcaption className="text-meta mt-3 text-muted">{media.caption ?? media.alt}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              {/* Current status + what's next */}
              <section id="status" className="theme-inverse scroll-mt-28 rounded-sm p-6 md:p-10">
                <div className="text-meta flex items-center justify-between text-muted">
                  <span>Current status</span>
                  <span>Updated {formatDate(ongoing.lastUpdated)}</span>
                </div>
                <div className="mt-8">
                  <StatusBadge label={ongoing.phase} />
                </div>
                <p className="text-h3 mt-6 max-w-xl">{ongoing.statusNote}</p>
                <ProgressBar value={ongoing.progress} label={`${project.title} progress`} className="mt-8" />

                <h2 className="text-meta mt-12 border-t border-border pt-4 text-muted">What’s next</h2>
                <ul className="mt-5 space-y-3">
                  {ongoing.next.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-lg tracking-tight">
                      <span className="mt-[0.45em] size-3 shrink-0 border border-current" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </article>

      <ProjectPager
        prev={prev && { to: `/ongoing/${prev.slug}`, title: prev.title }}
        next={next && { to: `/ongoing/${next.slug}`, title: next.title }}
        back={{ to: '/ongoing', label: 'Back to everything in progress' }}
      />
      <CTA />
    </>
  );
}
