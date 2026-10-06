import { ProcessCards } from '../components/studio/ProcessCards';
import { ExpandingVideo } from '../components/studio/ExpandingVideo';
import { CTA } from '../components/ui/CTA';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';
import { BrandMark, InlineMonogram } from '../components/brand/Brand';

/** The 'Why Dsquare exists' film, e.g. '/assets/studio/why.mp4'. Until it exists the section shows a video placeholder. */
const STUDIO_VIDEO: string | undefined = undefined;


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
              lines={['We’re not interested in', 'making things look good', 'just for the sake of it.']}
              className="text-[clamp(1.5rem,7.4vw,2.4rem)] font-medium leading-[0.95] md:text-[clamp(2.4rem,4.8vw,5rem)] tracking-[-0.045em]"
            />
            <Reveal className="text-lead mt-10 max-w-xl space-y-6 md:mt-14">
              <p>Dsquare uses design to understand problems, make experiences clearer and build things that actually work.</p>
              <p className="text-muted">
                It’s an independent design and development studio, run by a designer who also writes code — brands, interfaces,
                websites and digital products, from the first sketch to the version people use.
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
          {/* D × D = D²: the monogram on its construction grid (static — the homepage stone is the 3D moment) */}
          <Reveal delay={0.1} className="col-span-12 md:col-span-6 md:col-start-7">
            <figure
              className="relative mx-auto aspect-square w-full max-w-[34rem] border border-border md:ml-auto md:mr-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(250 250 250 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(250 250 250 / 0.06) 1px, transparent 1px)',
                backgroundSize: '12.5% 12.5%',
              }}
            >
              <BrandMark title="The Dsquare monogram — design multiplied by development" copyright={false} className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 text-accent" />
              <span className="text-meta absolute left-4 top-4 text-muted">D — Design</span>
              <span className="text-meta absolute bottom-4 right-4 text-right text-muted">× D — Development</span>
              <span className="text-meta absolute right-4 top-4 text-accent-ink">= D²</span>
            </figure>
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
      {/* The studio film grows to full screen as you scroll; a placeholder until STUDIO_VIDEO is set */}
      <ExpandingVideo src={STUDIO_VIDEO} label="Why Dsquare exists — video" gapBelow={0} />

      {/* Process: heading and the five steps, pinned together while the cards scroll sideways */}
      <ProcessCards header={<SectionHeader index="04" eyebrow="How we work" title={['Five steps,', 'repeated as needed.']} />} />

      <CTA />
    </>
  );
}
