import { Link } from 'react-router-dom';
import { OngoingProjectCard } from '../components/projects/OngoingProjectCard';
import { CTA } from '../components/ui/CTA';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Seo } from '../components/ui/Seo';
import { ongoingProjects, studioLog } from '../data/projects';
import { formatDate } from '../lib/format';

export default function Ongoing() {
  return (
    <>
      <Seo />
      <div className="container-site pt-32 md:pt-44">
        <SectionHeader
          as="h1"
          eyebrow="Currently building"
          title={['Currently building.']}
          intro={
            <>
              <p>Not everything we make is finished.</p>
              <p className="mt-4">
                Some things are still being researched, designed, coded, tested, redesigned and occasionally questioned.
              </p>
            </>
          }
        />

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {ongoingProjects.map((project, i) => (
            <OngoingProjectCard key={project.slug} project={project} index={i + 1} variant="feature" />
          ))}
        </div>
      </div>

      <section className="container-site section-space">
        <SectionHeader eyebrow="Studio log" title={['Latest notes.']} intro="Every update from every project, newest first." />
        <ol className="mt-16 border-b border-border md:mt-20">
          {studioLog.map(({ project, entry, date }) => (
            <Reveal as="li" key={`${project.slug}-${entry.id}`} className="border-t border-border">
              <Link
                to={`/ongoing/${project.slug}#${entry.id}`}
                className="group grid grid-cols-12 items-baseline gap-x-[var(--grid-gap)] gap-y-1 py-5 transition-colors hover:bg-surface/60"
              >
                <time dateTime={date} className="text-meta col-span-6 text-muted md:col-span-2">
                  {formatDate(date)}
                </time>
                <span className="text-meta col-span-6 text-right md:col-span-3 md:text-left">{project.title}</span>
                <span className="col-span-12 text-lg tracking-tight transition-transform duration-300 group-hover:translate-x-1 md:col-span-7">
                  {entry.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>
      <CTA />
    </>
  );
}
