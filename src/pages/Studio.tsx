import { ProcessCards } from '../components/studio/ProcessCards';
import { lazy, Suspense } from 'react';
import { ExpandingVideo } from '../components/studio/ExpandingVideo';
import { CTA } from '../components/ui/CTA';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';
import { InlineMonogram } from '../components/brand/Brand';

const MonogramModel = lazy(() => import('../components/studio/MonogramModel'));

export default function Studio() {
  return (
    <>
      <Seo />

      <section className="container-site pt-32 md:pt-44">
        <p className="text-meta border-t border-border pt-4 text-muted">(01) About <InlineMonogram /></p>
        <div className="grid-site mt-10 items-end gap-y-12 border-b border-border md:mt-14">
          {/* Portrait on the left, standing on the section's bottom line, with the name beside the face */}
          <Reveal className="relative order-2 col-span-12 md:order-1 md:col-span-5">
            <img
              src="/assets/studio/portrait.webp"
              alt="Mohit Bhandari, founder of Dsquare Studio"
              width={1022}
              height={1035}
              className="mx-auto block h-auto max-h-[78svh] w-auto max-w-full object-contain object-bottom md:ml-auto md:mr-0"
              loading="eager"
              decoding="async"
            />
            <div className="mt-4 lg:absolute lg:left-0 lg:top-[12%] lg:mt-0">
              <p className="text-xl font-medium leading-tight tracking-tight">Mohit Bhandari</p>
              <p className="text-meta mt-1.5 text-muted">Design partner</p>
            </div>
          </Reveal>

          <div className="order-1 col-span-12 pb-0 md:order-2 md:col-span-7 md:pb-16">
            <TextReveal
              as="h1"
              immediate
              lines={['Dsquare is a small studio', 'with a big interest in', 'making things better.']}
              className="text-[clamp(2.4rem,4.8vw,5rem)] font-medium leading-[0.95] tracking-[-0.045em]"
            />
            <Reveal className="text-lead mt-10 max-w-xl space-y-6 md:mt-14">
              <p>Dsquare is an independent design and development studio, run by a designer who also writes code.</p>
              <p className="text-muted">
                We work on brand identities, interfaces, websites and digital products — usually from the first sketch to the
                version people actually use.
              </p>
              <p className="text-muted">Small on purpose. You talk to the person doing the work.</p>
            </Reveal>
          </div>
        </div>

      </section>

      {/* D² */}
      <section className="theme-inverse section-space mt-[var(--section-space)]">
        <div className="container-site grid-site items-center gap-y-12">
          {/* Text on the left */}
          <Reveal className="col-span-12 space-y-6 md:col-span-6 lg:col-span-5">
            <p className="text-meta mb-6 text-muted">(02) The name</p>
            <h2 className="text-h2">Design + Development.</h2>
            <p className="text-lead text-muted">
              Two Ds, multiplied. Design works out what something should be. Development makes it real.
            </p>
            <p className="text-lead text-muted">
              Doing both in one place means fewer ideas get lost between the mockup and the browser — and the design gets
              better because it’s tested in the real thing.
            </p>
          </Reveal>
          {/* The D² monogram from the 3D file (three.js, loaded only on this page) */}
          <Reveal delay={0.1} className="col-span-12 md:col-span-6 md:col-start-7">
            <Suspense fallback={<div className="mx-auto aspect-square w-full max-w-[34rem] md:ml-auto md:mr-0" />}>
              <MonogramModel className="mx-auto aspect-square w-full max-w-[34rem] md:ml-auto md:mr-0" />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* Why — more room above, then a video that grows to full screen as you scroll */}
      <section className="container-site pt-[var(--section-space)]">
        <div className="grid-site gap-y-8 border-t border-border pt-4">
          <p className="text-meta col-span-12 text-muted lg:col-span-3 lg:tag-top-h2">(03) Why Dsquare exists</p>
          <div className="col-span-12 lg:col-span-9">
            <TextReveal
              lines={['To help businesses and ideas', 'communicate better through', 'design and technology.']}
              className="text-h2"
            />
            <Reveal delay={0.15}>
              <p className="text-lead mt-10 max-w-xl text-muted">
                A good idea explained badly loses to an average idea explained well. We’d like fewer good ideas to lose.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      {/* Add src="/assets/studio/your-video.mp4" to replace the placeholder */}
      <ExpandingVideo label="Why Dsquare exists — video" gapBelow={0} />

      {/* Process: heading and the five steps, pinned together while the cards scroll sideways */}
      <ProcessCards header={<SectionHeader index="04" eyebrow="How we work" title={['Five steps,', 'repeated as needed.']} />} />

      <CTA />
    </>
  );
}
