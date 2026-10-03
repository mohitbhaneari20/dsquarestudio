import { Reveal } from '../ui/Reveal';
import { SquareBullet } from '../ui/SquareBullet';
import { TextReveal } from '../ui/TextReveal';

const reasons = [
  {
    title: 'Design and code, together',
    body: 'The person who designs it also builds it. Ideas survive the trip from mockup to browser, and changes don’t need a meeting.',
  },
  {
    title: 'You talk to the maker',
    body: 'No account managers, no layers. The first conversation and the final delivery happen with the same person.',
  },
  {
    title: 'Work in progress, in public',
    body: 'Ongoing projects are shared openly with real progress. You can see how we think before you hire us.',
  },
  {
    title: 'Built to be yours',
    body: 'Clean files, readable code and a site you can update yourself. You shouldn’t need us for every small change.',
  },
];

export function WhyDsquare() {
  return (
    <section className="container-site section-space">
      <div className="grid-site gap-y-10">
        <p className="text-meta col-span-12 flex items-center gap-2 text-muted md:col-span-3 md:tag-top-h1">
          <SquareBullet /> Why Dsquare
        </p>
        <div className="col-span-12 md:col-span-9">
          <TextReveal as="h2" lines={['Small studio.', 'Full attention.']} className="text-h1" />
        </div>
      </div>

      <ul className="mt-16 grid gap-x-[var(--grid-gap)] gap-y-14 sm:grid-cols-2 md:mt-24 xl:grid-cols-4">
        {reasons.map((r, i) => (
          <Reveal as="li" key={r.title} delay={i * 0.06} className="border-t border-foreground/80 pt-5">
            <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
            <h3 className="mt-10 text-2xl font-medium leading-tight tracking-[-0.03em]">{r.title}</h3>
            <p className="mt-4 text-muted">{r.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
