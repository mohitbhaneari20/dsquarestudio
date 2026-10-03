import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CTA } from '../components/ui/CTA';
import { ImageReveal } from '../components/ui/ImageReveal';
import { ServiceMotion } from '../components/services/ServiceMotion';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Seo } from '../components/ui/Seo';
import { getProject, projectHref } from '../data/projects';
import { services } from '../data/services';
import type { Project } from '../data/types';
import type { SceneName } from '../components/services/scenes';
import { useHashScroll } from '../hooks/useHashScroll';
import { pad } from '../lib/format';

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-meta mb-4 border-t border-border pt-3 text-muted">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  useHashScroll();

  return (
    <>
      <Seo
        title="Services"
        description="UI / UX design, branding, design systems, motion, no-code development and websites — designed and built by Dsquare Studio."
      />
      <div className="container-site pt-32 md:pt-44">
        <SectionHeader
          as="h1"
          eyebrow="Services"
          title={['What we can', 'build together.']}
          intro="Six things we do well. Most projects mix a few of them."
        />

        <nav aria-label="Services" className="mt-16 md:mt-24">
          <ol className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-border">
                <a href={`#${s.slug}`} className="group flex items-baseline gap-4 py-4 pr-4">
                  <span className="text-meta text-muted">{pad(i + 1)}</span>
                  <span className="link-underline text-lg tracking-tight">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="container-site section-space space-y-28 md:space-y-44">
        {services.map((service, i) => {
          const related = service.relatedProjects.map(getProject).filter((p): p is Project => !!p);
          return (
            <section key={service.slug} id={service.slug} className="grid-site scroll-mt-24 gap-y-10" aria-labelledby={`${service.slug}-title`}>
              <div className="col-span-12 md:col-span-5">
                <div className="md:sticky md:top-28">
                  <p className="text-meta border-t border-border pt-4 text-accent">{pad(i + 1)}</p>
                  <h2 id={`${service.slug}-title`} className="text-h2 mt-6">
                    {service.title}
                  </h2>
                  <p className="text-lead mt-4 max-w-sm text-muted">{service.short}</p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
                <ImageReveal>
                  <ServiceMotion scene={service.slug as SceneName} label={service.title} className="aspect-[16/10]" />
                </ImageReveal>
                <Reveal>
                  <p className="text-lead mt-10">{service.description}</p>
                  <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    <List title="What’s included" items={service.included} />
                    <List title="Typical deliverables" items={service.deliverables} />
                  </div>
                  {related.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-meta mb-4 border-t border-border pt-3 text-muted">Related work</h3>
                      <ul className="flex flex-wrap gap-2">
                        {related.map((p) => (
                          <li key={p.slug}>
                            <Link
                              to={projectHref(p)}
                              className="group inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                            >
                              {p.title}
                              <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:rotate-45" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <CTA title={['Not sure which', 'one you need?']} body="That’s normal. Tell us what you’re trying to do and we’ll figure out the rest together." />
    </>
  );
}
