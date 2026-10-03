import { ongoingProjects } from '../../data/projects';
import { formatDate } from '../../lib/format';
import { OngoingProjectCard } from '../projects/OngoingProjectCard';
import { ButtonLink } from '../ui/ButtonLink';
import { SectionHeader } from '../ui/SectionHeader';

export function OngoingSection() {
  const latest = ongoingProjects.map((p) => p.ongoing.lastUpdated).sort().at(-1);

  return (
    <section className="container-site section-space pt-0!">
      <SectionHeader
        eyebrow="Currently building"
        title={['Not finished.', 'That’s the point.']}
        intro="Some projects are still being designed, developed, tested, changed, broken and rebuilt. This is where they are right now."
        action={
          <ButtonLink to="/ongoing" variant="text">
            Studio log
          </ButtonLink>
        }
      />

      <div className="mt-16 md:mt-24">
        <div className="text-meta flex items-center justify-between pb-4 text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Live studio log
          </span>
          {latest && <span>Last updated {formatDate(latest)}</span>}
        </div>
        <ul aria-label="Ongoing projects" className="border-b border-border">
          {ongoingProjects.map((project, i) => (
            <OngoingProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </ul>
      </div>
    </section>
  );
}
