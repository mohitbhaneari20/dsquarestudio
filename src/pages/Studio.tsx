import { ProcessTimeline } from '../components/studio/ProcessTimeline';
import { CTA } from '../components/ui/CTA';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';
import { pad } from '../lib/format';

const interests = [
  { title: 'Design', body: 'Deciding what something should be, and how it should feel.' },
  { title: 'Development', body: 'Making it real — in code, in the browser, on a phone.' },
  { title: 'Problem solving', body: 'Starting from the problem, not from a style.' },
  { title: 'Visual systems', body: 'Rules that keep things consistent as they grow.' },
  { title: 'User experience', body: 'Respecting people’s time and attention.' },
  { title: 'Building products', body: 'Shipping, learning and improving. Then again.' },
];

export default function Studio() {
  return (
    <>
      <Seo
        title="Studio"
        description="Dsquare is a small, independent design and development studio. D² — design and development, done by the same hands."
      />

      <section className="container-site pt-32 md:pt-44">
        <p className="text-meta border-t border-border pt-4 text-muted">(01) Studio</p>
        <TextReveal
          as="h1"
          immediate
          lines={['Dsquare is a small studio', 'with a big interest in', 'making things better.']}
          className="text-h1 mt-12 md:mt-20"
        />
        <div className="grid-site mt-16 gap-y-6 md:mt-24">
          <Reveal className="text-lead col-span-12 space-y-6 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <p>Dsquare is an independent design and development studio, run by a designer who also writes code.</p>
            <p className="text-muted">
              We work on brand identities, interfaces, websites and digital products — usually from the first sketch to the
              version people actually use.
            </p>
            <p className="text-muted">Small on purpose. You talk to the person doing the work.</p>
          </Reveal>
        </div>
      </section>

      {/* D² */}
      <section className="theme-inverse section-space mt-[var(--section-space)]">
        <div className="container-site grid-site items-end gap-y-12">
          <Reveal className="col-span-12 md:col-span-6">
            <p className="text-meta mb-6 text-muted">(02) The name</p>
            <p className="text-[clamp(8rem,28vw,26rem)] font-semibold leading-[0.75] tracking-[-0.08em]" aria-label="D squared">
              D<sup className="text-[0.4em] text-accent">2</sup>
            </p>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 space-y-6 md:col-span-6 lg:col-span-5 lg:col-start-8">
            <h2 className="text-h2">Design + Development.</h2>
            <p className="text-lead text-muted">
              Two Ds, multiplied. Design works out what something should be. Development makes it real.
            </p>
            <p className="text-lead text-muted">
              Doing both in one place means fewer ideas get lost between the mockup and the browser — and the design gets
              better because it’s tested in the real thing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Interests */}
      <section className="container-site section-space">
        <SectionHeader index="03" eyebrow="What we care about" title={['Things we think about', 'a lot.']} />
        <ul className="mt-16 grid gap-x-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-3 md:mt-24">
          {interests.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 3) * 0.06} className="border-t border-border pb-12 pt-5">
              <span className="text-meta text-muted">{pad(i + 1)}</span>
              <h3 className="text-h3 mt-6">{item.title}</h3>
              <p className="mt-3 max-w-xs text-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Why */}
      <section className="container-site pb-[var(--section-space)]">
        <div className="grid-site gap-y-8 border-t border-border pt-4">
          <p className="text-meta col-span-12 text-muted lg:col-span-3">(04) Why Dsquare exists</p>
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

      {/* Process */}
      <section className="container-site pb-[var(--section-space)]">
        <SectionHeader index="05" eyebrow="How we work" title={['Five steps,', 'repeated as needed.']} />
        <div className="mt-16 md:mt-24">
          <ProcessTimeline />
        </div>
      </section>

      <CTA />
    </>
  );
}
