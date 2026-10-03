import { ArrowUpRight } from 'lucide-react';
import { CalendlyEmbed } from '../components/contact/CalendlyEmbed';
import { ContactForm } from '../components/contact/ContactForm';
import { Reveal } from '../components/ui/Reveal';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';
import { site } from '../config/site';
import { useHashScroll } from '../hooks/useHashScroll';

const nextSteps = [
  'We read every message properly.',
  'We reply by email with questions — or book a call below.',
  'If it’s a fit, we shape a plan together.',
];

export default function Contact() {
  useHashScroll();
  return (
    <>
      <Seo title="Contact" description="Start a project with Dsquare Studio. Tell us about the product, brand or strange idea you’re figuring out." />
      <section className="container-site pb-[var(--section-space)] pt-32 md:pt-44">
        <p className="text-meta border-t border-border pt-4 text-muted">Contact</p>
        <TextReveal as="h1" immediate lines={['Let’s make', 'something.']} className="text-display mt-12 md:mt-20" />

        <div className="grid-site mt-16 gap-y-16 md:mt-24">
          <Reveal className="col-span-12 lg:col-span-4">
            <p className="text-lead">
              Have a project, product, brand or strange idea you’re trying to figure out? Tell us about it.
            </p>

            <div className="mt-12 space-y-8">
              <div>
                <h2 className="text-meta mb-3 border-t border-border pt-3 text-muted">Email</h2>
                <a href={`mailto:${site.email}`} className="link-underline text-xl tracking-tight">
                  {site.email}
                </a>
              </div>
              <div>
                <h2 className="text-meta mb-3 border-t border-border pt-3 text-muted">Elsewhere</h2>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1">
                        <span className="link-underline">{s.label}</span>
                        <ArrowUpRight size={14} aria-hidden="true" className="opacity-60" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-meta mb-3 border-t border-border pt-3 text-muted">What happens next</h2>
                <ol className="space-y-2 text-muted">
                  {nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-mono text-xs leading-6 text-foreground">0{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Book a call */}
      <section id="book" className="container-site scroll-mt-24 pb-[var(--section-space)]">
        <div className="grid-site gap-y-10 border-t border-border pt-4">
          <Reveal className="col-span-12 md:col-span-5 lg:col-span-4">
            <p className="text-meta text-muted">Book a call</p>
            <h2 className="text-h2 mt-8">Rather talk it through?</h2>
            <p className="text-lead mt-4 max-w-sm text-muted">
              Pick a time for a free 30-minute call. Bring the idea, the problem or the half-finished thing — we’ll figure out the next step together.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <CalendlyEmbed />
          </Reveal>
        </div>
      </section>
    </>
  );
}
