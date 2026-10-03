import { ArrowUpRight } from 'lucide-react';
import { ContactForm } from '../components/contact/ContactForm';
import { Reveal } from '../components/ui/Reveal';
import { Seo } from '../components/ui/Seo';
import { TextReveal } from '../components/ui/TextReveal';
import { site } from '../config/site';

const nextSteps = [
  'We read every message properly.',
  'We reply by email with questions, or a time to talk.',
  'If it’s a fit, we shape a plan together.',
];

export default function Contact() {
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
    </>
  );
}
